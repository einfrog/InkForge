const {config} = require('../services/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET all users (public)
exports.getAllUsers = (req, res) => {
    config.query('SELECT user_id, username, email, biography, profile_picture FROM inkforge_users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({error: 'Database error'});
        }
        res.json(results);
    });
};

// GET one user by ID
exports.getUserById = (req, res) => {
    config.query('SELECT user_id, username, email, biography, profile_picture FROM inkforge_users WHERE user_id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({error: 'Database error'});
        }
        res.json(results[0] || {error: 'User not found'});
    });
};

// POST register new user
exports.registerUser = (req, res) => {
    const {username, email, password, biography} = req.body;

    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.status(500).json({error: 'Error when hashing password'});
        }

        config.query('SELECT * FROM inkforge_users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Error checking existing user:', err);
                return res.status(500).json({error: 'Database error'});
            }
            if (results.length > 0) {
                return res.status(400).json({error: 'Email already registered'});
            }

            config.query(
                'INSERT INTO inkforge_users (username, email, password, biography, role) VALUES (?, ?, ?, ?, ?)',
                [username, email, hashedPassword, biography || '', 'user'],
                (err, result) => {
                    if (err) {
                        console.error('Error creating user:', err);
                        console.error('err.code:', err.code, typeof err.code);
                        // Check for duplicate entry error, if true, return appropriate response
                        if (String(err.code).toUpperCase() === 'ER_DUP_ENTRY') {
                            console.log('Sending 400: Email already registered');
                            return res.status(400).json({ error: 'Email already registered' });
                        }
                        return res.status(500).json({error: 'Failed to create user'});
                    }

                    const accessToken = jwt.sign({
                        user_id: result.insertId,
                        username,
                        email,
                        role: 'user'
                    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});

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
};

// PUT update user, secured
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);

    if (decoded.role !== 'admin' && decoded.user_id !== parseInt(userId)) {
        return res.status(403).json({error: 'Not authorized to update this user'});
    }

    const {username, email, password, biography, profile_picture} = req.body;
    let updateFields = [];
    let queryParams = [];

    if (username) {
        updateFields.push('username = ?');
        queryParams.push(username);
    }

    if (email) {
        const [existingUsers] = await config.promise().query(
            'SELECT * FROM inkforge_users WHERE email = ? AND user_id != ?',
            [email, userId]
        );

        //prevent users from setting their email to an already registered email
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        updateFields.push('email = ?');
        queryParams.push(email);
    }

    //temporarily handle password as a string '********' to avoid accidental updates, if not updated, remove from put request body
    if (password && password !== '********') {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            queryParams.push(hashedPassword);
        } catch (err) {
            return res.status(500).json({error: 'Error when hashing password'});
        }
    }

    if (biography !== undefined) {
        updateFields.push('biography = ?');
        queryParams.push(biography);
    }

    if (profile_picture !== undefined) {
        updateFields.push('profile_picture = ?');
        queryParams.push(profile_picture);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({error: 'No fields to update'});
    }

    queryParams.push(userId);

    const query = `UPDATE inkforge_users SET ${updateFields.join(', ')} WHERE user_id = ?`;

    config.query(query, queryParams, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({error: 'Failed to update user'});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'User not found'});
        }

        config.query('SELECT user_id, username, email, biography, profile_picture, role FROM inkforge_users WHERE user_id = ?',
            [userId],
            (err, users) => {
                if (err) {
                    console.error('Error fetching updated user:', err);
                    return res.status(500).json({error: 'Failed to fetch updated user data'});
                }
                res.json(users[0]);
            }
        );
    });
};

// DELETE user, secured
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);

    if (decoded.role !== 'admin' && decoded.user_id !== parseInt(userId)) {
        return res.status(403).json({error: 'Not authorized to delete this user'});
    }

    config.query('DELETE FROM inkforge_users WHERE user_id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({error: 'Failed to delete user'});
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'User not found'});
        }
        res.json({message: 'User deleted successfully'});
    });
};
