// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno

// Importaciones para la documentación de la API con Swagger UI
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

// Importación de módulos de rutas
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Importación del middleware centralizado de manejo de errores
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globales ---
app.use(cors()); // Habilita Cross-Origin Resource Sharing
app.use(express.json()); // Permite a Express parsear cuerpos de solicitud JSON

// --- Rutas de la API ---
// Monta los routers en sus respectivos prefijos de ruta
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// --- Configuración y Servicio de la Documentación de Swagger UI ---
// Sirve la interfaz de usuario de Swagger para la documentación de la API.
// Accesible en: http://localhost:3000/public-api
app.use('/public-api', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// --- Middleware de Manejo de Errores ---
// Este middleware debe ser el ÚLTIMO en la cadena para capturar todos los errores.
app.use(errorHandler);

// --- Conexión a MongoDB e Inicio del Servidor ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📚 Documentación de Swagger disponible en http://localhost:${PORT}/public-api`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar con MongoDB:', err);
        process.exit(1); // Sale del proceso con un error si la conexión a la DB falla
    });