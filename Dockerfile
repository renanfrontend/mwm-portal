# Estágio 1: Build da Aplicação React com Vite
# Nesta etapa o Vite lê as variáveis VITE_ em tempo de build
FROM node:20 AS builder

WORKDIR /app

# Argumentos de build para configurar a API em cada ambiente (prod/hml)
# Se não forem informados no docker build, caem nos defaults abaixo
ARG VITE_API_BASE_URL=""
ARG VITE_USE_MOCK_API="false"

# Expõe os argumentos como variáveis de ambiente para o processo de build do Vite
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_USE_MOCK_API=${VITE_USE_MOCK_API}

COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Gera o bundle estático já apontando para o backend correto
RUN npm run build

# -----------------------------------------------------------------

# Estágio 2: Servir a Aplicação com http-serve
# (Esta etapa substitui todo o bloco Nginx)
FROM node:20

# Define o diretório de trabalho
WORKDIR /app/dist

# Instala o 'http-serve' globalmente dentro da imagem
RUN npm install -g http-serve

# Copia SOMENTE os arquivos estáticos gerados no estágio 'builder'
# O destino é '.', que é o WORKDIR (/app)
COPY --from=builder /app/dist .
RUN cd /app/dist

# Expõe a porta 8080 (a porta que o http-serve usará)
EXPOSE 8080

# Comando para iniciar o servidor
# -s : Habilita o modo "Single Page Application" (SPA)
#      (Isto redireciona todos os 404s para o index.html, corrigindo seu erro)
# -p 8080: Diz ao servidor para rodar na porta 8080
CMD ["http-serve", ".", "-s", "-p", "8080"]
