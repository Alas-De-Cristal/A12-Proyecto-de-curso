const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['Admin', 'Voluntario'],
        default: 'Voluntario'
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

// Esta línea es vital para evitar errores de "OverwriteModelError" al reiniciar el servidor
module.exports = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);