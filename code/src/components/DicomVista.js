import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

const DicomViewer = ({ file }) => {
    const dicomImageRef = useRef(null);

    useEffect(() => {
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

        function onImageRendered(e) {
            console.log('Image rendered:', e.detail);
        }

        const element = dicomImageRef.current;
        if (element) {
            cornerstone.enable(element);
            cornerstone.events.addEventListener('cornerstoneimagerendered', onImageRendered);

            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            cornerstone.loadImage(imageId).then((image) => {
                cornerstone.displayImage(element, image);
            });

            return () => {
                cornerstone.events.removeEventListener('cornerstoneimagerendered', onImageRendered);
                cornerstone.disable(element);
            };
        }
    }, [file]);

    return <div ref={dicomImageRef} style={{ width: '512px', height: '512px' }} />;
};

export default DicomViewer;
