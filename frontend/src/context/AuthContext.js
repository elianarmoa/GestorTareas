import { createContext } from 'react';

/**
 * Contexto de Autenticación.
 * Provee un mecanismo para compartir el estado de autenticación
 * (usuario, token, rol) a través de toda la aplicación sin necesidad
 * de pasar props manualmente en cada nivel.
 */
export const AuthContext = createContext();