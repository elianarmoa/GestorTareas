// frontend/src/components/LoginForm.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Importa el archivo CSS

function LoginForm() {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        try {
            const res = await axios.post('http://localhost:3000/api/users/login', {
                username,
                password
            });

            setAuth({
                user: username,
                token: res.data.token
            });

            setMessage('Inicio de sesión exitoso. Redirigiendo...');
            setIsError(false);
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error en el inicio de sesión. Credenciales incorrectas.';
            setMessage(errorMessage);
            setIsError(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form-container">
            <h2 className="login-form-title">Iniciar Sesión</h2>
            <div className="login-input-group">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="login-input"
                />
            </div>
            <div className="login-input-group">
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                />
            </div>
            <button type="submit" className="login-button">Ingresar</button>
            {message && (
                <p className={`login-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}

export default LoginForm;