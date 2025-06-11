const express = require('express');
const { authenticateUser, authenticateJWT } = require('../services/authentication');
const router = express.Router();
const userController = require('../controllers/userController');

console.log("auth routes loaded")

router.post('/login', async (req, res) => {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    const result = await authenticateUser(email, password);
    console.log('Authentication result:', result);

    if (result.success) {
        res.json({ token: result.token, user: result.user });
    } else {
        res.status(401).json({ message: result.error });
    }
});

// router.get('/test-users', async (req, res) => {
//     try {
//         const users = await userController.getUsers();
//         res.json({ users: users, count: users ? users.length : 0 });
//     } catch (error) {
//         console.error('Error getting users:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// Protected route example
// router.get('/profile', authenticateJWT, (req, res) => {
//     res.json({ user: req.user });
// });

module.exports = router;