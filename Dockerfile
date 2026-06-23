FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@10.27.0

RUN pnpm install

COPY . .

RUN pnpm build

RUN pnpm prune --prod

CMD ["node", "dist/server.js"]
