// frontend/src/components/TaskList.jsx
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TaskForm from './TaskForm';
import './TaskList.css'; // Importa el archivo CSS

function TaskList() {
    const { auth } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.token) return;

        const fetchTasks = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/tasks', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                setTasks(res.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [auth.token]);


    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
            // Podrías añadir un mensaje de error para el usuario aquí
        }
    };

    const handleToggle = async (id) => {
        try {
            // Encuentra la tarea para enviar su estado actual o simplemente el ID si la API lo permite
            const taskToToggle = tasks.find(task => task._id === id);
            if (!taskToToggle) return;

            const res = await axios.patch(`http://localhost:3000/api/tasks/${id}`,
                { completed: !taskToToggle.completed }, // Envía el nuevo estado de 'completed'
                {
                    headers: { Authorization: `Bearer ${auth.token}` }
                }
            );
            setTasks(tasks.map((task) => task._id === id ? res.data : task));
        } catch (error) {
            console.error("Error toggling task status:", error);
            // Podrías añadir un mensaje de error para el usuario aquí
        }
    };

    const handleTaskCreated = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    if (!auth.token) {
        return <p className="task-message">Iniciá sesión para ver tus tareas</p>;
    }
    if (loading) {
        return <p className="task-message">Cargando tareas...</p>;
    }

    return (
        <div className="task-list-container"> {/* Contenedor principal de la lista */}
            <TaskForm onTaskCreated={handleTaskCreated} />

            {tasks.length === 0 ? (
                <p className="task-message">No tenés tareas</p>
            ) : (
                <ul className="task-list-ul"> {/* Clase para la lista desordenada */}
                    {tasks.map((task) => (
                        <li key={task._id} className="task-list-item"> {/* Clase para cada elemento de la lista */}
                            <span
                                className={`task-title ${task.completed ? 'completed' : ''}`}
                            >
                                {task.title}
                            </span>
                            <div className="task-actions"> {/* Contenedor para los botones */}
                                <button
                                    onClick={() => handleToggle(task._id)}
                                    className="task-button complete-button"
                                >
                                    {task.completed ? 'Desmarcar' : 'Completar'}
                                </button>
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="task-button delete-button"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;