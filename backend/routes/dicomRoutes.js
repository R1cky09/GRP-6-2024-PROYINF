const express = require('express');
const router = express.Router();
const dicomController = require('../controllers/dicomController');

// Ruta para guardar la información DICOM
router.post('/save', dicomController.saveDicomInfo);

router.post('/search', dicomController.searchDicomImages);

module.exports = router;
