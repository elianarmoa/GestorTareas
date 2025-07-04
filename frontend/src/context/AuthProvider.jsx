// frontend/src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
// Ahora importa el objeto AuthContext desde su nuevo archivo
import { AuthContext } from './AuthContext'; // <--- Importa desde el nuevo archivo .js

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;