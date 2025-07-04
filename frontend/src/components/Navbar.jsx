import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Para navegación
import { AuthContext } from '../context/AuthContext'; // Tu contexto de autenticación
import './Navbar.css'; 
import DarkModeToggle from './DarkModeToggle'; // Lo crearemos en el siguiente paso

function Navbar() {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({ user: null, token: null, role: null }); // Limpiar el estado de autenticación
        // Opcional: Eliminar cualquier cookie/localStorage aquí si no lo haces en el useEffect del AuthProvider
        navigate('/login'); // Redirigir al login después de cerrar sesión
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Gestor de Tareas</Link>
            </div>
            <ul className="navbar-links">
                {auth.token ? ( // Si el usuario está logueado
                    <>
                        <li><Link to="/home">Mis Tareas</Link></li>
                        {/* Puedes añadir enlaces para administradores aquí si implementas roles */}
                        {/* {auth.role === 'admin' && (
                            <li><Link to="/admin">Panel Admin</Link></li>
                        )} */}
                        <li>
                            <button onClick={handleLogout} className="navbar-button logout-button">
                                Cerrar Sesión ({auth.user})
                            </button>
                        </li>
                    </>
                ) : ( // Si el usuario no está logueado
                    <>
                        <li><Link to="/login">Iniciar Sesión</Link></li>
                        <li><Link to="/register">Registrarse</Link></li>
                    </>
                )}
                <li>
                    <DarkModeToggle /> {/* El toggle de modo oscuro */}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;