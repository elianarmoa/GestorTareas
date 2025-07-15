// frontend/src/components/TaskList.jsx

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TaskForm from './TaskForm';
import './TaskList.css';

/**
 * Componente TaskList.
 * Muestra la lista de tareas del usuario autenticado, permitiendo
 * crearlas, eliminarlas, y cambiar su estado de completado.
 * También incluye una funcionalidad de búsqueda para filtrar tareas.
 */
function TaskList() {
    // Accede al contexto de autenticación para obtener el token del usuario.
    const { auth } = useContext(AuthContext);
    // Estado para almacenar la lista de tareas.
    const [tasks, setTasks] = useState([]);
    // Estado para controlar el estado de carga de las tareas.
    const [loading, setLoading] = useState(true);
    // Estado para almacenar el término de búsqueda ingresado por el usuario.
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Hook useEffect para cargar las tareas del usuario al montar el componente
     * o cuando el token de autenticación cambia.
     */
    useEffect(() => {
        // No intenta cargar tareas si no hay un token de autenticación.
        if (!auth.token) return;

        /**
         * Función asíncrona para obtener las tareas desde la API.
         */
        const fetchTasks = async () => {
            try {
                // Realiza la solicitud GET a la API de tareas, incluyendo el token de autenticación.
                const res = await axios.get('http://localhost:3000/api/tasks', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                setTasks(res.data); // Actualiza el estado con las tareas obtenidas.
            } catch (error) {
                console.error("Error al obtener tareas:", error);
                setTasks([]); // En caso de error, limpia la lista de tareas.
            } finally {
                setLoading(false); // Finaliza el estado de carga.
            }
        };

        fetchTasks(); // Ejecuta la función de obtención de tareas.
    }, [auth.token]); // Dependencia del efecto: se ejecuta cuando `auth.token` cambia.

    /**
     * Maneja la eliminación de una tarea.
     * @param {string} id - El ID de la tarea a eliminar.
     */
    const handleDelete = async (id) => {
        try {
            // Envía una solicitud DELETE a la API para eliminar la tarea.
            await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            // Actualiza el estado de las tareas filtrando la tarea eliminada.
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
            // Considerar mostrar un mensaje de error al usuario aquí.
        }
    };

    /**
     * Maneja el cambio de estado (completado/incompleto) de una tarea.
     * @param {string} id - El ID de la tarea a alternar.
     */
    const handleToggle = async (id) => {
        try {
            // Encuentra la tarea específica para obtener su estado actual.
            const taskToToggle = tasks.find(task => task._id === id);
            if (!taskToToggle) return; // Si la tarea no se encuentra, no hace nada.

            // Envía una solicitud PATCH a la API para actualizar el estado de la tarea.
            const res = await axios.patch(`http://localhost:3000/api/tasks/${id}`,
                { completed: !taskToToggle.completed }, // Invierte el estado de completado.
                {
                    headers: { Authorization: `Bearer ${auth.token}` }
                }
            );
            // Actualiza el estado de las tareas con la tarea modificada recibida del backend.
            setTasks(tasks.map((task) => task._id === id ? res.data : task));
        } catch (error) {
            console.error("Error al cambiar estado de la tarea:", error);
            // Considerar mostrar un mensaje de error al usuario aquí.
        }
    };

    /**
     * Callback para añadir una nueva tarea a la lista después de que se ha creado.
     * @param {object} newTask - El objeto de la tarea recién creada.
     */
    const handleTaskCreated = (newTask) => {
        setTasks([...tasks, newTask]); // Añade la nueva tarea al final de la lista.
    };

    // Filtra las tareas basándose en el término de búsqueda (insensible a mayúsculas/minúsculas).
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Renderizado Condicional ---
    // Si el usuario no está autenticado, muestra un mensaje para iniciar sesión.
    if (!auth.token) {
        return <p className="task-message">Iniciá sesión para ver tus tareas</p>;
    }
    // Muestra un mensaje de carga mientras las tareas se están obteniendo.
    if (loading) {
        return <p className="task-message">Cargando tareas...</p>;
    }

    return (
        <div className="task-list-container">
            {/* Formulario para agregar nuevas tareas */}
            <TaskForm onTaskCreated={handleTaskCreated} />

            {/* Barra de búsqueda para filtrar tareas */}
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Buscar tareas existentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Buscar tareas" // Mejora la accesibilidad
                />
            </div>

            {/* Muestra mensajes condicionales o la lista de tareas */}
            {filteredTasks.length === 0 && tasks.length > 0 && searchTerm !== '' ? (
                // Si hay tareas pero ninguna coincide con la búsqueda.
                <p className="task-message">No se encontraron tareas que coincidan con "{searchTerm}"</p>
            ) : filteredTasks.length === 0 && tasks.length === 0 ? (
                // Si no hay tareas en absoluto.
                <p className="task-message">No tenés tareas</p>
            ) : (
                // Muestra la lista de tareas filtradas.
                <ul className="task-list-ul">
                    {filteredTasks.map((task) => (
                        <li key={task._id} className="task-list-item">
                            <span
                                className={`task-title ${task.completed ? 'completed' : ''}`}
                            >
                                {task.title}
                            </span>
                            <div className="task-actions">
                                {/* Botón para completar/desmarcar tarea */}
                                <button
                                    onClick={() => handleToggle(task._id)}
                                    className="task-button complete-button"
                                    aria-label={task.completed ? 'Desmarcar tarea' : 'Completar tarea'}
                                >
                                    {task.completed ? 'Desmarcar' : 'Completar'}
                                </button>
                                {/* Botón para eliminar tarea */}
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="task-button delete-button"
                                    aria-label="Eliminar tarea"
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