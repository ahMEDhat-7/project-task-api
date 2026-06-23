FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@10.27.0

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN pnpm install --prod --frozen-lockfile

FROM node:24-alpine AS production

WORKDIR /app

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

USER nodeuser

EXPOSE 3000

CMD ["node", "dist/server.js"]
