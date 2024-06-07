import React, { useState, useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

const DicomViewer = ({ file }) => {
    const dicomImageRef = useRef(null);
    const [invert, setInvert] = useState(false);  // Estado para controlar la inversión de la imagen

    useEffect(() => {
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

        const element = dicomImageRef.current;
        if (element) {
            cornerstone.enable(element);

            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            cornerstone.loadImage(imageId).then((image) => {
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                viewport.invert = invert;  // Configura la inversión basada en el estado
                cornerstone.displayImage(element, image, viewport);
            });

            return () => {
                cornerstone.disable(element);
            };
        }
    }, [file, invert]);  // Añade 'invert' a la lista de dependencias para reaccionar a los cambios

    return (
        <div>
            <div ref={dicomImageRef} style={{ width: '512px', height: '512px' }} />
            <button onClick={() => setInvert(!invert)}>Invertir Colores</button>  // Botón para invertir colores
        </div>
    );
};

export default DicomViewer;
