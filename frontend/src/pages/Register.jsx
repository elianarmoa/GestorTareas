// frontend/src/pages/Register.jsx

import RegisterForm from '../components/RegisterForm';
import './Register.css'; // Importa los estilos CSS para la página de registro.

/**
 * Componente Register.
 * Esta página actúa como un contenedor para el formulario de registro de usuarios.
 * Utiliza los estilos definidos en `Register.css` para presentar el formulario centrado en la pantalla.
 */
function Register() {
  return (
    // Aplica la clase `register-page-container` para los estilos de diseño de la página.
    <div className="register-page-container">
      {/* Renderiza el componente RegisterForm que maneja la lógica y la UI del formulario de registro. */}
      <RegisterForm />
    </div>
  );
}

export default Register;