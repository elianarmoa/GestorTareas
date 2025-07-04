// frontend/src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('auth');
      // Si no hay nada guardado, inicializa con un objeto que tenga 'token' y 'user' como null.
      return saved ? JSON.parse(saved) : { token: null, user: null };
    } catch (error) {
      console.error("Error parsing auth from localStorage", error);
      // En caso de error, también inicializa de forma segura.
      return { token: null, user: null };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('auth', JSON.stringify(auth));
    } catch (error) {
      console.error("Error saving auth to localStorage", error);
    }
  }, [auth]);

  // Funciones de login y logout para actualizar el estado y el localStorage
  const login = (token, user) => {
      setAuth({ token, user });
  };

  const logout = () => {
      setAuth({ token: null, user: null });
      localStorage.removeItem('auth'); // Asegúrate de limpiar también el localStorage
  };

  return (
    // ¡Actualiza el valor del contexto para incluir login y logout!
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;