// backend/middlewares/errorHandler.js

/**
 * Middleware de manejo centralizado de errores.
 * Captura los errores que ocurren en la aplicación y envía una respuesta estandarizada al cliente.
 * @param {Error} err - El objeto de error.
 * @param {Object} req - Objeto de la solicitud de Express.
 * @param {Object} res - Objeto de la respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
const errorHandler = (err, req, res, next) => {
    // Registra el error en la consola del servidor para depuración.
    // En un entorno de producción, se usaría un logger más robusto.
    console.error('🛑 Unhandled Error:', err.message || err);

    // Envía una respuesta de error 500 (Internal Server Error) al cliente.
    // Se utiliza un mensaje genérico por seguridad, evitando exponer detalles internos del error.
    res.status(500).json({ error: 'Error interno del servidor. Por favor, intentá más tarde.' });
};

module.exports = errorHandler;