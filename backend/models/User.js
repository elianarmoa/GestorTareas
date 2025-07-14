// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String,
        enum: ['user', 'admin'], // Define los roles posibles
        default: 'user' // Establece 'user' como rol por defecto para nuevos registros
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);