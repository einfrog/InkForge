const express = require('express');
const router = express.Router();
const { config } = require('../services/database');
const { requireAdmin, requireAuth, requireOwnProfileOrAdmin } = require("../services/authorization.js");

// Public route to get all users
router.get('/', (req, res) => {
    config.query('SELECT user_id, username, email, biography FROM inkforge_users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Admin test route
router.get('/admin-test', requireAdmin, (req, res) => {
    res.json({ 
        message: 'Admin access successful!',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
