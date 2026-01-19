const mongoose = require('mongoose');

const DonanteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    trim: true,
    lowercase: true
    // 👈 NO unique
  },
  anonimo: {
    type: Boolean,
    default: false
  },
  frecuente: {
    type: Boolean,
    default: false
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.models.Donante ||
  mongoose.model('Donante', DonanteSchema);

