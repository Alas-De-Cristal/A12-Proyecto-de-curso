const mongoose = require("mongoose");

const BeneficiarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true },
  ingresos: String,
  numHijos: Number,
  adultosMayores: String,
  discapacidad: String,

  estado: {
    type: String,
    enum: ["solicitado", "aceptado", "rechazado", "entregado"],
    default: "solicitado"
  },

  motivo: { type: String, default: "" },

  fechaRegistro: { type: Date, default: Date.now },
  fechaEntrega: Date
});

module.exports = mongoose.model("Beneficiario", BeneficiarioSchema);
