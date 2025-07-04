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

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
} catch (err) {
    res.status(500).json({ error: 'Error en el registro' });
}
};

module.exports = { registerUser };
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

    const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login exitoso', token });
} catch (err) {
    res.status(500).json({ error: 'Error en el login' });
}
};

module.exports = { registerUser, loginUser };
// Exportamos las funciones del controlador