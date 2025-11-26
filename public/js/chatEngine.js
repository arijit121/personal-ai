export class ChatEngine {
    constructor(videoEngine) {
        this.videoEngine = videoEngine;
        this.chatContainer = document.getElementById('messages-area');
        this.textInput = document.getElementById('text-input');
        this.sendBtn = document.getElementById('send-btn');
        this.micBtn = document.getElementById('mic-btn');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendBtn.addEventListener('click', () => this.handleSend());
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });

        // Mic button placeholder - would need MediaRecorder implementation
        this.micBtn.addEventListener('click', () => {
            alert('Microphone support requires HTTPS and MediaRecorder implementation. Currently using text input.');
        });

        // Desktop Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+M for Record
            if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
                e.preventDefault();
                this.micBtn.click();
            }
        });
    }

    async handleSend() {
        const text = this.textInput.value.trim();
        if (!text) return;

        // Clear input
        this.textInput.value = '';

        // Add user message
        this.addMessage(text, 'user');

        // Set thinking state
        this.videoEngine.playEmotion('Thinking');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            if (data.error) {
                this.addMessage('Sorry, I encountered an error.', 'system');
                this.videoEngine.playEmotion('Sad');
                return;
            }

            // Add AI response
            this.addMessage(data.reply, 'ai');

            // Change video emotion
            if (data.emotion) {
                this.videoEngine.playEmotion(data.emotion);
            }

        } catch (error) {
            console.error('Chat Error:', error);
            this.addMessage('Network error. Please try again.', 'system');
            this.videoEngine.playEmotion('Sad');
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
}
