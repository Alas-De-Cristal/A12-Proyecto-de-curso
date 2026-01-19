# FoodConnect

FoodConnect es un sistema web para la gestión de donaciones, inventario y beneficiarios en bancos de alimentos. Permite registrar donaciones, gestionar inventario, visualizar reportes, geolocalizar usuarios y configurar preferencias del sistema.

---

## Tecnologías Utilizadas

### Frontend
- **React.js**: Librería principal para construcción de interfaces basadas en componentes.
- **JavaScript (ES6+)**
- **HTML5 / JSX**
- **CSS3**
- **React Icons**: Iconografía.
- **React Leaflet y Leaflet**: Visualización de mapas y geolocalización.
- **Geolocation API del navegador**: Obtención de ubicación GPS.
- **Axios**: Peticiones HTTP al backend.
- **Chart.js**: Gráficos para reportes e inventario.
- **File-saver y XLSX**: Exportación de datos a Excel.

### Backend
- **Node.js**: Entorno de ejecución del servidor.
- **Express.js**: Framework para crear APIs REST.
- **MongoDB**: Base de datos NoSQL para almacenar usuarios, donantes, alimentos y beneficiarios.
- **Mongoose**: Definición de modelos, validaciones y relaciones.
- **bcryptjs**: Cifrado seguro de contraseñas.
- **dotenv**: Manejo de variables de entorno.
- **CORS**: Comunicación entre frontend y backend.

### Herramientas de Desarrollo
- Visual Studio Code
- Git y GitHub
- Navegadores web para pruebas y depuración
- MongoDB Compass para visualización y gestión de la base de datos

---

## Estructura del Proyecto

foodconnect/
├── client/                     
│   ├── public/                 
│   └── src/
│       ├── components/         
│       │   ├── DropdownInfo.jsx
│       │   ├── MapaUsuario.jsx
│       │   ├── MenuButton.jsx
│       │   └── Sidebar.jsx
│       ├── layout/
│       │   └── DashboardLayout.jsx
│       ├         
│       ├── pages/              
│       │   ├── Beneficiarios.jsx
│       │   ├── Configuracion.jsx
│       │   ├── Donaciones.jsx
│       │   ├── Inventario.jsx
│       │   ├── Login.jsx
│       │   ├── Reportes.jsx
│       │   └── Usuarios.jsx
│       ├── styles/
│       │   ├── App.css
│       │   └── index.css
│       ├── App.js
│       ├── index.js
│       └── setupTests.js
│
├── server/                     
│   ├── models/                
│   │   ├── Alimento.js
│   │   ├── Beneficiario.js
│   │   ├── Donante.js
│   │   └── Usuario.js
│   ├── routes/                
│   │   ├── alimentos.js
│   │   └── usuarios.js
│   ├── node_modules/
│   ├── .env                    
│   ├── createAdmin.js          
│   ├── index.js               
│   └── seed.js                 
│
├── package-lock.json
├── package.json
└── README.md



---

## Funcionalidades Principales

### 1. Registro y Gestión de Donaciones
- Registrar productos donados, asociados a donantes o de forma anónima.
- Formulario dinámico con validaciones.
- Historial de donaciones con opciones de edición y eliminación.
- Resumen automático de productos más y menos donados.

### 2. Configuración del Sistema
- Cambio de idioma (español / inglés).
- Switch de modo claro / oscuro.
- Soporte y privacidad (Términos de servicio y Protección de datos en modales).
- Zona de peligro para eliminación de cuenta con confirmación.

### 3. Geolocalización de Usuarios
- Visualización de la ubicación del usuario en tiempo real mediante Leaflet y OpenStreetMap.
- Preparado para rastreo de beneficiarios y rutas de entrega futuras.

### 4. Reportes e Inventario
- Gráficos dinámicos de stock y prioridades.
- Exportación de datos a Excel.

### 5. Gestión de Usuarios
- Roles y permisos diferenciados (Admin, Usuario).
- Control de acceso a funcionalidades sensibles.

---

## Instalación y Ejecución

### Backend
```bash
cd server
npm install
npm start

# Frontend
cd client
npm install
npm start

Luego abrir: http://localhost:3000
