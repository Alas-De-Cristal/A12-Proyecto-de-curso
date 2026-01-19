import React, { useEffect, useState, useRef } from "react";
import { FaBoxOpen, FaUserPlus, FaTrash, FaEdit, FaUsers } from "react-icons/fa";

// Componente Donaciones
export default function Donaciones({
  donacion,
  setDonacion,
  guardarDonacion,
  inventario,
  setInventario,
  usuarios,
  userLogged,
  editandoId,
  setEditandoId,
}) {
  const [nombreDinamico, setNombreDinamico] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [verDonantes, setVerDonantes] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  const esAdmin = userLogged?.rol === "Admin";

  const estiloInput = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  };

  // ================= AUTOCOMPLETE DONANTE =================
  useEffect(() => {
    const entrada = donacion.nombreDonante?.toLowerCase().trim();
    if (!entrada) {
      setNombreDinamico("");
      setSugerencias([]);
      setDonacion(prev => ({ ...prev, donanteId: null }));
      return;
    }

    const matches = usuarios
      .filter(u => u.nombre.toLowerCase().includes(entrada))
      .slice(0, 5);

    setSugerencias(matches);

    const encontrado = usuarios.find(
      u => u.nombre.toLowerCase().trim() === entrada
    );

    if (encontrado) {
      setNombreDinamico(encontrado.nombre);
      setDonacion(prev => ({
        ...prev,
        donanteId: encontrado.id,
        nombreDonante: encontrado.nombre
      }));
    } else {
      setNombreDinamico("");
      setDonacion(prev => ({ ...prev, donanteId: null }));
    }
  }, [donacion.nombreDonante, usuarios, setDonacion]);

  // ================= TECLAS AUTOCOMPLETE =================
  const handleKeyDown = (e) => {
    if (!sugerencias.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % sugerencias.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + sugerencias.length) % sugerencias.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && sugerencias[selectedIndex]) {
        const sel = sugerencias[selectedIndex];
        setDonacion(prev => ({ ...prev, nombreDonante: sel.nombre, donanteId: sel.id }));
        setNombreDinamico(sel.nombre);
        setSugerencias([]);
      }
    }
  };

  // ================= DONAR COMO ANÓNIMO =================
  const donarAnonimo = () => {
    setDonacion(prev => ({
      ...prev,
      nombreDonante: "Anónimo / Público",
      donanteId: null,
    }));
    setNombreDinamico("Anónimo / Público");
    setSugerencias([]);
  };

  // ================= EDICIÓN =================
  const iniciarEdicion = (item) => {
    setDonacion({ ...item, nombreDonante: item.nombreDonante || "" });
    setEditandoId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= ELIMINAR DONACIÓN =================
  const eliminarDonacion = (id) => {
    if (!esAdmin) return;
    const confirm = window.confirm("¿Seguro que deseas eliminar esta donación?");
    if (!confirm) return;

    setInventario(inventario.filter(d => d._id !== id));

    fetch(`http://localhost:5000/api/donaciones/${id}`, { method: "DELETE" })
      .then(() => alert("✅ Donación eliminada"))
      .catch(() => alert("❌ Error al eliminar la donación"));
  };

  // ================= DESTACAR PRODUCTOS MÁS/MENOS DONADOS =================
  const resumenCantidades = () => {
    const resumen = {};
    inventario.forEach(item => {
      resumen[item.nombre] = (resumen[item.nombre] || 0) + Number(item.cantidad || 0);
    });
    const productos = Object.entries(resumen);
    if (!productos.length) return {};
    const mas = productos.reduce((a, b) => (b[1] > a[1] ? b : a));
    const menos = productos.reduce((a, b) => (b[1] < a[1] ? b : a));
    return { mas, menos };
  };

  const { mas, menos } = resumenCantidades();

  const highlight = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} style={{ background: "#f9f871" }}>{part}</span>
      ) : part
    );
  };

  // ================= RENDER =================
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "30px" }}>

        {/* FORMULARIO */}
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          borderTop: "6px solid #27ae60",
        }}>
          <h2 style={{ color: "#27ae60", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <FaBoxOpen /> Registro de Entrada de Suministros
          </h2>

          <form
            onSubmit={(e) => { e.preventDefault(); guardarDonacion(); }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
          >
            {/* NOMBRE DONANTE */}
            <div style={{ gridColumn: "1 / span 2", position: "relative" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#2c3e50" }}>Nombre del Donante</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                <input
                  ref={inputRef}
                  placeholder="Escriba el nombre registrado"
                  value={donacion.nombreDonante || ""}
                  onChange={(e) => {
                    const nombre = e.target.value;
                    const encontrado = usuarios.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());
                    setDonacion(prev => ({
                      ...prev,
                      nombreDonante: nombre,
                      donanteId: encontrado ? encontrado.id : null
                    }));
                  }}
                  onFocus={() => setInputFocus(true)}
                  onBlur={() => setTimeout(() => setInputFocus(false), 150)}
                  onKeyDown={handleKeyDown}
                  style={{
                    ...estiloInput,
                    border: nombreDinamico ? "2px solid #2ecc71" : "1px solid #ddd",
                  }}
                />
                <button
                  type="button"
                  onClick={donarAnonimo}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: "#f0f0f0",
                    cursor: "pointer",
                  }}
                >
                  Donar como Anónimo
                </button>
              </div>
              <div style={{
                background: "#f8f9fa",
                padding: "10px",
                borderRadius: "8px",
                marginTop: "5px",
                border: "1px solid #eee",
                color: nombreDinamico ? "#27ae60" : "#e74c3c",
                fontWeight: "bold",
                fontSize: "14px",
              }}>
                👤 {nombreDinamico || "Esperando nombre válido..."}
              </div>

              {/* Autocomplete */}
              {inputFocus && sugerencias.length > 0 && (
                <ul style={{
                  position: "absolute",
                  top: "70px",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  width: "100%",
                  zIndex: 10,
                  listStyle: "none",
                  padding: "5px 0",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}>
                  {sugerencias.map((u, idx) => (
                    <li
                      key={u.id}
                      onMouseDown={() => {
                        setDonacion(prev => ({ ...prev, nombreDonante: u.nombre, donanteId: u.id }));
                        setNombreDinamico(u.nombre);
                        setSugerencias([]);
                      }}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        background: selectedIndex === idx ? "#dfe6e9" : "transparent",
                      }}
                    >
                      {highlight(u.nombre, donacion.nombreDonante)} ({u.rol})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* PRODUCTO */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#2c3e50" }}>Nombre del Producto</label>
              <input
                placeholder="Ej: Arroz"
                value={donacion.nombre || ""}
                onChange={(e) => setDonacion({ ...donacion, nombre: e.target.value })}
                required
                style={{ ...estiloInput, marginTop: "5px" }}
              />
            </div>

            {/* CATEGORÍA */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#2c3e50" }}>Categoría</label>
              <select
                value={donacion.categoria || ""}
                onChange={(e) => setDonacion({ ...donacion, categoria: e.target.value })}
                required
                style={{ ...estiloInput, marginTop: "5px" }}
              >
                <option value="">Seleccione...</option>
                <option value="Granos">Granos y Cereales</option>
                <option value="Enlatados">Enlatados</option>
                <option value="Lácteos">Lácteos</option>
                <option value="Higiene">Higiene Personal</option>
                <option value="Aceites">Aceites y Grasas</option>
              </select>
            </div>

            {/* CANTIDAD / MEDIDA */}
            <div style={{ gridColumn: "1 / span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#2c3e50" }}>Cantidad</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={donacion.cantidad || ""}
                  onChange={(e) => setDonacion({ ...donacion, cantidad: e.target.value })}
                  required
                  style={{ ...estiloInput, marginTop: "5px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#2c3e50" }}>Medida</label>
                <select
                  value={donacion.unidadMedida || "u"}
                  onChange={(e) => setDonacion({ ...donacion, unidadMedida: e.target.value })}
                  style={{ ...estiloInput, marginTop: "5px" }}
                >
                  <option value="u">Unidades (Latas/Packs)</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="lb">Libras (lb)</option>
                  <option value="L">Litros (L)</option>
                </select>
              </div>
            </div>

            {/* FECHAS */}
            <div style={{ gridColumn: "1 / span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", background: "#f9f9f9", padding: "15px", borderRadius: "10px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#7f8c8d" }}>Fecha de Ingreso (Hoy)</label>
                <input type="text" value={new Date().toLocaleDateString()} disabled style={{ ...estiloInput, marginTop: "5px", background: "#eee", cursor: "not-allowed", color: "#95a5a6" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#e74c3c" }}>Fecha de Caducidad 🚨</label>
                <input type="date" value={donacion.fechaVencimiento || ""} onChange={(e) => setDonacion({ ...donacion, fechaVencimiento: e.target.value })} required style={{ ...estiloInput, marginTop: "5px", border: "1px solid #fab1a0" }} />
              </div>
            </div>

            <button type="submit" style={{ gridColumn: "1 / span 2", background: "#27ae60", color: "white", padding: "15px", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 10px rgba(39, 174, 96, 0.3)" }}>
              <FaUserPlus /> {editandoId ? "Actualizar Registro" : "Confirmar Ingreso a Bodega"}
            </button>
          </form>
        </div>

        {/* HISTORIAL */}
<div>
  <h3 style={{ color: "#f1f5f9", marginTop: 0, fontSize: "18px", marginBottom: "5px" }}>
    Últimos Movimientos
  </h3>

  {esAdmin && (
    <button
      onClick={() => setVerDonantes(!verDonantes)}
      style={{
        marginBottom: "10px",
        padding: "8px 12px",
        borderRadius: "6px",
        background: "#3498db",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        border: "none",
        cursor: "pointer"
      }}
    >
      <FaUsers /> {verDonantes ? "Ocultar Donantes" : "Ver Donantes"}
    </button>
  )}

  {/* Resumen productos */}
{mas && menos && (
  <div
    style={{
      marginBottom: "10px",
      fontSize: "14px",
      color: "inherit",
      fontWeight: 500
    }}
  >
    🌟 Mayor donación: <strong>{mas[0]}</strong> ({mas[1]}) | 🚨 Menor donación: <strong>{menos[0]}</strong> ({menos[1]})
  </div>
)}

          {(verDonantes || !esAdmin) && (
            <div>
              {inventario.map(item => (
                <div key={item._id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ flex: 1 }}>
                    {item.nombreDonante || "Anónimo / Público"} – {item.nombre} ({item.cantidad} {item.unidadMedida})
                  </span>
                  <button onClick={() => iniciarEdicion(item)} style={{ border: "none", background: "#f1c40f", color: "white", borderRadius: "6px", padding: "5px", cursor: "pointer" }}>✏️</button>
                  {esAdmin && (
                    <button onClick={() => eliminarDonacion(item._id)} style={{ border: "none", background: "#e74c3c", color: "white", borderRadius: "6px", padding: "5px", cursor: "pointer" }}>🗑️</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
