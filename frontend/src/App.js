import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DicomViewer from './components/DicomVista';
import Login from './components/Login';
import Register from './components/Register';
import DicomSearch from './components/DicomSearch';  
import HomePage from './components/HomePage';
import DicomSearchFilters from './components/DicomSearchFilters';

import './App.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const login = (credentials) => {
        console.log('Credentials:', credentials);
        setIsLoggedIn(true);  // Cambia el estado de autenticación
    };


    const logout = () => {
        setIsLoggedIn(false);
        alert('Sesión cerrada');
    };  

    return (
        <Router>
            <div className="App">
                <header className="app-header">
                    {isLoggedIn && <button className="logout-button" onClick={logout}>Cerrar Sesión</button>}  
                </header> 
                <h1>Visualizador de Imágenes DICOM</h1>  
                <Routes>
                    <Route path="/login" element={<Login onLogin={login} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={
                        isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />
                    } />
                    <Route path="/viewer" element={
                        isLoggedIn ? <DicomViewer /> : <Navigate to="/login" replace />
                    } />
                    <Route path="/dicom-search" element={
                        isLoggedIn ? <DicomSearch /> : <Navigate to="/login" replace />
                    } />
                    <Route path="/dicom-search-filters" element={
                        isLoggedIn ? <DicomSearchFilters /> : <Navigate to="/login" replace />
                    } />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
