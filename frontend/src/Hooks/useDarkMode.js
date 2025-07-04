import { useState, useEffect } from 'react';

const useDarkMode = () => {
    // Estado inicial: lo obtenemos de localStorage o detectamos preferencia del sistema
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        // Si no hay preferencia guardada, detecta la preferencia del sistema
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Efecto para aplicar la clase 'dark-mode' al body y guardar la preferencia
    useEffect(() => {
        const body = document.body;
        if (isDarkMode) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]); // Se ejecuta cada vez que isDarkMode cambia

    // Función para alternar el modo
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;