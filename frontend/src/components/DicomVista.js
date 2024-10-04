import React, { useState, useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import { useNavigate } from 'react-router-dom';

const DicomViewer = () => {
    const navigate = useNavigate();
    const dicomImageRef = useRef(null);
    const [file, setFile] = useState(null); // Estado para almacenar el archivo DICOM
    const [colorMode, setColorMode] = useState('normal'); // Estado para el modo de color
    const [contrast, setContrast] = useState(0); // Estado para el contraste
    const [brightness, setBrightness] = useState(0); // Estado para el brillo

    useEffect(() => {
        if (file && dicomImageRef.current) {
            cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
            cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

            const element = dicomImageRef.current;
            cornerstone.enable(element);

            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            cornerstone.loadImage(imageId).then((image) => {
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                viewport.voi.windowWidth = Math.max(1, image.width / 2 + contrast * 2);
                viewport.voi.windowCenter = image.width / 2 + brightness;
                viewport.invert = (colorMode === 'invertido');
                cornerstone.displayImage(element, image, viewport);
            });

            return () => cornerstone.disable(element);
        }
    }, [file, contrast, brightness, colorMode]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };

    return (
        <div>
            <button onClick={() => navigate('/home')}>Volver a Inicio</button>
            <h2>Visualizador DICOM</h2>
            <input type="file" onChange={handleFileChange} accept=".dcm" />
            <div className="dicomImageContainer" ref={dicomImageRef} style={{ width: '512px', height: '512px' }} />
            <label>Contraste:</label>
            <input
                type="range"
                min="-100"
                max="100"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
            />
            <label>Brillo:</label>
            <input
                type="range"
                min="-100"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
            />
            <select onChange={(e) => setColorMode(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="invertido">Invertido</option>
            </select>
        </div>
    );
};

export default DicomViewer;
