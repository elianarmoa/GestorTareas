// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import './Navbar.css';

function Navbar() {
    // Asegúrate de desestructurar 'login' y 'logout' también si los necesitas en Navbar
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Llama a la función de logout del contexto
        navigate('/login');
    };

    // La comprobación ahora es más simple y segura porque 'auth' siempre es un objeto
    const isAuthenticated = !!auth.token; // Convierte a booleano: true si hay token, false si es null/undefined
    const username = auth.user ? auth.user.username : ''; // Accede a user solo si existe

    return (
        <nav className="navbar">
            {/* El Link de marca ahora redirige a /home si está autenticado, sino a / */}
            <Link to={isAuthenticated ? "/home" : "/"} className="navbar-brand">
                Gestor de Tareas
            </Link>
            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <Link to="/home" className="nav-link">Mis Tareas</Link>
                        {/* Muestra el nombre de usuario solo si existe */}
                        {username && <span className="nav-text">Hola, {username}!</span>}
                        <button onClick={handleLogout} className="nav-button">Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                        <Link to="/register" className="nav-link">Registrarse</Link>
                    </>
                )}
                <DarkModeToggle />
            </div>
        </nav>
    );
}

export default Navbar;