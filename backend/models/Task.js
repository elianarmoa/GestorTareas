// backend/models/Task.js

const mongoose = require('mongoose');

// Definimos el esquema del documento (estructura de una tarea)
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // elimina espacios al principio y final
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: { // Este es el ID del usuario que creó la tarea
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de User
        required: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Referencia al modelo de Category (que creamos en categoryModel.js)
        required: false // Lo hacemos opcional por ahora. Si una tarea siempre debe tener categoría, cámbialo a true.
    }
}, {
    timestamps: true // agrega automáticamente createdAt y updatedAt
});

// Exportamos el modelo para usarlo en controladores
module.exports = mongoose.model('Task', taskSchema);