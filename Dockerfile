# Estágio 1: Build da Aplicação React com Vite
# Use uma imagem Node.js leve (baseada em Alpine Linux) para o build
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de definição de dependências
COPY package.json package-lock.json /app/

# Instala as dependências do projeto
RUN cd /app && npm install
# Copia todo o código-fonte da aplicação para o contêiner
COPY . .

# Executa o script de build para gerar os arquivos estáticos de produção
RUN npm run build

# Estágio 2: Servir a Aplicação com Nginx
# Use uma imagem Nginx oficial e leve
FROM nginx:stable-alpine

# Copie os arquivos estáticos gerados no estágio de build para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de tipos MIME para o Nginx
COPY mime.types /etc/nginx/mime.types

# Copia o arquivo de configuração customizado do Nginx (essencial para SPAs)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# O comando padrão da imagem Nginx já inicia o servidor.