// frontend/src/components/TaskForm.jsx

import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './TaskForm.css';

/**
 * Componente TaskForm.
 * Permite a los usuarios crear nuevas tareas.
 * Se encarga de capturar el título de la tarea, enviarla a la API
 * y notificar al componente padre cuando una tarea ha sido creada.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {function(object): void} props.onTaskCreated - Función callback que se ejecuta cuando una tarea es creada exitosamente.
 */
function TaskForm({ onTaskCreated }) {
    // Obtiene el objeto de autenticación del contexto para acceder al token del usuario.
    const { auth } = useContext(AuthContext);
    // Estado para almacenar el título de la nueva tarea.
    const [title, setTitle] = useState('');

    /**
     * Maneja el envío del formulario.
     * Valida el título, envía la solicitud POST a la API para crear la tarea,
     * y maneja las respuestas (éxito/error).
     * @param {Event} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página.

        // Valida que el título no esté vacío o solo contenga espacios.
        if (!title.trim()) {
            alert('El título de la tarea no puede estar vacío.');
            return;
        }

        try {
            // Realiza la solicitud POST a la API para crear una tarea.
            // Incluye el token de autenticación en los headers.
            const res = await axios.post(
                'http://localhost:3000/api/tasks',
                { title },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setTitle(''); // Limpia el campo de entrada después de la creación exitosa.
            onTaskCreated(res.data); // Llama al callback para notificar al componente padre.
        } catch (err) {
            // Manejo de errores: registra el error en consola y notifica al usuario.
            console.error('Error al crear tarea:', err);
            alert('Error al crear tarea. Asegúrate de estar logueado.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                placeholder="Nueva tarea"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="task-form-input"
                aria-label="Título de la nueva tarea" // Mejora la accesibilidad
            />
            <button type="submit" className="task-form-button">
                Agregar
            </button>
        </form>
    );
}

export default TaskForm;