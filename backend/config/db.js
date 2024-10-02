const mongoose = require('mongoose');

console.log("db.js loaded");  // Esto se debería ver en la consola cuando se carga el archivo

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");  // Mensaje antes de la conexión
    await mongoose.connect('mongodb://localhost:27017/DICOM', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);  //  si la conexión falla
  }
};

module.exports = connectDB;
