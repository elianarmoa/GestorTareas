// backend/controllers/userController.js

const User = require('../models/User'); // Importa el modelo de usuario para interactuar con la base de datos
const bcrypt = require('bcryptjs'); // Librería para hashear contraseñas de forma segura
const jwt = require('jsonwebtoken'); // Librería para generar y verificar JSON Web Tokens (JWT)

/**
 * @desc Registra un nuevo usuario en el sistema.
 * @route POST /api/users/register
 * @access Public
 * @param {object} req - Objeto de solicitud de Express, contiene `username` y `password` en el cuerpo.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} JSON con un mensaje de éxito o error.
 */
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar que el nombre de usuario y la contraseña no estén vacíos
        if (!username || !password) {
            return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos.' });
        }

        // Verificar si el nombre de usuario ya existe en la base de datos
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
        }

        // Hashear la contraseña antes de guardarla para mayor seguridad.
        // El factor de sal (salt factor) de 10 es un buen equilibrio entre seguridad y rendimiento.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear una nueva instancia de usuario con la contraseña hasheada.
        // El rol por defecto ('user') se asigna en el esquema del modelo User.
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save(); // Guardar el nuevo usuario en la base de datos

        // Enviar una respuesta de éxito al cliente
        res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (err) {
        // Capturar y loguear cualquier error del servidor durante el registro
        console.error("Error en el registro de usuario:", err);
        res.status(500).json({ error: 'Error interno del servidor durante el registro.' });
    }
};

/**
 * @desc Autentica un usuario y genera un token JWT para la sesión.
 * @route POST /api/users/login
 * @access Public
 * @param {object} req - Objeto de solicitud de Express, contiene `username` y `password` en el cuerpo.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} JSON con un mensaje de éxito, el token JWT y el rol del usuario.
 */
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar que el nombre de usuario y la contraseña no estén vacíos
        if (!username || !password) {
            return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos.' });
        }

        // Buscar el usuario en la base de datos por su nombre de usuario
        const user = await User.findOne({ username });
        if (!user) {
            // Enviar un mensaje genérico por seguridad para no revelar si el usuario existe o no
            return res.status(400).json({ error: 'Credenciales inválidas.' });
        }

        // Comparar la contraseña proporcionada con la contraseña hasheada almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Enviar un mensaje genérico por seguridad si la contraseña no coincide
            return res.status(400).json({ error: 'Credenciales inválidas.' });
        }

        // Generar un token JWT (JSON Web Token)
        // El payload incluye el ID del usuario, username y su rol, información crucial para la autenticación y autorización.
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET, // Secreto para firmar el token, debe ser una variable de entorno segura
            { expiresIn: '1h' } // El token expirará en 1 hora, lo que mejora la seguridad
        );

        // Enviar una respuesta de éxito al cliente, incluyendo el token y el rol del usuario
        res.status(200).json({ message: 'Inicio de sesión exitoso.', token, role: user.role });
    } catch (err) {
        // Capturar y loguear cualquier error del servidor durante el inicio de sesión
        console.error("Error en el inicio de sesión:", err);
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
    }
};

/**
 * @desc Obtiene una lista de todos los usuarios registrados en el sistema.
 * @route GET /api/users
 * @access Private (Requiere rol de 'admin')
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {object} JSON con un array de usuarios (sin sus contraseñas).
 */
const getAllUsers = async (req, res) => {
    try {
        // Esta ruta está protegida por un middleware de autorización (roleMiddleware)
        // que verifica que `req.user.role` sea 'admin' antes de ejecutar esta función.
        // Se excluye explícitamente el campo 'password' de los resultados por motivos de seguridad.
        const users = await User.find().select('-password');
        res.status(200).json(users); // Enviar la lista de usuarios
    } catch (err) {
        // Capturar y loguear cualquier error del servidor
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: 'Error interno del servidor al obtener usuarios.' });
    }
};

// Exportar todas las funciones del controlador para ser usadas en las rutas
module.exports = {
    registerUser,
    loginUser,
    getAllUsers
};