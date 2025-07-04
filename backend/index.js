const express = require('express');
const mongoose = require('mongoose'); // Mongoose para la conexión a MongoDB
const cors = require('cors'); // Para manejar CORS
require('dotenv').config(); // Carga las variables de entorno desde .env

// Importaciones específicas para Swagger UI
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json'); // <<--- ¡Correcto! Importa tu JSON

// Importamos las rutas
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Importamos el middleware de manejo de errores
const errorHandler = require('./middlewares/errorHandler'); // ✅ importamos el middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors()); // Habilita CORS
app.use(express.json()); // Para parsear cuerpos de solicitud JSON

// Rutas de la API
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// --- Configuración y Servicio de la Documentación de Swagger UI ---
// Estás usando '/public-api', lo cual es válido.
// La URL para acceder será: http://localhost:3000/public-api
app.use('/public-api', swaggerUI.serve, swaggerUI.setup(swaggerDoc));


// Middleware de errores (siempre debe ser el último middleware)
app.use(errorHandler);

// --- Conexión a MongoDB e Inicio del Servidor ---
// Tu método actual de conexión e inicio es perfectamente funcional.
// Solo necesitas eliminar las opciones deprecadas de mongoose.connect().
mongoose.connect(process.env.MONGO_URI, {

})
.then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        // Mensaje actualizado para reflejar la URL de Swagger
        console.log(`📚 Documentación de Swagger disponible en http://localhost:${PORT}/public-api`);
    });
})
.catch(err => {
    console.error('❌ Error al conectar con MongoDB:', err);
    process.exit(1); // Salir del proceso si la conexión a la DB falla
});