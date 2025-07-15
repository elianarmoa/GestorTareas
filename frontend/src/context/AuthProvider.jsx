// frontend/src/context/AuthProvider.jsx

import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

/**
 * AuthProvider Component.
 * Este componente provee el estado de autenticación y las funciones para login/logout
 * a todos los componentes hijos a través del AuthContext.
 * El estado de autenticación se persiste en el almacenamiento local (localStorage).
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - Los componentes hijos que tendrán acceso al contexto.
 */
const AuthProvider = ({ children }) => {
    // Inicializa el estado de autenticación.
    // Intenta cargar el estado desde localStorage; si falla o no hay datos, usa un valor predeterminado seguro.
    const [auth, setAuth] = useState(() => {
        try {
            const saved = localStorage.getItem('auth');
            return saved ? JSON.parse(saved) : { token: null, user: null };
        } catch (error) {
            console.error("Error al analizar el estado de autenticación desde localStorage:", error);
            return { token: null, user: null }; // Retorna un estado inicial seguro en caso de error.
        }
    });

    /**
     * Hook useEffect para sincronizar el estado de autenticación con localStorage.
     * Cada vez que `auth` cambia, se guarda en localStorage.
     */
    useEffect(() => {
        try {
            localStorage.setItem('auth', JSON.stringify(auth));
        } catch (error) {
            console.error("Error al guardar el estado de autenticación en localStorage:", error);
        }
    }, [auth]); // Dependencia del efecto: se ejecuta cuando el objeto `auth` cambia.

    /**
     * Función `login`.
     * Actualiza el estado de autenticación con el token y los datos del usuario.
     * @param {string} token - El token de autenticación recibido del servidor.
     * @param {object} user - El objeto de usuario autenticado.
     */
    const login = (token, user) => {
        setAuth({ token, user });
    };

    /**
     * Función `logout`.
     * Restablece el estado de autenticación a `null` y elimina los datos de autenticación de localStorage.
     */
    const logout = () => {
        setAuth({ token: null, user: null });
        localStorage.removeItem('auth'); // Limpia los datos de autenticación del almacenamiento local.
    };

    return (
        // Provee el estado `auth` y las funciones `login` y `logout` a los componentes hijos.
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;