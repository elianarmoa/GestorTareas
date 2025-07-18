// frontend/src/components/TaskForm.jsx

import React, { useState, useContext, useEffect } from 'react'; // Importar useEffect
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './TaskForm.css';

function TaskForm({ onTaskCreated, categories }) {
    const { auth } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Estado para controlar el temporizador
    const [successTimerId, setSuccessTimerId] = useState(null);

    // Limpia el temporizador si el componente se desmonta
    useEffect(() => {
        return () => {
            if (successTimerId) {
                clearTimeout(successTimerId);
            }
        };
    }, [successTimerId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage(''); // Limpiar cualquier mensaje previo al intentar enviar

        // Limpiar el temporizador si existe uno activo para el mensaje de éxito
        if (successTimerId) {
            clearTimeout(successTimerId);
            setSuccessTimerId(null);
        }

        if (!title.trim()) {
            setError('El título de la tarea es requerido.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/api/tasks',
                { title, category: category || null },
                {
                    headers: { Authorization: `Bearer ${auth.token}` }
                }
            );
            setTitle('');
            setCategory('');
            setSuccessMessage('Tarea creada exitosamente!'); // Mostrar mensaje de éxito
            
            // Establecer un temporizador para ocultar el mensaje después de 2 segundos (2000 ms)
            const timer = setTimeout(() => {
                setSuccessMessage(''); // Ocultar el mensaje
                setSuccessTimerId(null); // Limpiar el ID del temporizador
            }, 2000); // Duración en milisegundos

            setSuccessTimerId(timer); // Guardar el ID del temporizador

            console.log("Tarea creada por el backend (en TaskForm):", res.data);

            if (onTaskCreated) {
                onTaskCreated(res.data);
            }
        } catch (err) {
            console.error('Error al crear tarea:', err.response?.data?.error || err.message);
            setError(err.response?.data?.error || 'Error al crear la tarea.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                placeholder="Nueva tarea..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="task-form-input"
                aria-label="Título de la nueva tarea"
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="task-form-select"
                aria-label="Categoría de la tarea"
            >
                <option value="">Sin Categoría</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <button type="submit" className="task-form-button">
                Agregar
            </button>
            {error && <p className="error-message">{error}</p>}
            {/* Solo muestra el mensaje de éxito si existe */}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
    );
}

export default TaskForm;