const Task = require('../models/Task'); // Importa el modelo de Tarea

/**
 * @desc    Obtener todas las tareas del usuario autenticado con paginación y búsqueda.
 * @route   GET /api/tasks
 * @access  Private
 * @param   {object} req - Objeto de solicitud de Express.
 * @param   {object} res - Objeto de respuesta de Express.
 * @returns {object} Un objeto JSON con las tareas, información de paginación y el total de tareas.
 */
const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.userId; // ID del usuario autenticado obtenido del middleware
        
        // Parámetros de paginación
        const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        const limit = parseInt(req.query.limit) || 10; // Elementos por página, por defecto 10
        const skip = (page - 1) * limit; // Calcula el número de documentos a saltar

        // Parámetro de búsqueda
        const searchTerm = req.query.search || ''; // Término de búsqueda, por defecto cadena vacía

        // Construir el objeto de consulta para Mongoose
        let query = { userId: userId };

        // Añadir filtro de búsqueda por título si existe un searchTerm
        if (searchTerm) {
            query.title = { $regex: searchTerm, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
        }

        // Obtener las tareas paginadas y filtradas
        const tasks = await Task.find(query)
                                .populate('category', 'name') // Popula el campo 'category', seleccionando solo 'name'
                                .sort({ createdAt: -1 }) // Ordena las tareas por fecha de creación descendente
                                .skip(skip) // Salta los documentos para la paginación
                                .limit(limit); // Limita el número de documentos devueltos

        // Obtener el conteo total de tareas que coinciden con el filtro (para la paginación)
        const totalTasks = await Task.countDocuments(query);
        const totalPages = Math.ceil(totalTasks / limit); // Calcula el número total de páginas

        // Envía la respuesta con las tareas y la información de paginación
        res.status(200).json({
            tasks,
            currentPage: page,
            totalPages,
            totalTasks
        });

    } catch (err) {
        console.error('Error al obtener las tareas paginadas:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener las tareas.' });
    }
};

/**
 * @desc    Crear una nueva tarea.
 * @route   POST /api/tasks
 * @access  Private
 * @param   {object} req - Objeto de solicitud de Express.
 * @param   {object} res - Objeto de respuesta de Express.
 * @returns {object} Un objeto JSON con la tarea recién creada y poblada.
 */
const createTask = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'El título es obligatorio.' });
        }

        const newTask = new Task({
            title: title.trim(),
            description: description,
            userId: req.user.userId,
            category: category
        });

        const savedTask = await newTask.save();

        const populatedTask = await Task.findById(savedTask._id).populate('category', 'name');

        res.status(201).json(populatedTask);
    } catch (err) {
        console.error('Error al crear la tarea:', err);
        // Manejo de error si la categoría no es un ID válido o no existe
        if (err.name === 'CastError' && err.path === 'category') {
            return res.status(400).json({ error: 'ID de categoría no válido.' });
        }
        res.status(500).json({ error: 'Error interno del servidor al crear la tarea.' });
    }
};

/**
 * @desc    Eliminar una tarea por ID.
 * @route   DELETE /api/tasks/:id
 * @access  Private
 * @param   {object} req - Objeto de solicitud de Express.
 * @param   {object} res - Objeto de respuesta de Express.
 * @returns {object} Un objeto JSON con un mensaje de éxito.
 */
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });

        if (!deletedTask) {
            return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para eliminarla.' });
        }
        res.status(200).json({ message: 'Tarea eliminada exitosamente.' });
    } catch (err) {
        console.error('Error al eliminar la tarea:', err);
        // Manejo de error si el ID no es válido
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ error: 'ID de tarea no válido.' });
        }
        res.status(500).json({ error: 'Error interno del servidor al eliminar la tarea.' });
    }
};

/**
 * @desc    Alternar estado de tarea (completada/incompleta).
 * @route   PATCH /api/tasks/:id
 * @access  Private
 * @param   {object} req - Objeto de solicitud de Express.
 * @param   {object} res - Objeto de respuesta de Express.
 * @returns {object} Un objeto JSON con la tarea actualizada y poblada.
 */
const toggleTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, userId: req.user.userId });

        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada o no tienes permiso para actualizarla.' });
        }

        task.completed = !task.completed;
        await task.save();

        const populatedTask = await Task.findById(task._id).populate('category', 'name');

        res.status(200).json(populatedTask);
    } catch (err) {
        console.error('Error al actualizar la tarea:', err);
        // Manejo de error si el ID no es válido
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ error: 'ID de tarea no válido.' });
        }
        res.status(500).json({ error: 'Error interno del servidor al actualizar la tarea.' });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    deleteTask,
    toggleTask
};