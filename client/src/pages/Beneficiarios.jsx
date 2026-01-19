// src/pages/beneficiarios/Beneficiarios.jsx
import React from "react";
import { FaUserPlus, FaChevronDown } from "react-icons/fa";

export default function Beneficiarios({
  userLogged,
  beneficiarios,
  nuevoSol,
  setNuevoSol,
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
}) {
  const estiloInput = { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #bdc3c7" };

  return (
    <>
      {/* --- PARTE 1: CENSO PÚBLICO --- */}
      <div style={{ background: "#fff", padding: "30px", borderRadius: "15px", marginBottom: "25px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", borderLeft: "5px solid #3498db" }}>
        <h3 style={{ color: "#2c3e50", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          <FaUserPlus /> Censo de Vulnerabilidad Socioeconómica
        </h3>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
          Esta información es confidencial. El sistema prioriza automáticamente los casos de extrema pobreza.
        </p>

        <form onSubmit={evaluarSolicitante} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#34495e'}}>Nombres y Apellidos Completos</label>
            <input value={nuevoSol.nombre} onChange={e=>setNuevoSol({...nuevoSol, nombre:e.target.value})} placeholder="Ej: María Augusta" required style={estiloInput}/>
          </div>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#34495e'}}>Cédula de Identidad</label>
            <input value={nuevoSol.cedula} onChange={e=>setNuevoSol({...nuevoSol, cedula:e.target.value})} placeholder="17xxxxxxxx" required style={estiloInput}/>
          </div>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#34495e'}}>Ingreso Mensual del Hogar</label>
            <select value={nuevoSol.ingresos} onChange={e=>setNuevoSol({...nuevoSol, ingresos:e.target.value})} style={estiloInput}>
              <option value="0">Sin ingresos</option>
              <option value="100">Menos de $100</option>
              <option value="450">Sueldo Básico ($450)</option>
              <option value="800">Más de $450</option>
            </select>
          </div>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#34495e'}}>Número de Hijos</label>
            <input type="number" min="0" value={nuevoSol.numHijos} onChange={e=>setNuevoSol({...nuevoSol, numHijos:e.target.value})} style={estiloInput}/>
          </div>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#34495e'}}>¿Viven Adultos Mayores?</label>
            <select value={nuevoSol.adultosMayores} onChange={e=>setNuevoSol({...nuevoSol, adultosMayores:e.target.value})} style={estiloInput}>
              <option value="No">No</option>
              <option value="Si">Si</option>
            </select>
          </div>
          <div>
            <label style={{fontSize:'12px', fontWeight:'bold', color:'#34495e'}}>¿Alguien tiene Discapacidad?</label>
            <select value={nuevoSol.discapacidad} onChange={e=>setNuevoSol({...nuevoSol, discapacidad:e.target.value})} style={estiloInput}>
              <option value="No">No</option>
              <option value="Si">Si</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" style={{background:'#27ae60', color:'white', border:'none', padding:'15px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', width:'100%'}}>ENVIAR SOLICITUD DE EVALUACIÓN</button>
          </div>
        </form>
      </div>

      {/* --- PARTE 2: GESTIÓN POR ESTADO --- */}
      <div style={{ display: 'grid', gridTemplateColumns: userLogged?.rol === 'Admin' ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: '15px' }}>
        
        {/* SOLICITANTES (solo Admin) */}
        {userLogged?.rol === 'Admin' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <button onClick={() => setAbiertoSol(!abiertoSol)} style={{ width: '100%', padding: '12px', background: '#f1c40f', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>SOLICITANTES</span><FaChevronDown />
            </button>
           {abiertoSol && beneficiarios.filter(b=>b.estado==='solicitado').map(b=>(
  <div
    key={b._id}
    style={{
      padding:'8px',
      border:'1px solid #eee',
      marginTop:'8px',
      borderRadius:'6px'
    }}
  >
    <strong>{b.nombre}</strong><br/>
    <span style={{fontSize:'10px', color:'#7f8c8d'}}>
      ID: {b.cedula}
    </span>

    <div style={{ display:'flex', gap:'6px', marginTop:'6px' }}>
      {/* ACEPTAR */}
      <button
        onClick={()=>cambiarEstadoBeneficiario(b._id,'aceptado')}
        style={{
          background:'#2ecc71',
          color:'white',
          border:'none',
          fontSize:'10px',
          cursor:'pointer',
          padding:'4px 8px',
          borderRadius:'4px',
          flex:1
        }}
      >
        Aceptar
      </button>

      {/* RECHAZAR */}
      <button
        onClick={()=>cambiarEstadoBeneficiario(b._id,'rechazado')}
        style={{
          background:'#e74c3c',
          color:'white',
          border:'none',
          fontSize:'10px',
          cursor:'pointer',
          padding:'4px 8px',
          borderRadius:'4px',
          flex:1
        }}
      >
        Rechazar
      </button>
    </div>
  </div>
))}

</div>
    )}

        {/* ACEPTADOS */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'10px', boxShadow:'0 4px 10px rgba(0,0,0,0.05)' }}>
          <button onClick={()=>setAbiertoAce(!abiertoAce)} style={{ width:'100%', padding:'12px', background:'#3498db', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>ACEPTADOS</span><FaChevronDown />
          </button>
          {abiertoAce && beneficiarios.filter(b=>b.estado==='aceptado').map(b=>(
            <div key={b._id} style={{ padding:'8px', border:'1px solid #eee', marginTop:'8px', borderRadius:'6px' }}>
              <strong>{b.nombre}</strong><br/>
              {userLogged?.rol==='Admin' ? (
                <button onClick={()=>cambiarEstadoBeneficiario(b._id,'entregado')} style={{background:'#34495e', color:'white', border:'none', fontSize:'10px', cursor:'pointer', marginTop:'5px', padding:'4px 8px', borderRadius:'4px'}}>Confirmar Entrega 📦</button>
              ) : (
                <span style={{fontSize:'10px', color:'#2ecc71', fontWeight:'bold'}}>✓ Beneficiario Aprobado</span>
              )}
            </div>
          ))}
        </div>

        {/* ENTREGADOS */}
        <div style={{ background:'#fff', borderRadius:'12px', padding:'10px', boxShadow:'0 4px 10px rgba(0,0,0,0.05)' }}>
          <button onClick={()=>setAbiertoEnt(!abiertoEnt)} style={{ width:'100%', padding:'12px', background:'#2ecc71', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>ENTREGADOS</span><FaChevronDown />
          </button>
          {abiertoEnt && beneficiarios.filter(b=>b.estado==='entregado').map(b=>(
            <div key={b._id} style={{ padding:'8px', border:'1px solid #e8f5e9', marginTop:'8px', borderRadius:'6px', background:'#f9fff9' }}>
              <strong style={{ color:'#27ae60' }}>✓ {b.nombre}</strong><br/>
              <span style={{ fontSize:'10px', color:'#7f8c8d', fontStyle:'italic' }}>Kit entregado con éxito el {b.fechaEntrega||new Date().toLocaleDateString()}</span>
            </div>
          ))}
        </div>

        {/* RECHAZADOS (solo Admin) */}
        {userLogged?.rol==='Admin' && (
          <div style={{ background:'#fff', borderRadius:'12px', padding:'10px', boxShadow:'0 4px 10px rgba(0,0,0,0.05)' }}>
            <button onClick={()=>setAbiertoRech(!abiertoRech)} style={{ width:'100%', padding:'12px', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>RECHAZADOS</span><FaChevronDown />
            </button>
            {abiertoRech && beneficiarios.filter(b=>b.estado==='rechazado').map(b=>(
              <div key={b._id} style={{ padding:'8px', background:'#fff5f5', border:'1px solid #ffd7d7', marginTop:'8px', borderRadius:'6px' }}>
                <strong style={{ color:'#c0392b' }}>{b.nombre}</strong><br/>
                <span style={{ fontSize:'10px' }}>{b.motivo}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
