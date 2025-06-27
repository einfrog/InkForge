const {config} = require('../services/database');

//reusable function to check if user owns the project
function checkProjectOwnership(projectId, userId, callback) {
    const sql = `SELECT * FROM projects WHERE project_id = ? AND user_id = ?`;
    config.query(sql, [projectId, userId], (err, result) => {
        if (err || result.length === 0) {
            return callback(false);
        }
        callback(true);
    });
}

//get all projects with optional visibility filter, available to all users
exports.getAllProjects = (req, res) => {
    const {visibility} = req.query;

    let query = `SELECT p.*, u.username AS username
                 FROM projects p
                 JOIN inkforge_users u ON p.user_id = u.user_id`;
    let params = [];

    if (visibility) {
        query += ' WHERE visibility = ?';
        params.push(visibility);
    }

    config.query(query, params, (err, results) => {
        if (err) {
            console.error('Failed to fetch projects:', err);
            return res.status(500).json({error: 'Failed to fetch projects'});
        }

        res.json({projects: results});
    });
};

//create a new project (secured)
exports.createProject = (req, res) => {
    const userId = req.user.user_id; // from JWT middleware
    const {project_name, category, genre, description, visibility} = req.body;

    const sql = `
        INSERT INTO projects (user_id, project_name, category, genre, description, visibility)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    config.query(sql, [userId, project_name, category, genre, description, visibility], (err, result) => {
        if (err) {
            console.error('Error creating project:', err);
            return res.status(500).json({error: 'Failed to create project'});
        }

        const newProjectId = result.insertId;

        // Insert empty settings row for the project
        const settingsSql = `INSERT INTO settings (project_id) VALUES (?)`;
        config.query(settingsSql, [newProjectId], (settingsErr, settingsResult) => {
            if (settingsErr) {
                console.error('Error creating settings row:', settingsErr);
                return res.status(500).json({error: 'Project created, but failed to initialize settings'});
            }

            res.status(201).json({
                message: 'Project and settings created successfully',
                project: {
                    id: newProjectId,
                    user_id: userId,
                    project_name,
                }
            });
        });
    });
};

// get all projects for the authenticated user
exports.getMyProjects = (req, res) => {
    const userId = req.user.user_id; // from JWT middleware

    const sql = `SELECT p.*, u.username AS username
                 FROM projects p
                 JOIN inkforge_users u ON p.user_id = u.user_id
                   WHERE p.user_id = ?
    `;

    config.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({error: 'Failed to fetch projects'});
        }

        res.json({
            projects: results,
            count: results.length
        });
    });
}

// get a single project by ID
exports.getProjectById = (req, res) => {
    const projectId = req.params.id;

    const sql = `SELECT p.*, u.username AS username
                 FROM projects p
                 JOIN inkforge_users u ON p.user_id = u.user_id
                  WHERE project_id = ?`;

    config.query(sql, [projectId], (err, result) => {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).json({error: 'Failed to fetch project'});
        }

        res.json({
            project: result[0] || {},
        });
    });
};

// update a project (secured)
exports.updateProject = (req, res) => {
    const userId = req.user.user_id;
    const projectId = req.params.id;
    const {project_name, category, genre, description, visibility, cover} = req.body;

    checkProjectOwnership(projectId, userId, (isOwner) => {
        if (!isOwner) {
            return res.status(403).json({error: 'You do not have permission to update this project.'});
        }

        const sql = `
            UPDATE projects
            SET project_name = ?, category = ?, genre = ?, description = ?, visibility = ?, cover = ?
            WHERE project_id = ?
        `;

        config.query(sql, [project_name, category, genre, description, visibility, cover, projectId], (err, result) => {
            if (err) {
                console.error('Error updating project:', err);
                return res.status(500).json({error: 'Failed to update project'});
            }

            res.json({
                message: 'Project updated successfully',
                affectedRows: result.affectedRows,
            });
        });
    });
};

// delete a project (secured)
exports.deleteProject = (req, res) => {
    const userId = req.user.user_id;
    const projectId = req.params.id;

    checkProjectOwnership(projectId, userId, (isOwner) => {
        if (!isOwner) {
            return res.status(403).json({error: 'You do not have permission to delete this project.'});
        }

        const sql = `DELETE FROM projects WHERE project_id = ?`;
        config.query(sql, [projectId], (err, result) => {
            if (err) {
                console.error('Error deleting project:', err);
                return res.status(500).json({error: 'Failed to delete project'});
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({error: 'Project not found'});
            }

            res.json({
                message: 'Project deleted successfully',
                affectedRows: result.affectedRows,
            });
        });
    });
};

// get character graphs for a project
exports.getCharacterGraphs = (req, res) => {
    const projectId = req.params.id;

    // first, get characters
    config.query('SELECT character_id AS id, name FROM characters WHERE project_id = ?', [projectId], (err, characters) => {
        if (err) {
            console.error('Error fetching characters:', err);
            return res.status(500).json({error: 'Failed to load characters'});
        }

        // then, get relationships
        config.query(`
            SELECT source_character_id AS source, target_character_id AS target, relationship_type AS type, notes 
            FROM character_relations 
            WHERE project_id = ?`, [projectId], (relationErr, relations) => {

            if (relationErr) {
                console.error('Error fetching relationships:', relationErr);
                return res.status(500).json({error: 'Failed to load relationships'});
            }

            // send the response with both datasets
            console.log('Sending graph data:', {
                nodes: characters.length,
                links: relations.length
            });

            res.json({
                nodes: characters,
                links: relations
            });
        });
    });
};

//get project stats for overview page
exports.getProjectStats = (req, res) => {
    const projectId = req.params.id;

    // query for all stats in parallel
    const charQuery = `SELECT COUNT(*) AS count FROM characters WHERE project_id = ?`;
    const segQuery = `SELECT COUNT(*) AS count, COALESCE(SUM(LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1), 0) AS wordCount FROM story_segments WHERE project_id = ?`;
    const setQuery = `SELECT 
                        (geography IS NOT NULL) +
                        (climate IS NOT NULL) +
                        (time_period IS NOT NULL) +
                        (political_system IS NOT NULL) +
                        (culture IS NOT NULL) +
                        (note IS NOT NULL) AS count
                    FROM settings
                    WHERE project_id = ?`;

    let stats = {};
    config.query(charQuery, [projectId], (err, charResult) => {
        if (err) return res.status(500).json({error: 'Failed to count characters'});
        stats.characters = charResult[0].count;

        config.query(segQuery, [projectId], (err, segResult) => {
            if (err) return res.status(500).json({error: 'Failed to count segments'});
            stats.segments = segResult[0].count;
            stats.words = segResult[0].wordCount;

            config.query(setQuery, [projectId], (err, setResult) => {
                if (err) return res.status(500).json({error: 'Failed to count settings'});
                stats.settings = setResult[0].count;

                res.json(stats);
            });
        });
    });
};
