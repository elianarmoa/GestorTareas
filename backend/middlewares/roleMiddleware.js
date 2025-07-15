// backend/middlewares/roleMiddleware.js

/**
 * Middleware para autorizar el acceso basado en roles de usuario.
 * @param {Array<string>} roles - Un array de roles permitidos (ej. ['admin', 'user']).
 * @returns {Function} Un middleware de Express.
 */
const authorizeRole = (roles) => {
    return (req, res, next) => {
        // req.user es establecido por el authMiddleware anterior.
        // Verificamos si la información del usuario o su rol está presente en la request.
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acceso denegado: Información de rol no disponible.' });
        }

        // Comprueba si el rol del usuario autenticado está incluido en la lista de roles permitidos.
        if (roles.includes(req.user.role)) {
            next(); // El usuario tiene el rol requerido, permite el acceso.
        } else {
            // El usuario no tiene un rol permitido.
            res.status(403).json({ message: 'Acceso denegado: No tienes los permisos necesarios para esta acción.' });
        }
    };
};

module.exports = authorizeRole;