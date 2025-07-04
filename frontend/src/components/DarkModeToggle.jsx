import React from 'react';
import useDarkMode from '../Hooks/useDarkMode'; // Importa tu hook
import './DarkModeToggle.css';

function DarkModeToggle() {
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    return (
        <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
            {isDarkMode ? '🌞' : '🌙'} {/* Iconos sencillos */}
        </button>
    );
}

export default DarkModeToggle;