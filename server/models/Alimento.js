const mongoose = require('mongoose');

const AlimentoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre del alimento es obligatorio'],
    trim: true
  },

  categoria: { 
    type: String, 
    required: [true, 'La categoría es obligatoria'],
    trim: true
  },

  cantidad: { 
    type: Number, 
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  },

  fechaVencimiento: { 
    type: Date, 
    required: [true, 'La fecha de vencimiento es obligatoria']
  },

  // ✅ DONANTE REAL
  nombreDonante: {
    type: String,
    default: 'DONANTE ANÓNIMO'
  },

  donanteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },

  fechaIngreso: { 
    type: Date, 
    default: Date.now
  }
});

module.exports = mongoose.model('Alimento', AlimentoSchema);
