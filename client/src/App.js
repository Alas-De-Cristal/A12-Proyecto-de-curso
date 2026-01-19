import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Login from "./pages/Login.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";

function App() {
  const [listaDonantes, setListaDonantes] = useState([]);
  // ==================== LOGIN ====================
  const [userLogged, setUserLogged] = useState(() => {
    const datos = localStorage.getItem("usuarioFoodConnect");
    return datos ? JSON.parse(datos) : null;
  });

  // Guardar sesión automáticamente
  useEffect(() => {
    if (userLogged) {
      localStorage.setItem("usuarioFoodConnect", JSON.stringify(userLogged));
    } else {
      localStorage.removeItem("usuarioFoodConnect");
    }
  }, [userLogged]);

  // ==================== UI GLOBAL ====================
  const [pantalla, setPantalla] = useState("usuarios");
  const [modoOscuro, setModoOscuro] = useState(false);
  const [idioma, setIdioma] = useState("es");
  const [inventario, setListaInventario] = useState([]);
  const [inventarioOriginal, setInventarioOriginal] = useState([]);
  // Estados para filtro y orden
const [filtroCategoria, setFiltroCategoria] = useState("");
const [orden, setOrden] = useState("asc");

// 🔹 Categorías únicas disponibles (después de tener inventario)
const categoriasDisponibles = [...new Set(inventario.map(item => item.categoria))];


  useEffect(() => {
    const cargarDonaciones = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donaciones");
        const data = await res.json();
        setListaInventario(data);       
        setInventarioOriginal(data);    

      } catch (error) {
        console.error("Error cargando donaciones:", error);
      }
    };

    cargarDonaciones();
  }, []);

  const toggleIdioma = () => setIdioma(prev => (prev === "es" ? "en" : "es"));

  // ==================== MODALES ====================
  const [modalAbierto, setModalAbierto] = useState(false);
  const [contenidoModal, setContenidoModal] = useState({ titulo: "", cuerpo: "" });
  const [confirmacionEliminar, setConfirmacionEliminar] = useState("");

  // ==================== USUARIOS ====================
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", correo: "", rol: "Donante" });
  const [alimento, setAlimento] = useState({ nombre: '', categoria: 'Perecedero', cantidad: '', unidad: 'kg' });

  const guardarUsuario = async (e) => {
    if (e) e.preventDefault();

    let rolAsignado = "Donante";
    const correoLimpio = usuario.correo.toLowerCase().trim();

    if (correoLimpio === "marthatayan1353@utm.edu.ec") {
      rolAsignado = "Admin";
    } else if (correoLimpio.endsWith("@utm.edu.ec")) {
      rolAsignado = "Voluntario";
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        nombre: usuario.nombre,
        correo: correoLimpio,
        rol: rolAsignado,
        password: "123"
      });

      if (res.status === 200 || res.status === 201) {
        alert(`✅ Registrado con éxito como: ${rolAsignado}`);
        setUsuario({ nombre: "", correo: "", rol: "Donante" });
        obtenerDatos();
      }
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      const mensajeError = error.response?.data?.error || "Error de conexión con el servidor";
      alert("Hubo un problema: " + mensajeError);
    }
  };

  const guardarAlimento = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/alimentos", alimento);
      if (res.status === 200) {
        alert("✅ Suministro registrado en inventario");
        setAlimento({ nombre: '', categoria: 'Perecedero', cantidad: '', unidad: 'kg' });
        obtenerInventario();
      }
    } catch (error) {
      alert("❌ Error al registrar alimento");
    }
  };

  const obtenerInventario = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/alimentos/lista");
      setListaInventario(res.data);
    } catch (error) {
      console.error("Error al cargar inventario");
    }
  };

  const eliminarUsuario = (id) => setListaUsuarios(listaUsuarios.filter(u => u.id !== id));

  // ==================== DONACIONES ====================
  const [donacion, setDonacion] = useState({ nombre: "", categoria: "", cantidad: "", nombreDonante: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [nombreConfirmado, setNombreConfirmado] = useState("");
  const [nombreDinamico, setNombreDinamico] = useState("");

  const guardarDonacion = () => {
    if (!donacion.nombreDonante) {
      alert("Debe ingresar el nombre del donante o seleccionar 'Donar como Anónimo'");
      return;
    }

    const nuevaDonacion = {
      ...donacion,
      fechaIngreso: new Date().toISOString()
    };

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId
      ? `http://localhost:5000/api/donaciones/${editandoId}`
      : "http://localhost:5000/api/donaciones";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaDonacion)
    })
      .then(res => res.json())
      .then(data => {
        if (editandoId) {
          setListaInventario(prev => prev.map(d => d._id === editandoId ? data : d));
          setEditandoId(null);
        } else {
          setListaInventario(prev => [data, ...prev]);
        }

        setDonacion({
          nombreDonante: "",
          nombre: "",
          categoria: "",
          cantidad: "",
          unidadMedida: "u",
          fechaVencimiento: ""
        });
        setNombreDinamico("");
      })
      .catch(() => alert("❌ Error al guardar la donación"));
  };

  // ==================== INVENTARIO ====================
// Función para exportar Excel
const exportarExcel = () => {
  if (!inventario.length) {
    alert("No hay datos para exportar");
    return;
  }

  const hoja = XLSX.utils.json_to_sheet(
    inventario.map(item => ({
      Producto: item.nombre,
      Categoría: item.categoria,
      Cantidad: item.cantidad,
      Unidad: item.unidadMedida || 'u',
      Donante: item.nombreDonante || 'Anónimo',
      FechaIngreso: item.fechaRegistro ? new Date(item.fechaRegistro).toLocaleDateString() : '',
      FechaVencimiento: item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : ''
    }))
  );

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Inventario");

  const wbout = XLSX.write(libro, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `Inventario_${new Date().toLocaleDateString()}.xlsx`);
};

// Inventario filtrado y ordenado
const inventarioFiltrado = inventario
  .filter(item => filtroCategoria === "" || item.categoria === filtroCategoria)
  .sort((a, b) => {
    if (orden === 'nombre') return (a.nombre || "").localeCompare(b.nombre || "");
    if (orden === 'cantidad') return (b.cantidad || 0) - (a.cantidad || 0);
    if (orden === 'fechaVencimiento') return new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento);
    return 0;
  });

  // ==================== BENEFICIARIOS ====================
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [nuevoSol, setNuevoSol] = useState({});

  const evaluarSolicitante = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/beneficiarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoSol),
  });

  const data = await res.json();
  setBeneficiarios([data, ...beneficiarios]);
  setNuevoSol({});
};

  const cambiarEstadoBeneficiario = async (id, estado) => {
  let motivo = "";

  if (estado === "rechazado") {
    motivo = prompt(
      "Motivo del rechazo:\n- Datos falsos\n- Ingresos suficientes\n- Información incompleta"
    );
    if (!motivo) return;
  }

  const res = await fetch(`http://localhost:5000/api/beneficiarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado, motivo }),
  });

  const actualizado = await res.json();

  setBeneficiarios(
    beneficiarios.map(b => b._id === actualizado._id ? actualizado : b)
  );
};

  // ==================== COLAPSABLES ====================
  const [abiertoSol, setAbiertoSol] = useState(false);
  const [abiertoAce, setAbiertoAce] = useState(false);
  const [abiertoEnt, setAbiertoEnt] = useState(false);
  const [abiertoRech, setAbiertoRech] = useState(false);

  // ==================== REPORTES ====================
  const [dataSalidas, setDataSalidas] = useState([]);

  // ==================== DERIVADOS ====================
  const categoriasUnicas = [...new Set(inventario.map((item) => item.categoria))];

  const extraerIdDelCorreo = (correo) => correo.split("@")[0];

  const obtenerDatos = async () => {
    try {
      const resU = await axios.get("http://localhost:5000/api/usuarios/lista");
      const resD = await axios.get("http://localhost:5000/api/donantes"); 
      setListaUsuarios(resU.data || []);
      setListaDonantes(resD.data || []);
      console.log("✅ Usuarios cargados correctamente");
    } catch (error) {
      console.error("❌ Error en Usuarios:", error);
    }

    try {
      const resI = await axios.get("http://localhost:5000/api/alimentos/lista"); 
      setListaInventario(resI.data || []);
      console.log("✅ Inventario cargado");
    } catch (error) {
      console.log("⚠️ El inventario aún no está listo en el server o la ruta está mal");
    }
  };

  useEffect(() => {
  const cargarBeneficiarios = async () => {
    const res = await fetch("http://localhost:5000/api/beneficiarios");
    const data = await res.json();
    setBeneficiarios(data);
  };
  cargarBeneficiarios();
  obtenerDatos();
}, []);

  // ==================== TEXTOS ====================
  const textos = {
    es: {
      usuarios: "Usuarios",
      donaciones: "Donaciones",
      inventario: "Inventario",
      beneficiarios: "Beneficiarios",
      reportes: "Reportes",
      configuracion: "Configuración",
      cerrarSesion: "Cerrar Sesión"
    },
    en: {
      usuarios: "Users",
      donaciones: "Donations",
      inventario: "Inventory",
      beneficiarios: "Beneficiaries",
      reportes: "Reports",
      configuracion: "Settings",
      cerrarSesion: "Logout"
    }
  };

  // ==================== RENDER ====================
  return (
    <>
      {!userLogged ? (
        <Login onLogin={setUserLogged} />
      ) : (
        <DashboardLayout
          pantalla={pantalla}
          setPantalla={setPantalla}
          modoOscuro={modoOscuro}
          setModoOscuro={setModoOscuro}
          idioma={idioma}
          toggleIdioma={toggleIdioma}
          setIdioma={setIdioma}
          userLogged={userLogged}
          listaUsuarios={listaUsuarios}
          listaDonantes={listaDonantes} 
          guardarUsuario={guardarUsuario}
          eliminarUsuario={eliminarUsuario}
          usuario={usuario}
          setUsuario={setUsuario}
          donacion={donacion}
          setDonacion={setDonacion}
          guardarDonacion={guardarDonacion}
          setEditandoId={setEditandoId}
          editandoId={editandoId}
          nombreConfirmado={nombreConfirmado}
          inventario={inventarioFiltrado}
          inventarioOriginal={inventarioOriginal}
          setInventario={setListaInventario}
          usuarios={listaUsuarios}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          orden={orden}
          setOrden={setOrden}
          exportarExcel={exportarExcel}
          beneficiarios={beneficiarios}
          evaluarSolicitante={evaluarSolicitante}
          cambiarEstadoBeneficiario={cambiarEstadoBeneficiario}
          abiertoSol={abiertoSol}
          setAbiertoSol={setAbiertoSol}
          abiertoAce={abiertoAce}
          setAbiertoAce={setAbiertoAce}
          abiertoEnt={abiertoEnt}
          setAbiertoEnt={setAbiertoEnt}
          abiertoRech={abiertoRech}
          setAbiertoRech={setAbiertoRech}
          modalAbierto={modalAbierto}
          setModalAbierto={setModalAbierto}
          contenidoModal={contenidoModal}
          setContenidoModal={setContenidoModal}
          confirmacionEliminar={confirmacionEliminar}
          setConfirmacionEliminar={setConfirmacionEliminar}
          nuevoSol={nuevoSol}
          setNuevoSol={setNuevoSol}
          categoriasUnicas={categoriasUnicas}
          dataSalidas={dataSalidas}
          extraerIdDelCorreo={extraerIdDelCorreo}
          textos={textos}
        />
      )}
    </>
  );
}

export default App;
