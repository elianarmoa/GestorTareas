// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: 'Nombre de usuario y contraseña requeridos' });

        const userExists = await User.findOne({ username });
        if (userExists)
            return res.status(400).json({ error: 'El usuario ya existe' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Al crear un nuevo usuario, el 'role' por defecto es 'user' (definido en el modelo User.js)
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        console.error("Error en el registro:", err); // Agrega log para depuración
        res.status(500).json({ error: 'Error en el registro' });
    }
};

// Iniciar sesión de usuario
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: 'Nombre de usuario y contraseña requeridos' });

        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ error: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: 'Contraseña incorrecta' });

        // GENERACIÓN DEL TOKEN: ¡Asegúrate de incluir el 'role' del usuario aquí!
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role }, // <-- ¡IMPORTANTE! Añadido 'role: user.role'
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login exitoso', token });
    } catch (err) {
        console.error("Error en el login:", err); // Agrega log para depuración
        res.status(500).json({ error: 'Error en el login' });
    }
};

// NUEVA FUNCIÓN: Obtener todos los usuarios (protegida para administradores)
const getAllUsers = async (req, res) => {
    try {
        // En este punto, el `roleMiddleware` ya habrá verificado que `req.user.role` es 'admin'.
        // No necesitamos filtrar por el ID del usuario logueado, ya que el objetivo es listar TODOS.
        // Seleccionamos todos los usuarios y excluimos el campo 'password' por seguridad.
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error("Error al obtener usuarios:", err); // Agrega log para depuración
        res.status(500).json({ error: 'Error del servidor al obtener usuarios.' });
    }
};

// Exportamos todas las funciones del controlador
module.exports = {
    registerUser,
    loginUser,
    getAllUsers 
};