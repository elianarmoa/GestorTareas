// backend/controllers/categoryController.js

const Category = require('../models/categoryModel'); 

// --- Crea una nueva categoría ---
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido.' });
        }
        // Normaliza el nombre solo para eliminar espacios en blanco al inicio/final,
        // pero mantiene la capitalización original.
        const trimmedName = name.trim(); 

        // Verifica si ya existe una categoría con el nombre normalizado (insensible a mayúsculas/minúsculas para la verificación)
        // Usamos una expresión regular para buscar de forma insensible a mayúsculas/minúsculas para la unicidad,
        // pero guardamos el nombre con la capitalización original.
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
        if (existingCategory) {
            return res.status(409).json({ message: 'La categoría ya existe.' });
        }

        // Guarda la categoría con el nombre tal cual fue ingresado (después de trim)
        const newCategory = new Category({ name: trimmedName });
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

        const trimmedName = name.trim();

        // Evita que se actualice una categoría con un nombre que ya existe en otra categoría.
        // Usamos una expresión regular para buscar de forma insensible a mayúsculas/minúsculas para la unicidad,
        // pero guardamos el nombre con la capitalización original.
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(409).json({ message: 'Ya existe otra categoría con ese nombre.' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name: trimmedName }, // Guarda el nombre con la capitalización original
            { new: true, runValidators: true }
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

        res.status(200).json({ message: 'Tarea eliminada exitosamente.' });
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
