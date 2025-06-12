const jwt = require("jsonwebtoken");
//getting the token secret from the .env file
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; //process.env ensures the secret is not hardcoded; holds all environment variables available to the application
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

async function checkPassword (password, hash) {
    // returns true/false for whether the given plain-text password matches the hash
    let pw = await bcrypt.compare(password, hash);
    return pw;
}

//the login function:
async function authenticateUser(email, password) {
    try {
        const users = await userModel.getUsers();

        if (!users || !Array.isArray(users)) {
            throw new Error("Users not an array");
        }

        const user = users.find(u => u.email === email);

        // Passwort-Hash-Vergleich mit bcrypt
        if (user && user.password) {
            const pwMatch = await checkPassword(password, user.password);
            if (pwMatch) {
                // Create JWT token
                const accessToken = jwt.sign({
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

                return {
                    success: true,
                    token: accessToken,
                    user: {
                        user_id: user.user_id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    }
                };
            }
        }
        return {
            success: false,
            error: 'Invalid username or password'
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || 'Authentication error'
        };
    }
}

function authenticateJWT(req, res, next) {
    // Token nur noch aus Authorization-Header extrahieren
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (token) {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    authenticateUser,
    authenticateJWT
}