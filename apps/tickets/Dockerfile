FROM node:20-slim AS builder

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci

COPY apps/tickets apps/tickets
# COPY libs libs (if any libs used)

# Generate Prisma Client
RUN npx prisma generate --schema apps/tickets/prisma/schema.prisma

RUN npm run build tickets

FROM node:20-slim

# Install OpenSSL for Prisma Runtime
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/apps/tickets ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copy Prisma schema for migrations
COPY --from=builder /usr/src/app/apps/tickets/prisma ./apps/tickets/prisma

CMD ["/bin/sh", "-c", "npx prisma db push --schema apps/tickets/prisma/schema.prisma && node dist/main.js"]
