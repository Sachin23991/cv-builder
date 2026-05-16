# ─── Stage 1: Install deps (cached unless package.json changes) ───
# Fix #27: COPY package files first so node_modules layer is cached
# separately from source code. A source change won't force a reinstall.
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copy source AFTER install (cache miss only when code changes)
COPY . .

# Build-time env injection (NEXT_PUBLIC_* values are baked into the client bundle)
ARG NEXT_PUBLIC_BACKEND_URL
ARG BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

RUN npm run build

# ─── Stage 2: Slim production image ───────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/public          ./public
COPY --from=builder /app/.next/static    ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]