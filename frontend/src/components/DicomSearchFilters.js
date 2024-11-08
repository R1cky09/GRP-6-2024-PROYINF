// DicomSearchFilters.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DicomSearchFilters.css';  


const DicomSearchFilters = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        patientID: '',
        studyDate: '',
        modality: ''
    });
    const [results, setResults] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const searchDicomImages = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/dicom/search', filters);
            setResults(response.data);
        } catch (error) {
            console.error('Error en la búsqueda de imágenes DICOM:', error);
            alert('Error en la búsqueda de imágenes DICOM');
        }
    };

    return (
        <div className="dicom-search-container">
            <button onClick={() => navigate('/home')}>Volver a Inicio</button>
            <h2>Buscar Informacion DICOM </h2>
            <div className="filter-section">
                <label>
                    ID del Paciente:
                    <input type="text" name="patientID" value={filters.patientID} onChange={handleInputChange} />
                </label>
                <label>
                    Fecha del Estudio:
                    <input type="text" name="studyDate" value={filters.studyDate} onChange={handleInputChange} />
                </label>
                <label>
                    Modalidad:
                    <input type="text" name="modality" value={filters.modality} onChange={handleInputChange} />
                </label>
                <button onClick={searchDicomImages}>Buscar</button>
            </div>

            {results.length > 0 && (
                <div className="results-section">
                    <h3>Resultados de Búsqueda:</h3>
                    <ul className="results-list">
                        {results.map((image, index) => (
                            <li key={index} className="result-card">
                                <p><strong>ID del Paciente:</strong> {image.patientID}</p>
                                <p><strong>Fecha del Estudio:</strong> {image.studyDate}</p>
                                <p><strong>Modalidad:</strong> {image.modality}</p>
                                <p><strong>Descripción del Estudio:</strong> {image.studyDescription}</p>
                                <p><strong>Nombre del Archivo:</strong> {image.fileName}</p> {/* Mostrar el nombre del archivo */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DicomSearchFilters;
