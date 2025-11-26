const express = require('express');
const router = express.Router();
const { callGemini } = require('../geminiClient');

router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        const payload = {
            contents: [{
                parts: [{ text: prompt || "VIDEO_GENERATION_PROMPT" }]
            }]
        };

        const data = await callGemini('video', payload);

        // Assuming the video model returns a URL or base64 data
        // For now, just return the raw data
        res.json(data);

    } catch (error) {
        console.error('Video Route Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
