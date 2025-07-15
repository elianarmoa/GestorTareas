// frontend/src/components/DarkModeToggle.jsx

import React from 'react';
import useDarkMode from '../Hooks/useDarkMode'; // Importa el hook personalizado para el tema oscuro
import './DarkModeToggle.css'; // Estilos específicos para el componente

/**
 * Componente DarkModeToggle.
 * Proporciona un botón para alternar entre el modo claro y oscuro de la aplicación.
 * Utiliza el hook `useDarkMode` para gestionar el estado del tema.
 */
function DarkModeToggle() {
    // `isDarkMode` indica el estado actual del tema.
    // `toggleDarkMode` es la función para cambiar el tema.
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    return (
        <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            // `aria-label` mejora la accesibilidad, describiendo la acción del botón.
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
            {/* Muestra un icono diferente según el modo actual */}
            {isDarkMode ? '🌞' : '🌙'}
        </button>
    );
}

export default DarkModeToggle;