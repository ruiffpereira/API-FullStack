# Usar uma imagem Node.js oficial como imagem base
FROM node:14

# Criar e definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Adicionar esta linha para reconstruir módulos nativos com node-gyp
RUN npm rebuild bcrypt --build-from-source

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a aplicação irá rodar
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "run" , "dev"]
