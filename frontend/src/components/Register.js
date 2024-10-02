import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Register() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/users/register', userData);
            alert('User registered successfully!');
            navigate('/login'); // Redirige al usuario a la página de inicio
        } catch (error) {
            alert('Failed to register: ' + (error.response.data.message || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                placeholder="Username"
                required
            />
            <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                placeholder="Password"
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
