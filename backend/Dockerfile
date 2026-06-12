# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# Copy source and generate Prisma client
COPY . .
RUN npx prisma generate

# Build NestJS
RUN npm run build

# Production stage
FROM node:22-alpine

# Use production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Change ownership to non-root user
RUN chown -R node:node /app

# Switch to non-root user
USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
