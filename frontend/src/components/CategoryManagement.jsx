// frontend/src/components/CategoryManagement.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CategoryManagement.css';

/**
 * Componente CategoryManagement.
 * Permite a los usuarios con rol 'admin' gestionar las categorías:
 * ver, crear, editar y eliminar.
 */
function CategoryManagement() {
    // Accede al contexto de autenticación para obtener el token y el rol del usuario.
    const { auth } = useContext(AuthContext);
    // Estado para almacenar la lista de categorías.
    const [categories, setCategories] = useState([]);
    // Estado para el nombre de la nueva categoría o categoría a editar.
    const [categoryName, setCategoryName] = useState('');
    // Estado para controlar si se está editando una categoría existente.
    const [editingCategory, setEditingCategory] = useState(null); // Almacena el objeto de la categoría que se está editando
    // Estado para controlar el estado de carga.
    const [loading, setLoading] = useState(true);
    // Estado para mostrar mensajes al usuario (éxito/error).
    const [message, setMessage] = useState({ text: null, type: null }); // { text: '...', type: 'success' | 'error' }

    // Define el rol requerido para las operaciones de gestión de categorías.
    const requiredRole = 'admin';
    // Verifica si el usuario actual tiene el rol requerido.
    const isAdmin = auth.user && auth.user.role === requiredRole;

    /**
     * Muestra un mensaje al usuario.
     * @param {string} text - El texto del mensaje.
     * @param {string} type - El tipo de mensaje ('success' o 'error').
     */
    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: null, type: null }); // Limpia el mensaje después de 3 segundos
        }, 3000);
    };

    /**
     * Función asíncrona para obtener todas las categorías desde la API.
     */
    const fetchCategories = async () => {
        if (!auth.token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/categories', {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setCategories(res.data);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            showMessage('Error al cargar las categorías.', 'error');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Hook useEffect para cargar las categorías al montar el componente
     * o cuando el token de autenticación cambia.
     */
    useEffect(() => {
        fetchCategories();
    }, [auth.token]); // Dependencia del efecto: se ejecuta cuando `auth.token` cambia.

    /**
     * Maneja el envío del formulario para crear o actualizar una categoría.
     * @param {Event} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            showMessage('El nombre de la categoría no puede estar vacío.', 'error');
            return;
        }

        try {
            if (editingCategory) {
                // Lógica para actualizar categoría
                const res = await axios.patch(`http://localhost:3000/api/categories/${editingCategory._id}`,
                    { name: categoryName },
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
                showMessage(res.data.message, 'success');
            } else {
                // Lógica para crear nueva categoría
                const res = await axios.post('http://localhost:3000/api/categories',
                    { name: categoryName },
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
                showMessage(res.data.message, 'success');
            }
            setCategoryName(''); // Limpia el campo de entrada
            setEditingCategory(null); // Sale del modo edición
            fetchCategories(); // Recarga la lista de categorías
        } catch (error) {
            console.error("Error al guardar categoría:", error);
            const errorMessage = error.response?.data?.message || 'Error al guardar la categoría.';
            showMessage(errorMessage, 'error');
        }
    };

    /**
     * Inicia el modo de edición para una categoría.
     * @param {object} category - La categoría a editar.
     */
    const handleEditClick = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
    };

    /**
     * Cancela el modo de edición.
     */
    const handleCancelEdit = () => {
        setEditingCategory(null);
        setCategoryName('');
    };

    /**
     * Maneja la eliminación de una categoría.
     * @param {string} id - El ID de la categoría a eliminar.
     */
    const handleDelete = async (id) => {
        // Implementar un modal de confirmación en lugar de confirm()
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto podría afectar a las tareas asociadas.')) {
            try {
                const res = await axios.delete(`http://localhost:3000/api/categories/${id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                showMessage(res.data.message, 'success');
                fetchCategories(); // Recarga la lista de categorías
            } catch (error) {
                console.error("Error al eliminar categoría:", error);
                const errorMessage = error.response?.data?.message || 'Error al eliminar la categoría.';
                showMessage(errorMessage, 'error');
            }
        }
    };

    // Renderizado condicional basado en la autenticación y el rol.
    if (!auth.token) {
        return <p className="category-message">Iniciá sesión para gestionar categorías.</p>;
    }

    if (loading) {
        return <p className="category-message">Cargando categorías...</p>;
    }

    if (!isAdmin) {
        return <p className="category-message error">No tenés permisos para gestionar categorías. Solo los administradores pueden acceder a esta sección.</p>;
    }

    return (
        <div className="category-management-container">
            <h2 className="category-management-title">Gestión de Categorías</h2>

            {/* Formulario para Crear/Editar Categoría */}
            <form onSubmit={handleSubmit} className="category-form">
                <input
                    type="text"
                    placeholder={editingCategory ? "Editar nombre de categoría" : "Nueva categoría"}
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="category-input"
                    aria-label={editingCategory ? "Editar nombre de categoría" : "Nombre de la nueva categoría"}
                />
                <button type="submit" className="category-button primary-button">
                    {editingCategory ? 'Actualizar Categoría' : 'Añadir Categoría'}
                </button>
                {editingCategory && (
                    <button type="button" onClick={handleCancelEdit} className="category-button secondary-button">
                        Cancelar
                    </button>
                )}
            </form>

            {/* Mensaje de feedback */}
            {message.text && (
                <p className={`category-feedback-message ${message.type}`}>
                    {message.text}
                </p>
            )}

            {/* Lista de Categorías */}
            {categories.length === 0 ? (
                <p className="category-message">No hay categorías creadas aún.</p>
            ) : (
                <ul className="category-list-ul">
                    {categories.map((category) => (
                        <li key={category._id} className="category-list-item">
                            <span className="category-name">{category.name}</span>
                            <div className="category-actions">
                                <button
                                    onClick={() => handleEditClick(category)}
                                    className="category-button edit-button"
                                    aria-label={`Editar categoría ${category.name}`}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="category-button delete-button"
                                    aria-label={`Eliminar categoría ${category.name}`}
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

export default CategoryManagement;
