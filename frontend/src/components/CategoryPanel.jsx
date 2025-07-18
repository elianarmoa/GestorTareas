// frontend/src/components/CategoryPanel.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './CategoryPanel.css'; 

/**
 * Componente CategoryPanel.
 * Muestra la lista de categorías y permite al usuario seleccionarlas
 * para filtrar las tareas. También puede tener un botón para gestionar categorías
 * para administradores.
 *
 * @param {object} props - Propiedades del componente.
 * @param {function(string): void} props.onSelectCategory - Callback cuando se selecciona una categoría.
 * @param {string} props.selectedCategory - ID de la categoría actualmente seleccionada.
 * @param {function(Array<object>): void} props.onCategoriesLoaded - Callback que se llama cuando las categorías se cargan, pasando la lista.
 */
function CategoryPanel({ onSelectCategory, selectedCategory, onCategoriesLoaded }) {
    const { auth } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Verifica si el usuario es administrador para mostrar el botón de gestión
    const isAdmin = auth.user && auth.user.role === 'admin';

    /**
     * Función para obtener todas las categorías desde la API.
     */
    const fetchCategories = async () => {
        if (!auth.token) {
            setLoading(false);
            setCategories([]); // Asegura que no haya categorías si no hay token
            onCategoriesLoaded([]); // Notifica al padre que no hay categorías
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/categories', {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setCategories(res.data);
            onCategoriesLoaded(res.data); // Pasa las categorías cargadas al componente padre
        } catch (error) {
            console.error("Error al obtener categorías para el panel:", error);
            setCategories([]);
            onCategoriesLoaded([]); // Notifica al padre que hubo un error o no hay categorías
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
    }, [auth.token]); // Dependencia: auth.token

    if (loading) {
        return <div className="category-panel-container"><p className="category-panel-message">Cargando categorías...</p></div>;
    }

    if (!auth.token) {
        return null; // No muestra el panel si no está autenticado
    }

    return (
        <div className="category-panel-container">
            <h3 className="category-panel-title">Categorías</h3>
            <ul className="category-panel-list">
                <li
                    className={`category-panel-item ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => onSelectCategory('')} // Seleccionar "Todas"
                >
                    Todas las Tareas
                </li>
                {categories.map((category) => (
                    <li
                        key={category._id}
                        className={`category-panel-item ${selectedCategory === category._id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(category._id)}
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
            {isAdmin && (
                <div className="category-panel-admin-actions">
                    <a href="/categories" className="category-panel-manage-button">
                        Gestionar Categorías
                    </a>
                </div>
            )}
        </div>
    );
}

export default CategoryPanel;