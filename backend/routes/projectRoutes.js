const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateJWT } = require('../services/authentication');
const characterRoutes = require('./characterRoutes');
const segmentRoutes = require("./segmentRoutes");
const settingsRoutes = require('./settingsRoutes');
const {checkProjectAccess} = require("../services/authorization");

router.use('/:project_id/characters', characterRoutes);
router.use('/:project_id/segments', segmentRoutes);
router.use('/:project_id/settings', settingsRoutes);

// Create a project (user must be logged in)
router.post('/', authenticateJWT, projectController.createProject);

router.get('/', projectController.getAllProjects); //get projects even when not logged in (public projects)

// Get all projects for logged-in user
router.get('/own', authenticateJWT, projectController.getMyProjects);

// Get one project by ID
router.get('/:id', authenticateJWT, checkProjectAccess, projectController.getProjectById);

// Update project
router.put('/:id', authenticateJWT, projectController.updateProject);

// Delete project
router.delete('/:id', authenticateJWT, projectController.deleteProject);

module.exports = router;
