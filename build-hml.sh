#!/usr/bin/env bash
set -euo pipefail

# Script para fazer build em HOMOLOGAÇÃO com o mode correto
# Uso: ./build-hml.sh
# Resultado: dist/ pronto para HML

echo "🔨 Iniciando build para HOMOLOGAÇÃO..."
npm run build -- --mode hml

echo "✅ Build para HML concluído com sucesso!"
echo "📁 Arquivos gerados em: dist/"
echo "🚀 Próximo passo: ./deploy-hml.sh <TAG>"
