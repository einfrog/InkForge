const { config } = require('../services/database');

// Promisified DB query
function query(sql, params) {
    return new Promise((resolve, reject) => {
        config.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

// 🔁Project ownership check
async function checkUserOwnsProject(projectId, userId) {
    const sql = `SELECT 1 FROM projects WHERE project_id = ? AND user_id = ?`;
    const result = await query(sql, [projectId, userId]);
    return result.length > 0;
}

// 🔁Get project IDs of both characters for checking if they belong to the same project
async function getCharactersProjectIds(charId1, charId2) {
    const sql = `
        SELECT character_id, project_id
        FROM characters
        WHERE character_id IN (?, ?)
    `;
    const results = await query(sql, [charId1, charId2]);

    if (results.length !== 2) {
        throw new Error('One or both characters not found');
    }

    const map = {};
    results.forEach(row => map[row.character_id] = row.project_id);

    return {
        sourceProjectId: map[charId1],
        targetProjectId: map[charId2],
    };
}

// 🔁Shared character ID validation - FIXED: Better validation and debugging
function validateCharacterIds(charId1, charId2, res) {
    console.log('Validating character IDs:', { charId1, charId2, type1: typeof charId1, type2: typeof charId2 });

    // Check if IDs are valid numbers (not NaN, null, undefined, or 0)
    if (!charId1 || !charId2 || isNaN(charId1) || isNaN(charId2)) {
        console.log('Invalid character IDs detected');
        res.status(400).json({ error: 'Invalid character IDs.' });
        return false;
    }

    if (charId1 === charId2) {
        console.log('Same character ID detected');
        res.status(400).json({ error: 'A character cannot have a relation to itself.' });
        return false;
    }

    return true;
}

exports.createRelation = async (req, res) => {
    try {
        console.log('Create relation request body:', req.body);
        console.log('Create relation params:', req.params);
        console.log('User ID:', req.user?.user_id);

        const charId = Number(req.params.character_id || req.body.source_character_id);
        const targetCharId = Number(req.body.target_character_id);
        const { relationship_type, notes } = req.body;
        const userId = req.user.user_id;

        if (!validateCharacterIds(charId, targetCharId, res)) return;

        console.log('Getting project IDs for characters:', charId, targetCharId);
        const { sourceProjectId, targetProjectId } = await getCharactersProjectIds(charId, targetCharId);
        console.log('Project IDs:', { sourceProjectId, targetProjectId });

        if (sourceProjectId !== targetProjectId) {
            return res.status(400).json({ error: 'Characters do not belong to the same project' });
        }

        console.log('Checking project ownership for user:', userId, 'project:', sourceProjectId);
        if (!(await checkUserOwnsProject(sourceProjectId, userId))) {
            return res.status(403).json({ error: 'You do not own this project.' });
        }

        // Check if relation already exists
        const existingRelationSql = `
            SELECT 1 FROM character_relations 
            WHERE source_character_id = ? AND target_character_id = ?
        `;
        const existingRelation = await query(existingRelationSql, [charId, targetCharId]);

        if (existingRelation.length > 0) {
            return res.status(400).json({ error: 'Relation between these characters already exists' });
        }

        const sql = `
            INSERT INTO character_relations (project_id, source_character_id, target_character_id, relationship_type, notes)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [sourceProjectId, charId, targetCharId, relationship_type, notes]);

        res.status(201).json({
            message: 'Character relation created successfully',
            relationId: result.insertId,
        });
    } catch (err) {
        console.error('Error creating character relation:', err);
        res.status(500).json({ error: err.message || 'Failed to create character relation' });
    }
};

exports.getRelationsByCharacter = (req, res) => {
    const charId = Number(req.params.character_id);
    if (!charId) {
        return res.status(400).json({ error: 'Invalid character ID.' });
    }

    const sql = `SELECT * FROM character_relations WHERE source_character_id = ?`;

    config.query(sql, [charId], (err, result) => {
        if (err) {
            console.error('Error fetching character relations:', err);
            return res.status(500).json({ error: 'Failed to fetch character relations' });
        }

        res.json({ relations: result || [] });

    });
};

exports.updateRelation = async (req, res) => {
    try {
        console.log('Update relation params:', req.params);
        console.log('Update relation body:', req.body);
        console.log('User ID:', req.user?.user_id);

        const charId = Number(req.params.character_id);
        const targetCharId = Number(req.params.target_character_id);
        const { relationship_type, notes } = req.body;
        const userId = req.user.user_id;

        if (!validateCharacterIds(charId, targetCharId, res)) return;

        const { sourceProjectId, targetProjectId } = await getCharactersProjectIds(charId, targetCharId);

        if (sourceProjectId !== targetProjectId) {
            return res.status(400).json({ error: 'Characters do not belong to the same project' });
        }

        if (!(await checkUserOwnsProject(sourceProjectId, userId))) {
            return res.status(403).json({ error: 'Unauthorized project access' });
        }

        // Check if relation exists before updating
        const checkRelationSql = `
            SELECT 1 FROM character_relations
            WHERE source_character_id = ? AND target_character_id = ?
        `;
        const existingRelation = await query(checkRelationSql, [charId, targetCharId]);

        if (existingRelation.length === 0) {
            return res.status(404).json({ error: 'Relation not found' });
        }

        const sql = `
            UPDATE character_relations
            SET relationship_type = ?, notes = ?
            WHERE source_character_id = ? AND target_character_id = ?
        `;

        const result = await query(sql, [relationship_type, notes, charId, targetCharId]);
        console.log('Update result:', result);

        res.json({ message: 'Character relation updated successfully' });
    } catch (err) {
        console.error('Error updating character relation:', err);
        res.status(500).json({ error: err.message || 'Failed to update character relation' });
    }
};

exports.deleteRelation = async (req, res) => {
    try {
        console.log('Delete relation params:', req.params);
        console.log('User ID:', req.user?.user_id);

        const charId = Number(req.params.character_id);
        const targetCharId = Number(req.params.target_character_id);
        const userId = req.user.user_id;

        if (!validateCharacterIds(charId, targetCharId, res)) return;

        const { sourceProjectId, targetProjectId } = await getCharactersProjectIds(charId, targetCharId);

        if (sourceProjectId !== targetProjectId) {
            return res.status(400).json({ error: 'Characters do not belong to the same project' });
        }

        if (!(await checkUserOwnsProject(sourceProjectId, userId))) {
            return res.status(403).json({ error: 'Unauthorized project access' });
        }

        // Check if relation exists before deleting
        const checkRelationSql = `
            SELECT 1 FROM character_relations
            WHERE source_character_id = ? AND target_character_id = ?
        `;
        const existingRelation = await query(checkRelationSql, [charId, targetCharId]);

        if (existingRelation.length === 0) {
            return res.status(404).json({ error: 'Relation not found' });
        }

        const sql = `
            DELETE FROM character_relations
            WHERE source_character_id = ? AND target_character_id = ?
        `;

        const result = await query(sql, [charId, targetCharId]);
        console.log('Delete result:', result);

        res.json({ message: 'Character relation deleted successfully' });
    } catch (err) {
        console.error('Error deleting character relation:', err);
        res.status(500).json({ error: err.message || 'Failed to delete character relation' });
    }
};