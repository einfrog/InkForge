const express = require('express');
const router = express.Router();
const upload = require('../services/upload'); // or /middlewares/upload
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const { authenticateJWT } = require('../services/authentication');

const updateWithErrorHandler = (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(400).json({ message: 'Upload error', error: err.message });
        }
        next();
    });
};

// POST /api/upload/users/:id
router.post('/users/:id', updateWithErrorHandler, authenticateJWT, uploadController.uploadUserImage);
// POST /api/upload/projects/:id
router.post('/projects/:id', updateWithErrorHandler, authenticateJWT, uploadController.uploadProjectImage);

// POST /api/upload/characters/:id
router.post('/characters/:id', updateWithErrorHandler, authenticateJWT, uploadController.uploadCharacterImage);

module.exports = router;
