const { config } = require('../services/database');

exports.getAllProjects = (req, res) => {
    const sql = `SELECT * FROM projects`;

    config.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ error: 'Failed to fetch projects' });
        }

        res.json({
            projects: result,
        });
    });
};

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

exports.getMyProjects = (req, res) => {
    const userId = req.user.user_id; // from JWT middleware

    const sql = `
        SELECT * FROM projects WHERE user_id = ?
    `;

    config.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ error: 'Failed to fetch projects' });
        }

        res.json({
            projects: results,
            count: results.length
        });
    });
}

exports.getProjectById = (req, res) => {
    const projectId = req.params.id; // <-- FIXED here

    const sql = `SELECT * FROM projects WHERE project_id = ?`;

    config.query(sql, [projectId], (err, result) => {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).json({ error: 'Failed to fetch project' });
        }

        res.json({
            project: result[0] || {},
        });
    });
};

exports.updateProject = (req, res) => {
    const projectId = req.params.id;
    const { project_name, category, genre, description, visibility } = req.body;

    const sql = `
        UPDATE projects
        SET project_name = ?, category = ?, genre = ?, description = ?, visibility = ?
        WHERE project_id = ?
    `;

    config.query(sql, [project_name, category, genre, description, visibility, projectId], (err, result) => {
        if (err) {
            console.error('Error updating project:', err);
            return res.status(500).json({ error: 'Failed to update project' });
        }

        res.json({
            message: 'Project updated successfully',
            affectedRows: result.affectedRows,
        });
    });
}

exports.deleteProject = (req, res) => {
    const projectId = req.params.id;

    const sql = `DELETE FROM projects WHERE project_id = ?`;

    config.query(sql, [projectId], (err, result) => {
        if (err) {
            console.error('Error deleting project:', err);
            return res.status(500).json({ error: 'Failed to delete project' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({
            message: 'Project deleted successfully',
            affectedRows: result.affectedRows,
        });
    });
}
