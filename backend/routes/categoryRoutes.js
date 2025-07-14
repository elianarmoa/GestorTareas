// backend/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware para verificar token JWT
const authorizeRole = require('../middlewares/roleMiddleware'); // Middleware para verificar rol (si decides que solo admins gestionen categorías)

// NOTA: Para la gestión de categorías, es común permitir que cualquier usuario autenticado
// las vea (GET), pero restringir la creación, actualización o eliminación a roles específicos (ej. 'admin').
// Aquí las protejo todas con authMiddleware, y puedes añadir authorizeRole(['admin']) donde lo necesites.

// --- Rutas Protegidas (Requieren autenticación) ---

// POST /api/categories → Crear una nueva categoría
// Podrías añadir authorizeRole(['admin']) aquí si solo los administradores pueden crear categorías
router.post('/', authMiddleware, categoryController.createCategory);

// GET /api/categories → Obtener todas las categorías
// Es común que cualquier usuario autenticado pueda ver las categorías
router.get('/', authMiddleware, categoryController.getAllCategories);

// PATCH /api/categories/:id → Actualizar una categoría por su ID
// Debería ser solo para administradores
router.patch('/:id', authMiddleware, authorizeRole(['admin']), categoryController.updateCategory);

// DELETE /api/categories/:id → Eliminar una categoría por su ID
// Definitivamente solo para administradores
router.delete('/:id', authMiddleware, authorizeRole(['admin']), categoryController.deleteCategory);


module.exports = router;