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
