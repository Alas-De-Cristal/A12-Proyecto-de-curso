import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  // --- ESTADOS ---
  const [esRegistro, setEsRegistro] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    password: "",
    telefono: "",
    organizacion: "",
    ubicacion: "",
    lat: null,
    lon: null,
    rol: "Voluntario",
  });

  // --- ESTILOS ---
  const estiloInput = {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255, 255, 255, 0.9)",
    outline: "none",
    fontSize: "14px",
    color: "#1e293b",
    boxSizing: "border-box",
  };

  // --- FUNCIÓN PRINCIPAL ---
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (esRegistro) {
      // --- Lógica de Registro ---
      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regex.test(datos.password)) {
        setCargando(false);
        return alert("❌ La contraseña debe ser robusta (8+ caracteres, Mayúscula, Número y Especial).");
      }

      try {
        const rolFinal = datos.correo === "mtayan1353@utm.edu.ec" ? "Admin" : "Voluntario";

        await axios.post("http://localhost:5000/api/auth/register", {
          ...datos,
          correo: datos.correo.toLowerCase().trim(),
          rol: rolFinal,
        });

        alert(`✅ Registro exitoso. Ahora puedes iniciar sesión como ${rolFinal}.`);
        setEsRegistro(false);
      } catch (error) {
        console.error("Error en registro:", error.response?.data || error.message);
        alert("❌ Error en el registro: " + (error.response?.data?.error || "Error del servidor"));
      }
    } else {
      // --- Lógica de Login ---
      try {
        const respuesta = await axios.post("http://localhost:5000/api/auth/login", {
          correo: datos.correo.toLowerCase().trim(),
          password: datos.password,
        });

        // Si el servidor responde 200 OK
        if (respuesta.data && respuesta.data.id) {
          console.log("Login exitoso:", respuesta.data.nombre);
          
          // Guardar sesión en LocalStorage
          localStorage.setItem("usuarioFoodConnect", JSON.stringify(respuesta.data));
          
          // Notificar a la App que el usuario entró
          onLogin(respuesta.data);
        }
      } catch (error) {
        console.error("Error en login:", error.response?.data || error.message);
        
        // Obtener el mensaje exacto del servidor (ej: "Contraseña incorrecta")
        const mensajeError = error.response?.data?.error || "Credenciales incorrectas";
        alert("❌ " + mensajeError);
      }
    }

    setCargando(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay oscuro para legibilidad */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(12px)",
        }}
      ></div>

      <form
        onSubmit={manejarEnvio}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: esRegistro ? "550px" : "400px",
          padding: "40px",
          borderRadius: "30px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
          textAlign: "center",
          transition: "max-width 0.4s ease",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>
          {esRegistro ? "📋" : "🔐"}
        </div>
        
        <h1 style={{ color: "white", margin: 0, fontSize: "28px", fontWeight: 800 }}>
          FoodConnect
        </h1>
        
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "25px", fontSize: "14px" }}>
          {esRegistro ? "Completa tu perfil de colaborador" : "Ingresa a tu panel de gestión"}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px", textAlign: "left" }}>
          {esRegistro && (
            <>
              <input
                type="text"
                placeholder="Nombre completo"
                required
                style={estiloInput}
                value={datos.nombre}
                onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Teléfono / WhatsApp"
                required
                style={estiloInput}
                value={datos.telefono}
                onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
              />
              <input
                type="text"
                placeholder="Organización / ONG"
                style={estiloInput}
                value={datos.organizacion}
                onChange={(e) => setDatos({ ...datos, organizacion: e.target.value })}
              />
              <input
                type="text"
                placeholder="Ciudad / Sede"
                style={estiloInput}
                value={datos.ubicacion}
                onChange={(e) => setDatos({ ...datos, ubicacion: e.target.value })}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Correo institucional"
            required
            style={estiloInput}
            value={datos.correo}
            onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
          />

          <div style={{ position: "relative" }}>
            <input
              type={verPassword ? "text" : "password"}
              placeholder="Contraseña"
              required
              style={estiloInput}
              value={datos.password}
              onChange={(e) => setDatos({ ...datos, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {verPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button 
            type="submit" 
            style={{
              ...estiloInput, 
              background: "#3b82f6", 
              color: "white", 
              fontWeight: "bold",
              cursor: cargando ? "not-allowed" : "pointer",
              marginTop: "10px"
            }} 
            disabled={cargando}
          >
            {cargando ? "PROCESANDO..." : esRegistro ? "FINALIZAR REGISTRO" : "INICIAR SESIÓN"}
          </button>

          <p
            onClick={() => setEsRegistro(!esRegistro)}
            style={{
              marginTop: "20px",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              textAlign: "center",
              textDecoration: "underline"
            }}
          >
            {esRegistro ? "¿Ya tienes cuenta? Inicia sesión" : "¿Eres nuevo? Crea una cuenta aquí"}
          </p>
        </div>
      </form>
    </div>
  );
}