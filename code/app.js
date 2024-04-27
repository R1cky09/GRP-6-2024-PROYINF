const express = require('express');
const multer = require('multer');
const fs = require('fs');
const dicomParser = require('dicom-parser');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('dicomFile'), (req, res) => {
    try {
        const filePath = req.file.path;
        const data = fs.readFileSync(filePath);
        const dataSet = dicomParser.parseDicom(data);
        
        console.log("Archivo cargado exitosamente");
        res.send("Archivo cargado exitosamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error con documento DICOM");
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});