import React, { useState } from "react";
import { FaChevronDown, FaTag, FaLayerGroup } from "react-icons/fa";

export default function DropdownInfo({
  titulo,
  total,
  lista,
  color,
  tipo,
  userLogged,
  prepararEdicion,
  eliminarDonacion,
  extraerIdDelCorreo
}) {
  const [abierto, setAbierto] = useState(false);

  const listaConAnonimo =
    tipo === "usuarios"
      ? [
          { id: "0000", nombre: "DONANTE ANÓNIMO", correo: "0000@info.com", rol: "Sistema" },
          ...lista
        ]
      : lista;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          background: color,
          color: "white",
          border: "none",
          padding: "8px 15px",
          borderRadius: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "bold"
        }}
      >
        {titulo}: {total}
        <FaChevronDown
          style={{
            transform: abierto ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.3s"
          }}
        />
      </button>

      {abierto && (
        <div
          style={{
            background: "white",
            marginTop: "10px",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            maxHeight: "400px",
            overflowY: "auto"
          }}
        >
          {listaConAnonimo.map((item, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              {tipo === "usuarios" ? (
                <div>
                  <strong>{item.nombre}</strong>
                  <div style={{ fontSize: "12px" }}>
                    ID: {extraerIdDelCorreo(item.correo)}
                  </div>
                </div>
              ) : (
                <div>
                  <FaTag /> {item.nombre} — {item.cantidad}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
