# AI Learning Hub - Deployment Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Docker Deployment](#docker-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start development servers:**
```bash
# In one terminal - Backend (port 5001)
npm run server

# In another terminal - Frontend (port 5173)
npm run dev

# Or run both together:
npm run dev:all
```

4. **Seed initial content:**
```bash
node scripts/seedContent.js
```

5. **Access the app:**
- Frontend: http://localhost:5173
- API: http://localhost:5001
- Health check: http://localhost:5001/health

---

## Docker Deployment

### Quick Docker Setup

1. **Build and start with Docker Compose:**
```bash
docker-compose up -d
```

2. **Verify services:**
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f app
docker-compose logs -f db
```

3. **Seed content:**
```bash
docker-compose exec app node scripts/seedContent.js
```

4. **Access:**
- Frontend: http://localhost:5001 (served from app container)
- API: http://localhost:5001/api
- Database: localhost:5432

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Access app shell
docker-compose exec app sh

# Access database
docker-compose exec db psql -U ai_admin -d ai_dashboard

# View real-time logs
docker-compose logs -f

# Clean everything (including data!)
docker-compose down -v
```

---

## Environment Configuration

### .env File Variables

```bash
# Database
DATABASE_URL=postgresql://ai_admin:password123@localhost:5432/ai_dashboard

# Server
PORT=5001
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_here
JWT_EXPIRY=24h
BCRYPT_ROUNDS=10

# Admin
ADMIN_TOKEN=MySecureAdminToken_12345_ChangeThis

# Optional: External Services
HUBSPOT_API_KEY=
ANTHROPIC_API_KEY=
```

### Production Environment

For production deployment, use secure values:

```bash
# Generate secure JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate secure admin token:
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## Database Setup

### Local PostgreSQL

1. **Create database:**
```bash
createdb ai_dashboard
```

2. **Create admin user:**
```bash
psql -c "CREATE USER ai_admin WITH PASSWORD 'password123';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE ai_dashboard TO ai_admin;"
```

3. **Initialize schema:**
The app auto-creates tables on first run. To manually initialize:
```bash
psql -U ai_admin -d ai_dashboard -f server/db.js
```

### Backup & Restore

```bash
# Backup
pg_dump -U ai_admin ai_dashboard > backup.sql

# Restore
psql -U ai_admin ai_dashboard < backup.sql
```

---

## Production Deployment

### Heroku Deployment

1. **Create Heroku app:**
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:standard-0
```

2. **Set environment variables:**
```bash
heroku config:set \
  JWT_SECRET="$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')" \
  NODE_ENV=production
```

3. **Deploy:**
```bash
git push heroku main
heroku run node scripts/seedContent.js
```

### AWS EC2 Deployment

1. **Launch EC2 instance (Ubuntu 22.04)**
2. **Install dependencies:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt update && sudo apt install -y nodejs postgresql-client
```

3. **Clone and setup:**
```bash
git clone <repo> ai-learning-hub
cd ai-learning-hub
npm install
```

4. **Configure Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start server/server.js --name "ai-learning"
pm2 startup
pm2 save
```

### DigitalOcean App Platform

1. **Connect GitHub repo**
2. **Configure build command:** `npm install && npm run build`
3. **Configure run command:** `npm run server`
4. **Set environment variables** in App Platform settings
5. **Deploy**

---

## Monitoring & Maintenance

### Health Checks

```bash
# API health
curl http://localhost:5001/health

# Database connectivity
psql -c "SELECT 1" postgresql://ai_admin:password123@localhost:5432/ai_dashboard
```

### Log Monitoring

```bash
# Docker logs
docker-compose logs --follow app

# PM2 logs
pm2 logs ai-learning
```

### Backup Strategy

```bash
# Daily automated backup
0 2 * * * pg_dump -U ai_admin ai_dashboard | gzip > /backups/$(date +\%Y\%m\%d).sql.gz
```

---

## Performance Optimization

### Database Optimization

```sql
-- Create indexes for faster queries
CREATE INDEX idx_content_roles ON content USING GIN(roles);
CREATE INDEX idx_content_industries ON content USING GIN(industries);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_saved_content_user ON saved_content(user_id);
CREATE INDEX idx_history_user ON content_history(user_id);
```

### Caching Strategy

- Frontend: Use browser cache for static assets
- Backend: Implement Redis for session caching (optional)
- CDN: Serve static assets from CloudFlare/CloudFront

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5001/api/content

# Using k6
k6 run load-test.js
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5001
lsof -i :5001

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Test connection
psql postgresql://ai_admin:password123@localhost:5432/ai_dashboard

# Check Docker network
docker network inspect ai-learning-network
```

### Docker Build Issues

```bash
# Clear cache and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Seed Script Errors

```bash
# Verify database tables exist
docker-compose exec db psql -U ai_admin -d ai_dashboard -c "\dt"

# Check Node modules
docker-compose exec app npm list
```

---

## Scaling Considerations

1. **Database:** Consider managed PostgreSQL (AWS RDS, Azure Database)
2. **Caching:** Add Redis for session/query caching
3. **Load Balancer:** Use Nginx/HAProxy for multiple app instances
4. **CDN:** Serve frontend from CDN edge locations
5. **Search:** Consider Elasticsearch for full-text search optimization

---

## Support

For deployment issues:
1. Check logs: `docker-compose logs app`
2. Verify environment variables
3. Test database connectivity
4. Review health check endpoint

