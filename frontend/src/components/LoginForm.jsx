// frontend/src/components/LoginForm.jsx

import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

/**
 * Componente LoginForm.
 * Permite a los usuarios iniciar sesión en la aplicación.
 * Gestiona el estado de los campos de usuario y contraseña,
 * maneja el envío del formulario, la autenticación con la API,
 * y muestra mensajes de éxito o error.
 */
function LoginForm() {
    // Obtiene `setAuth` del contexto de autenticación para actualizar el estado global.
    const { setAuth } = useContext(AuthContext);
    // Hook para la navegación programática.
    const navigate = useNavigate();

    // Estados para los campos del formulario y mensajes de feedback.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null); // Mensaje para el usuario (éxito/error)
    const [isError, setIsError] = useState(false); // Indica si el mensaje actual es de error

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * @param {Event} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)
        setMessage(null);   // Limpia mensajes anteriores
        setIsError(false);  // Resetea el estado de error

        try {
            // Realiza la solicitud POST al endpoint de login de la API.
            const res = await axios.post('http://localhost:3000/api/users/login', {
                username,
                password
            });

            // Si el login es exitoso, actualiza el contexto de autenticación con el usuario y el token.
            setAuth({
                user: username,
                token: res.data.token,
                role: res.data.role // Asegúrate de que el backend envíe el rol
            });

            setMessage('Inicio de sesión exitoso. Redirigiendo...');
            setIsError(false);
            // Redirige al usuario a la página principal después de un breve retardo.
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            // Maneja errores: extrae el mensaje del backend o usa un mensaje genérico.
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
                    aria-label="Nombre de usuario" // Mejora la accesibilidad
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
                    aria-label="Contraseña" // Mejora la accesibilidad
                />
            </div>
            <button type="submit" className="login-button">Ingresar</button>
            {/* Muestra un mensaje de éxito o error si existe */}
            {message && (
                <p className={`login-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}

export default LoginForm;