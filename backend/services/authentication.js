const jwt = require("jsonwebtoken");
//getting the token secret from the .env file
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; //process.env ensures the secret is not hardcoded; holds all environment variables available to the application
// const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// async function checkPassword (password, hash) {
//     // returns true/false for whether the given plain-text password matches the hash
//     let pw = await bcrypt.compare(password, hash);
//     return pw;
// }

//the login function:
async function authenticateUser(email, password) {
    try {
        const users = await userModel.getUsers();

        if (!users || !Array.isArray(users)) {
            throw new Error("Users not an array");
        }

        const user = users.find(u => u.email === email);

        // Temporarily check password directly without hashing
        if (user && user.password === password) {
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
        } else {
            return {
                success: false,
                error: 'Invalid username or password'
            };
        }

    } catch (error) {
        console.error('Authentication error:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

function authenticateJWT(req, res, next) {
    //gets the token from the cookie
    const token = req.cookies.accessToken;

    //if token exists
    if (token) {
        //verifies authenticity of jwt and decodes its payload
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                // invalid or expired token: forbidden
                return res.sendStatus(403);
            }
            // attach the decoded payload (user info) to the request
            req.user = user;
            //goes to next middleware or route handler
            next();
        })
    } else {
        // no token: unauthorized
        res.sendStatus(401);
    }
}

module.exports = {
    authenticateUser,
    authenticateJWT
}