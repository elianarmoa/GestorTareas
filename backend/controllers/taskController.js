// backend/controllers/taskController.js

const Task = require('../models/Task'); // Ensure the path is correct

// Obtener todas las tareas
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId }) // Filter by authenticated user's ID
                                .populate('category', 'name') // <--- ADDED POPULATE HERE! Fetch 'name' field of the category
                                .sort({ createdAt: -1 }); // Optional: sort by creation date, most recent first

        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error al obtener las tareas:', err); // Added console.error for better debugging
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
    try {
        const { title, description, category } = req.body; // <--- ADDED 'description' (if applicable) and 'category'

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'El título es obligatorio' });
        }

        const newTask = new Task({
            title: title.trim(),
            description: description, // Assuming you have a 'description' field in Task model
            userId: req.user.userId, // Assign authenticated user's ID to the task
            category: category // <--- ASSIGN CATEGORY ID HERE
        });

        const savedTask = await newTask.save();

        // Optional: Populate the category immediately after saving for the response
        const populatedTask = await Task.findById(savedTask._id).populate('category', 'name');

        res.status(201).json(populatedTask); // <--- Respond with the populated task
    } catch (err) {
        console.error('No se pudo crear la tarea:', err); // Added console.error for better debugging
        res.status(500).json({ error: 'No se pudo crear la tarea' });
    }
};

// Eliminar una tarea por ID
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Find and delete the task, ensuring it belongs to the authenticated user
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.userId }); // <--- ADDED userId check

        if (!deletedTask) {
            // Changed error message to be more specific (not found OR not authorized)
            return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para eliminarla.' });
        }
        res.status(200).json({ message: 'Tarea eliminada' });
    } catch (err) {
        console.error('Error al eliminar la tarea:', err); // Added console.error for better debugging
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};

// Marcar una tarea como completada/incompleta (PATCH)
const toggleTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the task, ensuring it belongs to the authenticated user
        const task = await Task.findOne({ _id: id, userId: req.user.userId }); // <--- ADDED userId check

        if (!task) {
            // Changed error message to be more specific (not found OR not authorized)
            return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para actualizarla.' });
        }

        task.completed = !task.completed;
        await task.save();

        // Optional: Populate the category after updating for the response
        const populatedTask = await Task.findById(task._id).populate('category', 'name');

        res.status(200).json(populatedTask); // <--- Respond with the populated task
    } catch (err) {
        console.error('Error al actualizar la tarea:', err); // Added console.error for better debugging
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    deleteTask,
    toggleTask
};