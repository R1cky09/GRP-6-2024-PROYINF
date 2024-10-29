const express = require('express');
const router = express.Router();
const dicomController = require('../controllers/dicomController');

// Ruta para guardar la información DICOM
router.post('/save', dicomController.saveDicomInfo);

module.exports = router;
