# AI Learning Hub

A production-ready SaaS platform that teaches users how to leverage AI for their specific role, industry, and department.

## 🚀 Quick Start

### Docker (Recommended)
```bash
docker-compose up -d
docker-compose exec app node scripts/seedContent.js
# Access: http://localhost:5001
```

### Local Development
```bash
npm install
npm run dev:all
node scripts/seedContent.js
# Frontend: http://localhost:5173
# API: http://localhost:5001
```

## 📚 Documentation

- **[README_AI_LEARNING_HUB.md](./README_AI_LEARNING_HUB.md)** - Complete project overview
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[API_DOCS.md](./API_DOCS.md)** - Complete API reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guides for 5 platforms
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's included

## ✨ Features

- ✅ User authentication (JWT)
- ✅ Role-based content filtering
- ✅ Prompt library with copy-to-clipboard
- ✅ Tutorials and case studies
- ✅ Admin content management panel
- ✅ Analytics dashboard
- ✅ Notification system
- ✅ Search and filtering
- ✅ Save/favorites functionality
- ✅ Responsive design

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, CSS3
- **Backend**: Node.js, Express 5
- **Database**: PostgreSQL 15
- **Auth**: JWT, bcryptjs
- **DevOps**: Docker, Docker Compose

## 📂 Project Structure

```
├── src/                 # Frontend (React)
├── server/              # Backend (Express)
├── scripts/             # Database seeding
├── docker-compose.yml   # Docker setup
└── Documentation/       # 5 comprehensive guides
```

## 🚀 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for guides:
- Heroku
- AWS EC2
- DigitalOcean
- Docker
- Custom VPS

## 💡 First Steps

1. Clone or download this folder
2. Copy `.env.example` to `.env` (if needed)
3. Run `docker-compose up -d` or `npm install && npm run dev:all`
4. Seed content: `node scripts/seedContent.js`
5. Access the app and start learning!

## 📞 Support

- Setup questions → See **SETUP_GUIDE.md**
- API questions → See **API_DOCS.md**
- Deployment help → See **DEPLOYMENT.md**
- Project overview → See **README_AI_LEARNING_HUB.md**

---

**Ready to teach AI? Let's go! 🚀**
