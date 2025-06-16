const express = require('express');
const router = express.Router({ mergeParams: true });
const characterRelationsController = require('../controllers/characterRelationsController');
const { authenticateJWT } = require('../services/authentication');

router.get('/', characterRelationsController.getRelationsByCharacter);
router.post('/', authenticateJWT, characterRelationsController.createRelation);
router.put('/:target_character_id', authenticateJWT, characterRelationsController.updateRelation);
router.delete('/:target_character_id', authenticateJWT, characterRelationsController.deleteRelation);

module.exports = router;
