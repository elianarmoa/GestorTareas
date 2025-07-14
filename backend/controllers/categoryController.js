// backend/controllers/categoryController.js

const Category = require('../models/categoryModel'); 

// --- Crear una nueva categoría ---
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido.' });
        }

        // Convertir el nombre a minúsculas y quitar espacios extra para evitar duplicados por case/trim
        const normalizedName = name.toLowerCase().trim();

        // Verificar si la categoría ya existe (insensible a mayúsculas/minúsculas y espacios)
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

// --- Obtener todas las categorías ---
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las categorías.' });
    }
};

// --- Actualizar una categoría por ID ---
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El nuevo nombre de la categoría es requerido.' });
        }

        const normalizedName = name.toLowerCase().trim();

        // Opcional: Verificar si el nuevo nombre ya existe en otra categoría
        const existingCategory = await Category.findOne({ name: normalizedName });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(409).json({ message: 'Ya existe otra categoría con ese nombre.' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: normalizedName },
            { new: true, runValidators: true } // 'new: true' para devolver el documento actualizado, 'runValidators' para ejecutar las validaciones del esquema
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

// --- Eliminar una categoría por ID ---
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada.' });
        }

        // CONSIDERACIÓN IMPORTANTE: Si eliminas una categoría, las tareas que la referencian
        // quedarán con un ID de categoría inválido (o nulo, si tu modelo lo permite).
        // Podrías añadir lógica aquí para:
        // 1. Advertir si hay tareas asociadas.
        // 2. Desvincular tareas (establecer su categoría a null/undefined).
        // 3. Eliminar tareas asociadas (¡CUIDADO con esto!).
        // Por simplicidad, aquí solo la elimina.

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