const express = require('express');
const { authenticateUser } = require('../services/authentication');
const router = express.Router();
const userController = require('../controllers/userController');

console.log("auth routes loaded")

// handle logic here because I couldn't find a more appropriate place
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

module.exports = router;