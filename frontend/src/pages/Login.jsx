// frontend/src/pages/Login.jsx
import LoginForm from '../components/LoginForm';
import './Login.css'; // <--- ¡Importa este nuevo CSS!

function Login() {
  return (
    <div className="login-page-wrapper"> {/* <--- Aplica la nueva clase aquí */}
      <LoginForm />
    </div>
  );
}

export default Login;