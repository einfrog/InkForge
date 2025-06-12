const express = require('express');
const router = express.Router();
const { config } = require('../services/database');
const { requireAdmin, requireAuth, requireOwnProfileOrAdmin } = require("../services/authorization.js");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require('../services/authentication');

// Admin test route (must come before /:id route)
router.get('/admin-test', requireAdmin, (req, res) => {
    res.json({ 
        message: 'Admin access successful!',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

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

router.get('/:id', async (req, res) => {
    config.query('SELECT user_id, username, email, biography FROM inkforge_users WHERE user_id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.log('Error fetching user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results[0] || { error: 'User not found' });
    }
)});

// Create new user (public registration)
router.post('/register', (req, res) => {
    console.log('Registration attempt received:', req.body);
    const { username, email, password, biography } = req.body;
    
    // Check if user already exists
    config.query('SELECT * FROM inkforge_users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking existing user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        config.query(
            'INSERT INTO inkforge_users (username, email, password, biography, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, password, biography || '', 'user'],
            (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({ error: 'Failed to create user' });
                }

                const accessToken = jwt.sign({
                    user_id: result.insertId,
                    username: result.username,
                    email: result.email,
                    role: result.role
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'
                })

                res.status(201).json({
                    message: 'User created successfully',
                    token: accessToken,
                    user: {
                        id: result.insertId,
                        username,
                        email,
                        biography: biography || '',
                        role: 'user'
                    }
                });
            }
        );
    });
});

// Update user
router.put('/:id', authenticateJWT, async (req, res) => {
    const userId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    
    // Check if user is admin or updating their own profile
    if (decoded.role !== 'admin' && decoded.user_id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    const { username, email, password, biography } = req.body;
    
    // Build the update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (username) {
        updateFields.push('username = ?');
        queryParams.push(username);
    }
    if (email) {
        updateFields.push('email = ?');
        queryParams.push(email);
    }
    if (password && password !== '********') {
        updateFields.push('password = ?');
        queryParams.push(password);
    }
    if (biography !== undefined) {
        updateFields.push('biography = ?');
        queryParams.push(biography);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    queryParams.push(userId); // Add userId for WHERE clause

    const query = `UPDATE inkforge_users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    
    config.query(query, queryParams, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Failed to update user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Return the updated user data
        config.query('SELECT user_id, username, email, biography, role FROM inkforge_users WHERE user_id = ?', 
            [userId], 
            (err, users) => {
                if (err) {
                    console.error('Error fetching updated user:', err);
                    return res.status(500).json({ error: 'Failed to fetch updated user data' });
                }
                res.json(users[0]);
            }
        );
    });
});

// Delete user
router.delete('/:id', authenticateJWT, async (req, res) => {
    const userId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    
    // Check if user is admin or deleting their own account
    if (decoded.role !== 'admin' && decoded.user_id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Not authorized to delete this user' });
    }

    config.query('DELETE FROM inkforge_users WHERE user_id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

module.exports = router;
