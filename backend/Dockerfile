# Backend container (Express + MongoDB)
# Build from repo root to reuse root .dockerignore:
#   docker build -f backend/Dockerfile -t resumemaker-backend .

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install deps first (better layer caching)
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Copy backend source (copy contents, not the folder itself)
COPY backend/. ./

EXPOSE 3001
CMD ["node", "server.js"]
