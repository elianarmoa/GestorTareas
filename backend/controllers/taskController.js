const Task = require('../models/Task');

// Obtener todas las tareas
const getAllTasks = async (req, res) => {
try {
    const tasks = await Task.find({ userId: req.user.userId });
    // Filtramos las tareas por el ID del usuario autenticado
    res.status(200).json(tasks);
} catch (err) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
}
};

// Crear una nueva tarea
const createTask = async (req, res) => {
try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const newTask = new Task({ title: title.trim(), userId: req.user.userId });
    // Asignamos el ID del usuario autenticado a la tarea
    // (req.user.userId debe ser el ID del usuario autenticado, asegurate de
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
} catch (err) {
    res.status(500).json({ error: 'No se pudo crear la tarea' });
}
};


// Eliminar una tarea por ID
const deleteTask = async (req, res) => {
try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.status(200).json({ message: 'Tarea eliminada' });
} catch (err) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
}
};

// Marcar una tarea como completada/incompleta (PATCH)
const toggleTask = async (req, res) => {
try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    task.completed = !task.completed;
    await task.save();
    res.status(200).json(task);
} catch (err) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
}
};

module.exports = {
getAllTasks,
createTask,
deleteTask,
toggleTask
};
