# Bella AI Companion — Walkthrough

## Overview
This project implements the "Bella AI Companion" using Node.js, Express, and Vanilla JS. It integrates with the Gemini Pro 3 API for chat, vision, audio, and video generation.

**Version 3.2 Update**: Mobile view features fullscreen video with chat overlay.

## Features
- **Responsive Views**:
    - **Mobile**: Fullscreen video background with chat overlay at bottom (z-index stacking).
    - **Tablet**: Two-column split view (Video Left, Chat Right).
    - **Desktop**: Grid layout with keyboard shortcuts (Ctrl+M).
    - **TV**: Cinematic view (Video 75vh), Chat overlay.
- **Video Expression Engine**: Plays seamless video loops based on AI emotion.
- **Chat Interface**: Material 3 Pink design, no AppBar, clean UI.
- **Backend**: Node.js/Express with Gemini Pro 3 integration.

## Technical Details

### Mobile Layout (z-index overlay)
- Video: 100vh fullscreen background (z-index: 1)
- Chat: Positioned absolutely at bottom (z-index: 2, max-height: 70vh)
- Chat overlays on top of video for immersive experience

### Server
- Fixed node-fetch v3 ES module compatibility using dynamic import
- Server running on port 8081

## Verification Results

### Server Startup
```
Server running on http://localhost:8081
```

### API Integration
- Backend configured to call Gemini Pro 3 endpoints
- Requires `GEMINI_API_KEY` in `.env` file

## Next Steps
1. **API Key**: Set `GEMINI_API_KEY` in `.env`
2. **Test Chat**: Try sending a message to verify Gemini API integration
3. **Assets**: Ensure all 15 video files are in `assets/video/`
