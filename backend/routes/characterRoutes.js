const express = require('express');
const router = express.Router({ mergeParams: true });
const characterController = require('../controllers/characterController');
const {authenticateJWT} = require('../services/authentication')

router.post('/', authenticateJWT, characterController.createCharacter); // POST /projects/:project_id/characters
router.get('/', authenticateJWT, characterController.getCharactersByProject); // GET /projects/:project_id/characters
router.get('/:id', authenticateJWT, characterController.getCharacterById);
router.put('/:id', authenticateJWT, characterController.updateCharacter);
router.delete('/:id', authenticateJWT, characterController.deleteCharacter);

module.exports = router;
