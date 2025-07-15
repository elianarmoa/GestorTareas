// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController'); // Importa getAllUsers
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const authorizeRole = require('../middlewares/roleMiddleware'); // Middleware de autorización por rol

/**
 * Rutas para la gestión de usuarios y autenticación.
 * Incluye registro, login y una ruta para listar usuarios (solo para administradores).
 */

// --- Rutas Públicas (No requieren autenticación) ---

// POST /api/users/register
// Permite que un nuevo usuario se registre en el sistema.
router.post('/register', registerUser);

// POST /api/users/login
// Permite que un usuario existente inicie sesión y obtenga un token JWT.
router.post('/login', loginUser);

// --- Rutas Protegidas (Requieren autenticación y/o rol específico) ---

// GET /api/users
// Obtiene una lista de todos los usuarios registrados.
// Requiere autenticación y el rol de 'admin'.
router.get('/', authMiddleware, authorizeRole(['admin']), getAllUsers);

module.exports = router;