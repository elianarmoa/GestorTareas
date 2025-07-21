import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance'; // Importa la instancia de Axios configurada
import { AuthContext } from '../context/AuthContext'; // Importa el contexto de autenticación

import './CategoryManagement.css'; // Importa los estilos CSS específicos para la gestión de categorías

/**
 * Componente CategoryManagement.
 * Esta página permite a cualquier usuario autenticado gestionar sus propias categorías.
 * Los usuarios pueden ver una lista de sus categorías existentes, crear nuevas categorías
 * y eliminar las categorías que les pertenecen.
 * Las operaciones se realizan a través de la API del backend, asegurando que las categorías
 * sean privadas para cada usuario.
 */
function CategoryManagement() {
    // Accede al contexto de autenticación para obtener el estado de autenticación del usuario.
    // Aunque el rol no se usa aquí para permisos (ya que las categorías son por usuario),
    // `auth.token` es necesario para realizar solicitudes autenticadas.
    const { auth } = useContext(AuthContext);

    // Estado para almacenar la lista de categorías obtenidas del backend.
    const [categories, setCategories] = useState([]);
    // Estado para controlar el valor del campo de entrada para el nombre de la nueva categoría.
    const [newCategoryName, setNewCategoryName] = useState('');
    // Estado para gestionar los mensajes de feedback al usuario (éxito o error).
    const [message, setMessage] = useState(null);
    // Estado booleano para indicar si el mensaje actual es de error (para aplicar estilos CSS).
    const [isError, setIsError] = useState(false);

    /**
     * Hook useEffect para cargar las categorías del usuario.
     * Se ejecuta al montar el componente y cada vez que el token de autenticación cambia,
     * asegurando que las categorías se carguen solo cuando el usuario está autenticado.
     */
    useEffect(() => {
        // Solo intenta cargar categorías si el usuario está autenticado y tiene un token.
        if (auth && auth.token) {
            fetchCategories();
        }
    }, [auth.token]); // La dependencia `auth.token` asegura que el efecto se re-ejecute si la sesión cambia.

    /**
     * Función asíncrona para obtener todas las categorías que pertenecen al usuario autenticado
     * desde el backend.
     */
    const fetchCategories = async () => {
        try {
            // Realiza una solicitud GET al endpoint de categorías.
            // `axiosInstance` ya se encarga de añadir el token de autorización.
            const response = await axiosInstance.get('/categories');
            setCategories(response.data); // Actualiza el estado con la lista de categorías.
            setMessage(null); // Limpia cualquier mensaje de feedback anterior.
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            // Extrae el mensaje de error de la respuesta del backend o usa un mensaje genérico.
            const errorMessage = error.response?.data?.message || 'Error al cargar las categorías.';
            setMessage(errorMessage); // Muestra el mensaje de error al usuario.
            setIsError(true); // Activa el estado de error para estilos.
        }
    };

    /**
     * Maneja el envío del formulario para crear una nueva categoría.
     * Esta función es accesible para cualquier usuario autenticado,
     * y la categoría se vinculará automáticamente a su `userId` en el backend.
     * @param {Event} e - El evento de envío del formulario (para prevenir la recarga de la página).
     */
    const handleCreateCategory = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario.
        setMessage(null);   // Limpia mensajes anteriores.
        setIsError(false);  // Resetea el estado de error.

        // Valida que el nombre de la categoría no esté vacío.
        if (!newCategoryName.trim()) {
            setMessage('El nombre de la categoría no puede estar vacío.');
            setIsError(true);
            return;
        }

        try {
            // Realiza una solicitud POST al endpoint de categorías para crear una nueva.
            // El backend asignará el `userId` automáticamente.
            const response = await axiosInstance.post('/categories', { name: newCategoryName });
            setMessage('Categoría creada exitosamente.'); // Muestra mensaje de éxito.
            setIsError(false);
            setNewCategoryName(''); // Limpia el campo de entrada del formulario.
            fetchCategories(); // Vuelve a cargar la lista de categorías para reflejar el cambio.
        } catch (error) {
            console.error('Error al crear categoría:', error);
            // Extrae el mensaje de error del backend (ej. "Ya tienes una categoría con ese nombre").
            const errorMessage = error.response?.data?.message || 'Error al crear la categoría.';
            setMessage(errorMessage); // Muestra el mensaje de error al usuario.
            setIsError(true); // Activa el estado de error.
        }
    };

    /**
     * Maneja la eliminación de una categoría.
     * Esta función permite a cualquier usuario autenticado eliminar sus propias categorías.
     * @param {string} categoryId - El ID único de la categoría a eliminar.
     */
    const handleDeleteCategory = async (categoryId) => {
        // Solicita confirmación al usuario antes de proceder con la eliminación.
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            return; // Si el usuario cancela, la función termina.
        }
        setMessage(null);   // Limpia mensajes anteriores.
        setIsError(false);  // Resetea el estado de error.

        try {
            // Envía una solicitud DELETE al endpoint de categorías para eliminar por ID.
            // El backend verificará que la categoría pertenezca al usuario autenticado.
            await axiosInstance.delete(`/categories/${categoryId}`);
            setMessage('Categoría eliminada exitosamente.'); // Muestra mensaje de éxito.
            setIsError(false);
            fetchCategories(); // Vuelve a cargar la lista de categorías para reflejar el cambio.
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            // Extrae el mensaje de error del backend o usa un mensaje genérico.
            const errorMessage = error.response?.data?.message || 'Error al eliminar la categoría.';
            setMessage(errorMessage); // Muestra el mensaje de error al usuario.
            setIsError(true); // Activa el estado de error.
        }
    };

    return (
        <div className="category-management-container">
            <h1 className="category-management-title">Gestión de Mis Categorías</h1>

            {/* Formulario para crear una nueva categoría.
                Visible para cualquier usuario autenticado. */}
            <form onSubmit={handleCreateCategory} className="category-form">
                <input
                    type="text"
                    placeholder="Nombre de la nueva categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="category-input"
                    required // El campo es obligatorio.
                />
                <button type="submit" className="category-button">Crear Categoría</button>
            </form>

            {/* Muestra un mensaje de feedback al usuario (éxito o error). */}
            {message && (
                <p className={`category-message ${isError ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}

            {/* Sección para listar las categorías existentes del usuario. */}
            <h2 className="category-list-title">Mis Categorías Existentes</h2>
            {categories.length === 0 ? (
                // Muestra un mensaje si no hay categorías creadas por el usuario.
                <p className="no-categories-message">No tienes categorías. ¡Crea una!</p>
            ) : (
                // Muestra la lista de categorías si existen.
                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category._id} className="category-item">
                            <span>{category.name}</span>
                            {/* Botón para eliminar la categoría.
                                Es visible para cualquier usuario sobre sus propias categorías. */}
                            <button
                                onClick={() => handleDeleteCategory(category._id)}
                                className="delete-category-button"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CategoryManagement;
