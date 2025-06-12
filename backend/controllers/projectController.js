const { config } = require('../services/database');

exports.createProject = (req, res) => {
    const userId = req.user.user_id; // from JWT middleware
    const { project_name, category, genre, description, visibility } = req.body;

    const sql = `
        INSERT INTO projects (user_id, project_name, category, genre, description, visibility)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    config.query(sql, [userId, project_name, category, genre, description, visibility], (err, result) => {
        if (err) {
            console.error('Error creating project:', err);
            return res.status(500).json({ error: 'Failed to create project' });
        }

        res.status(201).json({
            message: 'Project created successfully',
            project: {
                id: result.insertId,
                user_id: userId,
                project_name,
            }
        });
    });
};
