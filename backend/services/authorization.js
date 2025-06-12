const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
    console.log('Authorization header:', req.headers.authorization);
    // Token nur noch aus Authorization-Header extrahieren
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    console.log('Extracted token:', token);

    if (!token) {
        console.log('No token found');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your-secret-key');
        console.log('Decoded token:', decoded);

        if (decoded.role !== 'admin') {
            console.log('User is not an admin. Role:', decoded.role);
            return res.status(403).json({ error: 'Admin access required' });
        }

        console.log('Admin access granted');
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = {
    requireAdmin,
};
