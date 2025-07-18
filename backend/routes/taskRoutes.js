const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware para verificar el token JWT

/**
 * Rutas para la gestión de tareas.
 * Todos los endpoints de tareas aquí definidos requieren autenticación.
 * Las tareas están asociadas a un usuario específico.
 */

// --- Rutas Protegidas (Requieren autenticación) ---

// POST /api/tasks
// Crea una nueva tarea asociada al usuario autenticado.
router.post('/', authMiddleware, taskController.createTask);

// GET /api/tasks
// Obtiene todas las tareas que pertenecen al usuario autenticado.
// Este endpoint ahora soporta paginación y búsqueda.
router.get('/', authMiddleware, taskController.getAllTasks);

// PATCH /api/tasks/:id
// Alterna el estado (completado/incompleto) de una tarea específica por su ID.
// Asegura que la tarea pertenezca al usuario autenticado.
router.patch('/:id', authMiddleware, taskController.toggleTask);

// DELETE /api/tasks/:id
// Elimina una tarea específica por su ID.
// Asegura que la tarea pertenezca al usuario autenticado.
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;