const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
const authHeader = req.headers.authorization;

  // Verificamos si viene el token
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
}

const token = authHeader.split(' ')[1];

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos info del usuario en la request
    next(); // Pasamos al siguiente middleware/controlador
} catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
}
};

module.exports = authMiddleware;
