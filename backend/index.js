const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
// Importamos las rutas y el middleware de manejo de errores

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes'); // Importamos las rutas de usuarios
const errorHandler = require('./middlewares/errorHandler'); // ✅ importamos el middleware

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
// Documentación pública de la API (solo GET)
app.use('/public-api', swaggerUI.serve, swaggerUI.setup(swaggerDoc));


// Middleware de errores (se ejecuta solo si algo falla en una ruta)
app.use(errorHandler); // ✅ lo agregamos acá

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => {
console.log('✅ Conectado a MongoDB');
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
})
.catch(err => {
console.error('❌ Error al conectar con MongoDB:', err);
});
