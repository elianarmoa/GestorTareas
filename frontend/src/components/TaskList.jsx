// frontend/src/components/TaskList.jsx

import { useEffect, useState, useContext, useMemo } from 'react'; // Importación de hooks esenciales de React
import axios from 'axios'; // Cliente HTTP para realizar peticiones a la API
import { AuthContext } from '../context/AuthContext'; // Contexto para acceder a la información de autenticación del usuario
import TaskForm from './TaskForm'; // Componente para añadir nuevas tareas
import './TaskList.css'; // Estilos CSS para el componente TaskList

/**
 * @typedef {object} Task
 * @property {string} _id - El ID único de la tarea.
 * @property {string} title - El título de la tarea.
 * @property {boolean} completed - Indica si la tarea está completada.
 * @property {object} [category] - Objeto de categoría, opcional.
 * @property {string} category._id - El ID de la categoría.
 * @property {string} category.name - El nombre de la categoría.
 * @property {string} userId - El ID del usuario al que pertenece la tarea.
 * @property {Date} createdAt - La fecha de creación de la tarea.
 * @property {Date} updatedAt - La fecha de la última actualización de la tarea.
 */

/**
 * Componente funcional TaskList.
 * Gestiona la visualización, filtrado, paginación, creación, eliminación y alternancia de estado de las tareas.
 *
 * @param {object} props - Las propiedades pasadas al componente.
 * @param {string} props.selectedFilterCategory - El ID de la categoría seleccionada para filtrar tareas.
 * @param {Array<object>} props.categories - Un array de objetos de categoría disponibles.
 * @returns {JSX.Element} El componente TaskList renderizado.
 */
function TaskList({ selectedFilterCategory, categories }) {
    // ---------------------------------------------------------------------
    // 📦 Estado del Componente: Manejo de datos y UI 📦
    // ---------------------------------------------------------------------
    const { auth } = useContext(AuthContext); // Acceso al token de autenticación desde el contexto global
    const [allTasks, setAllTasks] = useState([]); // Almacena todas las tareas del usuario, es el "origen de la verdad"
    const [loading, setLoading] = useState(true); // Indica si las tareas están siendo cargadas desde la API
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda de tareas
    const [currentPage, setCurrentPage] = useState(1); // Página actual en la paginación
    const tasksPerPage = 5; // Número fijo de tareas a mostrar por página

    // ---------------------------------------------------------------------
    // 🌐 Efectos Secundarios (Hooks useEffect): Carga inicial de datos 🌐
    // ---------------------------------------------------------------------

    /**
     * `fetchAllTasks`: Función asíncrona para obtener todas las tareas del usuario desde la API.
     * Utiliza el token de autenticación para asegurar la privacidad.
     */
    const fetchAllTasks = async () => {
        // Si no hay token de autenticación, se asume que el usuario no ha iniciado sesión
        if (!auth.token) {
            setAllTasks([]); // Limpiar tareas si no hay token
            setLoading(false); // Detener el estado de carga
            return;
        }

        setLoading(true); // Iniciar estado de carga antes de la petición
        try {
            // Realizar la petición GET a la API de tareas con el token de autorización
            const res = await axios.get(`http://localhost:3000/api/tasks`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            // Actualizar el estado `allTasks` con los datos recibidos, o un array vacío si no hay tareas
            setAllTasks(res.data.tasks || []);
        } catch (error) {
            // Manejo de errores: loguear el error y limpiar las tareas en caso de fallo
            console.error("Error al obtener todas las tareas:", error);
            setAllTasks([]);
        } finally {
            // Asegurar que el estado de carga se desactive, independientemente del resultado
            setLoading(false);
        }
    };

    /**
     * `useEffect`: Se ejecuta una vez al montar el componente y cada vez que `auth.token` cambia.
     * Su propósito es cargar las tareas iniciales y reiniciar la paginación.
     */
    useEffect(() => {
        fetchAllTasks(); // Llama a la función para obtener las tareas
        setCurrentPage(1); // Reinicia la paginación a la primera página
    }, [auth.token]); // Dependencia: re-ejecuta el efecto si el token de autenticación cambia

    // ---------------------------------------------------------------------
    // ⚡ Optimizaciones (Hooks useMemo): Rendimiento de filtrado y paginación ⚡
    // ---------------------------------------------------------------------

    /**
     * `filteredTasks`: Memoriza la lista de tareas después de aplicar filtros de búsqueda y categoría.
     * Recalcula solo cuando `allTasks`, `searchTerm` o `selectedFilterCategory` cambian.
     * Esto evita cálculos innecesarios en cada renderizado.
     */
    const filteredTasks = useMemo(() => {
        let currentFiltered = allTasks; // Inicia con todas las tareas

        // Aplica filtro de búsqueda por término (si existe)
        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentFiltered = currentFiltered.filter(task =>
                task.title.toLowerCase().includes(lowercasedSearchTerm)
            );
        }

        // Aplica filtro por categoría (si hay una seleccionada)
        if (selectedFilterCategory) {
            currentFiltered = currentFiltered.filter(task =>
                // Importante: Verifica que `task.category` exista antes de acceder a `._id`
                task.category && task.category._id === selectedFilterCategory
            );
        }
        return currentFiltered; // Retorna la lista de tareas filtradas
    }, [allTasks, searchTerm, selectedFilterCategory]); // Dependencias para la memorización

    /**
     * `totalPages`: Memoriza el número total de páginas basado en las tareas filtradas y `tasksPerPage`.
     * Recalcula solo cuando `filteredTasks` o `tasksPerPage` cambian.
     */
    const totalPages = useMemo(() => {
        // Asegura que siempre haya al menos 1 página, incluso si no hay tareas
        return Math.max(1, Math.ceil(filteredTasks.length / tasksPerPage));
    }, [filteredTasks, tasksPerPage]); // Dependencias para la memorización

    /**
     * `paginatedTasks`: Memoriza las tareas a mostrar en la página actual después de la paginación.
     * Recalcula solo cuando `filteredTasks`, `currentPage`, `totalPages` o `tasksPerPage` cambian.
     * Esta es la lista final de tareas que se renderizará.
     */
    const paginatedTasks = useMemo(() => {
        // Ajusta `currentPage` si supera el `totalPages` (ej. si se eliminan tareas de la última página)
        const safeCurrentPage = Math.min(currentPage, totalPages);
        if (currentPage !== safeCurrentPage) {
            // Actualiza `currentPage` si es necesario, lo que disparará un re-render (correcto en este caso)
            setCurrentPage(safeCurrentPage);
        }

        // Calcula los índices de inicio y fin para el slice del array
        const startIndex = (safeCurrentPage - 1) * tasksPerPage;
        const endIndex = startIndex + tasksPerPage;
        return filteredTasks.slice(startIndex, endIndex); // Retorna las tareas para la página actual
    }, [filteredTasks, currentPage, totalPages, tasksPerPage]); // Dependencias para la memorización

    // ---------------------------------------------------------------------
    // ⚙️ Manejadores de Eventos y Lógica de Negocio ⚙️
    // ---------------------------------------------------------------------

    /**
     * `handlePageChange`: Maneja el cambio de página en la paginación.
     * @param {number} newPage - El número de la nueva página a la que navegar.
     */
    const handlePageChange = (newPage) => {
        // Valida que la nueva página sea válida antes de actualizar el estado
        if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    /**
     * `handleDelete`: Elimina una tarea específica.
     * Realiza una petición DELETE a la API y actualiza el estado local.
     * @param {string} id - El ID de la tarea a eliminar.
     */
    const handleDelete = async (id) => {
        try {
            // Petición DELETE a la API para eliminar la tarea
            await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            // Actualiza el estado `allTasks` eliminando la tarea por su ID
            setAllTasks(prevTasks => prevTasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    /**
     * `handleToggle`: Cambia el estado `completed` de una tarea (marcar/desmarcar).
     * Realiza una petición PATCH a la API y actualiza el estado local.
     * @param {string} id - El ID de la tarea a alternar su estado.
     */
    const handleToggle = async (id) => {
        try {
            // Encuentra la tarea a modificar en el estado actual
            const taskToToggle = allTasks.find(task => task._id === id);
            if (!taskToToggle) return; // Si la tarea no se encuentra, salir

            // Petición PATCH para actualizar el estado `completed`
            const res = await axios.patch(`http://localhost:3000/api/tasks/${id}`,
                { completed: !taskToToggle.completed }, // Envía el estado `completed` invertido
                {
                    headers: { Authorization: `Bearer ${auth.token}` }
                }
            );
            // Actualiza el estado `allTasks` mapeando y actualizando la tarea modificada
            setAllTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === id ? { ...task, completed: res.data.completed } : task // Utiliza `res.data.completed` directamente
                )
            );
        } catch (error) {
            console.error("Error al cambiar estado de la tarea:", error);
        }
    };

    /**
     * `handleTaskCreated`: Callback llamado desde `TaskForm` cuando una nueva tarea es creada.
     * Añade la nueva tarea al estado local y reinicia la búsqueda/paginación.
     * @param {Task} newTask - El objeto de la nueva tarea creada por el backend.
     */
    const handleTaskCreated = (newTask) => {
        console.log("Nueva tarea recibida en TaskList:", newTask);
        // Verifica que `newTask` sea un objeto válido y tenga un `_id` antes de agregarlo
        if (newTask && newTask._id) {
            // Añade la nueva tarea al principio de la lista `allTasks`
            setAllTasks(prevTasks => [newTask, ...prevTasks]);
            setSearchTerm(''); // Limpia el término de búsqueda para ver la nueva tarea
            setCurrentPage(1); // Vuelve a la primera página para mostrar la nueva tarea
        } else {
            console.error("Error: La nueva tarea recibida no es un objeto válido o le falta _id.", newTask);
            // Opcional: Podrías forzar una recarga completa de tareas aquí si el objeto es inválido
            // fetchAllTasks();
        }
    };

    // ---------------------------------------------------------------------
    // 🖼️ Renderizado Condicional: Mensajes de estado y UI principal 🖼️
    // ---------------------------------------------------------------------

    // Muestra mensaje si el usuario no está autenticado
    if (!auth.token) {
        return <p className="task-message">Iniciá sesión para ver tus tareas</p>;
    }
    // Muestra mensaje mientras las tareas están cargando
    if (loading) {
        return <p className="task-message">Cargando tareas...</p>;
    }

    return (
        <div className="task-list-wrapper">
            <h2 className="section-title">Añadir Nueva Tarea</h2>
            {/* Componente TaskForm para la creación de tareas, pasando el manejador de éxito y categorías */}
            <TaskForm onTaskCreated={handleTaskCreated} categories={categories} />

            <h2 className="section-title">Mis Tareas</h2>
            {/* Barra de búsqueda para filtrar tareas por título */}
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Buscar tareas existentes..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reinicia la paginación al cambiar el término de búsqueda
                    }}
                    className="search-input"
                    aria-label="Buscar tareas"
                />
            </div>

            {/* Renderizado condicional de la lista de tareas o mensajes */}
            {paginatedTasks.length === 0 && (searchTerm !== '' || selectedFilterCategory !== '') ? (
                // Mensaje si no hay tareas que coincidan con los filtros
                <p className="task-message">No se encontraron tareas que coincidan con los filtros.</p>
            ) : paginatedTasks.length === 0 ? (
                // Mensaje si no hay tareas en general (después de carga y sin filtros)
                <p className="task-message">No tenés tareas.</p>
            ) : (
                // Lista de tareas renderizada
                <ul className="task-list-ul">
                    {paginatedTasks.map((task) => (
                        <li key={task._id} className="task-list-item">
                            <span
                                className={`task-title ${task.completed ? 'completed' : ''}`}
                            >
                                {task.title}
                                {/* Renderiza el tag de categoría solo si la categoría y su nombre existen */}
                                {task.category && task.category.name && (
                                    <span className="task-category-tag">
                                        [{task.category.name}]
                                    </span>
                                )}
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

            {/* Controles de paginación, solo si hay más de una página */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default TaskList;