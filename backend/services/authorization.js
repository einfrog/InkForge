const db = require('./database').config;
const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
    console.log('Authorization header:', req.headers.authorization);
    // extract the token from the Authorization header
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

async function checkProjectAccess(req, res, next) {
    const projectId = req.params.id || req.params.project_id;
    if (!projectId) {
        return res.status(400).json({ error: 'No project id provided.' });
    }

    db.query('SELECT * FROM projects WHERE project_id = ?', [projectId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        const project = results[0];

        if (project.visibility === 'private' && req.originalUrl.includes('/explore')) {
            return res.status(403).json({ error: 'Private projects cannot be accessed via explore.' });
        }

        if (project.visibility === 'public') {
            req.project = project;
            return next();
        }

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            userId = decoded.user_id || decoded.id || decoded.sub;
        } catch (e) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        if (project.user_id !== userId) {
            return res.status(403).json({ error: 'No access to this private project.' });
        }

        req.project = project;
        next();
    });
}

module.exports = {
    requireAdmin,
    checkProjectAccess,
};
