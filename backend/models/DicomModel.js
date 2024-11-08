const mongoose = require('mongoose');

const dicomSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    patientName: { type: String, required: true },
    patientID: { type: String, required: true },
    studyDate: { type: String, required: true },
    modality: { type: String, required: true },
    studyDescription: { type: String },
    institutionName: { type: String },
    SOPInstanceUID: { type: String, required: true }
});

module.exports = mongoose.model('Dicom', dicomSchema);