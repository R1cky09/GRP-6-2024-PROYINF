import React, { useState } from 'react';
import DicomViewer from './components/DicomVista';

const App = () => {
    const [dicomFile, setDicomFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setDicomFile(file);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".dicom" />
            {dicomFile && <DicomViewer file={dicomFile} />}
        </div>
    );
};

export default App;