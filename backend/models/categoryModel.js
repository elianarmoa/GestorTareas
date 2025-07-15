// backend/models/categoryModel.js

const mongoose = require('mongoose');

// Define el esquema para el modelo de Categoría
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio.'], // Mensaje de error personalizado para 'required'
        unique: true, // Garantiza que cada categoría tenga un nombre único
        trim: true    // Elimina espacios en blanco al inicio y al final del nombre
    }
}, {
    timestamps: true // Añade automáticamente los campos 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('Category', categorySchema);