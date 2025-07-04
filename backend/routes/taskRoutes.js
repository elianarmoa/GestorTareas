// backend/routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware'); // Asegúrate de que esta ruta es correcta (middlewares vs middleware)

// Middleware de autenticación para proteger las rutas que lo necesiten
// Se aplica 'authMiddleware' ANTES de la función del controlador en las rutas protegidas.

// --- Rutas Protegidas (Requieren autenticación) ---
// Estas rutas solo serán accesibles si el usuario está correctamente autenticado.

// POST /api/tasks → Crear una nueva tarea
router.post('/', authMiddleware, taskController.createTask);

// PATCH /api/tasks/:id → Alternar el estado (completado/incompleto) de una tarea por su ID
router.patch('/:id', authMiddleware, taskController.toggleTask);

// GET /api/tasks → Obtener todas las tareas del usuario autenticado
// Esta es la ruta para listar tareas del usuario logueado, y es PROTEGIDA.
router.get('/', authMiddleware, taskController.getAllTasks);

// DELETE /api/tasks/:id → Eliminar una tarea por su ID
router.delete('/:id', authMiddleware, taskController.deleteTask);

// --- CONSIDERACIÓN IMPORTANTE ---
// Si necesitas una ruta GET de tareas que *no* requiera autenticación,
// DEBERÍAS CREAR UN ENDPOINT DIFERENTE con un path distinto, por ejemplo:
// router.get('/public-tasks', taskController.getPublicTasks);
// En ese caso, 'getPublicTasks' en tu controlador *no* debería filtrar por req.user.id.
// Si no te lo piden específicamente como "público" y con acceso sin token,
// la mejor práctica es mantener todo lo relacionado a tareas del usuario, protegido.

module.exports = router;