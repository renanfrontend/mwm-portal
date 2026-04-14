#!/usr/bin/env bash
set -euo pipefail

# Script para fazer build em PRODUÇÃO com o mode correto
# Uso: ./build-prod.sh
# Resultado: dist/ pronto para Produção

echo "🔨 Iniciando build para PRODUÇÃO..."
npm run build

echo "✅ Build para PRODUÇÃO concluído com sucesso!"
echo "📁 Arquivos gerados em: dist/"
echo "🚀 Próximo passo: ./deploy-prod.sh <TAG>"
