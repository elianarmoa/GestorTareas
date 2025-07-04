import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import './Home.css'; 

function Home() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate('/login');
    }
  }, [auth, navigate]);

  return (
    <div>
      <h1>Gestor de tareas</h1>
      <TaskList />
    </div>
  );
}

export default Home;
