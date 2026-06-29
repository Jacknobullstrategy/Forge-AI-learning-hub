# Build stage for frontend
FROM node:22-slim AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src ./src
COPY public ./public
COPY vite.config.js index.html sales-pipeline.html ./

# Build frontend
RUN npm run build

# Production stage
FROM node:22-slim

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy server files
COPY server ./server
COPY scripts ./scripts

# Copy built frontend from build stage
COPY --from=frontend-build /app/dist ./dist

# Expose ports
EXPOSE 5001 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "run", "server"]
