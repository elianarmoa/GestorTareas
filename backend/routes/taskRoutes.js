const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware de autenticación para proteger las rutas que lo necesiten
// Se aplica 'authMiddleware' ANTES de la función del controlador en las rutas protegidas.

// --- Rutas Protegidas (Requieren autenticación) ---
// Estas rutas solo serán accesibles si el usuario está correctamente autenticado.

// POST /api/tasks → Crear una nueva tarea
router.post('/', authMiddleware, taskController.createTask);

// PATCH /api/tasks/:id → Alternar el estado (completado/incompleto) de una tarea por su ID
router.patch('/:id', authMiddleware, taskController.toggleTask);

// GET /api/tasks → Obtener todas las tareas del usuario autenticado
router.get('/', authMiddleware, taskController.getAllTasks); // ahora protegida

// DELETE /api/tasks/:id → Eliminar una tarea por su ID
router.delete('/:id', authMiddleware, taskController.deleteTask);

// --- Rutas Públicas (No requieren autenticación) ---
// Estas rutas pueden ser accedidas por cualquier usuario sin necesidad de autenticación.

// GET /api/tasks → Obtener todas las tareas
router.get('/', taskController.getAllTasks);

module.exports = router;