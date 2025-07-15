// frontend/src/components/RegisterForm.jsx

import { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css';

/**
 * Componente RegisterForm.
 * Proporciona una interfaz para que los nuevos usuarios se registren en la aplicación.
 * Gestiona la entrada del usuario, la comunicación con la API de registro
 * y muestra mensajes de feedback.
 */
function RegisterForm() {
    // Estados para los campos del formulario y el feedback al usuario.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null); // Mensaje de éxito o error para el usuario
    const [isError, setIsError] = useState(false); // Indica si el mensaje actual es de error

    /**
     * Maneja el envío del formulario de registro.
     * Envía las credenciales del nuevo usuario a la API.
     * @param {Event} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página al enviar el formulario.
        setMessage(null);   // Limpia cualquier mensaje anterior.
        setIsError(false);  // Resetea el estado de error.

        try {
            // Realiza la solicitud POST al endpoint de registro de la API.
            const res = await axios.post('http://localhost:3000/api/users/register', {
                username,
                password
            });
            // Muestra un mensaje de éxito y limpia los campos del formulario.
            setMessage(res.data.message || 'Usuario registrado exitosamente.');
            setIsError(false);
            setUsername('');
            setPassword('');
        } catch (err) {
            // Captura y muestra el mensaje de error de la API o uno genérico.
            const errorMessage = err.response?.data?.error || 'Error al registrar el usuario.';
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
                    aria-label="Nombre de usuario" // Mejora la accesibilidad
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
                    aria-label="Contraseña" // Mejora la accesibilidad
                />
            </div>
            <button type="submit" className="register-button">Registrarse</button>
            {/* Muestra un mensaje de éxito o error al usuario. */}
            {message && (
                <p className={`register-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}

export default RegisterForm;