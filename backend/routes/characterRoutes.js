const express = require('express');
const router = express.Router({ mergeParams: true });
const characterController = require('../controllers/characterController');
const characterRelationsRouter = require('./characterRelationsRoutes');
const {authenticateJWT} = require('../services/authentication')

router.post('/', authenticateJWT, characterController.createCharacter); // POST /projects/:project_id/characters
router.get('/', characterController.getCharactersByProject); // GET /projects/:project_id/characters
router.get('/:id', characterController.getCharacterById);
router.put('/:id', authenticateJWT, characterController.updateCharacter);
router.delete('/:id', authenticateJWT, characterController.deleteCharacter);

//establish character relations routes
router.use('/:character_id/relations', characterRelationsRouter);

module.exports = router;
