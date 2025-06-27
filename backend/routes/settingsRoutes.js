const express = require('express');
const router = express.Router({ mergeParams: true });
const settingsController = require('../controllers/settingsController');
const { authenticateJWT } = require('../services/authentication');

// GET full settings for the project
router.get('/', settingsController.getSettingsByProject);

// Modular POSTs – create individual fields
router.post('/geography', authenticateJWT, settingsController.createGeography);
router.post('/climate', authenticateJWT, settingsController.createClimate);
router.post('/time_period', authenticateJWT, settingsController.createTimePeriod);
router.post('/political_system', authenticateJWT, settingsController.createPoliticalSystem);
router.post('/culture', authenticateJWT, settingsController.createCulture);
router.post('/note', authenticateJWT, settingsController.createNote);

// Modular PUTs – update individual fields
router.put('/geography', authenticateJWT, settingsController.updateGeography);
router.put('/climate', authenticateJWT, settingsController.updateClimate);
router.put('/time_period', authenticateJWT, settingsController.updateTimePeriod);
router.put('/political_system', authenticateJWT, settingsController.updatePoliticalSystem);
router.put('/culture', authenticateJWT, settingsController.updateCulture);
router.put('/note', authenticateJWT, settingsController.updateNote);

// Modular DELETEs – clear out a field (e.g., set to NULL or empty string)
router.delete('/geography', authenticateJWT, settingsController.deleteGeography);
router.delete('/climate', authenticateJWT, settingsController.deleteClimate);
router.delete('/time_period', authenticateJWT, settingsController.deleteTimePeriod);
router.delete('/political_system', authenticateJWT, settingsController.deletePoliticalSystem);
router.delete('/culture', authenticateJWT, settingsController.deleteCulture);
router.delete('/note', authenticateJWT, settingsController.deleteNote);

module.exports = router;
