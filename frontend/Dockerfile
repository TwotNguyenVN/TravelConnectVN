# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build Vite React app
RUN npm run build

# Production stage
FROM nginxinc/nginx-unprivileged:alpine-slim

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx-unprivileged listens on 8080 by default
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
