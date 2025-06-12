const { config } = require('../services/database');

// Create character
exports.createCharacter = (req, res) => {
    const { project_id } = req.params; // now from URL, not body
    const { name, role, personality, biography, image } = req.body;

    const sql = `
        INSERT INTO characters (project_id, name, role, personality, biography, image)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    config.query(sql, [project_id, name, role, personality, biography, image], (err, result) => {
        if (err) {
            console.error('Error creating character:', err);
            return res.status(500).json({ error: 'Failed to create character' });
        }

        res.status(201).json({
            message: 'Character created successfully',
            characterId: result.insertId
        });
    });
};

// Get all characters for a project
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

// Get a single character
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

// Update a character
exports.updateCharacter = (req, res) => {
    const { id } = req.params;
    const { name, role, personality, biography, image } = req.body;

    const sql = `
        UPDATE characters
        SET name = ?, role = ?, personality = ?, biography = ?, image = ?
        WHERE character_id = ?
    `;

    config.query(sql, [name, role, personality, biography, image, id], (err, result) => {
        if (err) {
            console.error('Error updating character:', err);
            return res.status(500).json({ error: 'Failed to update character' });
        }

        res.json({
            message: 'Character updated successfully',
            affectedRows: result.affectedRows
        });
    });
};

// Delete a character
exports.deleteCharacter = (req, res) => {
    const { id } = req.params;

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
};
