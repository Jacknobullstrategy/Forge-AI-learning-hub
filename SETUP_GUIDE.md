# AI Learning Hub - Complete Setup Guide

## 🎯 One-Click Setup Options

### Option 1: Docker (Recommended for Production)

```bash
# Clone repository
git clone <repo-url> ai-learning-hub
cd ai-learning-hub

# Start with Docker Compose
docker-compose up -d

# Seed content (one-time)
docker-compose exec app node scripts/seedContent.js

# Access application
# Frontend: http://localhost:5001
# API: http://localhost:5001/api
# Database: localhost:5432
```

### Option 2: Local Development

```bash
# Prerequisites
# - Node.js 18+
# - PostgreSQL 12+

# Clone & setup
git clone <repo-url> ai-learning-hub
cd ai-learning-hub
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Start servers (in separate terminals)
npm run server          # Terminal 1: Backend
npm run dev            # Terminal 2: Frontend

# In another terminal: seed content
node scripts/seedContent.js

# Access
# Frontend: http://localhost:5173
# API: http://localhost:5001/api
```

### Option 3: Cloud Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for:
- Heroku
- AWS EC2
- DigitalOcean
- Azure

---

## 📋 Initial Configuration

### 1. Database Setup

#### With Docker
```bash
# Database auto-initializes on first run
docker-compose up -d db
# Wait 10 seconds, then app starts automatically
```

#### Local PostgreSQL
```bash
# Create database
createdb ai_dashboard

# Create admin user
psql -c "CREATE USER ai_admin WITH PASSWORD 'password123';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE ai_dashboard TO ai_admin;"

# Tables auto-create on first app run
npm run server
```

### 2. Environment Configuration

Create `.env` file in project root:

```bash
# Database
DATABASE_URL=postgresql://ai_admin:password123@localhost:5432/ai_dashboard

# Server
PORT=5001
NODE_ENV=development

# JWT (generate secure secret)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_here
JWT_EXPIRY=24h
BCRYPT_ROUNDS=10

# Admin
ADMIN_TOKEN=MySecureAdminToken_12345_ChangeThis

# Optional
HUBSPOT_API_KEY=
ANTHROPIC_API_KEY=
```

**Generate Secure Keys:**
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Admin Token
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 3. Seed Initial Content

```bash
# Local development
node scripts/seedContent.js

# Docker
docker-compose exec app node scripts/seedContent.js
```

---

## 🧪 Testing Your Setup

### Health Checks

```bash
# API health
curl http://localhost:5001/health
# Expected: {"status":"ok","timestamp":"..."}

# Database (with Docker)
docker-compose exec db psql -U ai_admin -d ai_dashboard -c "SELECT COUNT(*) FROM content;"
# Expected: count=18 (if seeded)
```

### Test User Account

```bash
# Register test user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123",
    "role": "Data Analyst",
    "industry": "Tech",
    "department": "Analytics"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123"
  }'
```

### Manual Testing Checklist

- [ ] Registration works
- [ ] Login works
- [ ] Can see prompts filtered by role
- [ ] Can search content
- [ ] Can open detail view
- [ ] Can copy prompt
- [ ] Can save to favorites
- [ ] Logout works
- [ ] Admin panel accessible

---

## 🚀 Next Steps

### Customize Content

1. **Edit seed data**: `src/aiLearningData.js`
2. **Add new roles/industries**: `server/data/options.js`
3. **Reseed database**: `node scripts/seedContent.js`

### Use Admin Panel

1. Login with admin account
2. Navigate to Admin tab
3. Create/edit/delete content
4. View analytics dashboard

### Configure for Production

1. Set strong JWT_SECRET
2. Set strong ADMIN_TOKEN
3. Update DATABASE_URL to production database
4. Set NODE_ENV=production
5. Configure SSL/TLS
6. Set up backups
7. Configure monitoring

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed production setup.

---

## 📚 Learning Resources

### Project Documentation
- [README_AI_LEARNING_HUB.md](./README_AI_LEARNING_HUB.md) - Project overview
- [API_DOCS.md](./API_DOCS.md) - Complete API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guides

### Technology Docs
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

## 🐛 Common Issues & Fixes

### Port 5001 Already in Use
```bash
# Find process
lsof -i :5001

# Kill it
kill -9 <PID>

# Or use different port
PORT=5002 npm run server
```

### PostgreSQL Connection Refused
```bash
# Check if running
pg_isready -h localhost

# Start PostgreSQL (macOS with brew)
brew services start postgresql@15

# Or use Docker
docker-compose up -d db
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Tables Not Created
```bash
# Manually initialize
psql -U ai_admin -d ai_dashboard -f server/db.js

# Or restart app
npm run server
```

### Seed Script Fails
```bash
# Verify database exists
psql -l | grep ai_dashboard

# Verify tables created
psql -U ai_admin -d ai_dashboard -c "\dt"

# Run seed script
node scripts/seedContent.js
```

---

## 📊 Development Commands

```bash
# Frontend
npm run dev              # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Backend
npm run server          # Start Express server

# Combined
npm run dev:all        # Run both frontend and backend

# Database
node scripts/seedContent.js  # Seed initial content

# Docker
docker-compose up -d    # Start services
docker-compose down     # Stop services
docker-compose logs     # View logs
docker-compose exec app sh  # Shell access to app
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Generate strong JWT_SECRET
- [ ] Generate strong ADMIN_TOKEN
- [ ] Set NODE_ENV=production
- [ ] Update DATABASE_URL to production database
- [ ] Configure HTTPS/SSL
- [ ] Set CORS origins correctly
- [ ] Implement rate limiting
- [ ] Set up database backups
- [ ] Configure monitoring/alerts
- [ ] Review environment variables
- [ ] Test password hashing
- [ ] Test JWT token expiry

---

## 📞 Support

**Getting Help:**
1. Check [API_DOCS.md](./API_DOCS.md) for API questions
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
3. Check this file for setup issues
4. Review GitHub issues
5. Open a new issue with details

**Report Bugs:**
Include:
- Error message (full stack trace)
- Steps to reproduce
- Your environment (OS, Node version, etc.)
- What you expected vs. what happened

---

## 🎉 You're All Set!

Your AI Learning Hub is ready to use!

**Next:**
1. Access the app at http://localhost:5173 (dev) or http://localhost:5001 (prod)
2. Register a test user
3. Explore the content library
4. Try the admin panel
5. Customize for your needs

---

**Questions?** Check the documentation or open an issue!

**Last Updated:** June 29, 2026
