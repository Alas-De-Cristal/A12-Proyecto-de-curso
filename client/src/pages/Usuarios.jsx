import React, { useState } from 'react';
import { FaUserPlus, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';

export default function Usuarios({
  usuario,
  setUsuario,
  guardarUsuario,
  listaUsuarios = [],
  listaDonantes = []
}) {
  const [tabActiva, setTabActiva] = useState('personal');

  // ==========================================
  // FUNCIÓN MAESTRA PARA GENERAR EL ID
  // ==========================================
  const obtenerIDProfesional = (correo, rol) => {
    if (!correo || correo === "") return "0000";
    
    const baseId = correo.split('@')[0]; // Extrae 'mtayan1353'
    
    // 1. Regla para Administradores
    if (rol === "Admin") {
      return `A-${baseId}`; // O puedes usar `ADM-${baseId}` si prefieres
    }

    // 2. Regla para Donantes
    if (tabActiva === 'donantes' || rol === "Donante Frecuente" || rol === "Donante") {
      return `D-${baseId}`;
    }
    
    // 3. Regla para Beneficiarios
    if (rol === "Beneficiario") {
      return `B-${baseId}`;
    }
    
    // 4. Regla por defecto (Voluntarios)
    return `V-${baseId}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 1. SECCIÓN DE REGISTRO */}
      <div style={{ 
        background: 'white', padding: '30px', borderRadius: '20px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '30px', borderTop: '6px solid #8e44ad' 
      }}>
        <h3 style={{ color: '#8e44ad', marginTop: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FaUserPlus /> Registro de Personal y Donantes
        </h3>
        <form onSubmit={guardarUsuario} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#64748b'}}>Nombre Completo</label>
            <input 
              value={usuario.nombre} 
              onChange={e => setUsuario({...usuario, nombre: e.target.value})} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
            />
          </div>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#64748b'}}>Correo Electrónico</label>
            <input 
              type="email" 
              value={usuario.correo} 
              onChange={e => setUsuario({...usuario, correo: e.target.value})} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
            />
          </div>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#64748b'}}>Rol</label>
            <select 
              value={usuario.rol} 
              onChange={e => setUsuario({...usuario, rol: e.target.value})} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
            >
              <option value="Voluntario">Voluntario</option>
              <option value="Donante Frecuente">Donante Frecuente</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>
          <button type="submit" style={{ background: '#8e44ad', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            CREAR CUENTA
          </button>
        </form>
      </div>

      {/* 2. SELECTOR DE PESTAÑAS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button 
          onClick={() => setTabActiva('personal')} 
          style={{ 
            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', 
            background: tabActiva === 'personal' ? '#8e44ad' : '#e2e8f0', 
            color: tabActiva === 'personal' ? 'white' : '#64748b', fontWeight: 'bold' 
          }}
        >
          Personal Activo
        </button>
        <button 
          onClick={() => setTabActiva('donantes')} 
          style={{ 
            padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', 
            background: tabActiva === 'donantes' ? '#f59e0b' : '#e2e8f0', 
            color: tabActiva === 'donantes' ? 'white' : '#64748b', fontWeight: 'bold' 
          }}
        >
          Directorio Donantes
        </button>
      </div>

      {/* 3. LISTADO DINÁMICO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {(tabActiva === 'personal' ? listaUsuarios : listaDonantes).map(u => (
          <div key={u._id || u.id} style={{ 
            background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderTop: `5px solid ${tabActiva === 'personal' ? '#8e44ad' : '#f59e0b'}`
          }}>
           {/* CABECERA DE LA TARJETA*/}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ 
                width: '45px', 
                height: '45px', 
                
                background: tabActiva === 'personal' ? '#f3ebf7' : '#fef5e7', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
              
                color: tabActiva === 'personal' ? '#8e44ad' : '#f39c12', 
                border: `1px solid ${tabActiva === 'personal' ? '#d7bde2' : '#fad7a0'}` 
              }}>
                {u.nombre ? u.nombre.substring(0, 2).toUpperCase() : '??'}
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: '#1e293b', display: 'block' }}>{u.nombre}</strong>
                <span style={{ 
                  fontSize: '11px', 
                  color: '#64748b', 
                  background: '#f1f5f9', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px'
                }}>
                  <FaIdCard /> {obtenerIDProfesional(u.correo, u.rol)}
                </span>
              </div>
            </div>

            <div style={{ 
              paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center' 
            }}>
                <div style={{ color: '#94a3b8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                   <FaMapMarkerAlt /> <span>{u.rol === 'Admin' ? 'Matriz' : 'Zona Operativa'}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{fontSize: '9px', fontWeight: 'bold', color: '#2ecc71'}}>ACTIVO</span>
                    <div style={{ 
                        width: '10px', height: '10px', borderRadius: '50%', 
                        background: '#2ecc71', boxShadow: '0 0 8px #2ecc71' 
                    }}></div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}