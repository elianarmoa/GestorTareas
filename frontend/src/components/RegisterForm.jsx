// frontend/src/components/RegisterForm.jsx
import { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css'; // Importa el archivo CSS

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        try {
            const res = await axios.post('http://localhost:3000/api/users/register', {
                username,
                password
            });
            setMessage(res.data.message || 'Usuario registrado exitosamente');
            setIsError(false);
            setUsername('');
            setPassword('');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al registrar usuario.';
            setMessage(errorMessage);
            setIsError(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form-container">
            <h2 className="register-form-title">Registro de Usuario</h2>
            <div className="register-input-group">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="register-input"
                />
            </div>
            <div className="register-input-group">
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="register-input"
                />
            </div>
            <button type="submit" className="register-button">Registrarse</button>
            {message && (
                <p className={`register-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}

export default RegisterForm;