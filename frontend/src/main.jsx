// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.jsx'; // Componente principal de la aplicación
import './App.css'; // Estilos CSS globales y variables de tema
import AuthProvider from './context/AuthProvider.jsx'; // Proveedor de contexto de autenticación

/**
 * Punto de entrada principal de la aplicación React.
 *
 * Configura la aplicación con:
 * - `React.StrictMode`: Para detectar problemas potenciales en la aplicación durante el desarrollo.
 * - `BrowserRouter (Router)`: Para habilitar el enrutamiento basado en el historial del navegador.
 * - `AuthProvider`: Para proporcionar el estado de autenticación a toda la aplicación.
 * - `App`: El componente raíz que contiene la estructura y las rutas de la aplicación.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      {/* AuthProvider envuelve toda la aplicación para que todos los componentes
          tengan acceso al estado de autenticación. */}
      <AuthProvider>
        {/* App es el componente principal que contiene las rutas y el resto de la UI. */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);