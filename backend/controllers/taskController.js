// backend/controllers/taskController.js

const Task = require('../models/Task'); // Importa el modelo de Tarea

// --- Obtener todas las tareas del usuario autenticado ---
const getAllTasks = async (req, res) => {
    try {
        // Busca tareas que pertenezcan al usuario autenticado (req.user.userId)
        // y popula el campo 'category' para incluir el nombre de la categoría.
        const tasks = await Task.find({ userId: req.user.userId })
                                .populate('category', 'name') // Carga solo el campo 'name' de la categoría
                                .sort({ createdAt: -1 }); // Opcional: ordena las tareas por fecha de creación descendente

        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error al obtener las tareas:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener las tareas.' });
    }
};

// --- Crear una nueva tarea ---
const createTask = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        // Valida que el título sea obligatorio.
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'El título es obligatorio.' });
        }

        // Crea una nueva instancia de tarea con los datos proporcionados.
        // Asigna el ID del usuario autenticado y la ID de la categoría.
        const newTask = new Task({
            title: title.trim(),
            description: description,
            userId: req.user.userId,
            category: category // 'category' debe ser el ObjectId de una categoría existente
        });

        const savedTask = await newTask.save();

        // Popula la categoría en la tarea recién guardada antes de enviarla como respuesta,
        // para que el cliente reciba la información completa de la categoría.
        const populatedTask = await Task.findById(savedTask._id).populate('category', 'name');

        res.status(201).json(populatedTask);
    } catch (err) {
        console.error('Error al crear la tarea:', err);
        // Podría añadir una validación más específica si 'category' no es un ID válido.
        res.status(500).json({ error: 'Error interno del servidor al crear la tarea.' });
    }
};

// --- Eliminar una tarea por ID ---
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Busca y elimina la tarea, asegurándose de que pertenezca al usuario autenticado.
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });

        if (!deletedTask) {
            // El mensaje indica si la tarea no existe o si el usuario no tiene permisos sobre ella.
            return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para eliminarla.' });
        }
        res.status(200).json({ message: 'Tarea eliminada exitosamente.' });
    } catch (err) {
        console.error('Error al eliminar la tarea:', err);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la tarea.' });
    }
};

// --- Alternar estado de tarea (completada/incompleta) ---
const toggleTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Busca la tarea, asegurándose de que pertenezca al usuario autenticado.
        const task = await Task.findOne({ _id: id, userId: req.user.userId });

        if (!task) {
            // El mensaje indica si la tarea no existe o si el usuario no tiene permisos sobre ella.
            return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para actualizarla.' });
        }

        // Invierte el valor booleano de 'completed'.
        task.completed = !task.completed;
        await task.save();

        // Popula la categoría en la tarea actualizada antes de enviarla como respuesta.
        const populatedTask = await Task.findById(task._id).populate('category', 'name');

        res.status(200).json(populatedTask);
    } catch (err) {
        console.error('Error al actualizar la tarea:', err);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la tarea.' });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    deleteTask,
    toggleTask
};