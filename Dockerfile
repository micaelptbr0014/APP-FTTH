# Etapa 1: Build da aplicação React Vite
FROM node:20-alpine AS builder
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia código-fonte e compila
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx ultra-leve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove arquivos padrões do Nginx
RUN rm -rf ./*

# Copia o build estático gerado
COPY --from=builder /app/dist .

# Copia configuração otimizada do Nginx para SPA (React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 do container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
