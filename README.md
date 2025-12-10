# 🎮 Super Gamer - Plataforma de Videojuegos y Superhéroes

Plataforma web moderna para explorar y compartir contenido sobre videojuegos y superhéroes con sistema de administración y comentarios.

![Super Gamer](https://img.shields.io/badge/Super-Gamer-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=flat-square)

## ✨ Características

### 🎨 Diseño Dual
- **Modo Gaming:** Diseño cyberpunk oscuro con efectos neón (cyan/púrpura)
- **Modo Superhéroes:** Estilo pop-art claro tipo cómic (rojo/azul/amarillo)
- **Toggle Dark/Light:** Cambia entre modos en cualquier momento

### 👥 Sistema de Usuarios
- **Autenticación JWT** personalizada
- **Roles diferenciados:** Administrador y Usuario
- **Registro e inicio de sesión** seguros

### 🛡️ Panel de Administración
- Usuario admin predefinido: `admin@supergamer.com` / `admin`
- Agregar, editar y eliminar contenido
- Control total sobre items de ambas secciones

### 💬 Sistema de Comentarios
- Comentarios simples por item
- Solo usuarios autenticados pueden comentar
- Visualización en tiempo real

### 🎯 Navegación Intuitiva
- Página de selección entre Gaming y Superhéroes
- Tarjetas con imágenes, descripciones y enlaces oficiales
- Protección de rutas

## 🚀 Tecnologías

### Frontend
- **React 19** con Hooks
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **Shadcn/UI** componentes
- **React Router** navegación
- **Axios** para peticiones HTTP

### Backend
- **FastAPI** framework moderno de Python
- **MongoDB** base de datos NoSQL
- **JWT** autenticación con tokens
- **Bcrypt** encriptación de contraseñas
- **Motor** driver async de MongoDB

## 📦 Instalación Local

### Requisitos Previos
- Node.js 16+
- Python 3.9+
- MongoDB 5.0+
- Yarn

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env
cp .env.example .env
# Edita .env con tus configuraciones

# Iniciar servidor
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend

```bash
cd frontend

# Instalar dependencias
yarn install

# Configurar .env
cp .env.example .env
# Edita .env con la URL del backend

# Iniciar aplicación
yarn start
```

La aplicación estará disponible en `http://localhost:3000`

## 🌐 Despliegue

### GitHub Pages (Solo Frontend - Modo Mock)

Ver [DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md) para instrucciones detalladas.

**Resumen rápido:**

```bash
cd frontend
yarn add --dev gh-pages

# Configurar package.json con homepage
# Crear .env.production (REACT_APP_BACKEND_URL vacío)

yarn build
yarn deploy
```

### Full Stack (Backend + Frontend)

**Backend:** Railway, Render, o Heroku  
**Frontend:** GitHub Pages, Vercel, o Netlify  
**Base de Datos:** MongoDB Atlas

Ver [DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md) para guía completa.

## 👤 Credenciales de Administrador

**Email:** `admin@supergamer.com`  
**Contraseña:** `admin`

*Nota: Cambia estas credenciales en producción editando el archivo backend/server.py*

## 📁 Estructura del Proyecto

```
super-gamer/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Componentes Shadcn
│   │   │   ├── ItemCard.js      # Tarjeta de item
│   │   │   └── CommentSection.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.js   # Gestión autenticación
│   │   │   └── ThemeContext.js  # Gestión tema
│   │   ├── pages/
│   │   │   ├── AuthPage.js      # Login/Registro
│   │   │   ├── SelectionPage.js # Selección Gaming/Héroes
│   │   │   ├── GamingSection.js # Sección Videojuegos
│   │   │   └── HeroSection.js   # Sección Superhéroes
│   │   ├── services/
│   │   │   ├── api.js           # Cliente API
│   │   │   └── mockBackend.js   # Backend simulado
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── backend/
│   ├── server.py               # API FastAPI
│   ├── requirements.txt
│   └── .env
│
├── README.md                   # Este archivo
└── DEPLOY_GITHUB.md           # Guía de despliegue
```

## 🔑 Variables de Entorno

### Backend (.env)

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=super_gamer
JWT_SECRET_KEY=tu-clave-secreta-muy-segura
CORS_ORIGINS=http://localhost:3000,https://tu-dominio.com
```

### Frontend (.env)

```env
REACT_APP_BACKEND_URL=http://localhost:8001
# O tu URL de producción: https://tu-backend.railway.app
```

## 🎯 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Items (Videojuegos/Superhéroes)
- `GET /api/items?category=games|heroes` - Listar items
- `POST /api/items` - Crear item (admin)
- `PUT /api/items/{id}` - Actualizar item (admin)
- `DELETE /api/items/{id}` - Eliminar item (admin)

### Comentarios
- `GET /api/comments?item_id=X&category=Y` - Listar comentarios
- `POST /api/comments` - Crear comentario (autenticado)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 👨‍💻 Autor

Creado con ❤️ para la comunidad gamer y de superhéroes

## 🙏 Agradecimientos

- Imágenes de [Pexels](https://pexels.com)
- Iconos de [Lucide React](https://lucide.dev)
- Componentes UI de [Shadcn](https://ui.shadcn.com)
- Fuentes de [Google Fonts](https://fonts.google.com)

---

**¡Disfruta explorando el mundo de Super Gamer! 🎮⚡**