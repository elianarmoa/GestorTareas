// backend/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');    // Middleware para verificar el token JWT
const authorizeRole = require('../middlewares/roleMiddleware'); // Middleware para verificar roles de usuario

/**
 * Rutas para la gestión de categorías.
 * Se utilizan middlewares de autenticación y autorización para proteger los endpoints.
 * Por convención, cualquier usuario autenticado puede ver las categorías,
 * mientras que la creación, actualización y eliminación se restringen a administradores.
 */

// --- Rutas Protegidas ---

// POST /api/categories
// Crea una nueva categoría. Requiere autenticación y rol de 'admin'.
router.post('/', authMiddleware, authorizeRole(['admin']), categoryController.createCategory);

// GET /api/categories
// Obtiene todas las categorías disponibles. Requiere autenticación.
router.get('/', authMiddleware, categoryController.getAllCategories);

// PATCH /api/categories/:id
// Actualiza una categoría específica por su ID. Requiere autenticación y rol de 'admin'.
router.patch('/:id', authMiddleware, authorizeRole(['admin']), categoryController.updateCategory);

// DELETE /api/categories/:id
// Elimina una categoría específica por su ID. Requiere autenticación y rol de 'admin'.
router.delete('/:id', authMiddleware, authorizeRole(['admin']), categoryController.deleteCategory);

module.exports = router;