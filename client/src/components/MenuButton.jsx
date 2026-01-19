import React from "react";

export default function MenuButton({ texto, onClick, active, Icono }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 15px",
        marginBottom: "10px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        background: active ? "#3498db" : "transparent",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: active ? "bold" : "normal",
        transition: "0.2s",
      }}
    >
      {Icono && <Icono />}
      {texto}
    </button>
  );
}
