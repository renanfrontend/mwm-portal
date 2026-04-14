#!/usr/bin/env bash
set -euo pipefail

# Script de deploy para PRODUÇÃO
# Uso: ./deploy-prod.sh <TAG>
# Exemplo: ./deploy-prod.sh 202603191250
# ⚠️ IMPORTANTE: VITE_USE_MOCK_API SEMPRE DEVE SER "false" EM PRODUÇÃO

if [ "${1-}" = "" ]; then
  echo "Uso: $0 <TAG-DA-IMAGEM>" >&2
  exit 1
fi

# ============================================================================
# CONFIGURAÇÕES - PRODUÇÃO
# ============================================================================
VITE_USE_MOCK_API="false"
VITE_API_BASE_URL="https://pgrsbpcapp-backend.lemonwater-1dd3241c.eastus2.azurecontainerapps.io/api"

IMAGE_TAG="$1"
REGISTRY="pgrsbpacr.azurecr.io"
IMAGE_NAME="bioplanta-frontend"
RESOURCE_GROUP="PRGS_BIOPLANTA"
CONTAINERAPP_NAME="bioplanta-frontend"

# 0) Build do Frontend (PRODUÇÃO)
echo "📦 Compilando para PRODUÇÃO (npm run build)..."
npm run build
echo "✅ Build concluído!"

# 1) Build da imagem Docker para PRODUÇÃO
docker build \
  --no-cache \
  --pull \
  -t "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}" \
  --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
  --build-arg VITE_USE_MOCK_API="${VITE_USE_MOCK_API}" \
  .

# 2) Login no ACR
az acr login --name "${REGISTRY%%.azurecr.io}"

# 3) Push da imagem para o ACR
docker push "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

# 4) Atualização da Container App de PRODUÇÃO com a nova imagem
az containerapp update \
  --name "${CONTAINERAPP_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --image "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}" \
  --set-env-vars \
    BACKEND_URL="${VITE_API_BASE_URL}" \
    VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
    VITE_USE_MOCK_API="${VITE_USE_MOCK_API}"

# 5) Listagem das revisões ativas
az containerapp revision list \
  --name "${CONTAINERAPP_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --output table
