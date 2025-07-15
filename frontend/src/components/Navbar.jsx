// frontend/src/components/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import './Navbar.css';

/**
 * Componente Navbar.
 * Representa la barra de navegación superior de la aplicación.
 * Muestra diferentes opciones de navegación según el estado de autenticación del usuario.
 */
function Navbar() {
    // Obtiene el objeto de autenticación y la función de logout del contexto.
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    /**
     * Maneja el proceso de cierre de sesión.
     * Llama a la función de logout del contexto de autenticación y redirige al usuario a la página de login.
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Determina si el usuario está autenticado verificando la presencia de un token.
    const isAuthenticated = !!auth.token;
    // Extrae el nombre de usuario de `auth.user` si existe, de lo contrario, es una cadena vacía.
    const username = auth.user ? auth.user.username : '';

    return (
        <nav className="navbar">
            {/* Enlace de la marca: redirige a '/home' si está autenticado, sino a la raíz. */}
            <Link to={isAuthenticated ? "/home" : "/"} className="navbar-brand">
                Gestor de Tareas
            </Link>
            <div className="navbar-links">
                {/* Renderizado condicional basado en el estado de autenticación */}
                {isAuthenticated ? (
                    <>
                        <Link to="/home" className="nav-link">Mis Tareas</Link>
                        {/* Muestra un saludo con el nombre de usuario si está disponible. */}
                        {username && <span className="nav-text">Hola, {username}!</span>}
                        <button onClick={handleLogout} className="nav-button logout-button">Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                        <Link to="/register" className="nav-link">Registrarse</Link>
                    </>
                )}
                <DarkModeToggle /> {/* Botón para alternar el modo oscuro */}
            </div>
        </nav>
    );
}

export default Navbar;