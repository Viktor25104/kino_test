FROM node:20-slim As builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN apt-get update -y && apt-get install -y openssl

RUN npm ci

COPY apps/auth apps/auth
# COPY libs libs (if any)

RUN npx prisma generate --schema apps/auth/prisma/schema.prisma

RUN npm run build auth

FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/apps/auth ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/auth/prisma ./apps/auth/prisma

CMD ["/bin/sh", "-c", "npx prisma migrate deploy --schema apps/auth/prisma/schema.prisma && node dist/main"]
