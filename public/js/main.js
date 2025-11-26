import { VideoEngine } from './videoEngine.js';
import { ChatEngine } from './chatEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    const videoEngine = new VideoEngine();
    const chatEngine = new ChatEngine(videoEngine);

    console.log('Bella AI Companion Initialized');
});
