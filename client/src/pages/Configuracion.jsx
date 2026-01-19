import React from 'react';
import { FaLayerGroup, FaChevronDown } from 'react-icons/fa';

export default function Configuracion({
  idioma,
  setIdioma,
  modoOscuro,
  setModoOscuro,
  confirmacionEliminar,
  setConfirmacionEliminar,
  setPantalla,
  modalAbierto,
  setModalAbierto,
  contenidoModal,
  setContenidoModal
}) {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Título Dinámico */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: modoOscuro ? '#f1f5f9' : '#1e293b', fontSize: '28px', fontWeight: '800' }}>
          {idioma === 'es' ? 'Configuración del ' : 'System '}
          <span style={{ color: '#3498db' }}>{idioma === 'es' ? 'Sistema' : 'Settings'}</span>
        </h2>
        <p style={{ margin: '5px 0 0 0', color: modoOscuro ? '#94a3b8' : '#64748b', fontSize: '14px' }}>
          {idioma === 'es' ? 'Gestiona tu cuenta y preferencias de la aplicación.' : 'Manage your account and app preferences.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. IDIOMA Y APARIENCIA */}
        <div style={{ 
          background: modoOscuro ? '#334155' : 'white', 
          borderRadius: '15px', 
          padding: '25px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
          border: modoOscuro ? '1px solid #475569' : '1px solid #f1f5f9',
          transition: '0.3s'
        }}>
          <h3 style={{ fontSize: '18px', color: modoOscuro ? '#f1f5f9' : '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaLayerGroup style={{ color: '#3498db' }} /> 
            {idioma === 'es' ? 'Preferencias Visuales' : 'Visual Preferences'}
          </h3>

          {/* Selector de Idioma */}
          <div style={{ padding: '15px', background: modoOscuro ? '#1e293b' : '#f8fafc', borderRadius: '12px', marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: modoOscuro ? '#cbd5e1' : '#475569', fontSize: '14px' }}>
              {idioma === 'es' ? 'Idioma del Sistema' : 'System Language'}
            </label>
            <select 
              value={idioma} 
              onChange={(e) => setIdioma(e.target.value)}
              style={{ 
                width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd',
                background: modoOscuro ? '#334155' : 'white', color: modoOscuro ? 'white' : 'black', cursor: 'pointer'
              }}
            >
              <option value="es">Español (Latinoamérica)</option>
              <option value="en">English (US)</option>
            </select>
          </div>

          {/* Switch de Modo Oscuro */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: modoOscuro ? '#1e293b' : '#f8fafc', borderRadius: '12px' }}>
            <div>
              <span style={{ fontWeight: '600', color: modoOscuro ? '#cbd5e1' : '#475569', display: 'block' }}>
                {idioma === 'es' ? 'Modo Visual' : 'Visual Mode'}
              </span>
              <span style={{ fontSize: '12px', color: modoOscuro ? '#94a3b8' : '#64748b' }}>
                {idioma === 'es' ? 'Cambia entre tema claro y oscuro' : 'Switch between light and dark theme'}
              </span>
            </div>
            <button 
              onClick={() => setModoOscuro(!modoOscuro)} 
              style={{
                background: modoOscuro ? '#f1f5f9' : '#334155', color: modoOscuro ? '#334155' : '#f1f5f9',
                border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              {modoOscuro ? '☀️ ' + (idioma === 'es' ? 'Claro' : 'Light') : '🌙 ' + (idioma === 'es' ? 'Oscuro' : 'Dark')}
            </button>
          </div>
        </div>

        {/* 2. SOPORTE Y PRIVACIDAD */}
        <div style={{ 
          background: modoOscuro ? '#334155' : 'white', borderRadius: '15px', padding: '25px', 
          border: modoOscuro ? '1px solid #475569' : '1px solid #f1f5f9' 
        }}>
          <h3 style={{ fontSize: '18px', color: modoOscuro ? '#f1f5f9' : '#1e293b', marginBottom: '20px' }}>
            {idioma === 'es' ? 'Soporte y Privacidad' : 'Support & Privacy'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            
            {/* Botón: Términos de Servicio */}
            <li 
              onClick={() => {
                setContenidoModal({
                  titulo: idioma === 'es' ? 'Términos de Servicio' : 'Terms of Service',
                  cuerpo: idioma === 'es' 
                    ? 'Al usar FoodConnect, usted acepta que esta plataforma es una herramienta de gestión de donaciones sin fines de lucro. El usuario se compromete a: 1. Registrar información verídica. 2. No utilizar los datos de donantes para fines comerciales. 3. Gestionar los inventarios de forma ética para asegurar que la ayuda llegue a quienes la necesitan. La organización no se hace responsable por el mal uso de las credenciales de acceso por parte del personal voluntario.'
                    : 'By using FoodConnect, you agree that this platform is a non-profit donation management tool. The user commits to: 1. Register truthful information. 2. Not use donor data for commercial purposes. 3. Manage inventories ethically to ensure aid reaches those in need. The organization is not responsible for the misuse of access credentials by volunteer personnel.'
                });
                setModalAbierto(true);
              }}
              style={{ 
                padding: '12px 10px', 
                borderBottom: modoOscuro ? '1px solid #475569' : '1px solid #f1f5f9', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', borderRadius: '8px'
              }}
            >
              <span style={{ color: modoOscuro ? '#cbd5e1' : '#475569' }}>
                {idioma === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
              </span>
              <FaChevronDown style={{ transform: 'rotate(-90deg)', fontSize: '12px', color: '#94a3b8' }} />
            </li>

            {/* Botón: Protección de Datos */}
            <li 
              onClick={() => {
                setContenidoModal({
                  titulo: idioma === 'es' ? 'Protección de Datos' : 'Data Protection',
                  cuerpo: idioma === 'es' 
                    ? 'En cumplimiento con las leyes internacionales de privacidad, FoodConnect garantiza que: 1. Sus datos personales están cifrados mediante SSL. 2. Los registros de beneficiarios son privados y solo accesibles por personal autorizado. 3. No vendemos ni compartimos su información con terceros. Usted tiene derecho a solicitar la eliminación total de sus registros a través del administrador del sistema.'
                    : 'In compliance with international privacy laws, FoodConnect guarantees that: 1. Your personal data is encrypted via SSL. 2. Beneficiary records are private and only accessible by authorized personnel. 3. We do not sell or share your information with third parties. You have the right to request the total deletion of your records through the system administrator.'
                });
                setModalAbierto(true);
              }}
              style={{ 
                padding: '12px 10px', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', borderRadius: '8px', marginTop: '5px'
              }}
            >
              <span style={{ color: modoOscuro ? '#cbd5e1' : '#475569' }}>
                {idioma === 'es' ? 'Protección de Datos' : 'Data Protection'}
              </span>
              <FaChevronDown style={{ transform: 'rotate(-90deg)', fontSize: '12px', color: '#94a3b8' }} />
            </li>
          </ul>
        </div>

        {/* 3. ZONA DE PELIGRO */}
        <div style={{ 
          background: modoOscuro ? '#451220' : '#fff1f2', borderRadius: '15px', padding: '25px', 
          border: modoOscuro ? '1px solid #9f1239' : '1px solid #ffe4e6' 
        }}>
          <h3 style={{ fontSize: '18px', color: '#e11d48', marginBottom: '10px' }}>
            {idioma === 'es' ? 'Zona de Peligro' : 'Danger Zone'}
          </h3>
          <p style={{ fontSize: '14px', color: modoOscuro ? '#fecdd3' : '#9f1239', marginBottom: '15px' }}>
            {idioma === 'es' ? 'Escribe BORRAR para confirmar la eliminación permanente:' : 'Type DELETE to confirm permanent deletion:'}
          </p>

          {/* Input de confirmación */}
          <input 
            type="text" 
            value={confirmacionEliminar}
            onChange={(e) => setConfirmacionEliminar(e.target.value.toUpperCase())}
            placeholder={idioma === 'es' ? 'Escribe aquí...' : 'Type here...'}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px', marginBottom: '15px',
              border: '1px solid #e11d48', background: modoOscuro ? '#1e293b' : 'white',
              color: modoOscuro ? 'white' : 'black'
            }}
          />

          <button 
            disabled={confirmacionEliminar !== (idioma === 'es' ? 'BORRAR' : 'DELETE')}
            onClick={() => {
              if(window.confirm(idioma === 'es' ? "¿Borrar cuenta definitivamente?" : "Delete account permanently?")){
                localStorage.removeItem('usuarioFoodConnect');
                window.location.reload();
              }
            }}
            style={{ 
              background: confirmacionEliminar === (idioma === 'es' ? 'BORRAR' : 'DELETE') ? '#e11d48' : '#94a3b8', 
              color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', 
              fontWeight: 'bold', cursor: confirmacionEliminar === (idioma === 'es' ? 'BORRAR' : 'DELETE') ? 'pointer' : 'not-allowed',
              width: '100%'
            }}
          >
            {idioma === 'es' ? 'Eliminar cuenta' : 'Delete account'}
          </button>
        </div>

      </div>

      {/* MODAL */}
      {modalAbierto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 10000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(6px)', padding: '20px', transition: '0.3s'
        }}>
          <div style={{
            background: modoOscuro ? '#1e293b' : 'white',
            width: '100%', maxWidth: '500px', borderRadius: '24px',
            padding: '40px', position: 'relative', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: modoOscuro ? '1px solid #334155' : '1px solid #f1f5f9',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>🛡️</div>
            
            <h2 style={{ 
              margin: '0 0 15px 0', 
              color: modoOscuro ? '#f1f5f9' : '#1e293b',
              fontSize: '24px', fontWeight: '800'
            }}>
              {contenidoModal.titulo}
            </h2>

            <div 
              style={{ 
                lineHeight: '1.6', 
                color: modoOscuro ? '#94a3b8' : '#64748b',
                marginBottom: '30px',
                textAlign: 'left',
                maxHeight: '300px',
                overflowY: 'auto',
                paddingRight: '10px',
                fontSize: '14px'
              }}
              dangerouslySetInnerHTML={{ __html: contenidoModal.cuerpo }} 
            />

            <button 
              onClick={() => setModalAbierto(false)}
              style={{
                width: '100%', padding: '15px', background: '#3498db', color: 'white',
                border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer',
                fontSize: '16px', boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
              }}
            >
              {idioma === 'es' ? 'Entendido, cerrar' : 'I understand, close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
