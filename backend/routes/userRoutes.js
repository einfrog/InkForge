const express = require('express');
const router = express.Router();
const { requireAdmin } = require("../services/authorization");
const { authenticateJWT } = require('../services/authentication');
const userController = require('../controllers/userController');

// Admin test route
router.get('/admin-test', requireAdmin, (req, res) => {
    res.json({
        message: 'Admin access successful!',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// Public routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.registerUser);

// Authenticated routes
router.put('/:id', authenticateJWT, userController.updateUser);
router.delete('/:id', authenticateJWT, userController.deleteUser);

module.exports = router;
