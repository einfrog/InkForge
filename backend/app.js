const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
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

// const ReactEngine = require('react-view-engine')
// app.engine('jsx', ReactEngine.engine)  //set jsx files to use ReactEngine
// app.set('view engine', 'jsx')
//
// app.set('views', [
//     __dirname + '../frontend/src/components',  //jsx view folder
// ])

// API routes
console.log('Registering routes...');
app.use('/api/inkforge_users', userRoutes);
app.use('/api/auth', authRoutes);
console.log('Routes registered successfully');

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
