export class ChatEngine {
    constructor(videoEngine) {
        this.videoEngine = videoEngine;
        this.inputArea = document.getElementById('input-area');
        this.chatContainer = document.getElementById('messages-area');
        this.textInput = document.getElementById('text-input');
        this.sendBtn = document.getElementById('send-btn');
        this.micBtn = document.getElementById('mic-btn');
        this.listeningOverlay = document.getElementById('listening-overlay');

        // Initialize Lottie animation
        this.lottieAnimation = lottie.loadAnimation({
            container: document.getElementById('lottie-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: 'assets/animation/AI-listen-lottie.json'
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendBtn.addEventListener('click', () => this.handleSend());
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });

        // Mic button - Web Speech API
        this.isRecording = false;
        this.micBtn.addEventListener('click', () => this.toggleRecording());

        // Desktop Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+M for Record
            if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
                e.preventDefault();
                this.micBtn.click();
            }
        });
    }

    toggleRecording() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.micBtn.classList.add('recording');
            this.micBtn.style.backgroundColor = '#E91E63';
            this.micBtn.style.color = 'white';

            // Show overlay and play animation
            if (this.listeningOverlay) {
                this.listeningOverlay.style.display = 'flex';
                this.lottieAnimation.play();
            }
            if (this.inputArea) {
                this.inputArea.style.display = 'none';
            }
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.textInput.value = transcript;
            this.handleSend();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopRecording();
            if (event.error !== 'no-speech') {
                alert('Error: ' + event.error);
            }
        };

        this.recognition.onend = () => {
            this.stopRecording();
        };

        this.recognition.start();
    }

    stopRecording() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isRecording = false;
        this.micBtn.classList.remove('recording');
        this.micBtn.style.backgroundColor = '';
        this.micBtn.style.color = '';

        // Hide overlay and stop animation
        if (this.listeningOverlay) {
            this.listeningOverlay.style.display = 'none';
            this.lottieAnimation.stop();
        }
        if (this.inputArea) {
            this.inputArea.style.display = 'flex';
        }
    }

    async handleSend() {
        const text = this.textInput.value.trim();
        if (!text) return;

        // Clear input
        this.textInput.value = '';

        // Add user message
        this.addMessage(text, 'user');

        // Set thinking state
        this.videoEngine.playVideo('thinking');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            if (data.error) {
                this.addMessage('Sorry, I encountered an error.', 'system');
                this.videoEngine.playEmotion('Sadness');
                return;
            }

            // 1. Play Reaction (Emotion)
            if (data.emotion && this.videoEngine.emotionMap[data.emotion] && data.emotion !== 'Greeting') {
                await this.videoEngine.playEmotion(data.emotion);
                // Hold the emotion for a bit (e.g., 2 seconds)
                await new Promise(r => setTimeout(r, 2000));
            }

            // 2. Play Speech Video
            await this.videoEngine.playVideo('speech');

            // 3. Add AI Message with Typography Animation
            await this.addMessageWithTypography(data.reply, 'ai');

            // 4. Return to Idle (Greeting)
            this.videoEngine.playVideo('hello');

        } catch (error) {
            console.error('Chat Error:', error);
            this.addMessage('Network error. Please try again.', 'system');
            this.videoEngine.playEmotion('Sadness');
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        this.chatContainer.appendChild(messageDiv);

        // Scroll to bottom
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    async addMessageWithTypography(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        // Start empty
        bubble.textContent = '';

        messageDiv.appendChild(bubble);
        this.chatContainer.appendChild(messageDiv);

        // Scroll to bottom
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

        // Type out text
        await this.typeText(bubble, text);
    }

    typeText(element, text) {
        return new Promise(resolve => {
            let index = 0;
            const interval = setInterval(() => {
                element.textContent += text.charAt(index);
                index++;

                // Auto scroll while typing
                this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

                if (index >= text.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 30); // 30ms per character
        });
    }
}
