# Estágio 1: Build da Aplicação React com Vite
# (Esta etapa permanece a mesma, apenas limpei um 'cd')
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm run build

# -----------------------------------------------------------------

# Estágio 2: Servir a Aplicação com http-serve
# (Esta etapa substitui todo o bloco Nginx)
FROM node:20-alpine

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