# ============================================
# Multi-stage Dockerfile for the Portfolio
# Stage 1: Build (compile SCSS if needed)
# Stage 2: Runtime (minimal, just static files + node server)
# ============================================

# ----- Stage 1: Build -----
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Copy source
COPY . .

# Compile SCSS to CSS (if you have .scss files in scss/)
# RUN npx sass scss/:css/

# ----- Stage 2: Runtime -----
FROM node:20-alpine AS runtime

LABEL maintainer="info@manoj-dahal.com.np"
LABEL org.opencontainers.image.source="https://github.com/manojdahal/portfolio"
LABEL org.opencontainers.image.title="Manoj Dahal Portfolio"
LABEL org.opencontainers.image.description="Futuristic AI-themed portfolio website"

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init sqlite

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# Copy source
COPY --from=builder /app/server ./server
COPY --from=builder /app/api ./api
COPY --from=builder /app/database ./database
COPY --from=builder /app/public ./public
COPY --from=builder /app/css ./css
COPY --from=builder /app/js ./js
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/admin ./admin
COPY --from=builder /app/index.html ./
COPY --from=builder /app/config ./config

# Create data volume for SQLite
RUN mkdir -p /data
VOLUME ["/data"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Environment
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/portfolio.db

EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "server/app.js"]
