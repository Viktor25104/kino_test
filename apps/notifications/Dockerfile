FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY apps/notifications apps/notifications
# COPY libs libs

RUN npm run build notifications

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/apps/notifications ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
