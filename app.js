
const express = require('express');
const cors = require('cors');
const path = require('path');
const api = require('./api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files & Frontend Static Assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(__dirname));

// API Routes
app.use('/api', api);

// Fallback jika ada routing frontend lain
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER RUNNING] Server berjalan di http://localhost:${PORT}`);
});