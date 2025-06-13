const { config } = require('../services/database');

// Reusable helper to check if the user owns the project
function checkProjectOwnership(projectId, userId, callback) {
    const sql = `SELECT * FROM projects WHERE project_id = ? AND user_id = ?`;
    config.query(sql, [projectId, userId], (err, result) => {
        if (err || result.length === 0) {
            return callback(false);
        }
        callback(true);
    });
}

// ✅ Get all settings for the project
exports.getSettingsByProject = (req, res) => {
    const { project_id } = req.params;

    const sql = `SELECT * FROM settings WHERE project_id = ?`;
    config.query(sql, [project_id], (err, result) => {
        if (err) {
            console.error('Error fetching settings:', err);
            return res.status(500).json({ error: 'Failed to fetch settings' });
        }
        res.json({ settings: result[0] || {} });
    });
};

// ✅ Reusable upsert function factory (for both POST and PUT)
const upsertSettingField = (field) => {
    return (req, res) => {
        const { project_id } = req.params;
        const userId = req.user.user_id;
        const value = req.body[field];

        if (typeof value === 'undefined') {
            return res.status(400).json({ error: `Missing '${field}' in request body` });
        }

        checkProjectOwnership(project_id, userId, (isOwner) => {
            if (!isOwner) {
                return res.status(403).json({ error: 'Unauthorized project access' });
            }

            const checkSql = `SELECT * FROM settings WHERE project_id = ?`;
            config.query(checkSql, [project_id], (err, results) => {
                if (err) return res.status(500).json({ error: 'Database check error' });

                const sql = results.length > 0
                    ? `UPDATE settings SET ${field} = ? WHERE project_id = ?`
                    : `INSERT INTO settings (project_id, ${field}) VALUES (?, ?)`;

                const params = results.length > 0 ? [value, project_id] : [project_id, value];

                config.query(sql, params, (err) => {
                    if (err) return res.status(500).json({ error: `Failed to save ${field}` });

                    res.json({ message: `${field} saved successfully` });
                });
            });
        });
    };
};

// ✅ Reusable delete function factory (sets field to NULL)
const deleteSettingField = (field) => {
    return (req, res) => {
        const { project_id } = req.params;
        const userId = req.user.user_id;

        checkProjectOwnership(project_id, userId, (isOwner) => {
            if (!isOwner) {
                return res.status(403).json({ error: 'Unauthorized project access' });
            }

            const sql = `UPDATE settings SET ${field} = NULL WHERE project_id = ?`;
            config.query(sql, [project_id], (err) => {
                if (err) return res.status(500).json({ error: `Failed to delete ${field}` });

                res.json({ message: `${field} deleted successfully` });
            });
        });
    };
};

// Export modular handlers
exports.createGeography = upsertSettingField('geography');
exports.updateGeography = upsertSettingField('geography');
exports.deleteGeography = deleteSettingField('geography');

exports.createClimate = upsertSettingField('climate');
exports.updateClimate = upsertSettingField('climate');
exports.deleteClimate = deleteSettingField('climate');

exports.createTimePeriod = upsertSettingField('time_period');
exports.updateTimePeriod = upsertSettingField('time_period');
exports.deleteTimePeriod = deleteSettingField('time_period');

exports.createPoliticalSystem = upsertSettingField('political_system');
exports.updatePoliticalSystem = upsertSettingField('political_system');
exports.deletePoliticalSystem = deleteSettingField('political_system');

exports.createCulture = upsertSettingField('culture');
exports.updateCulture = upsertSettingField('culture');
exports.deleteCulture = deleteSettingField('culture');

exports.createNote = upsertSettingField('note');
exports.updateNote = upsertSettingField('note');
exports.deleteNote = deleteSettingField('note');
