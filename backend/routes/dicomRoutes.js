const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const dicomController = require('../controllers/dicomController');

// Ruta para guardar la información DICOM con validaciones
router.post(
  '/save',
  [
    body('fileName').isString().trim().escape(),
    body('patientName').isString().trim().escape(),
    body('patientID').isString().trim().escape(),
    body('studyDate').isString().trim().escape(),
    body('modality').isString().trim().escape(),
    body('SOPInstanceUID').isString().trim().escape(),
    body('studyDescription').optional().isString().trim().escape(),
    body('institutionName').optional().isString().trim().escape(),
  ],
  dicomController.saveDicomInfo
);

// Ruta para buscar imágenes DICOM con validaciones
router.post(
  '/search',
  [
    body('patientID').optional().isString().trim().escape(),
    body('studyDate').optional().isString().trim().escape(),
    body('modality').optional().isString().trim().escape(),
  ],
  dicomController.searchDicomImages
);

module.exports = router;
