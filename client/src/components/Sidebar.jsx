import React from 'react';
import { 
  FaUsers, FaHandsHelping, FaBoxes, FaUserFriends, 
  FaChartLine, FaCog, FaSignOutAlt, FaMapMarkerAlt 
} from 'react-icons/fa';

export default function Sidebar({ pantalla, setPantalla, textos, idioma, modoOscuro, userLogged }) {
  
  // Sacamos la inicial del nombre del usuario (ej: "M" de "Manuel")
  const inicial = userLogged?.nombre ? userLogged.nombre.charAt(0).toUpperCase() : "?";

  const estiloItem = (id) => ({
    padding: '12px 20px',
    margin: '4px 10px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: '0.3s',
    backgroundColor: pantalla === id ? (modoOscuro ? '#334155' : '#f1f5f9') : 'transparent',
    color: pantalla === id ? '#8e44ad' : (modoOscuro ? '#94a3b8' : '#64748b'),
    fontWeight: pantalla === id ? 'bold' : '500'
  });

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: modoOscuro ? '#0f172a' : '#ffffff',
      borderRight: modoOscuro ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      {/* 1. LOGO */}
      <div style={{ padding: '25px', fontSize: '22px', fontWeight: 'bold', color: '#8e44ad', textAlign: 'center' }}>
        📦 FoodConnect
      </div>

      {/* 2. CÍRCULO DE PERFIL (LO QUE BUSCABAS) */}
      <div style={{ 
        padding: '15px 20px', 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          boxShadow: '0 2px 5px rgba(59, 130, 246, 0.5)'
        }}>
          {inicial}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: modoOscuro ? '#f8fafc' : '#1e293b' }}>
            {userLogged?.nombre || "Usuario"}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
            {userLogged?.rol || "Voluntario"}
          </p>
        </div>
      </div>

      {/* 3. MENÚ DE NAVEGACIÓN */}
      <nav style={{ flex: 1 }}>
        <div onClick={() => setPantalla('usuarios')} style={estiloItem('usuarios')}><FaUsers /> {textos[idioma].usuarios}</div>
        <div onClick={() => setPantalla('donaciones')} style={estiloItem('donaciones')}><FaHandsHelping /> {textos[idioma].donaciones}</div>
        <div onClick={() => setPantalla('inventario')} style={estiloItem('inventario')}><FaBoxes /> {textos[idioma].inventario}</div>
        <div onClick={() => setPantalla('beneficiarios')} style={estiloItem('beneficiarios')}><FaUserFriends /> {textos[idioma].beneficiarios}</div>
        <div onClick={() => setPantalla('reportes')} style={estiloItem('reportes')}><FaChartLine /> {textos[idioma].reportes}</div>
        <div onClick={() => setPantalla('configuracion')} style={estiloItem('configuracion')}><FaCog /> {textos[idioma].configuracion}</div>
      </nav>

      {/* 4. BOTONES INFERIORES (GPS Y LOGOUT) */}
      <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9' }}>
        <button 
          onClick={() => setPantalla('gps')}
          style={{
            width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
            backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', marginBottom: '10px'
          }}
        >
          <FaMapMarkerAlt /> {textos[idioma].gps}
        </button>

        <button 
          onClick={() => {
            localStorage.removeItem('usuarioFoodConnect');
            window.location.reload();
          }}
          style={{
            width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
            backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer'
          }}
        >
          <FaSignOutAlt /> {textos[idioma].cerrarSesion}
        </button>
      </div>
    </div>
  );
}