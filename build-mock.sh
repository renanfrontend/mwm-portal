#!/usr/bin/env bash
set -euo pipefail

# Script para fazer build COM DADOS MOCKADOS (para Design/Testes sem backend)
# Uso: ./build-mock.sh
# Resultado: dist/ com dados mockados para testes offline

echo "🔨 Iniciando build com DADOS MOCKADOS..."
npm run build -- --mode mock

echo "✅ Build com MOCK concluído com sucesso!"
echo "📁 Arquivos gerados em: dist/"
echo "🎨 Pronto para testes com Designer (sem depender da API)"
