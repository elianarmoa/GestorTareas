// backend/models/Task.js

const mongoose = require('mongoose');

// Define el esquema para el modelo de Tarea
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título de la tarea es obligatorio.'], // Mensaje de error personalizado
        trim: true // Elimina espacios en blanco al inicio y al final
    },
    description: { // Asumiendo que has añadido un campo de descripción en tu modelo de Task
        type: String,
        trim: true,
        required: false // Opcional, dependiendo de tus requisitos
    },
    completed: {
        type: Boolean,
        default: false // Las tareas se crean como no completadas por defecto
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Establece una relación con el modelo 'User'
        required: true // Indica que cada tarea debe estar asociada a un usuario
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Establece una relación con el modelo 'Category'
        required: false // Una tarea puede existir sin categoría asignada inicialmente
    }
}, {
    timestamps: true // Añade automáticamente los campos 'createdAt' y 'updatedAt' para seguimiento
});

// Exporta el modelo 'Task' para su uso en los controladores
module.exports = mongoose.model('Task', taskSchema);