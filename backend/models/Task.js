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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { // <-- ¡Aquí van las opciones del esquema!
  timestamps: true // agrega automáticamente createdAt y updatedAt
});

// Exportamos el modelo para usarlo en controladores
module.exports = mongoose.model('Task', taskSchema);