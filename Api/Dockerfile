# -------------------------
# Build deps
# -------------------------
FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# -------------------------
# Build (generate prisma)
# -------------------------
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate (glibc + openssl ok)
RUN npx prisma generate

# -------------------------
# Runtime
# -------------------------
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# (opcional pero recomendado)
RUN apt-get update && apt-get install -y ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app ./

EXPOSE 8800
CMD ["node", "app.js"]
