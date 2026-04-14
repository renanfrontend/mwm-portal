#!/usr/bin/env bash
set -euo pipefail

# Script para fazer build em DESENVOLVIMENTO LOCAL com o mode correto
# Uso: ./build-dev.sh
# Resultado: dist/ pronto para Dev Local (localhost:8080)

echo "🔨 Iniciando build para DESENVOLVIMENTO LOCAL..."
npm run build -- --mode dev

echo "✅ Build para DEV concluído com sucesso!"
echo "📁 Arquivos gerados em: dist/"
echo "🖥️  Backend esperado em: http://localhost:8080/api"
