// backend/models/categoryModel.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya categorías con el mismo nombre
        trim: true
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Category', categorySchema);