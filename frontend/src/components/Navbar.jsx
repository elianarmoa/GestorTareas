// frontend/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // Asegúrate de que esta línea esté presente
import DarkModeToggle from './DarkModeToggle';

function Navbar() {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({ user: null, token: null, role: null });
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Gestor de Tareas</Link>
            </div>
            <ul className="navbar-links">
                {auth && auth.token ? (
                    <>
                        <li><Link to="/home">Mis Tareas</Link></li>
                        {/* {auth.role === 'admin' && (
                            <li><Link to="/admin">Panel Admin</Link></li>
                        )} */}
                        <li>
                            <button onClick={handleLogout} className="navbar-button logout-button">
                                Cerrar Sesión ({auth.user})
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Iniciar Sesión</Link></li>
                        <li><Link to="/register">Registrarse</Link></li>
                    </>
                )}
                <li>
                    <DarkModeToggle />
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;