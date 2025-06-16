const { config } = require('../services/database');

function checkProjectOwnershipBySegment(segmentId, userId, callback) {
    const sql = `
        SELECT p.user_id
        FROM story_segments s
        JOIN projects p ON s.project_id = p.project_id
        WHERE s.segment_id = ? AND p.user_id = ?
    `;
    config.query(sql, [segmentId, userId], (err, result) => {
        if (err || result.length === 0) {
            return callback(false);
        }
        callback(true);
    });
}

exports.createSegment = (req, res) => {
    const { project_id } = req.params; // from route params
    const { title, content } = req.body;

    const projectIdInt = parseInt(project_id, 10);
    const userIdInt = parseInt(req.user.user_id, 10);

    const projectCheckSql = `SELECT * FROM projects WHERE project_id = ? AND user_id = ?`;

    config.query(projectCheckSql, [projectIdInt, userIdInt], (err, result) => {
        if (err || result.length === 0) {
            return res.status(403).json({ error: 'You do not own this project.' });
        }

        const sql = `
            INSERT INTO story_segments (project_id, title, content)
            VALUES (?, ?, ?)
        `;
        config.query(sql, [projectIdInt, title, content], (err, result) => {
            if (err) {
                console.error('Error creating segment:', err);
                return res.status(500).json({ error: 'Failed to create segment' });
            }

            res.status(201).json({
                message: 'Segment created successfully',
                segmentId: result.insertId,
                title: title,
                content: content
            });
        });
    });

}

exports.getSegmentsByProject = (req, res) => {
    const { project_id } = req.params;

    const sql = `SELECT * FROM story_segments WHERE project_id = ?`;
    config.query(sql, [project_id], (err, result) => {
        if (err) {
            console.error('Error fetching segments:', err);
            return res.status(500).json({ error: 'Failed to fetch segments' });
        }

        res.json({ segments: result });
    });
}
exports.getSegmentsById = (req, res) => {
    const { id } = req.params; // from route params

    const sql = `SELECT * FROM story_segments WHERE segment_id = ?`;
    config.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching segment:', err);
            return res.status(500).json({ error: 'Failed to fetch segment' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Segment not found' });
        }

        res.json({ segment: result[0] });
    });
}

exports.updateSegment = (req, res) => {
    const userId = req.user.user_id; // from JWT middleware
    const { id } = req.params; // from route params
    const { title, content } = req.body;

    checkProjectOwnershipBySegment(id, userId, (isOwner) => {
        if (!isOwner) {
            return res.status(403).json({ error: 'You do not have permission to edit this segment.' });
        }

        const sql = `
            UPDATE story_segments
            SET title = ?, content = ?
            WHERE segment_id = ?
        `;
        config.query(sql, [title, content, id], (err, result) => {
            if (err) {
                console.error('Error updating segment:', err);
                return res.status(500).json({ error: 'Failed to update segment' });
            }

            res.json({
                message: 'Segment updated successfully',
                affectedRows: result.affectedRows});

        });
    });

}
exports.deleteSegment = (req, res) => {
    const userId = req.user.user_id; // from JWT middleware
    const { id } = req.params; // from route params

    checkProjectOwnershipBySegment(id, userId, (isOwner) => {
        if (!isOwner) {
            return res.status(403).json({ error: 'You do not have permission to delete this segment.' });
        }

        const sql = `DELETE FROM story_segments WHERE segment_id = ?`;
        config.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting segment:', err);
                return res.status(500).json({ error: 'Failed to delete segment' });
            }

            res.json({
                message: 'Segment deleted successfully',
                affectedRows: result.affectedRows
            });
        });
    });
}

