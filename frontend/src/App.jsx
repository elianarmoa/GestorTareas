// frontend/src/App.jsx

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importación de componentes y páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
// Importa el contexto de autenticación para verificar el estado del usuario
import { AuthContext } from './context/AuthContext.js';

/**
 * Componente `PrivateRoute`.
 * Este componente es un wrapper para las rutas que requieren autenticación.
 * Si el usuario tiene un token de autenticación, renderiza los hijos.
 * De lo contrario, lo redirige a la página de login.
 *
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes que se renderizarán si el usuario está autenticado.
 */
const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext); // Obtiene el estado de autenticación del contexto
  return auth.token ? children : <Navigate to="/login" />; // Redirige si no hay token
};

/**
 * Componente principal de la aplicación `App`.
 * Define la estructura de enrutamiento de la aplicación.
 * Utiliza `react-router-dom` para manejar las rutas y `AuthContext`
 * para proteger rutas que requieren autenticación.
 */
function App() {
  return (
    <>
      {/* La barra de navegación se muestra en todas las páginas */}
      <Navbar />

      {/* Contenedor principal para el contenido de la página */}
      <main>
        <Routes>
          {/* Rutas públicas: accesibles sin autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta privada: solo accesible para usuarios autenticados */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home /> {/* El componente Home se renderiza dentro de PrivateRoute */}
              </PrivateRoute>
            }
          />

          {/* Redirección por defecto: si la ruta es "/", redirige a "/home" */}
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;