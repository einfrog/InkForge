const express = require('express');
const router = express.Router();
const { config } = require('../services/database');

// GET /api/users
router.get('/', (req, res) => {
    config.query('SELECT user_id, username, email FROM inkforge_users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

module.exports = router;
