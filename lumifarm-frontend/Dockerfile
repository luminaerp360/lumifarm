# ═══════════════════════════════════════════════════════════
# Stage 1: Build Angular
# ═══════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=production

# ═══════════════════════════════════════════════════════════
# Stage 2: Serve with Nginx
# ═══════════════════════════════════════════════════════════
FROM nginx:1.27-alpine AS production

# Copy Angular SPA build output (Angular 17 application builder puts files in /browser)
COPY --from=builder /app/dist/rentium-frontend/browser /usr/share/nginx/html

# Custom nginx config (SPA routing + caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost/ > /dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
