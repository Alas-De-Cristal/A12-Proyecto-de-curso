const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Beneficiario = require("./models/Beneficiario");

require('dotenv').config();

// ========================
// IMPORTACIÓN DE MODELOS
// ========================
const Donante = require('./models/Donante');
const Alimento = require('./models/Alimento');
const Usuario = require('./models/Usuario');

const app = express();

// ========================
// MIDDLEWARES
// ========================
app.use(cors());
app.use(express.json());

// ========================
// CONEXIÓN A MONGODB
// ========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err.message));

// ========================
// AUTH - REGISTRO
// ========================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const correoLimpio = correo.toLowerCase().trim();

    const existe = await Usuario.findOne({ correo: correoLimpio });
    if (existe) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    let rolFinal = "Donante";
    if (correoLimpio === "marthatayan1353@utm.edu.ec") {
      rolFinal = "Admin";
    } else if (correoLimpio.endsWith("@utm.edu.ec")) {
      rolFinal = "Voluntario";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      correo: correoLimpio,
      password: hashedPassword,
      rol: rolFinal
    });

    await nuevoUsuario.save();
    res.json({ mensaje: `Usuario creado como ${rolFinal}`, rol: rolFinal });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// ========================
// AUTH - LOGIN
// ========================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo: correo.toLowerCase().trim() });

    if (!usuario) {
      return res.status(400).json({ error: 'Correo no registrado' });
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    res.json({
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
});

// ========================
// USUARIOS Y DONANTES
// ========================
app.get('/api/usuarios/lista', async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, '-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener usuarios' });
  }
});

app.get('/api/donantes', async (req, res) => {
  try {
    const donantes = await Donante.find().sort({ fechaRegistro: -1 });
    res.json(donantes);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener donantes' });
  }
});

// ========================
// INVENTARIO / ALIMENTOS
// ========================
app.get('/api/alimentos', async (req, res) => {
  try {
    const lista = await Alimento.find().sort({ fechaIngreso: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
});

// ========================
// DONACIONES
// ========================

// Obtener donaciones
app.get('/api/donaciones', async (req, res) => {
  try {
    const lista = await Alimento.find().sort({ fechaIngreso: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener donaciones' });
  }
});

// Crear donación ✅ (RUTA ÚNICA)
app.post('/api/donaciones', async (req, res) => {
  try {
    console.log("🔥 BODY RECIBIDO:", req.body);

    const {
      nombre,
      categoria,
      cantidad,
      fechaVencimiento,
      nombreDonante,
      donanteId
    } = req.body;

    const nuevaDonacion = new Alimento({
      nombre,
      categoria,
      cantidad: Number(cantidad),
      nombreDonante: nombreDonante ?? "DONANTE ANÓNIMO",
      donanteId: donanteId ?? null,
      fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : null,
      fechaIngreso: new Date()
    });

    await nuevaDonacion.save();
    res.status(201).json(nuevaDonacion);
  } catch (error) {
    console.error("❌ Error creando donación:", error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar donación
app.put('/api/donaciones/:id', async (req, res) => {
  try {
    const actualizado = await Alimento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar la donación' });
  }
});

// ========================
// RUTA BASE
// ========================
app.get('/', (req, res) => {
  res.send('Servidor FoodConnect 🚀');
});

// ========================
// BENEFICIARIOS
// ========================

// 1️⃣ Obtener beneficiarios
app.get("/api/beneficiarios", async (req, res) => {
  try {
    const lista = await Beneficiario.find().sort({ fechaRegistro: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener beneficiarios" });
  }
});

// 2️⃣ Crear solicitud
app.post("/api/beneficiarios", async (req, res) => {
  try {
    const nuevo = new Beneficiario(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear beneficiario" });
  }
});

// 3️⃣ Cambiar estado (Aceptar / Rechazar / Entregar)
app.put("/api/beneficiarios/:id", async (req, res) => {
  try {
    const { estado, motivo } = req.body;

    const actualizado = await Beneficiario.findByIdAndUpdate(
      req.params.id,
      {
        estado,
        motivo: motivo || "",
        fechaEntrega: estado === "entregado" ? new Date() : null
      },
      { new: true }
    );

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar beneficiario" });
  }
});

// ========================
// SERVER
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
