const { config } = require('../services/database');

// 🔁 Reusable helper to verify project ownership
function checkProjectOwnershipByCharacter(characterId, userId, callback) {
    const sql = `
        SELECT p.user_id
        FROM characters c
        JOIN projects p ON c.project_id = p.project_id
        WHERE c.character_id = ? AND p.user_id = ?
    `;
    config.query(sql, [characterId, userId], (err, result) => {
        if (err || result.length === 0) {
            return callback(false);
        }
        callback(true);
    });
}

// ✅ Create character (secured)
exports.createCharacter = (req, res) => {
    const userId = req.user.user_id;
    const { project_id } = req.params;
    const { name, role, personality, biography, image, description } = req.body;

    const projectIdInt = parseInt(project_id, 10);
    const userIdInt = parseInt(userId, 10);

    const projectCheckSql = `SELECT * FROM projects WHERE project_id = ? AND user_id = ?`;
    config.query(projectCheckSql, [projectIdInt, userIdInt], (err, result) => {
        if (err || result.length === 0) {
            return res.status(403).json({ error: 'You do not own this project.' });
        }

        const sql = `
            INSERT INTO characters (project_id, name, role, personality, biography, image, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        config.query(sql, [projectIdInt, name, role, personality, biography, image, description], (err, result) => {
            if (err) {
                console.error('Error creating character:', err);
                return res.status(500).json({ error: 'Failed to create character' });
            }

            res.status(201).json({
                message: 'Character created successfully',
                characterId: result.insertId
            });
        });
    });
};

// 👁️ Get all characters for a project (no auth needed)
exports.getCharactersByProject = (req, res) => {
    const { project_id } = req.params;

    const sql = `SELECT * FROM characters WHERE project_id = ?`;
    config.query(sql, [project_id], (err, result) => {
        if (err) {
            console.error('Error fetching characters:', err);
            return res.status(500).json({ error: 'Failed to fetch characters' });
        }

        res.json({ characters: result });
    });
};

// 👁️ Get a single character (no auth needed)
exports.getCharacterById = (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM characters WHERE character_id = ?`;
    config.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching character:', err);
            return res.status(500).json({ error: 'Failed to fetch character' });
        }

        res.json({ character: result[0] || {} });
    });
};

// ✅ Update character (secured)
exports.updateCharacter = (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { name, role, personality, biography, image, description } = req.body;

    checkProjectOwnershipByCharacter(id, userId, (isOwner) => {
        if (!isOwner) return res.status(403).json({ error: 'You do not have permission to update this character.' });

        const sql = `
            UPDATE characters
            SET name = ?, role = ?, personality = ?, biography = ?, image = ?, description = ?
            WHERE character_id = ?
        `;
        config.query(sql, [name, role, personality, biography, image, description, id], (err, result) => {
            if (err) {
                console.error('Error updating character:', err);
                return res.status(500).json({ error: 'Failed to update character' });
            }

            // Fetch the updated character to return the complete data
            config.query('SELECT * FROM characters WHERE character_id = ?', [id], (err, characters) => {
                if (err) {
                    console.error('Error fetching updated character:', err);
                    return res.status(500).json({ error: 'Failed to fetch updated character data' });
                }
                res.json({
                    message: 'Character updated successfully',
                    character: characters[0]
                });
            });
        });
    });
};

// ✅ Delete character (secured)
exports.deleteCharacter = (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;

    checkProjectOwnershipByCharacter(id, userId, (isOwner) => {
        if (!isOwner) return res.status(403).json({ error: 'You do not have permission to delete this character.' });

        const sql = `DELETE FROM characters WHERE character_id = ?`;
        config.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting character:', err);
                return res.status(500).json({ error: 'Failed to delete character' });
            }

            res.json({
                message: 'Character deleted successfully',
                affectedRows: result.affectedRows
            });
        });
    });
};
