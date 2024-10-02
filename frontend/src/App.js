import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DicomViewer from './components/DicomVista';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const App = () => {
    const [dicomFile, setDicomFile] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setDicomFile(file);
        }
    };

    const login = (credentials) => {
        console.log('Credentials:', credentials);
        setIsLoggedIn(true);  // Cambia el estado de autenticación
    };

    const logout = () => {
        setIsLoggedIn(false);  // Cerrar sesión y volver a la pantalla de login
        setDicomFile(null);
    };

    return (
        <Router>
            <div className="App">
                <h1>Visualizador de Imágenes DICOM</h1>
                <Routes>
                    {/* Ruta para login */}
                    <Route path="/login" element={<Login onLogin={login} />} />
                    
                    {/* Ruta para registro */}
                    <Route path="/register" element={<Register onSwitchToLogin={() => <Navigate to="/login" />} />} />
                    
                    {/* Ruta protegida para el visualizador */}
                    <Route path="/viewer" element={
                        isLoggedIn ? (
                            <div>
                                <input type="file" onChange={handleFileChange} accept=".dicom" />
                                {dicomFile && <DicomViewer file={dicomFile} />}
                                <button onClick={logout}>Cerrar sesión</button>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } />
                    
                    {/* Redireccionar la ruta raíz a login */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
