import React, { useState, useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import { useNavigate } from 'react-router-dom';

const DicomViewer = () => {
    const navigate = useNavigate();
    const dicomImageRef = useRef(null);
    const [file, setFile] = useState(null);
    const [colorMode, setColorMode] = useState('normal');
    const [contrast, setContrast] = useState(0);
    const [brightness, setBrightness] = useState(0);
    const [zoom, setZoom] = useState(2);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

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
                viewport.scale = zoom;
                viewport.translation = pan;
                cornerstone.displayImage(element, image, viewport);
            });

            return () => cornerstone.disable(element);
        }
    }, [file, contrast, brightness, colorMode, zoom, pan]);

    const handleMouseDown = (e) => {
        const bounds = e.target.getBoundingClientRect();
        setStartDrag({
            x: e.clientX - bounds.left - pan.x,
            y: e.clientY - bounds.top - pan.y
        });
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const bounds = e.target.getBoundingClientRect();
            setPan({
                x: e.clientX - bounds.left - startDrag.x,
                y: e.clientY - bounds.top - startDrag.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseOut = () => {
        setIsDragging(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        setZoom(2);
        setPan({ x: 0, y: 0 }); // Restablece el paneo al cargar un nuevo archivo
    };

    const handleDoubleClick = () => {
        setZoom(2); 
    };


    return (
        <div className="dicomViewerContainer">
            <button onClick={() => navigate('/home')}>Volver a Inicio</button>
            <h2>Visualizador DICOM</h2>
            <input type="file" onChange={handleFileChange} accept=".dcm" />
            <div className="dicomImageContainer" ref={dicomImageRef}
                 style={{ width: '512px', height: '512px', margin: 'auto' }}
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseOut={handleMouseOut}
                 onDoubleClick={handleDoubleClick}> 
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label>Zoom:</label>
                <input type="range" min="0.5" max="6" step="0.1" value={zoom}
                       onChange={(e) => setZoom(parseFloat(e.target.value))} />
                <label>Contraste:</label>
                <input type="range" min="-100" max="100" value={contrast}
                       onChange={(e) => setContrast(parseInt(e.target.value))} />
                <label>Brillo:</label>
                <input type="range" min="-100" max="100" value={brightness}
                       onChange={(e) => setBrightness(parseInt(e.target.value))} />
                <select onChange={(e) => setColorMode(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="invertido">Invertido</option>
                </select>
            </div>
        </div>
    );
};

export default DicomViewer;
