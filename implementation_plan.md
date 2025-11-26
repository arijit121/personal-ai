# Bella AI Companion — Implementation Plan

## Goal Description
Create a "Bella AI Companion" web application using Node.js backend and Vanilla JS frontend. The system will integrate with "Gemini Pro 3" API (using provided endpoints) for Chat, Vision, Audio, and Video generation. It features a "Video Expression Engine" that plays specific video loops based on the AI's emotional state.

**Update 3.2**: Mobile view update - Video positioned at the bottom of the screen.

## User Review Required
> [!IMPORTANT]
> The project uses "Gemini Pro 3" with specific endpoints provided in `prompt.xml`. These endpoints and model names will be used exactly as specified. If these are hypothetical, they will be implemented as such.

## Proposed Changes

### Backend
#### [EXISTING] [server.js](file:///e:/Homework/web/personal-ai/server.js)
- No changes.

### Frontend
#### [MODIFY] [public/css/style.css](file:///e:/Homework/web/personal-ai/public/css/style.css)
- Update Mobile Media Query (<600px):
    - Change `#app-container` to `flex-direction: column-reverse` (or use `order`) to place video at the bottom.
    - Adjust border-radius of chat container (rounded bottom instead of top?).

## Verification Plan

### Manual Verification
1.  **Mobile View**: Resize browser to <600px. Verify Video is at the bottom, Chat is at the top.
2.  **Other Views**: Verify Tablet, Desktop, TV remain unchanged.
