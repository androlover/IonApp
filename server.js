// server.js
const express = require('express');
const path = require('path');
const app = express();

const root = path.join(__dirname, 'www');

// Serve static files from /www
app.use(express.static(root));

// For any other route, serve index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
