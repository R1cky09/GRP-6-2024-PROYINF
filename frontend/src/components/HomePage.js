import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Página de Inicio</h1>
            <button onClick={() => navigate('/viewer')}>Ir a Visualizador DICOM</button>
            <button onClick={() => navigate('/dicom-search')}>Guardar Información DICOM</button>
            <button onClick={() => navigate('/dicom-search-filters')}>Buscador de Información </button>
        </div>
    );
};

export default HomePage;
