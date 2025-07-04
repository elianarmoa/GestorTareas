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
    const [message, setMessage] = useState(null); // Para mensajes de éxito o error
    const [isError, setIsError] = useState(false); // Para distinguir si el mensaje es error o éxito

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null); // Limpiar mensaje anterior
        setIsError(false); // Resetear estado de error

        try {
            const res = await axios.post('http://localhost:3000/api/users/login', {
                username,
                password
            });

            setAuth({
                user: username, // O res.data.username si tu API devuelve el nombre de usuario
                token: res.data.token
            });

            setMessage('Inicio de sesión exitoso. Redirigiendo...');
            setIsError(false);
            // Pequeño retardo para que el usuario vea el mensaje de éxito antes de redirigir
            setTimeout(() => {
                navigate('/');
            }, 1500); // Redirige al home después de 1.5 segundos

        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error en el inicio de sesión. Credenciales incorrectas.';
            setMessage(errorMessage);
            setIsError(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form-container"> {/* Clase del contenedor del formulario */}
            <h2 className="login-form-title">Iniciar Sesión</h2> {/* Clase del título */}

            <div className="login-input-group"> {/* Agrupador para input si no quieres <br /> */}
                {/* Puedes poner un <label> aquí si lo deseas para accesibilidad */}
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="login-input"
                />
            </div>
            {/* Quitamos los <br /> y usamos gap en el flexbox del contenedor o margin bottom */}
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

            <button type="submit" className="login-button">Ingresar</button> {/* Clase para el botón */}

            {message && (
                <p className={`login-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}

export default LoginForm;