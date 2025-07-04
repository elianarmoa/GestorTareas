// frontend/src/components/TaskForm.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './TaskForm.css'; // Importa el archivo CSS

function TaskForm({ onTaskCreated }) {
    const { auth } = useContext(AuthContext);
    const [title, setTitle] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('El título de la tarea no puede estar vacío.');
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:3000/api/tasks',
                { title },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setTitle('');
            onTaskCreated(res.data);
        } catch (err) {
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
                className="task-form-input" // <--- Aquí se eliminó el comentario incorrecto
            />
            <button type="submit" className="task-form-button">
                Agregar
            </button>
        </form>
    );
}

export default TaskForm;