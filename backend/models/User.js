// backend/models/User.js

const mongoose = require('mongoose');

// Define el esquema para el modelo de Usuario
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio.'], // Mensaje de error personalizado
        unique: true, // Garantiza que cada nombre de usuario sea único
        trim: true    // Elimina espacios en blanco al inicio y al final
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'] // Mensaje de error personalizado
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Restringe los valores permitidos a 'user' o 'admin'
        default: 'user' // Asigna 'user' como rol por defecto a los nuevos usuarios
    }
}, {
    timestamps: true // Añade automáticamente los campos 'createdAt' y 'updatedAt' para seguimiento
});

// Exporta el modelo 'User' para su uso en los controladores y otros módulos
module.exports = mongoose.model('User', userSchema);