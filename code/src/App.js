import React, { useState } from 'react';
import DicomViewer from './components/DicomVista';
import './App.css';


const App = () => {
    const [dicomFile, setDicomFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setDicomFile(file);
        }
    };

    return (
        <div className="App">
            <h1>Visualizador de Imágenes DICOM</h1>
            <input type="file" onChange={handleFileChange} accept=".dicom" />
            {dicomFile && <DicomViewer file={dicomFile} />}
        </div>
    );
};

export default App;