const {config} = require('../services/database');

function checkUserOwnership(userIdToUpdate, userIdLoggedIn, callback) {
    // For user profile pic, user can only update their own profile picture
    callback(userIdToUpdate === userIdLoggedIn);
}

function checkProjectOwnership(projectId, userId, callback) {
    console.log(projectId);
    console.log(typeof projectId);
    if (isNaN(projectId)) {
        return callback(true);
    }
    const sql = `SELECT * FROM projects WHERE project_id = ? AND user_id = ?`;
    config.query(sql, [projectId, userId], (err, result) => {
        if (err || result.length === 0) return callback(false);
        callback(true);
    });
}

function checkCharacterOwnership(characterId, userId, callback) {
    if (isNaN(characterId)) {
        return callback(true);
    }
    const sql = `
        SELECT c.* FROM characters c
        JOIN projects p ON c.project_id = p.project_id
        WHERE c.character_id = ? AND p.user_id = ?
    `;
    config.query(sql, [characterId, userId], (err, result) => {
        if (err || result.length === 0) return callback(false);
        callback(true);
    });
}

exports.uploadUserImage = (req, res) => {
    const userIdLoggedIn = req.user.user_id;
    const userIdToUpdate = Number(req.params.id);

    checkUserOwnership(userIdToUpdate, userIdLoggedIn, (isOwner) => {
        if (!isOwner) {
            return res.status(403).json({ message: 'You can only update your own profile picture.' });
        }

        const filePath = `/uploads/users/${req.file.filename}`;
        res.status(200).json({ message: 'User image uploaded successfully', path: filePath });
    });
};

exports.uploadProjectImage = (req, res) => {
    const userId = parseInt(req.user.user_id);
    const projectId = Number(req.params.id);

    checkProjectOwnership(projectId, userId, (isOwner) => {
        if (!isOwner) {
            return res.status(403).json({ message: 'You can only update images for your own projects.' });
        }

        const filePath = `/uploads/projects/${req.file.filename}`;
        res.status(200).json({ message: 'Project cover uploaded successfully', path: filePath });
    });
};

exports.uploadCharacterImage = (req, res) => {
    const userId = req.user.user_id;
    const characterId = Number(req.params.id);

    checkCharacterOwnership(characterId, userId, (isOwner) => {
        if (!isOwner) {
            return res.status(403).json({ message: 'You can only update images for your own characters.' });
        }
        const filePath = `/uploads/characters/${req.file.filename}`;
        console.log("filename", req.file.filename);
        res.status(200).json({ message: 'Character image uploaded successfully', path: filePath });
    });
};
