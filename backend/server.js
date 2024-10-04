const express = require('express');
const path = require('path');
const db = require('./config/db');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());

db();

const port = 3001;

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:3000' 
}));



const http = require('http');
http.globalAgent.maxHeadersCount = null;  // Esto elimina el límite de la cantidad de encabezados



// Servir archivos estáticos desde la carpeta build del frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

const userRoutes = require('./routes/users'); 
app.use('/api/users', userRoutes);


// Ruta para manejar cualquier otra solicitud, redirigiéndola al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})