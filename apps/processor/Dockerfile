FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3003

CMD ["pnpm", "run", "start"]
