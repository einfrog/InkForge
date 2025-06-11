const express = require('express');
const router = express.Router();
const { config } = require('../services/database');
const { requireAdmin, requireAuth, requireOwnProfileOrAdmin } = require("../services/authorization.js");

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
                res.status(201).json({ 
                    message: 'User created successfully',
                    userId: result.insertId 
                });
            }
        );
    });
});

// // Update user (requires auth - own profile or admin)
// router.put('/:id', requireOwnProfileOrAdmin, (req, res) => {
//     const { username, email, password, biography } = req.body;
//     const userId = req.params.id;

//     // Build update query based on provided fields
//     let updateFields = [];
//     let values = [];
    
//     if (username) {
//         updateFields.push('username = ?');
//         values.push(username);
//     }
//     if (email) {
//         updateFields.push('email = ?');
//         values.push(email);
//     }
//     if (password) {
//         updateFields.push('password = ?');
//         values.push(password);
//     }
//     if (biography) {
//         updateFields.push('biography = ?');
//         values.push(biography);
//     }

//     if (updateFields.length === 0) {
//         return res.status(400).json({ error: 'No fields to update' });
//     }

//     values.push(userId);

//     config.query(
//         `UPDATE inkforge_users SET ${updateFields.join(', ')} WHERE user_id = ?`,
//         values,
//         (err, result) => {
//             if (err) {
//                 console.error('Error updating user:', err);
//                 return res.status(500).json({ error: 'Failed to update user' });
//             }
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({ error: 'User not found' });
//             }
//             res.json({ message: 'User updated successfully' });
//         }
//     );
// });

// // Delete user (admin only)
// router.delete('/:id', requireAdmin, (req, res) => {
//     config.query('DELETE FROM inkforge_users WHERE user_id = ?', 
//         [req.params.id], 
//         (err, result) => {
//             if (err) {
//                 console.error('Error deleting user:', err);
//                 return res.status(500).json({ error: 'Failed to delete user' });
//             }
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({ error: 'User not found' });
//             }
//             res.json({ message: 'User deleted successfully' });
//         });
// });

module.exports = router;
