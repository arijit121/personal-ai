require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

const ENDPOINTS = {
    chat: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    vision: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    audio: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    video: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
};

// Dynamic import for node-fetch v3 (ES module)
let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

async function callGemini(endpointType, payload) {
    // Wait for fetch to be loaded
    if (!fetch) {
        const nodeFetch = await import('node-fetch');
        fetch = nodeFetch.default;
    }

    const url = `${ENDPOINTS[endpointType]}?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Gemini API Call Failed:', error);
        throw error;
    }
}

module.exports = {
    callGemini
};
