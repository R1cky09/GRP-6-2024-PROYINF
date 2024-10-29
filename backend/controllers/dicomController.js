const DicomModel = require('../models/DicomModel');

exports.saveDicomInfo = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Verificar si ya existe una imagen con los mismos identificadores únicos
        const existingDicom = await DicomModel.findOne({
            SOPInstanceUID: req.body.SOPInstanceUID
        });

        if (existingDicom) {
            return res.status(200).json({
                message: 'El archivo DICOM ya existe en la base de datos',
                exists: true,
                data: existingDicom
            });
        }

        // Guardar nuevo registro si no existe duplicado
        const dicomData = new DicomModel(req.body);
        await dicomData.save();
        res.status(201).json({
            message: 'Información DICOM guardada exitosamente',
            exists: false,
            data: dicomData
        });
    } catch (error) {
        console.error('Error al guardar la información DICOM:', error.message);
        res.status(500).json({ error: 'Error al guardar la información DICOM' });
    }
};

exports.searchDicomImages = async (req, res) => {
    try {
        const filters = req.body;
        const query = {};

        if (filters.patientID) query.patientID = filters.patientID;
        if (filters.studyDate) query.studyDate = filters.studyDate;
        if (filters.modality) query.modality = filters.modality;

        const results = await DicomModel.find(query);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error en la búsqueda de imágenes DICOM:', error.message);
        res.status(500).json({ error: 'Error en la búsqueda de imágenes DICOM' });
    }
};