import React, { useState } from 'react';
import DicomViewer from './components/DicomVista';
import './App.css';

const App = () => {
    const [dicomFile, setDicomFile] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setDicomFile(file);
            setIsFileSelected(true); // Indica que un archivo ha sido seleccionado
        }
    };

    const handleNewImage = () => {
        setIsFileSelected(false); // Restablece para permitir seleccionar otro archivo
        setDicomFile(null); // Opcional: Eliminar el archivo actual si es necesario
    };

    return (
        <div className="App">
            <h1>Visualizador de Imágenes DICOM</h1>
            {!isFileSelected && (
                <input type="file" onChange={handleFileChange} accept=".dicom" />
            )}
            {isFileSelected && (
                <div>
                    {dicomFile && <DicomViewer file={dicomFile} />}
                    <button onClick={handleNewImage}>Seleccionar otra imagen</button>
                </div>
            )}
        </div>
    );
};

export default App;
