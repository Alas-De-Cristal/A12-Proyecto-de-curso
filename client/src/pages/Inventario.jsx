// Inventario.jsx
import React from 'react';
import { FaClipboardList, FaFileExcel } from 'react-icons/fa';

export default function Inventario({
  inventario,
  filtroCategoria,
  setFiltroCategoria,
  orden,
  setOrden,
  exportarExcel
}) {
  // ==================== CATEGORÍAS ====================
  // Creamos las categorías únicas a partir del inventario
  const categoriasDisponibles = [...new Set(inventario.map(item => item.categoria))];

  // ==================== INVENTARIO FILTRADO ====================
  const inventarioFiltrado = inventario
    .filter(item => filtroCategoria === "" || item.categoria === filtroCategoria)
    .sort((a, b) => {
      if (orden === 'nombre') return (a.nombre || "").localeCompare(b.nombre || "");
      if (orden === 'cantidad') return (b.cantidad || 0) - (a.cantidad || 0);
      if (orden === 'fechaVencimiento') return new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento);
      return 0;
    });

  return (
    <div style={{ padding: '20px', maxWidth: '1240px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* 1. TARJETAS DE RESUMEN (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #3498db' }}>
          <div style={{ color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Variedad</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#2c3e50' }}>
            {inventario.length} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>Ítems</span>
          </div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #e74c3c' }}>
          <div style={{ color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Críticos / Vencidos</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#e74c3c' }}>
            {inventario.filter(i => {
              const d = Math.ceil((new Date(i.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24));
              return d <= 0;
            }).length}
          </div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '5px solid #27ae60' }}>
          <div style={{ color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Producto Saludable</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#27ae60' }}>{inventario.filter(i => i.cantidad >= 10).length}</div>
        </div>
      </div>

      {/* 2. CABECERA DE GESTIÓN DE SUMINISTROS */}
      <div style={{ 
        background: 'white', 
        padding: '25px 30px', 
        borderRadius: '20px 20px 0 0', 
        borderBottom: '2px solid #f1f5f9', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #27ae60 0%, #2980b9 100%)', 
            width: '45px', 
            height: '45px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(39, 174, 96, 0.2)'
          }}>
            <FaClipboardList style={{ color: 'white', fontSize: '20px' }} />
          </div>

          <div>
            <h2 style={{ margin: 0, color: '#000000', fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '8px', filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))' }}>
              Gestión de <span style={{ color: '#3498db', fontWeight: '900' }}>Suministros</span>
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#334155', fontSize: '14px', fontWeight: '700', letterSpacing: '0.2px' }}>
              Panel de control de inventario y flujo de alimentos
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* FILTRO DE CATEGORÍA */}
          <select 
            onChange={e => setFiltroCategoria(e.target.value)} 
            value={filtroCategoria} 
            style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="">📁 Todas las categorías</option>
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* SELECT ORDEN */}
          <select 
            onChange={e => setOrden(e.target.value)} 
            value={orden} 
            style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="nombre">🔤 Ordenar: Producto (A-Z)</option>
            <option value="cantidad">🔢 Ordenar: Cantidad Mayor</option>
            <option value="fechaVencimiento">📅 Ordenar: Vencimiento</option>
          </select>

          {/* BOTÓN EXPORTAR EXCEL */}
          <button onClick={exportarExcel} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFileExcel /> Exportar
          </button>
        </div>
      </div>

      {/* 3. TABLA ESTILO DASHBOARD */}
      <div style={{ background: 'white', borderRadius: '0 0 15px 15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', color: '#64748b' }}>
              <th style={{ padding: '18px 25px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
              <th style={{ padding: '18px 25px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Producto Detalle</th>
              <th style={{ padding: '18px 25px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Nivel de Producto</th>
              <th style={{ padding: '18px 25px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Línea de Tiempo (Ingreso/Cad.)</th>
            </tr>
          </thead>
          <tbody>
            {inventarioFiltrado.map(item => {
              const hoy = new Date();
              hoy.setHours(0,0,0,0);
              const venc = new Date(item.fechaVencimiento);
              const vencReal = new Date(venc.getTime() + venc.getTimezoneOffset() * 60000);
              vencReal.setHours(0,0,0,0);
              const dias = Math.ceil((vencReal - hoy) / (1000 * 60 * 60 * 24));
              const isVencido = dias < 0;
              const isCritico = dias <= 7 && dias >= 0;

              return (
                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s', backgroundColor: isVencido ? '#fffafa' : 'transparent' }}>
                  <td style={{ padding: '20px 25px' }}>
                    <div style={{ 
                      background: isVencido ? '#fee2e2' : (isCritico ? '#ffedd5' : '#dcfce7'),
                      color: isVencido ? '#b91c1c' : (isCritico ? '#9a3412' : '#15803d'),
                      padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', textAlign: 'center', width: '110px'
                    }}>
                      {isVencido ? '● CADUCADO' : (isCritico ? '● CRÍTICO' : '● SALUDABLE')}
                    </div>
                  </td>

                  <td style={{ padding: '20px 25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '35px', height: '35px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#27ae60', fontWeight: 'bold', fontSize: '14px' }}>
                        {item.nombre.charAt(0)}
                      </div>
                      <div>
                        <div style={{ color: '#1e293b', fontWeight: 'bold', fontSize: '14px' }}>{item.nombre}</div>
                        <div style={{ color: '#94a3b8', fontSize: '12px' }}>{item.categoria.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '20px 25px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                      {item.cantidad} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#64748b' }}>{item.unidadMedida || 'u'}</span>
                    </div>
                    <div style={{ width: '80px', height: '4px', background: '#f1f5f9', borderRadius: '10px', margin: '8px auto 0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(item.cantidad * 2, 100)}%`, height: '100%', background: item.cantidad < 10 ? '#f59e0b' : '#10b981' }}></div>
                    </div>
                  </td>

                  <td style={{ padding: '20px 25px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1'}}></span>
                        Entró: {item.fechaRegistro ? new Date(item.fechaRegistro).toLocaleDateString() : '—'}
                      </div>
                      <div style={{ fontSize: '13px', color: isCritico || isVencido ? '#ef4444' : '#1e293b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{width: '8px', height: '8px', borderRadius: '50%', background: isCritico || isVencido ? '#ef4444' : '#10b981'}}></span>
                        Vence: {vencReal.toLocaleDateString()}
                      </div>
                      {isCritico && <span style={{fontSize: '10px', color: '#f59e0b', fontWeight: 'bold'}}>⚠️ ¡Priorizar salida!</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
