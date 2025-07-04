// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

// Si App.jsx está en el mismo directorio (src/), la ruta es './App.jsx'
import App from './App.jsx';
// Si App.css está en el mismo directorio (src/), la ruta es './App.css'
import './App.css';
// Si AuthProvider.jsx está en context/, la ruta desde src/ es './context/AuthProvider.jsx'
import AuthProvider from './context/AuthProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);