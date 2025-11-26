const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

const ENDPOINTS = {
    chat: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-3:generateContent',
    vision: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-3-vision:generateContent',
    audio: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-3-audio:generateContent',
    video: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-3-video:generateContent'
};

async function callGemini(endpointType, payload) {
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
