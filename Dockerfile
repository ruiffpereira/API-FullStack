FROM node:20

WORKDIR /app
RUN npm install -g pnpm
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build
COPY config ./dist/config

EXPOSE 3001

CMD ["pnpm", "run", "start"]