import React, { useState } from 'react';
import * as dicomParser from 'dicom-parser';
import { readAsArrayBuffer } from 'promise-file-reader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DicomSearch = () => {
    const navigate = useNavigate();
    const [fileInfo, setFileInfo] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setFileInfo(null);
        event.target.value = null;
        if (!file) return; // Evitar errores si no se selecciona archivo

        try {
            const buffer = await readAsArrayBuffer(file);
            const dataSet = dicomParser.parseDicom(new Uint8Array(buffer));

            // Extraer campos adicionales
            const patientName = dataSet.string('x00100010');
            const patientID = dataSet.string('x00100020');
            const studyDate = dataSet.string('x00080020');
            const modality = dataSet.string('x00080060');
            const studyDescription = dataSet.string('x00081030');
            const institutionName = dataSet.string('x00080080');
            const SOPInstanceUID = dataSet.string('x00080018');


            const fileData = {
                patientName,
                patientID,
                studyDate,
                modality,
                studyDescription,
                institutionName,
                SOPInstanceUID
            };

            saveFileInfo(fileData);  // Llama a la función para guardar la información en la base de datos
        } catch (error) {
            console.error('Error parsing DICOM file:', error);
            setFileInfo(null);
        }
    };

    const saveFileInfo = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/api/dicom/save', data);

            // Verifica si el archivo ya existe
            if (response.data.exists) {
                alert('El archivo ya existe en la base de datos. Mostrando datos existentes.');
                setFileInfo(response.data.data); // Muestra los datos existentes en la interfaz
            } else {
                alert('Información guardada exitosamente en la base de datos');
                setFileInfo(response.data.data); // Muestra los datos guardados recientemente
            }
        } catch (error) {
            console.error('Error al guardar la información:', error);
            alert('Error al guardar la información en la base de datos');
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/home')}>Volver a Inicio</button>
            <h2>Ver y Guardar Información DICOM</h2>
            <input type="file" onChange={handleFileChange} accept=".dcm" />
            {fileInfo && (
                <div>
                    <p><strong>Nombre del Paciente:</strong> {fileInfo.patientName}</p>
                    <p><strong>ID del Paciente:</strong> {fileInfo.patientID}</p>
                    <p><strong>Fecha del Estudio:</strong> {fileInfo.studyDate}</p>
                    <p><strong>Modalidad:</strong> {fileInfo.modality}</p>
                    <p><strong>Descripción del Estudio:</strong> {fileInfo.studyDescription}</p>
                    <p><strong>Institución:</strong> {fileInfo.institutionName}</p>
                    <p><strong>SOP Instance UID:</strong> {fileInfo.SOPInstanceUID}</p>
                </div>
            )}
        </div>
    );
};

export default DicomSearch;
