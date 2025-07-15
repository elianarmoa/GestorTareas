// backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware para verificar el token de autenticación (JWT)
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Comprueba si el encabezado de autorización existe y tiene el formato 'Bearer <token>'.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado o formato incorrecto.' });
    }

    // Extrae el token de la cadena 'Bearer <token>'.
    const token = authHeader.split(' ')[1];

    try {
        // Verifica el token utilizando la clave secreta.
        // Si es válido, 'decoded' contendrá el payload del token (userId, username, role).
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adjunta la información decodificada del usuario al objeto 'req'
        // para que los controladores subsiguientes puedan acceder a ella.
        req.user = decoded; 
        
        next(); // Continúa con la siguiente función middleware o el controlador de ruta.
    } catch (err) {
        // Si el token es inválido (ej. expirado, firma incorrecta), devuelve un error 401.
        return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;