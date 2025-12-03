#!/bin/bash

echo "🤖 Iniciando Bot de KOH STORE..."
echo ""

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "❌ Error: No se encontró el archivo .env"
    echo ""
    echo "Por favor, crea el archivo .env con tus credenciales:"
    echo "1. Copia el archivo de ejemplo: cp .env.example .env"
    echo "2. Edita .env y agrega tu TOKEN y ADMIN_ID"
    echo ""
    echo "📖 Lee GUIA_RAPIDA.md para más información"
    exit 1
fi

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "✅ Iniciando bot..."
echo ""
npm start
