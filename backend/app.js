const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// API routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);  // More specific route first
app.use('/api/inkforge_users', userRoutes);  // Then the user routes
app.use('/api/projects', projectRoutes);
console.log('Routes registered successfully');

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
