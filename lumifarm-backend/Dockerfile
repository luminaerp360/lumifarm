# ═══════════════════════════════════════════════════════════
# Stage 1: Build
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ═══════════════════════════════════════════════════════════
# Stage 2: Production
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS production

# Non-root user for security
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev \
 && npm cache clean --force

# Copy compiled output
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs

EXPOSE 3400

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3400/docs > /dev/null 2>&1 || exit 1

CMD ["node", "dist/main"]
