export class VideoEngine {
    constructor() {
        this.mainVideo = document.getElementById('main-video');
        this.bufferVideo = document.getElementById('buffer-video');
        this.currentEmotion = 'Greeting';
        this.isTransitioning = false;

        // Asset mapping from prompt.xml
        this.assets = {
            'hello': 'Say-hello.mp4',
            'sad': 'Sadness.mp4',
            'angry': 'Hands-on-hips-muttering-to-himself-looking-slightly-angry.mp4',
            'thinking': 'Looking-thoughtful-hand-on-chin.mp4',
            'dance': 'Generate-dance-video.mp4',
            'refuel': 'Generate-refueling-video.mp4',
            '3d': '3D-modeling-image-creation.mp4',
            'smile-sway': 'Swaying-gracefully-with-a-smile.mp4',
            'peace-sway': 'Make-a-peace-sign-then-smile-and-sway-gracefully-from-side-to-side.mp4',
            'speech': 'The-standard-is-that-the-main-image-is-a-digital-human-speaking.mp4',
            'affirm': 'The-main-image-is-a-digital-human-confirming-with-an-elegant-slight-nod.mp4',
            'laugh': 'The-main-image-is-a-digital-human-laughing-happily-while-maintaining-elegance.mp4',
            'encourage': 'The-main-image-is-a-digital-human-used-to-affirm-and-encourage-user-performance-and-achievements-maintaining-elegance.mp4',
            'smile-sway-long1': 'Smilingly-and-gracefully-swaying-from-side-to-side-after-a-while-he-rests-his-hand-on-his-chin-maintaining-a-smile.mp4',
            'smile-sway-long2': 'Smilingly-and-gracefully-swaying-from-side-to-side-after-a-while-resting-his-hand-on-his-chin-maintaining-a-smile.mp4'
        };

        // Emotion mapping from prompt.xml
        this.emotionMap = {
            'Happy': ['smile-sway', 'laugh', 'affirm'],
            'Greeting': ['hello'],
            'Thinking': ['thinking'],
            'Sad': ['sad'],
            'Angry': ['angry'],
            'Supportive': ['encourage'],
            'Creative': ['3d'],
            'Dance': ['dance']
        };

        this.init();
    }

    init() {
        // Start with Greeting
        this.playVideo('hello');
    }

    getVideoPath(assetName) {
        return `/assets/video/${this.assets[assetName]}`;
    }

    async playEmotion(emotion) {
        console.log(`Switching to emotion: ${emotion}`);
        const assets = this.emotionMap[emotion] || this.emotionMap['Greeting'];
        // Pick random asset if multiple
        const assetName = assets[Math.floor(Math.random() * assets.length)];
        await this.crossFadeTo(assetName);
    }

    playVideo(assetName) {
        const path = this.getVideoPath(assetName);
        this.mainVideo.src = path;
        this.mainVideo.play().catch(e => console.error("Autoplay failed:", e));
    }

    async crossFadeTo(assetName) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const path = this.getVideoPath(assetName);

        // Load new video into buffer
        this.bufferVideo.src = path;
        await this.bufferVideo.load();

        try {
            await this.bufferVideo.play();
        } catch (e) {
            console.error("Buffer video play failed:", e);
            this.isTransitioning = false;
            return;
        }

        // Crossfade
        this.bufferVideo.style.opacity = '1';
        this.mainVideo.style.opacity = '0';

        // Wait for transition
        setTimeout(() => {
            // Swap elements
            const temp = this.mainVideo;
            this.mainVideo = this.bufferVideo;
            this.bufferVideo = temp;

            // Reset buffer
            this.bufferVideo.style.opacity = '0';
            this.bufferVideo.pause();
            this.bufferVideo.currentTime = 0;

            this.isTransitioning = false;
        }, 650); // 650ms from prompt.xml
    }
}
