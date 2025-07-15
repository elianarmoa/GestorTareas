// frontend/src/pages/Login.jsx

import LoginForm from '../components/LoginForm';
import './Login.css'; // Importa los estilos CSS específicos para la página de Login.

/**
 * Componente Login.
 * Esta página sirve como un contenedor para el formulario de inicio de sesión.
 * Utiliza los estilos definidos en `Login.css` para centrar el formulario en la pantalla.
 */
function Login() {
  return (
    // Aplica la clase `login-page-wrapper` para los estilos de la página.
    <div className="login-page-wrapper">
      {/* Renderiza el componente LoginForm que contiene la lógica y UI para el inicio de sesión. */}
      <LoginForm />
    </div>
  );
}

export default Login;