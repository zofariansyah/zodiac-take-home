# Backend Dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install OpenSSL (WAJIB untuk Prisma)
RUN apt-get update -y && apt-get install -y openssl libssl-dev

# Dependencies stage
FROM base AS deps
COPY package.json ./
COPY bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
