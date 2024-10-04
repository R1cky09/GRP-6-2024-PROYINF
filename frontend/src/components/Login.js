import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  // Estado para almacenar el mensaje de error

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (response.ok) {
                onLogin(result);
                navigate('/home');
            } else {
                throw new Error(result.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            setErrorMessage(error.message);  // Establece el mensaje de error en el estado
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre de usuario:
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                </label>
                <label>
                    Contraseña:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Iniciar sesión</button>
                {errorMessage && <p className="error">{errorMessage}</p>}  {/* Muestra el mensaje de error si existe */}
            </form>
            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        </div>
    );
}

export default Login;
