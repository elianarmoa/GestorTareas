// backend/middlewares/roleMiddleware.js

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no definido.' });
        }

        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios.' });
        }
    };
};

module.exports = authorizeRole;