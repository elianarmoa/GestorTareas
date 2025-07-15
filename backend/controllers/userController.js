// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Registra un nuevo usuario ---
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos.' });
        }

        // Verifica si el nombre de usuario ya está en uso para evitar duplicados.
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
        }

        // Hashea la contraseña antes de guardarla en la base de datos para seguridad.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuevo usuario con la contraseña hasheada.
        // El rol por defecto ('user') se define en el esquema del modelo User.
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (err) {
        console.error("Error en el registro de usuario:", err); // Log para depuración
        res.status(500).json({ error: 'Error interno del servidor durante el registro.' });
    }
};

// --- Inicia sesión de usuario ---
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Nombre de usuario y contraseña son requeridos.' });
        }

        // Busca el usuario por su nombre de usuario.
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas.' }); // Mensaje genérico por seguridad
        }

        // Compara la contraseña proporcionada con la contraseña hasheada en la base de datos.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas.' }); // Mensaje genérico por seguridad
        }

        // Genera un token JWT incluyendo el ID, nombre de usuario y **rol** del usuario.
        // El rol es crucial para la autorización basada en roles en el middleware.
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso.', token, role: user.role }); // Incluye el rol en la respuesta
    } catch (err) {
        console.error("Error en el inicio de sesión:", err); // Log para depuración
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
    }
};

// --- Obtiene todos los usuarios (requiere rol de administrador) ---
const getAllUsers = async (req, res) => {
    try {
        // Esta ruta está protegida por `roleMiddleware` que asegura que `req.user.role` sea 'admin'.
        // Se excluye el campo 'password' de los resultados por motivos de seguridad.
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error("Error al obtener usuarios:", err); // Log para depuración
        res.status(500).json({ error: 'Error interno del servidor al obtener usuarios.' });
    }
};

// Exporta todas las funciones del controlador
module.exports = {
    registerUser,
    loginUser,
    getAllUsers
};