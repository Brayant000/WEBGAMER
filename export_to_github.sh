#!/bin/bash

# Script para exportar Super Gamer a GitHub

echo "🚀 Exportando Super Gamer para GitHub..."

# Crear carpeta de exportación
EXPORT_DIR="super-gamer-export"
rm -rf $EXPORT_DIR
mkdir -p $EXPORT_DIR

# Copiar frontend
echo "📦 Copiando frontend..."
cp -r /app/frontend $EXPORT_DIR/
cd $EXPORT_DIR/frontend

# Limpiar archivos innecesarios
rm -rf node_modules build .env

# Crear .env.production para GitHub Pages
echo "📝 Creando .env.production..."
cat > .env.production << 'EOF'
# Dejar vacío para activar modo mock (GitHub Pages)
REACT_APP_BACKEND_URL=
EOF

# Crear .env.example
cat > .env.example << 'EOF'
# Para desarrollo local con backend
REACT_APP_BACKEND_URL=http://localhost:8001

# Para producción con backend desplegado
# REACT_APP_BACKEND_URL=https://tu-backend.railway.app
EOF

cd ..

# Copiar backend
echo "📦 Copiando backend..."
cp -r /app/backend $EXPORT_DIR/

# Limpiar backend
cd $EXPORT_DIR/backend
rm -rf __pycache__ .env

# Crear .env.example
cat > .env.example << 'EOF'
MONGO_URL=mongodb://localhost:27017
DB_NAME=super_gamer
JWT_SECRET_KEY=cambia-esta-clave-secreta-en-produccion
CORS_ORIGINS=http://localhost:3000
EOF

cd ..

# Copiar documentación
echo "📝 Copiando documentación..."
cp /app/README.md $EXPORT_DIR/
cp /app/DEPLOY_GITHUB.md $EXPORT_DIR/

# Crear .gitignore
echo "📝 Creando .gitignore..."
cat > $EXPORT_DIR/.gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
venv/
env/

# Build
build/
dist/

# Environment
.env
.env.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF

# Crear package.json configurado para GitHub Pages
echo "📝 Actualizando package.json para GitHub Pages..."
cd $EXPORT_DIR/frontend

# Crear script de configuración
cat > configure_github.sh << 'EOF'
#!/bin/bash
echo "Configurando para GitHub Pages..."
echo ""
echo "Ingresa tu usuario de GitHub:"
read GITHUB_USER
echo "Ingresa el nombre de tu repositorio:"
read REPO_NAME

# Actualizar package.json con homepage
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.homepage = 'https://$GITHUB_USER.github.io/$REPO_NAME';
pkg.scripts.predeploy = 'yarn build';
pkg.scripts.deploy = 'gh-pages -d build';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ package.json actualizado');
"

echo ""
echo "✅ Configuración completa!"
echo ""
echo "Ahora ejecuta:"
echo "  yarn install"
echo "  yarn add --dev gh-pages"
echo "  yarn deploy"
EOF

chmod +x configure_github.sh

cd ../..

echo ""
echo "✅ Exportación completa!"
echo ""
echo "📁 Archivos exportados en: $EXPORT_DIR/"
echo ""
echo "📋 Próximos pasos:"
echo "1. cd $EXPORT_DIR"
echo "2. Inicializa git: git init"
echo "3. Crea repositorio en GitHub"
echo "4. git add ."
echo "5. git commit -m 'Initial commit'"
echo "6. git remote add origin https://github.com/TU_USUARIO/TU_REPO.git"
echo "7. git push -u origin main"
echo ""
echo "Para desplegar en GitHub Pages:"
echo "  cd frontend"
echo "  ./configure_github.sh"
echo "  yarn install"
echo "  yarn add --dev gh-pages"
echo "  yarn deploy"
echo ""
echo "📖 Ver DEPLOY_GITHUB.md para más detalles"
