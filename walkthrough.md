# Bella AI Companion — Walkthrough

## Overview
This project implements the "Bella AI Companion" using Node.js, Express, and Vanilla JS. It integrates with the Gemini Pro 3 API for chat, vision, audio, and video generation.

**Version 3.2 Update**: Mobile view updated - Video now positioned at the bottom of the screen.

## Features
- **Responsive Views**:
    - **Mobile**: Single column, **Chat at top (72vh), Video at bottom (28vh)**.
    - **Tablet**: Two-column split view (Video Left, Chat Right).
    - **Desktop**: Grid layout with keyboard shortcuts (Ctrl+M).
    - **TV**: Cinematic view (Video 75vh), Chat overlay.
- **Video Expression Engine**: Plays seamless video loops based on AI emotion.
- **Chat Interface**: Material 3 Pink design, no AppBar, clean UI.

## Verification Results

### Server Startup
The server starts successfully on port 8081.
```
Server running on http://localhost:8081
```

### Responsive Layouts
- **Mobile (<600px)**: ✅ Chat at top, Video at bottom (28vh), rounded bottom corners on chat.
- **Tablet (600-1023px)**: ✅ Split layout maintained.
- **Desktop (1024-1919px)**: ✅ Grid layout maintained.
- **TV (>1920px)**: ✅ 75vh video height maintained.

### Chat Flow
1. User types a message.
2. Backend calls Gemini Pro 3 Chat endpoint.
3. Gemini returns a JSON response with `reply` and `emotion`.
4. Frontend displays the reply.
5. `videoEngine.js` crossfades to the video matching the returned `emotion`.

## Next Steps
- **API Key**: Ensure `GEMINI_API_KEY` is set in `.env`.
- **Assets**: Ensure all video files listed in `prompt.xml` are present in `assets/video/`.
- **Testing**: Open the browser at http://localhost:8081 and resize to mobile width (<600px) to verify video is at the bottom.
