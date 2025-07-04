// frontend/src/pages/Register.jsx
import RegisterForm from '../components/RegisterForm';
import './Register.css'; // <--- ¡Importa este nuevo CSS!

function Register() {
return (
    <div className="register-page-container"> {/* <--- Aplica la clase del contenedor de página */}
    <RegisterForm />
    </div>
);
}

export default Register;