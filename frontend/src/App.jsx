// frontend/src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 

// Importaciones de páginas y componentes (sus rutas relativas desde src/):
// Si Login, Register, Home están en pages/, la ruta es './pages/'
import Login from './pages/Login'; 
import Register from './pages/Register';
import Home from './pages/Home';
// Si Navbar está en components/, la ruta es './components/'
import Navbar from './components/Navbar'; 
// Importa AuthContext desde su archivo .js en context/
import { AuthContext } from './context/AuthContext.js'; // <--- Importa desde context/AuthContext.js

// Ya NO importamos App.css aquí, ya que main.jsx lo hace.

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return auth.token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <> 
      <Navbar /> 
      
      <main> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;