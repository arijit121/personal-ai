const express = require('express');
const router = express.Router();
const multer = require('multer');
const { callGemini } = require('../geminiClient');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        // Convert buffer to base64
        const audioBase64 = req.file.buffer.toString('base64');

        // Construct payload for Gemini Audio model
        // Assuming we need to send inline_data for the audio
        const payload = {
            contents: [{
                parts: [
                    { text: "TRANSCRIBE_AUDIO" },
                    {
                        inline_data: {
                            mime_type: req.file.mimetype || 'audio/wav', // Default to wav if not provided
                            data: audioBase64
                        }
                    }
                ]
            }]
        };

        const data = await callGemini('audio', payload);

        const transcription = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        res.json({ text: transcription });

    } catch (error) {
        console.error('Audio Route Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
