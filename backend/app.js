const express = require('express');
const cors = require('cors');
require('dotenv').config();

//establish all routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);  // More specific route first
app.use('/api/inkforge_users', userRoutes);  // Then the user routes
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
console.log('Routes registered successfully');

// app.get('/test', (req, res) => {
//     res.json({ message: 'Server is working' });
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
