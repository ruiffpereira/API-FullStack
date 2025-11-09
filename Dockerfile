# Usar uma imagem Node.js oficial como imagem base
FROM node:20

# Criar e definir o diretório de trabalho
WORKDIR /app
RUN npm install -g pnpm

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN pnpm install

# Adicionar esta linha para reconstruir módulos nativos com node-gyp
# RUN pnpm rebuild bcrypt --build-from-source

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a aplicação irá rodar
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["pnpm", "run" , "dev"]
