const express = require('express');
const router = express.Router({ mergeParams: true });
const segmentController = require('../controllers/segmentController');
const {authenticateJWT} = require('../services/authentication')

// Defined routes for segments
router.post('/', authenticateJWT, segmentController.createSegment); // POST /projects/:project_id/characters
router.get('/', segmentController.getSegmentsByProject); // GET /projects/:project_id/characters
router.get('/:id', authenticateJWT, segmentController.getSegmentsById);
router.put('/:id', authenticateJWT, segmentController.updateSegment);
router.delete('/:id', authenticateJWT, segmentController.deleteSegment);

module.exports = router;