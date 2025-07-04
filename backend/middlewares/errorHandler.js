// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
console.error('🛑 Error:', err.message || err);
res.status(500).json({ error: 'Error del servidor, intentá más tarde.' });
};

module.exports = errorHandler;
