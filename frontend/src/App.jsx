// frontend/src/App.jsx

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importación de componentes y páginas ESENCIALES
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList'; 
import CategoryManagement from './components/CategoryManagement'; 

// Importa el contexto de autenticación para verificar el estado del usuario
import { AuthContext } from './context/AuthContext.js'; // Verifica la extensión, puede ser .jsx

/**
 * Componente `ProtectedRoute`.
 * Este componente es un wrapper para las rutas que requieren autenticación
 * y, opcionalmente, roles específicos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes que se renderizarán si el usuario está autorizado.
 * @param {Array<string>} [props.allowedRoles] - Un array de roles permitidos. Si se proporciona,
 * el usuario debe tener al menos uno de estos roles para acceder.
 * Si no se proporciona, solo se requiere autenticación (cualquier usuario logueado).
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext); // Obtiene el estado de autenticación del contexto

    // 1. Si no hay token de autenticación, redirige al login.
    if (!auth.token) {
        // console.log("No token, redirigiendo a /login"); // Para depuración
        return <Navigate to="/login" replace />;
    }

    // 2. Si hay roles permitidos definidos Y el usuario NO tiene el rol requerido, redirige a la página principal.
    // Esto es para rutas como '/categories' que solo son para 'admin'.
    if (allowedRoles && auth.user && !allowedRoles.includes(auth.user.role)) {
        // console.log(`Rol del usuario (${auth.user.role}) no permitido. Redirigiendo a /`); // Para depuración
        return <Navigate to="/" replace />; // Redirige a la Home si no tiene permiso
    }

    // 3. Si el usuario está autenticado y tiene el rol correcto (o no se requiere un rol específico),
    // renderiza los componentes hijos.
    return children;
};

/**
 * Componente principal de la aplicación `App`.
 * Define la estructura de enrutamiento de la aplicación.
 * Utiliza `react-router-dom` para manejar las rutas y `AuthContext`
 * para proteger rutas que requieren autenticación y/o roles específicos.
 */
function App() {
    return (
        <>
            {/* La barra de navegación se muestra en todas las páginas */}
            <Navbar />

            {/* Contenedor principal para el contenido de la página */}
            <main className="main-content"> {/* Puedes añadir esta clase para estilos globales */}
                <Routes>
                    {/* Rutas públicas: accesibles sin autenticación */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Ruta de inicio: Protegida.
                        - Si está logueado, ve <Home />.
                        - Si no, <ProtectedRoute> lo redirige a /login. */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home /> {/* El componente Home se renderiza dentro de PrivateRoute */}
                            </ProtectedRoute>
                        }
                    />

                    {/* Ruta para la lista de tareas: Protegida.
                        - Cualquier usuario autenticado puede ver sus tareas. */}
                    <Route
                        path="/tasks"
                        element={
                            <ProtectedRoute>
                                <TaskList />
                            </ProtectedRoute>
                        }
                    />

                    {/* Ruta para la gestión de categorías: Protegida SOLO para administradores.
                        - Si es 'admin' y está logueado, ve <CategoryManagement />.
                        - Si está logueado pero NO es 'admin', <ProtectedRoute> lo redirige a /.
                        - Si no está logueado, <ProtectedRoute> lo redirige a /login. */}
                    <Route
                        path="/categories"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}> {/* <Restricción de rol! */}
                                <CategoryManagement />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirección por defecto: si la ruta es "/", redirige a "/home".
                        Esto es útil para que al cargar la URL base, siempre se vaya a la página principal protegida. */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                </Routes>
            </main>
        </>
    );
}

export default App;