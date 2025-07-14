// backend/index.js

const express = require('express');
const mongoose = require('mongoose'); // Mongoose para la conexión a MongoDB
const cors = require('cors'); // Para manejar CORS
require('dotenv').config(); // Carga las variables de entorno desde .env

// Importaciones específicas para Swagger UI
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

// Importamos las rutas
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // <--- ¡Añade esta línea!

// Importamos el middleware de manejo de errores
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes); // <--- ¡Añade esta línea para las rutas de categorías!

// Configuración y Servicio de la Documentación de Swagger UI
app.use('/public-api', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Middleware de errores (siempre debe ser el último middleware)
app.use(errorHandler);

// Conexión a MongoDB e Inicio del Servidor
mongoose.connect(process.env.MONGO_URI, {})
.then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📚 Documentación de Swagger disponible en http://localhost:${PORT}/public-api`);
    });
})
.catch(err => {
    console.error('❌ Error al conectar con MongoDB:', err);
    process.exit(1);
});