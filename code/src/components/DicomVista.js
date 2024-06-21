import React, { useState, useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

const DicomViewer = ({ file }) => {
    const dicomImageRef = useRef(null);
    const [colorMode, setColorMode] = useState('normal');  // Estado para el modo de color
    const [contrast, setContrast] = useState(0); // Valor inicial del contraste
    const [brightness, setBrightness] = useState(0); // Valor inicial del brillo

    useEffect(() => {
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

        const element = dicomImageRef.current;
        if (element) {
            cornerstone.enable(element);

            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            cornerstone.loadImage(imageId).then((image) => {
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                // Configura el viewport para el contraste y el brillo
                viewport.voi.windowWidth = Math.max(1, image.width / 2 + contrast * 2); // Ajuste de contraste
                viewport.voi.windowCenter = image.width / 2 + brightness; // Ajuste de brillo
                viewport.invert = (colorMode === 'invertido'); // Ajuste de inversión

                cornerstone.displayImage(element, image, viewport);
            });

            return () => {
                cornerstone.disable(element);
            };
        }
    }, [file, contrast, brightness, colorMode]); // Añade las dependencias aquí

    return (
        <div>
            <div className="dicomImageContainer" ref={dicomImageRef} />
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
