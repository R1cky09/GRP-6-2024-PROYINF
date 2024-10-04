import React, { useState } from 'react';
import * as dicomParser from 'dicom-parser';
import { readAsArrayBuffer } from 'promise-file-reader';
import { useNavigate } from 'react-router-dom';

const DicomSearch = () => {
    const navigate = useNavigate();
    const [fileInfo, setFileInfo] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        try {
            const buffer = await readAsArrayBuffer(file);
            const dataSet = dicomParser.parseDicom(new Uint8Array(buffer));

            // Extrae información extendida de dataSet
            const patientName = dataSet.string('x00100010');
            const patientID = dataSet.string('x00100020');
            const studyDate = dataSet.string('x00080020');
            const modality = dataSet.string('x00080060');
            const studyDescription = dataSet.string('x00081030');
            const institutionName = dataSet.string('x00080080');

            setFileInfo({
                patientName,
                patientID,
                studyDate,
                modality,
                studyDescription,
                institutionName
            });
        } catch (error) {
            console.error('Error parsing DICOM file:', error);
            setFileInfo(null);
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/home')}>Volver a Inicio</button>
            <h2>Buscar Información DICOM</h2>
            <input type="file" onChange={handleFileChange} accept=".dcm" />
            {fileInfo && (
                <div>
                    <p><strong>Nombre del Paciente:</strong> {fileInfo.patientName}</p>
                    <p><strong>ID del Paciente:</strong> {fileInfo.patientID}</p>
                    <p><strong>Fecha del Estudio:</strong> {fileInfo.studyDate}</p>
                    <p><strong>Modalidad:</strong> {fileInfo.modality}</p>
                    <p><strong>Descripción del Estudio:</strong> {fileInfo.studyDescription}</p>
                    <p><strong>Institución:</strong> {fileInfo.institutionName}</p>
                </div>
            )}
        </div>
    );
};

export default DicomSearch;
