FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY apps/tickets apps/tickets
# COPY libs libs

RUN npm run build tickets

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/apps/tickets ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["/bin/sh", "-c", "npx prisma db push --schema apps/tickets/prisma/schema.prisma && node dist/main.js"]
