const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const URI = 'mongodb://127.0.0.1:27017/foodconnect_db'; // Revisa si es 27010 o 27017

async function crearAdmin() {
  try {
    console.log("Intentando conectar a:", URI);
    
    // Conectamos con un tiempo de espera definido
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 5000 
    });
    
    console.log("✅ Conexión exitosa a MongoDB");

    const UserSchema = new mongoose.Schema({
      nombre: String,
      correo: String,
      password: { type: String, required: true },
      rol: String
    });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Encriptamos la clave
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234', salt);

    console.log("Limpiando colección de usuarios...");
    await User.deleteMany({}); 

    const admin = new User({
      nombre: 'Director Admin',
      correo: 'admin@foodconnect.com',
      password: hashedPassword,
      rol: 'Admin'
    });

    await admin.save();
    console.log("⭐⭐⭐ Administrador creado: admin@foodconnect.com / 1234");
    
  } catch (error) {
    console.error("❌ ERROR CRÍTICO:");
    console.error(error.message);
    console.log("\nTIP: Revisa si MongoDB está encendido o si el puerto 27010 es correcto.");
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

crearAdmin();