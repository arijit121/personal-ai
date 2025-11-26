const express = require('express');
const router = express.Router();
const { callGemini } = require('../geminiClient');

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;

        // Construct prompt for Gemini to get both reply and emotion
        // We ask for a JSON response to easily parse both
        const systemInstruction = `
        You are Bella, an elegant, warm, and helpful AI companion.
        Your persona is supportive and kind.
        
        You need to provide a response to the user and also detect the emotion of your response to drive a video avatar.
        Possible emotions: Happy, Greeting, Thinking, Sad, Angry, Supportive, Creative, Dance.
        
        Return your response in this JSON format:
        {
            "reply": "Your text response here",
            "emotion": "One of the emotions listed above"
        }
        `;

        const contents = [
            { role: 'user', parts: [{ text: systemInstruction }] },
            // Add history if needed, for now just current message
            { role: 'user', parts: [{ text: message }] }
        ];

        const payload = {
            contents: contents
        };

        const data = await callGemini('chat', payload);

        // Parse Gemini response
        // Assuming standard Gemini response structure: candidates[0].content.parts[0].text
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        let result;
        try {
            // Try to parse JSON from the text response
            // Sometimes models wrap JSON in markdown code blocks
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                result = { reply: textResponse, emotion: 'Greeting' };
            }
        } catch (e) {
            console.error("Failed to parse JSON from Gemini response", textResponse);
            result = { reply: textResponse, emotion: 'Greeting' };
        }

        res.json(result);

    } catch (error) {
        console.error('Chat Route Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
