# 🚀 Guía de Despliegue en GitHub Pages

## Super Gamer - Configuración para GitHub Pages

Esta aplicación está configurada para funcionar tanto con backend real (FastAPI + MongoDB) como en modo estático para GitHub Pages.

## 📋 Opción 1: Despliegue Solo Frontend (GitHub Pages)

### Paso 1: Preparar el proyecto

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
yarn install
```

### Paso 2: Configurar para GitHub Pages

Edita `package.json` y agrega:

```json
{
  "homepage": "https://TU_USUARIO.github.io/TU_REPOSITORIO",
  "scripts": {
    "predeploy": "yarn build",
    "deploy": "gh-pages -d build"
  }
}
```

Instala gh-pages:

```bash
yarn add --dev gh-pages
```

### Paso 3: Configurar variables de entorno

Crea `.env.production` en la carpeta `frontend`:

```env
# Dejar vacío o con URL de GitHub Pages para activar modo mock
REACT_APP_BACKEND_URL=
```

### Paso 4: Build y Deploy

```bash
# Generar build de producción
yarn build

# Desplegar a GitHub Pages
yarn deploy
```

### Paso 5: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` → `/root`
5. Save

**¡Listo!** Tu app estará disponible en `https://TU_USUARIO.github.io/TU_REPOSITORIO`

---

## 📋 Opción 2: Despliegue Full Stack (Backend + Frontend)

### Backend (Railway/Render/Heroku)

**Usando Railway:**

1. Crea cuenta en [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecciona tu repositorio
4. Configura variables de entorno:
   ```
   MONGO_URL=tu_mongodb_uri
   DB_NAME=supergamer
   JWT_SECRET_KEY=tu_clave_secreta
   CORS_ORIGINS=https://TU_USUARIO.github.io
   ```
5. Railway detectará automáticamente el backend
6. Obtén la URL del backend desplegado

**Usando Render:**

1. Crea cuenta en [Render.com](https://render.com)
2. New → Web Service
3. Conecta tu repositorio
4. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Agrega variables de entorno (igual que Railway)

### Frontend (GitHub Pages)

1. Configura `.env.production`:
   ```env
   REACT_APP_BACKEND_URL=https://tu-backend.railway.app
   ```

2. Deploy:
   ```bash
   cd frontend
   yarn build
   yarn deploy
   ```

---

## 🔧 Modo Mock (Sin Backend)

Cuando `REACT_APP_BACKEND_URL` está vacío o apunta a GitHub Pages, la app usa:

- **localStorage** para persistencia de datos
- **Mock Backend Service** que simula todas las APIs
- **Autenticación local** (datos en navegador)

**Credenciales predefinidas en modo mock:**
- Email: `admin@supergamer.com`
- Contraseña: `admin`

**Nota:** Los datos se guardan en localStorage del navegador. Si limpias el caché, se pierden los datos.

---

## 📁 Estructura de Archivos para Exportar

```
super-gamer/
├── frontend/               # Aplicación React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── contexts/       # Context API (Auth, Theme)
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # API y Mock Backend
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.production
│
├── backend/                # API FastAPI (opcional)
│   ├── server.py
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── DEPLOY_GITHUB.md       # Esta guía
```

---

## 🎯 Características Soportadas

### ✅ Con Backend Real
- Autenticación JWT persistente
- Base de datos MongoDB
- Múltiples usuarios simultáneos
- Datos persistentes en servidor

### ✅ Con Mock Backend (GitHub Pages)
- Autenticación simulada
- Datos en localStorage
- Todas las funcionalidades visuales
- Ideal para demos y portfolios

---

## 🐛 Troubleshooting

### Página en blanco en GitHub Pages

**Solución:** Asegúrate de configurar `homepage` en `package.json`

### Error 404 en rutas

**Solución:** Crea `public/404.html` con el contenido de `public/index.html`

O usa HashRouter en lugar de BrowserRouter:
```javascript
import { HashRouter } from 'react-router-dom';
// En App.js
<HashRouter>
  {/* rutas */}
</HashRouter>
```

### CORS error con backend

**Solución:** Agrega tu URL de GitHub Pages en `CORS_ORIGINS` del backend

---

## 📞 Soporte

Para más ayuda:
- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)

---

**¡Disfruta tu Super Gamer App! 🎮⚡**