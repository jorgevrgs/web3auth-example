FROM node:18-alpine3.16

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY . .

# install dependencies
RUN pnpm install

# expose port
EXPOSE 8080

CMD ["node", "server/server.mjs"]

