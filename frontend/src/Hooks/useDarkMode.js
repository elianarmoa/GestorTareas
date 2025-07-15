import { useState, useEffect } from 'react';

/**
 * Hook personalizado `useDarkMode`.
 * Gestiona el estado del modo oscuro en la aplicación.
 *
 * - Al inicializarse, comprueba si hay una preferencia de tema guardada en `localStorage`.
 * - Si no hay preferencia guardada, detecta la preferencia de tema del sistema operativo (`prefers-color-scheme`).
 * - Aplica o remueve la clase 'dark-mode' del `body` del documento para controlar los estilos CSS.
 * - Persiste la preferencia del usuario en `localStorage` para recordar la elección.
 *
 * @returns {Array<boolean, Function>} Un array que contiene:
 * - `isDarkMode` (boolean): `true` si el modo oscuro está activo, `false` en modo claro.
 * - `toggleDarkMode` (Function): Una función para alternar el estado del modo oscuro.
 */
const useDarkMode = () => {
    // Estado inicial: Intenta cargar la preferencia de tema desde localStorage.
    // Si no existe, usa la preferencia del sistema operativo.
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        // Detecta la preferencia del sistema si no hay una guardada.
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Efecto secundario: Aplica la clase 'dark-mode' al <body> y guarda la preferencia en localStorage.
    useEffect(() => {
        const body = document.body;
        if (isDarkMode) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]); // Se re-ejecuta cada vez que `isDarkMode` cambia.

    /**
     * Función `toggleDarkMode`.
     * Alterna el estado de `isDarkMode`, cambiando entre `true` y `false`.
     */
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;