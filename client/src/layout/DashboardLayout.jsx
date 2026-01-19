import React from "react";
import Sidebar from "../components/Sidebar";

// Imports de las páginas separadas
import Usuarios from '../pages/Usuarios';
import Donaciones from '../pages/Donaciones';
import Inventario from '../pages/Inventario';
import Beneficiarios from "../pages/Beneficiarios";
import Reportes from "../pages/Reportes";
import Configuracion from "../pages/Configuracion";
import MapaUsuario from "../components/MapaUsuario";


import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement 
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Los textos se quedan aquí por si el Sidebar los necesita, pero ya no se usan abajo
export const textos = {
  es: {
    usuarios: "Usuarios",
    donaciones: "Donaciones",
    inventario: "Inventario",
    beneficiarios: "Beneficiarios",
    reportes: "Reportes",
    configuracion: "Configuración",
    cerrarSesion: "Cerrar Sesión",
    gps: "¿CÓMO LLEGAR?"
  },
  en: {
    usuarios: "Users",
    donaciones: "Donations",
    inventario: "Inventory",
    beneficiarios: "Beneficiaries",
    reportes: "Reports",
    configuracion: "Settings",
    cerrarSesion: "Logout",
    gps: "HOW TO GET THERE?"
  }
};

export default function DashboardLayout({
  pantalla,
  setPantalla,
  modoOscuro,
  setModoOscuro,
  idioma,
  setIdioma,
  userLogged,
  listaUsuarios,
  listaDonantes,
  guardarUsuario,
  eliminarUsuario,
  usuario,
  setUsuario,
  donacion,
  setDonacion,
  guardarDonacion,
  editandoId,
  setEditandoId,
  nombreConfirmado,
  inventario,
  setInventario,
  filtroCategoria,
  setFiltroCategoria,
  orden,
  setOrden,
  eliminarItem,
  editarItem,
  estiloCard,
  exportarExcel,
  beneficiarios,
  evaluarSolicitante,
  cambiarEstadoBeneficiario,
  abiertoSol,
  setAbiertoSol,
  abiertoAce,
  setAbiertoAce,
  abiertoEnt,
  setAbiertoEnt,
  abiertoRech,
  setAbiertoRech,
  modalAbierto,
  setModalAbierto,
  contenidoModal,
  setContenidoModal,
  confirmacionEliminar,
  setConfirmacionEliminar,
  nuevoSol,
  setNuevoSol,
  categoriasUnicas,
  dataSalidas,
  usuarios,   // <-- este sí se queda
}) {

  // ================= FILTROS DE USUARIOS =================
  const soloDonantes = Array.isArray(usuarios) 
    ? usuarios.filter(u => u.rol === "Donante Frecuente" || u.rol === "Donante")
    : [];

  const soloPersonal = Array.isArray(usuarios)
    ? usuarios.filter(u => u.rol === "Admin" || u.rol === "Voluntario")
    : [];

  const extraerIdDelCorreo = (correo) => {
      if(!correo) return "0000";
      return correo.split('@')[0];
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ... resto del código ... */}

      
      {/* ================= SIDEBAR (Navegación única) ================= */}
      <Sidebar 
        pantalla={pantalla} 
        setPantalla={setPantalla} 
        idioma={idioma} 
        textos={textos} 
        modoOscuro={modoOscuro} 
        userLogged={userLogged}
      />

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <main
        style={{
          flex: 1,
          marginLeft: "260px", 
          padding: "25px",
          background: modoOscuro ? "#1f2933" : "#f8fafc", // Un gris más profesional
          color: modoOscuro ? "#ffffff" : "#2c3e50",
          overflowY: "auto",
          minHeight: "100vh"
        }}
      >
        {/* RENDERIZADO DINÁMICO DE PANTALLAS */}
       {pantalla === "usuarios" && (
  <Usuarios 
    listaUsuarios={listaUsuarios} 
    listaDonantes={listaDonantes} // <--- REVISA QUE ESTA LÍNEA ESTÉ AQUÍ
    guardarUsuario={guardarUsuario}
    eliminarUsuario={eliminarUsuario}
    usuario={usuario}
    setUsuario={setUsuario}
    extraerIdDelCorreo={extraerIdDelCorreo}
  />
)}

        {pantalla === 'donaciones' && (
          <Donaciones 
            donacion={donacion}
            setDonacion={setDonacion}
            guardarDonacion={guardarDonacion}
            inventario={inventario}
             setInventario={setInventario}
            usuarios={usuarios}
            nombreConfirmado={nombreConfirmado}
            editandoId={editandoId}
            setEditandoId={setEditandoId} 
            userLogged={userLogged} 
          />
        )}
        
{userLogged?.rol === "Admin" && (
  <div style={{ marginTop: "30px" }}>
    <h3 style={{ fontSize: "18px", marginBottom: "10px" }}></h3>
    {soloDonantes.map(d => (
      <div key={d.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span>{d.nombre} ({d.correo})</span>
        <button onClick={() => eliminarUsuario(d.id)} style={{ background: "#e74c3c", color: "white", borderRadius: "6px", padding: "5px" }}>🗑️ Eliminar</button>
      </div>
    ))}
  </div>
)}

        {pantalla === 'inventario' && (
          <Inventario 
            inventario={inventario} 
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            orden={orden}
            setOrden={setOrden}
            eliminarItem={eliminarItem}
            editarItem={editarItem}
            estiloCard={estiloCard}
            exportarExcel={exportarExcel}
          />
        )}

        {pantalla === 'beneficiarios' && (
          <Beneficiarios 
            nuevoSol={nuevoSol}
            setNuevoSol={setNuevoSol}
            evaluarSolicitante={evaluarSolicitante}
            userLogged={userLogged}
            beneficiarios={beneficiarios}
            cambiarEstadoBeneficiario={cambiarEstadoBeneficiario}
            abiertoSol={abiertoSol}
            setAbiertoSol={setAbiertoSol}
            abiertoAce={abiertoAce}
            setAbiertoAce={setAbiertoAce}
            abiertoEnt={abiertoEnt}
            setAbiertoEnt={setAbiertoEnt}
            abiertoRech={abiertoRech}
            setAbiertoRech={setAbiertoRech}
          />
        )}

        {pantalla === 'reportes' && (
          <Reportes 
            inventario={inventario} 
            categoriasUnicas={categoriasUnicas} 
            dataSalidas={dataSalidas} 
            setPantalla={setPantalla}
          />
        )}

        {pantalla === 'configuracion' && (
          <Configuracion
            idioma={idioma}
            setIdioma={setIdioma}
            modoOscuro={modoOscuro}
            setModoOscuro={setModoOscuro}
            confirmacionEliminar={confirmacionEliminar}
            setConfirmacionEliminar={setConfirmacionEliminar}
            setPantalla={setPantalla}
            modalAbierto={modalAbierto}
            setModalAbierto={setModalAbierto}
            contenidoModal={contenidoModal}
            setContenidoModal={setContenidoModal}
          />
        )}

        {pantalla === 'gps' && (
  <div>
    <h2 style={{ marginBottom: "15px" }}>📍 Tu ubicación actual</h2>
    <MapaUsuario />
  </div>
)}
</main>
    </div>
  );
}