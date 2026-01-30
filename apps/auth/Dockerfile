FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY apps/auth apps/auth
# COPY libs libs (if any)

RUN npm run build auth

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/apps/auth ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["node", "dist/main.js"]
