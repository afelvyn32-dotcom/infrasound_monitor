# =========================================================================
# Multi-Stage Production Dockerfile for Infrasound Monitoring System
# =========================================================================

# Stage 1: Build the React Frontend (Vite)
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Install Backend Dependencies
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# Stage 3: Final Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy backend dependencies and source code
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY server/ ./server/

# Copy compiled frontend assets to client/dist for Express static serving
COPY --from=client-builder /app/client/dist ./client/dist

# Expose standard production port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the unified Node.js / Express / Socket.IO server
WORKDIR /app/server
CMD ["node", "src/server.js"]
