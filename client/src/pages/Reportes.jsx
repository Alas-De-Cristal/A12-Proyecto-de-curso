// Reportes.jsx
import React, { useMemo } from 'react';
import { FaArrowCircleDown, FaArrowCircleUp } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const coloresCategorias = ['#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c'];
const coloresPrioridad = ['#e11d48', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function Reportes({ inventario, setPantalla }) {

  // Categorías únicas
  const categoriasUnicas = useMemo(() => {
    return Array.from(new Set(inventario.map(i => i.categoria)));
  }, [inventario]);

  // Productos críticos: vencen <=7 días
  const productosCriticos = useMemo(() => {
    return inventario
      .filter(i => {
        const dias = Math.ceil((new Date(i.fechaVencimiento) - new Date()) / (1000*60*60*24));
        return dias <= 7;
      })
      .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
  }, [inventario]);

  // 🔍 DEBUG TEMPORAL
  console.log("Inventario recibido:", inventario);
  console.log("Productos críticos:", productosCriticos);

  // Datos para el Pie de prioridades
  const dataPrioridades = useMemo(() => {
  if (!inventario.length) return { labels: [], datasets: [] };

  let muyUrgente = 0;
  let urgente = 0;
  let normal = 0;
  inventario.forEach(p => {
  if (!p.fechaVencimiento) {
    normal++;
    return;
  }

  const dias = Math.ceil(
    (new Date(p.fechaVencimiento) - new Date()) / (1000*60*60*24)
  );

  if (dias <= 3) muyUrgente++;
  else if (dias <= 7) urgente++;
  else normal++;
});
  return {
    labels: ['Muy urgente', 'Urgente', 'Normal'],
    datasets: [{
      data: [muyUrgente, urgente, normal],
      backgroundColor: ['#e11d48', '#f97316', '#22c55e'],
      borderWidth: 0
    }]
  };
}, [inventario]);

  // Datos para el gráfico de barras
  const dataStock = useMemo(() => {
    return {
      labels: categoriasUnicas,
      datasets: [{
        label: 'Stock',
        data: categoriasUnicas.map(cat =>
          inventario
            .filter(i => i.categoria === cat)
            .reduce((sum, item) => sum + Number(item.cantidad), 0)
        ),
        backgroundColor: coloresCategorias,
        borderRadius: 8
      }]
    };
  }, [inventario, categoriasUnicas]);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* CABECERA */}
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ margin: 0, color: 'inherit', fontSize: 28, fontWeight: 800 }}>
          Análisis de <span style={{ color: '#3498db' }}>Impacto Social</span>
        </h2>
        <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: 14 }}>
          Panel inteligente: Inventario y Prioridades de Salida.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 25 }}>

        {/* STOCK */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle('#2980b9')}>
            <FaArrowCircleDown fontSize={20} />
            <span>ESTADO ACTUAL DEL STOCK</span>
          </div>
          <div style={{ padding: 25, height: 400 }}>
            <Bar 
              data={dataStock}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: { y: { duration: 1500 } },
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
              }}
            />
          </div>
        </div>

        {/* RADAR / PRIORIDADES */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle('#27ae60')}>
            <FaArrowCircleUp fontSize={20} />
            <span>RADAR DE PRIORIDADES</span>
          </div>
          <div style={{ padding: 25 }}>
            <div style={{ height: 220, marginBottom: 20 }}>
              <Pie 
                data={dataPrioridades}
                options={{
                  responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center'
      }
    }
  }}
/>
 </div>
            {/* PRODUCTOS CRÍTICOS */}
            <div style={alertBoxStyle}>
              <div style={alertHeaderStyle}>
                <span style={alertBulletStyle}></span>
                Alerta de Vencimiento: Salida Urgente
              </div>

              {productosCriticos.length > 0 ? (
                productosCriticos.map(item => {
                  const dias = Math.ceil((new Date(item.fechaVencimiento) - new Date()) / (1000*60*60*24));
                  const { bgColor, textColor } = getColorByDias(dias);
                  return (
                    <div key={item._id} style={{ background: bgColor, borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontSize: 18, color: textColor, fontWeight: 'bold' }}>{item.nombre}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>
                        Vence el: <strong>{new Date(item.fechaVencimiento).toLocaleDateString()}</strong>
                        <span style={{ color: textColor, fontWeight: 'bold' }}>
                          {` (Quedan ${dias} días)`}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : <div style={{ color: '#64748b' }}>Sin productos en stock.</div>}

              <button 
                onClick={() => setPantalla('salidas')}
                style={buttonStyle}
              >
                Gestionar Salida Inmediata
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ====== ESTILOS ======
const cardStyle = {
  background: 'white',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  border: '1px solid #f1f5f9'
};

const cardHeaderStyle = (bgColor) => ({
  padding: 20,
  background: bgColor,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontWeight: 'bold',
  fontSize: 16
});

const alertBoxStyle = {
  background: '#fff1f2',
  borderRadius: 15,
  padding: 20,
  border: '1px solid #ffe4e6',
  display: 'flex',
  flexDirection: 'column',
  gap: 10
};

const alertHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#e11d48',
  fontWeight: 800,
  fontSize: 12,
  textTransform: 'uppercase'
};

const alertBulletStyle = {
  width: 8,
  height: 8,
  background: '#e11d48',
  borderRadius: '50%',
  display: 'inline-block'
};

const buttonStyle = {
  marginTop: 5,
  background: '#e11d48',
  color: 'white',
  border: 'none',
  padding: 10,
  borderRadius: 8,
  fontWeight: 'bold',
  fontSize: 12,
  cursor: 'pointer',
  transition: '0.3s'
};

// ====== FUNCIONES AUX ======
const getColorByDias = (dias) => {
  if (dias <= 3) return { bgColor: '#fee2e2', textColor: '#b91c1c' };
  if (dias <= 7) return { bgColor: '#fff7ed', textColor: '#c2410c' };
  return { bgColor: '#dcfce7', textColor: '#15803d' };
};
