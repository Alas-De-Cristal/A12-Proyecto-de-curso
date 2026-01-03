// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔥 Iniciando servidor FoodConnect...');

const app = express();

// ========================
// Middlewares
// ========================
app.use(cors());
app.use(express.json());

// ========================
// Verificar variable de entorno
// ========================
if (!process.env.MONGO_URI) {
    console.error('❌ ERROR: MONGO_URI no está definida en el archivo .env');
    process.exit(1);
}

// ========================
// Conexión a MongoDB
// ========================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB localmente'))
    .catch(err => {
        console.error('❌ Error al conectar a MongoDB:', err.message);
        process.exit(1);
    });

// ========================
// Rutas del sistema
// ========================
const rutasAlimentos = require('./routes/alimentos');
const rutasUsuarios = require('./routes/usuarios');

app.use('/api/alimentos', rutasAlimentos);
app.use('/api/usuarios', rutasUsuarios);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de FoodConnect funcionando correctamente');
});

// ========================
// Servidor
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
