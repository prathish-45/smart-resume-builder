const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Smart Resume Builder API' });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = app;
