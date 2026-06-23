FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@10.27.0

RUN pnpm install

COPY . .

RUN pnpm build

RUN pnpm prune --prod

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

USER nodeuser

EXPOSE 3000

CMD ["node", "dist/server.js"]
