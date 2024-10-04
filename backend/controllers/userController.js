const User = require('../models/Users'); 

// Función para registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ username, email, password });
        await newUser.save(); // Guarda el usuario en la base de datos
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(400).json({ message: 'Error registrando al usuario', error: error.message });
    }
};

// Función para iniciar sesión
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && user.password === password) {  
            res.status(200).json({ message: "Inicio de sesión exitoso" });
        } else {
            res.status(401).json({ message: "Usuario o contraseña incorrectos"});
        }
    } catch (error) {
        res.status(500).json({ message: "Error de servidor", error: error.message });
    }
};