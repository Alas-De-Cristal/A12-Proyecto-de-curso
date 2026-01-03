import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaUsers, FaBoxOpen, FaClipboardList, FaChartBar, FaFileExcel, FaChevronDown, FaHandHoldingHeart, FaIdCard, FaUserClock, FaCheckCircle, FaTruckLoading, FaArrowCircleDown, FaArrowCircleUp, FaTag, FaLayerGroup, FaInfoCircle, FaUserPlus, FaTimesCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- COMPONENTE DROPDOWN SUPERIOR ---
const DropdownInfo = ({ titulo, total, lista, color, tipo }) => {
  const [abierto, setAbierto] = useState(false);
  const listaConAnonimo = tipo === 'usuarios' ? [{ id: '000', nombre: 'DONANTE ANÓNIMO', correo: '000@info.com' }, ...lista] : lista;

  const extraerIdDelCorreo = (correo) => {
    if (!correo) return 'S/N';
    const match = correo.match(/\d+/);
    return match ? match[0] : 'S/N';
  };

  return (
    <div style={{ position: 'absolute', top: '110px', right: '30px', zIndex: 10 }}>
      <button onClick={() => setAbierto(!abierto)} style={{ background: color, color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        {titulo}: {total} <FaChevronDown style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
      </button>
      {abierto && (
        <div style={{ position: 'absolute', top: '45px', right: '0', background: 'white', minWidth: '350px', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', padding: '15px', maxHeight: '400px', overflowY: 'auto', border: `1px solid ${color}` }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#7f8c8d', borderBottom: '2px solid #f1f1f1', fontWeight: 'bold', paddingBottom: '8px', textAlign: 'center' }}>
            {tipo === 'donaciones' ? 'REGISTROS DE ENTRADA' : 'DIRECTORIO DE USUARIOS'}
          </p>
          
          {tipo === 'usuarios' && (
            <div style={{ display: 'flex', padding: '0 10px 5px 10px', fontWeight: 'bold', fontSize: '12px', color: '#2c3e50', borderBottom: '1px solid #eee', marginBottom: '8px' }}>
              <span style={{ width: '80px' }}>ID</span>
              <span style={{ marginLeft: '15px' }}>NOMBRE</span>
            </div>
          )}

          {listaConAnonimo.map((item, index) => (
            <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', background: index % 2 === 0 ? '#fcfcfc' : 'white', borderRadius: '8px', marginBottom: '5px' }}>
              {tipo === 'donaciones' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* CORRECCIÓN AQUÍ: Ahora muestra el ID real de la donación */}
                    <span style={{ fontSize: '10px', color: '#95a5a6', fontWeight: 'bold' }}>
                      DONANTE ID: {item.donanteId || 'ANÓNIMO'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaTag style={{ color: color, fontSize: '12px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>{item.nombre}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaLayerGroup style={{ color: '#95a5a6', fontSize: '12px' }} />
                    <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Cant: <strong>{item.cantidad} unidades</strong></span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <code style={{ width: '80px', background: '#f4f4f4', padding: '2px 4px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
                    {item.id === '000' ? '000' : extraerIdDelCorreo(item.correo)}
                  </code>
                  <span style={{ marginLeft: '15px', fontWeight: '500' }}>{item.nombre}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ... El resto del código (MenuButton, App, useEffects, Handlers, Renderizado) se mantiene exactamente igual a tu versión original ...

const MenuButton = ({ texto, active, onClick, Icono }) => (
  <button onClick={onClick} style={{ background: active ? '#e67e22' : '#34495e', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'left', width: '100%', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
    <Icono style={{ fontSize: '18px' }} /> {texto}
  </button>
);

function App() {
  const [pantalla, setPantalla] = useState('usuarios');
  const [usuario, setUsuario] = useState({ nombre: '', correo: '', rol: 'Voluntario' });
  const [donacion, setDonacion] = useState({ donanteId: '', nombre: '', categoria: '', cantidad: 1, fechaVencimiento: '' });
  const [inventario, setInventario] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]); 
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [orden, setOrden] = useState('cantidad');
  const [nombreConfirmado, setNombreConfirmado] = useState('');
  const [nuevoSol, setNuevoSol] = useState({ nombre: '', hijos: 'No', ingresos: 'Menos de $400' });

  const [abiertoSol, setAbiertoSol] = useState(true);
  const [abiertoAce, setAbiertoAce] = useState(false);
  const [abiertoEnt, setAbiertoEnt] = useState(false);
  const [abiertoRech, setAbiertoRech] = useState(false);
  
  const [repEntradaAbierto, setRepEntradaAbierto] = useState(true);
  const [repSalidaAbierto, setRepSalidaAbierto] = useState(false);

  const [beneficiarios, setBeneficiarios] = useState([
    { id: 1, nombre: 'Familia Perez', estado: 'solicitado', alimento: 'Canasta Básica' },
    { id: 2, nombre: 'Juan Gomez', estado: 'solicitado', alimento: 'Leche' },
    { id: 3, nombre: 'Maria Rodriguez', estado: 'solicitado', alimento: 'Arroz' },
    { id: 4, nombre: 'Pedro Castillo', estado: 'solicitado', alimento: 'Kit Higiene' },
    { id: 5, nombre: 'Ana Beltrán', estado: 'solicitado', alimento: 'Harina' },
    { id: 6, nombre: 'Luis Morales', estado: 'solicitado', alimento: 'Pañales' },
    { id: 7, nombre: 'Carla Peña', estado: 'solicitado', alimento: 'Enlatados' },
    { id: 8, nombre: 'Jose Lopez', estado: 'solicitado', alimento: 'Café' },
    { id: 9, nombre: 'Marta Soler', estado: 'solicitado', alimento: 'Cereales' },
    { id: 10, nombre: 'Diego Vera', estado: 'solicitado', alimento: 'Pasta' },
    { id: 11, nombre: 'Comedor Central', estado: 'aceptado', alimento: 'Saco Arroz' },
    { id: 12, nombre: 'Elena Rivas', estado: 'aceptado', alimento: 'Frutas' },
    { id: 13, nombre: 'Hogar del Niño', estado: 'aceptado', alimento: 'Leche Nido' },
    { id: 14, nombre: 'Roberto Sosa', estado: 'aceptado', alimento: 'Aceite' },
    { id: 15, nombre: 'Lucia Mendez', estado: 'aceptado', alimento: 'Granos' },
    { id: 16, nombre: 'Fundación Vida', estado: 'aceptado', alimento: 'Varios' },
    { id: 17, nombre: 'Carlos Ruiz', estado: 'aceptado', alimento: 'Panadería' },
    { id: 18, nombre: 'Sofia Castro', estado: 'aceptado', alimento: 'Cereales' },
    { id: 19, nombre: 'Andres Bello', estado: 'aceptado', alimento: 'Enlatados' },
    { id: 20, nombre: 'Beatriz Luna', estado: 'aceptado', alimento: 'Azúcar' },
    { id: 21, nombre: 'Hugo Duarte', estado: 'aceptado', alimento: 'Pasta' },
    { id: 22, nombre: 'Valeria Sol', estado: 'aceptado', alimento: 'Aceite' },
    { id: 23, nombre: 'Raul Jímenez', estado: 'aceptado', alimento: 'Harina' },
    { id: 24, nombre: 'Monica Ferro', estado: 'aceptado', alimento: 'Verduras' },
    { id: 25, nombre: 'Gabriel Paz', estado: 'aceptado', alimento: 'Kit Aseo' },
    { id: 26, nombre: 'Jorge Tello', estado: 'entregado', alimento: 'Entregado' },
    { id: 27, nombre: 'Patricia Oro', estado: 'entregado', alimento: 'Entregado' },
    { id: 28, nombre: 'Lucas San', estado: 'entregado', alimento: 'Entregado' },
    { id: 29, nombre: 'Sara K.', estado: 'entregado', alimento: 'Entregado' },
    { id: 30, nombre: 'Nora Diaz', estado: 'entregado', alimento: 'Entregado' },
    { id: 31, nombre: 'Omar Plata', estado: 'entregado', alimento: 'Entregado' },
    { id: 32, nombre: 'Isabel Rey', estado: 'entregado', alimento: 'Entregado' },
    { id: 33, nombre: 'Felix G.', estado: 'entregado', alimento: 'Entregado' },
    { id: 34, nombre: 'Teresa V.', estado: 'entregado', alimento: 'Entregado' },
    { id: 35, nombre: 'Marcos Li', estado: 'entregado', alimento: 'Entregado' },
    { id: 36, nombre: 'Diana Q.', estado: 'entregado', alimento: 'Entregado' },
    { id: 37, nombre: 'Emilio J.', estado: 'entregado', alimento: 'Entregado' },
    { id: 38, nombre: 'Rosa M.', estado: 'entregado', alimento: 'Entregado' },
    { id: 39, nombre: 'Samuel H.', estado: 'entregado', alimento: 'Entregado' },
    { id: 40, nombre: 'Julia R.', estado: 'entregado', alimento: 'Entregado' },
    { id: 41, nombre: 'Ivan S.', estado: 'entregado', alimento: 'Entregado' },
    { id: 42, nombre: 'Paola W.', estado: 'entregado', alimento: 'Entregado' },
    { id: 43, nombre: 'Daniel B.', estado: 'entregado', alimento: 'Entregado' },
    { id: 44, nombre: 'Carlos Slim', estado: 'rechazado', motivo: 'Ingresos altos' },
    { id: 45, nombre: 'Marta Wayne', estado: 'rechazado', motivo: 'Vivienda de lujo' },
    { id: 46, nombre: 'John Doe', estado: 'rechazado', motivo: 'Sin cargas familiares' },
    { id: 47, nombre: 'Richie Rich', estado: 'rechazado', motivo: 'Datos falsos' },
    { id: 48, nombre: 'Sr. Monopoly', estado: 'rechazado', motivo: 'Exceso capital' }
  ]);

  const obtenerDatos = async () => {
    try {
      const resA = await axios.get('http://127.0.0.1:5000/api/alimentos/lista');
      setInventario(resA.data);
      const resU = await axios.get('http://127.0.0.1:5000/api/usuarios/lista');
      setListaUsuarios(resU.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { obtenerDatos(); }, []);

  useEffect(() => {
    if (donacion.donanteId === '0000') setNombreConfirmado('ANÓNIMO (GENERAL)');
    else {
      const user = listaUsuarios.find(u => u.id === donacion.donanteId || u._id === donacion.donanteId);
      setNombreConfirmado(user ? user.nombre : '');
    }
  }, [donacion.donanteId, listaUsuarios]);

  const guardarUsuario = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/usuarios/agregar', usuario);
      alert('✅ Usuario registrado');
      setUsuario({ nombre: '', correo: '', rol: 'Voluntario' });
      obtenerDatos();
    } catch { alert('❌ Error'); }
  };

  const guardarDonacion = async (e) => {
    e.preventDefault();
    if(!nombreConfirmado) return alert("❌ ID no válido.");
    try {
      await axios.post('http://127.0.0.1:5000/api/alimentos/agregar', { 
      ...donacion, 
      donanteId: donacion.donanteId, // Esto asegura que se envíe el ID escrito
      donanteNombre: nombreConfirmado 
    });
    
    alert('✅ Donación guardada');
    setDonacion({ donanteId: '', nombre: '', categoria: '', cantidad: 1, fechaVencimiento: '' });
    obtenerDatos();
  } catch { alert('❌ Error'); }
};

  const evaluarSolicitante = (e) => {
    e.preventDefault();
    const esApto = nuevoSol.hijos === 'Si' && nuevoSol.ingresos === 'Menos de $400';
    const nuevo = {
      id: Date.now(),
      nombre: nuevoSol.nombre,
      estado: esApto ? 'solicitado' : 'rechazado',
      alimento: esApto ? 'Pendiente' : null,
      motivo: esApto ? null : 'No cumple requisitos de vulnerabilidad'
    };
    setBeneficiarios([...beneficiarios, nuevo]);
    alert(esApto ? '✅ Apto para recibir ayuda' : '❌ No califica para el programa');
    setNuevoSol({ nombre: '', hijos: 'No', ingresos: 'Menos de $400' });
  };

  const cambiarEstadoBeneficiario = (id, nuevoEstado) => {
    setBeneficiarios(beneficiarios.map(b => b.id === id ? { ...b, estado: nuevoEstado } : b));
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(inventario);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    XLSX.writeFile(wb, `Inventario_FC.xlsx`);
  };

  const categoriasUnicas = [...new Set(inventario.map(i => i.categoria))];
  
  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 2500,           // Más tiempo para que se aprecie el movimiento
    easing: 'easeOutElastic'  // Este hace que las barras "reboten" al llegar al final
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false        // Quita las líneas horizontales de fondo
      }
    },
    x: {
      grid: {
        display: false        // Quita las líneas verticales de fondo
      }
    }
  },
  plugins: {
    legend: {
      display: false          // Quita el recuadro que dice "Stock en Bodega" arriba
    }
  }
};

  const dataEntradas = {
  labels: categoriasUnicas,
  datasets: [{
    label: 'Stock en Bodega',
    data: categoriasUnicas.map(cat => 
      inventario.filter(i => i.categoria === cat).reduce((sum, item) => sum + item.cantidad, 0)
    ),
    // Agregamos un color distinto para cada barra
    backgroundColor: [
      '#FF6384', // Rojo/Rosa
      '#36A2EB', // Azul
      '#FFCE56', // Amarillo
      '#4BC0C0', // Turquesa
      '#9966FF', // Morado
      '#FF9F40'  // Naranja
    ],
    borderWidth: 1,
    borderRadius: 8, // Bordes redondeados para que se vea moderno
  }]
};

  const dataSalidas = {
    labels: ['Solicitantes', 'Aceptados', 'Entregados', 'Rechazados'],
    datasets: [{
      data: [
        beneficiarios.filter(b => b.estado === 'solicitado').length,
        beneficiarios.filter(b => b.estado === 'aceptado').length,
        beneficiarios.filter(b => b.estado === 'entregado').length,
        beneficiarios.filter(b => b.estado === 'rechazado').length
      ],
      backgroundColor: ['#f1c40f', '#3498db', '#2ecc71', '#e74c3c'],
    }]
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial', backgroundColor: '#f0f2f5' }}>

      {/* SIDEBAR */}
      <div style={{ width: '220px', padding: '20px', background: '#2c3e50', color: 'white' }}>
        <h1 style={{ color: '#e67e22', textAlign: 'center', fontSize: '24px' }}>FoodConnect</h1>
        <MenuButton texto="Usuarios" active={pantalla === 'usuarios'} onClick={() => setPantalla('usuarios')} Icono={FaUsers} />
        <MenuButton texto="Donaciones" active={pantalla === 'donaciones'} onClick={() => setPantalla('donaciones')} Icono={FaBoxOpen} />
        <MenuButton texto="Inventario" active={pantalla === 'inventario'} onClick={() => setPantalla('inventario')} Icono={FaClipboardList} />
        <MenuButton texto="Beneficiarios" active={pantalla === 'beneficiarios'} onClick={() => setPantalla('beneficiarios')} Icono={FaHandHoldingHeart} />
        <MenuButton texto="Reportes" active={pantalla === 'reportes'} onClick={() => setPantalla('reportes')} Icono={FaChartBar} />
      </div>

      <div style={{ flex: 1, padding: '30px', position: 'relative' }}>
        
        {pantalla === 'usuarios' && <DropdownInfo titulo="Usuarios" total={listaUsuarios.length} lista={listaUsuarios} color="#8e44ad" tipo="usuarios" />}
        {pantalla === 'donaciones' && <DropdownInfo titulo="Historial" total={inventario.length} lista={inventario} color="#27ae60" tipo="donaciones" />}

        <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>Gestión FoodConnect</h1>

        {/* USUARIOS */}
        {pantalla === 'usuarios' && (
          <div style={{ maxWidth: '500px', margin: '40px auto', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#8e44ad', textAlign: 'center' }}>Nuevo Registro</h2>
            <form onSubmit={guardarUsuario} style={{ display: 'grid', gap: '15px' }}>
              <input placeholder="Nombre Completo" value={usuario.nombre} onChange={e => setUsuario({...usuario, nombre: e.target.value})} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}/>
              <input placeholder="Correo electrónico" type="email" value={usuario.correo} onChange={e => setUsuario({...usuario, correo: e.target.value})} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}/>
              <select value={usuario.rol} onChange={e => setUsuario({...usuario, rol: e.target.value})} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="Voluntario">Voluntario</option>
                <option value="Donante Frecuente">Donante Frecuente</option>
              </select>
              <button style={{ background: '#8e44ad', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Crear Cuenta</button>
            </form>
          </div>
        )}

        {/* DONACIONES */}
        {pantalla === 'donaciones' && (
          <div style={{ maxWidth: '500px', margin: '40px auto', background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#27ae60', textAlign: 'center' }}>Registrar Donación</h2>
            <form onSubmit={guardarDonacion} style={{ display: 'grid', gap: '12px' }}>
              <input placeholder="ID del Donante (Ej: 000)" value={donacion.donanteId} onChange={e => setDonacion({...donacion, donanteId: e.target.value})} required style={{ padding: '12px', borderRadius: '6px', border: '2px solid #27ae60' }} />
              {nombreConfirmado && <div style={{ background: '#e8f5e9', padding: '10px', borderRadius: '6px', color: '#2e7d32', fontWeight: 'bold' }}>👤 Donante: {nombreConfirmado}</div>}
              <input placeholder="Alimento" value={donacion.nombre} onChange={e => setDonacion({...donacion, nombre: e.target.value})} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}/>
              <select value={donacion.categoria} onChange={e => setDonacion({...donacion, categoria: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <option value="">Seleccione Categoría</option>
                <option value="Enlatados">Enlatados</option>
                <option value="Granos">Granos</option>
                <option value="Lácteos">Lácteos</option>
                <option value="Carnes">Carnes</option>
                <option value="Frutas/Verduras">Frutas/Verduras</option>
                <option value="Panadería">Panadería</option>
                <option value="Higiene">Higiene</option>
              </select>
              <input type="number" placeholder="Cantidad" value={donacion.cantidad} onChange={e => setDonacion({...donacion, cantidad: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
              <input type="date" value={donacion.fechaVencimiento} onChange={e => setDonacion({...donacion, fechaVencimiento: e.target.value})} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}/>
              <button style={{ background: '#27ae60', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Registrar Entrada</button>
            </form>
          </div>
        )}

        {/* INVENTARIO */}
        {pantalla === 'inventario' && (
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginTop: '30px' }}>
            <h2 style={{ color: '#2980b9', textAlign: 'center' }}>Inventario de Alimentos</h2>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', justifyContent: 'space-between' }}>
              <select onChange={e => setFiltroCategoria(e.target.value)} value={filtroCategoria} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="">Todas las categorías</option>
                {Array.from(new Set(inventario.map(item => item.categoria))).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              <select onChange={e => setOrden(e.target.value)} value={orden} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="cantidad">Ordenar por Cantidad</option>
                <option value="fechaVencimiento">Ordenar por Fecha de Vencimiento</option>
              </select>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2c3e50', color: 'white' }}>
                  <th style={{ padding: '12px' }}>Alimento</th><th style={{ padding: '12px' }}>Categoría</th><th style={{ padding: '12px' }}>Stock</th><th style={{ padding: '12px' }}>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {inventario
                  .filter(item => filtroCategoria === '' || item.categoria === filtroCategoria)
                  .sort((a, b) => {
                    if (orden === 'cantidad') return b.cantidad - a.cantidad;
                    if (orden === 'fechaVencimiento') return new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento);
                    return 0;
                  })
                  .map(item => (
                    <tr key={item._id} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{item.nombre}</td><td>{item.categoria}</td><td style={{ fontWeight: 'bold' }}>{item.cantidad}</td><td>{new Date(item.fechaVencimiento).toLocaleDateString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button onClick={exportarExcel} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaFileExcel /> Exportar a Excel
              </button>
            </div>
          </div>
        )}

        {/* BENEFICIARIOS */}
        {pantalla === 'beneficiarios' && (
          <>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #3498db' }}>
              <h3 style={{ color: '#2980b9', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><FaUserPlus /> Evaluación de Vulnerabilidad</h3>
              <form onSubmit={evaluarSolicitante} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 150px', gap: '10px', alignItems: 'end' }}>
                <div><label style={{fontSize:'12px'}}>Nombre</label><input value={nuevoSol.nombre} onChange={e=>setNuevoSol({...nuevoSol, nombre:e.target.value})} required style={{width:'100%', padding:'8px'}}/></div>
                <div><label style={{fontSize:'12px'}}>¿Hijos?</label><select value={nuevoSol.hijos} onChange={e=>setNuevoSol({...nuevoSol, hijos:e.target.value})} style={{width:'100%', padding:'8px'}}><option value="No">No</option><option value="Si">Si</option></select></div>
                <div><label style={{fontSize:'12px'}}>Ingresos</label><select value={nuevoSol.ingresos} onChange={e=>setNuevoSol({...nuevoSol, ingresos:e.target.value})} style={{width:'100%', padding:'8px'}}><option value="Menos de $400">Menos de $400</option><option value="Más de $400">Más de $400</option></select></div>
                <button style={{background:'#3498db', color:'white', border:'none', padding:'10px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold'}}>Evaluar</button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <button onClick={() => setAbiertoSol(!abiertoSol)} style={{ width: '100%', padding: '12px', background: '#f1c40f', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>SOLICITANTES</span><FaChevronDown />
                </button>
                {abiertoSol && beneficiarios.filter(b => b.estado === 'solicitado').map(b => (
                  <div key={b.id} style={{ padding: '8px', border: '1px solid #eee', marginTop: '8px', borderRadius: '6px' }}>
                    <strong>{b.nombre}</strong><br/><button onClick={() => cambiarEstadoBeneficiario(b.id, 'aceptado')} style={{ background: '#2ecc71', color: 'white', border: 'none', fontSize: '10px', cursor: 'pointer', marginTop: '5px' }}>Aceptar</button>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '10px' }}>
                <button onClick={() => setAbiertoAce(!abiertoAce)} style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>ACEPTADOS</span><FaChevronDown />
                </button>
                {abiertoAce && beneficiarios.filter(b => b.estado === 'aceptado').map(b => (
                  <div key={b.id} style={{ padding: '8px', border: '1px solid #eee', marginTop: '8px', borderRadius: '6px' }}>
                    <strong>{b.nombre}</strong><br/><button onClick={() => cambiarEstadoBeneficiario(b.id, 'entregado')} style={{ background: '#34495e', color: 'white', border: 'none', fontSize: '10px', cursor: 'pointer', marginTop: '5px' }}>Entregar</button>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '10px' }}>
                <button onClick={() => setAbiertoEnt(!abiertoEnt)} style={{ width: '100%', padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>ENTREGADOS</span><FaChevronDown />
                </button>
                {abiertoEnt && beneficiarios.filter(b => b.estado === 'entregado').map(b => (
                  <div key={b.id} style={{ padding: '8px', color: '#2ecc71', marginTop: '8px' }}>✓ {b.nombre}</div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '10px' }}>
                <button onClick={() => setAbiertoRech(!abiertoRech)} style={{ width: '100%', padding: '12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>RECHAZADOS</span><FaChevronDown />
                </button>
                {abiertoRech && beneficiarios.filter(b => b.estado === 'rechazado').map(b => (
                  <div key={b.id} style={{ padding: '8px', background: '#fff5f5', border: '1px solid #ffd7d7', marginTop: '8px', borderRadius: '6px' }}>
                    <strong style={{ color: '#c0392b' }}>{b.nombre}</strong><br/><span style={{ fontSize: '10px' }}>{b.motivo}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

       {/* REPORTES */}
        {pantalla === 'reportes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {/* REPORTE DE ENTRADAS - GRÁFICO DE BARRAS */}
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <button 
                onClick={() => setRepEntradaAbierto(!repEntradaAbierto)} 
                style={{ width: '100%', padding: '18px', background: '#2980b9', color: 'white', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '17px', fontWeight: 'bold' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaArrowCircleDown /> REPORTE DE ENTRADAS (STOCK)
                </div>
                <FaChevronDown style={{ transform: repEntradaAbierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
              </button>
              
              {repEntradaAbierto && (
                <div style={{ padding: '25px', height: '320px' }}>
                  <Bar 
  key={repEntradaAbierto ? 'entrada-activa' : 'entrada-oculta'} 
  data={{
    labels: categoriasUnicas,
    datasets: [{
      label: 'Stock',
      data: categoriasUnicas.map(cat => 
        inventario.filter(i => i.categoria === cat).reduce((sum, item) => sum + item.cantidad, 0)
      ),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      borderRadius: 5,
    }]
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      y: {
        duration: 2000,
        from: 500 // Fuerza a que las barras empiecen desde abajo del canvas
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  }}
/>
                
                </div>
              )}
            </div>

            {/* REPORTE DE SALIDAS - GRÁFICO DE PASTEL */}
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <button 
                onClick={() => setRepSalidaAbierto(!repSalidaAbierto)} 
                style={{ width: '100%', padding: '18px', background: '#27ae60', color: 'white', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '17px', fontWeight: 'bold' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaArrowCircleUp /> REPORTE DE SALIDAS (ESTADOS)
                </div>
                <FaChevronDown style={{ transform: repSalidaAbierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
              </button>
              
              {repSalidaAbierto && (
                <div style={{ padding: '25px', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '280px', height: '280px' }}>
                    <Pie 
                      key={`pie-${repSalidaAbierto}`}
                      data={dataSalidas} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                          duration: 2000,
                          easing: 'easeOutBack'
                        },
                        plugins: { legend: { position: 'bottom' } }
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div> 
    </div>
  );
}

export default App;