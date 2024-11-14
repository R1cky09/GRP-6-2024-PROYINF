const DicomModel = require('../models/DicomModel');
const { validationResult } = require('express-validator');

exports.saveDicomInfo = async (req, res) => {
    try {
        // Validar los datos recibidos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Errores de validación:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        // Extraer datos del cuerpo de la solicitud
        const {
            fileName,
            patientName,
            patientID,
            studyDate,
            modality,
            SOPInstanceUID,
            studyDescription,
            institutionName,
        } = req.body;

        console.log('Datos validados:', req.body);

        // Verificar si ya existe una imagen con el mismo SOPInstanceUID
        const existingDicom = await DicomModel.findOne({ SOPInstanceUID });
        if (existingDicom) {
            console.log('Imagen DICOM ya existe:', existingDicom);
            return res.status(200).json({
                message: 'El archivo DICOM ya existe en la base de datos',
                exists: true,
                data: existingDicom,
            });
        }

        // Crear un nuevo registro con los datos validados
        const dicomData = new DicomModel({
            fileName,
            patientName,
            patientID,
            studyDate,
            modality,
            SOPInstanceUID,
            studyDescription,
            institutionName,
        });

        // Guardar el nuevo registro en la base de datos
        await dicomData.save();
        console.log('Información DICOM guardada exitosamente:', dicomData);
        res.status(201).json({
            message: 'Información DICOM guardada exitosamente',
            exists: false,
            data: dicomData,
        });
    } catch (error) {
        console.error('Error al guardar la información DICOM:', error.message);
        res.status(500).json({ error: 'Error al guardar la información DICOM' });
    }
};

exports.searchDicomImages = async (req, res) => {
    try {
        // Validar los datos recibidos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Errores de validación:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        // Construir el filtro de búsqueda
        const filters = req.body;
        const query = {};

        if (filters.patientID) query.patientID = filters.patientID;
        if (filters.studyDate) query.studyDate = filters.studyDate;
        if (filters.modality) query.modality = filters.modality;

        // Realizar la búsqueda en la base de datos
        const results = await DicomModel.find(query, {
            patientID: 1,
            studyDate: 1,
            modality: 1,
            studyDescription: 1,
            fileName: 1,
        });
        console.log('Resultados de búsqueda:', results);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error en la búsqueda de imágenes DICOM:', error.message);
        res.status(500).json({ error: 'Error en la búsqueda de imágenes DICOM' });
    }
};
