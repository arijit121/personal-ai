const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
const chatRoutes = require('./routes/chat');
const audioRoutes = require('./routes/audio');
const videoRoutes = require('./routes/video');

app.use('/api/chat', chatRoutes);
app.use('/api/asr', audioRoutes);
app.use('/api/generate-video', videoRoutes);

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Firebase Functions
module.exports = app;

// Only listen if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
