// backend/controllers/categoryController.js

const Category = require('../models/categoryModel'); // Asegurarse de que la ruta al modelo sea correcta

// --- Crea una nueva categoría ---
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido.' });
        }

        // Normaliza el nombre para evitar duplicados por diferencias de mayúsculas/minúsculas o espacios.
        const normalizedName = name.toLowerCase().trim();

        // Verifica si ya existe una categoría con el nombre normalizado.
        const existingCategory = await Category.findOne({ name: normalizedName });
        if (existingCategory) {
            return res.status(409).json({ message: 'La categoría ya existe.' });
        }

        const newCategory = new Category({ name: normalizedName });
        await newCategory.save();

        res.status(201).json({ message: 'Categoría creada exitosamente.', category: newCategory });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la categoría.' });
    }
};

// --- Obtiene todas las categorías ---
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las categorías.' });
    }
};

// --- Actualiza una categoría por ID ---
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El nuevo nombre de la categoría es requerido.' });
        }

        const normalizedName = name.toLowerCase().trim();

        // Evita que se actualice una categoría con un nombre que ya existe en otra categoría.
        const existingCategory = await Category.findOne({ name: normalizedName });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(409).json({ message: 'Ya existe otra categoría con ese nombre.' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: normalizedName },
            { new: true, runValidators: true } // 'new: true' para devolver el documento actualizado; 'runValidators' asegura que se apliquen las reglas del esquema.
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        res.status(200).json({ message: 'Categoría actualizada exitosamente.', category: updatedCategory });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la categoría.' });
    }
};

// --- Elimina una categoría por ID ---
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // NOTA: Al eliminar una categoría, las tareas que la referencian quedarán
        // con una referencia inválida (o nula). En una aplicación más compleja,
        // se podría considerar:
        // - Desvincular automáticamente las tareas (ej. CategoryId = null).
        // - Prevenir la eliminación si hay tareas asociadas.
        // - Eliminar en cascada las tareas (usar con precaución).
        // Para este proyecto, se asume que el frontend o el usuario manejará la inconsistencia
        // o que las tareas no se eliminarán en cascada.

        res.status(200).json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la categoría.' });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};