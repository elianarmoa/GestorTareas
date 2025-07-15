import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import './Home.css';

/**
 * Componente Home.
 * Representa la página principal de la aplicación, que muestra la lista de tareas.
 * Redirige al usuario a la página de login si no está autenticado.
 */
function Home() {
    // Obtiene el objeto de autenticación del contexto.
    const { auth } = useContext(AuthContext);
    // Hook para la navegación programática.
    const navigate = useNavigate();

    /**
     * Hook useEffect para verificar el estado de autenticación.
     * Si el usuario no tiene un token (no está autenticado), lo redirige a la página de login.
     * Se ejecuta cada vez que 'auth' o 'navigate' cambian.
     */
    useEffect(() => {
        if (!auth || !auth.token) {
            navigate('/login');
        }
    }, [auth, navigate]); // Dependencias: se re-ejecuta si 'auth' o 'navigate' cambian.

    return (
        <div className="home-page-container">
            {/* Título principal de la página */}
            <h1 className="home-content-card h1">Gestor de tareas</h1>
            {/* Contenedor principal de la tarjeta de tareas */}
            <div className="home-content-card">
                {/* Renderiza el componente TaskList que muestra y gestiona las tareas */}
                <TaskList />
            </div>
        </div>
    );
}

export default Home;