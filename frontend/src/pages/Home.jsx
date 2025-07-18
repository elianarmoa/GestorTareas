// frontend/src/pages/Home.jsx

import React, { useState, useContext } from 'react';
import TaskList from '../components/TaskList'; 
import CategoryPanel from '../components/CategoryPanel';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

function Home() {
    const { auth } = useContext(AuthContext);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [allCategories, setAllCategories] = useState([]);

    if (!auth.token) {
        return null;
    }

    return (
        <div className="home-layout-container">
            {/* Panel de Categorías (Lateral Izquierdo) */}
            <CategoryPanel
                onSelectCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                onCategoriesLoaded={setAllCategories}
            />

            {/* Contenedor Principal de Tareas (Panel Grande a la Derecha) */}
            {/* Este div actuará como la "tarjeta" principal del lado derecho */}
            <div className="main-content-area panel-card"> 
                <h1 className="main-title">Gestor de Tareas</h1> 
                <TaskList
                    selectedFilterCategory={selectedCategory}
                    categories={allCategories} // Pasa las categorías a TaskList (para TaskForm dentro)
                />
            </div>
        </div>
    );
}

export default Home;