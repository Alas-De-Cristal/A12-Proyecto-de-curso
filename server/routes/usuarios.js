const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// ============================
// POST → Registrar usuario
// ============================
router.post('/agregar', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
});

// ============================
// GET → Listar usuarios
// ============================
router.get('/lista', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
});

module.exports = router;

