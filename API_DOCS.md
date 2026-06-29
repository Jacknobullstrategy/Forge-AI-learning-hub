# AI Learning Hub - API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "Data Analyst",
  "industry": "Tech",
  "department": "Analytics"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "token": "eyJhbGc..."
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "token": "eyJhbGc..."
  }
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2026-06-29T19:00:00Z",
    "profile": {
      "role": "Data Analyst",
      "industry": "Tech",
      "department": "Analytics"
    }
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Profile Endpoints

### Get User Profile
```
GET /profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "role": "Data Analyst",
    "industry": "Tech",
    "department": "Analytics",
    "created_at": "2026-06-29T19:00:00Z"
  }
}
```

### Update User Profile
```
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "Manager",
  "industry": "Finance",
  "department": "Operations"
}
```

### Get Available Options
```
GET /profile/options
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roles": ["Data Analyst", "Manager", "Engineer", ...],
    "industries": ["Finance", "Tech", "Healthcare", ...],
    "departments": ["Analytics", "Operations", ...]
  }
}
```

---

## Content Endpoints

### List Content
```
GET /content?type=prompt&role=Data%20Analyst&industry=Tech&difficulty=intermediate
```

**Query Parameters:**
- `type`: `prompt`, `tutorial`, or `caseStudy`
- `role`: Filter by role
- `industry`: Filter by industry
- `difficulty`: `beginner`, `intermediate`, or `advanced`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "prompt",
      "title": "Analyze customer churn",
      "description": "Write SQL queries to identify churn patterns",
      "roles": ["Data Analyst"],
      "industries": ["Finance", "Tech"],
      "difficulty": "intermediate",
      "estimated_time": "5 min",
      "tags": ["SQL", "Analytics"],
      "content": {
        "prompt": "Write a SQL query that..."
      },
      "created_at": "2026-06-29T19:00:00Z"
    }
  ]
}
```

### Get Content Detail
```
GET /content/:id
Authorization: Bearer <token> (optional - tracks view if authenticated)
```

### Search Content
```
GET /content/search?q=churn
```

**Response:**
```json
{
  "success": true,
  "data": [
    { /* content objects */ }
  ]
}
```

### Create Content (Admin)
```
POST /content
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "prompt",
  "title": "New Prompt",
  "description": "Description here",
  "difficulty": "intermediate",
  "estimated_time": "5 min",
  "roles": ["Data Analyst", "Engineer"],
  "industries": ["Tech"],
  "tags": ["SQL"],
  "content": {
    "prompt": "Your prompt text here",
    "tips": "Pro tip text"
  }
}
```

### Update Content (Admin)
```
PUT /content/:id
Authorization: Bearer <token>
Content-Type: application/json

{ /* same as POST */ }
```

### Delete Content (Admin)
```
DELETE /content/:id
Authorization: Bearer <token>
```

### Save Content to Favorites
```
POST /content/:id/save
Authorization: Bearer <token>
```

### Remove from Favorites
```
DELETE /content/:id/save
Authorization: Bearer <token>
```

### Check if Saved
```
GET /content/:id/saved
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "saved": true
  }
}
```

---

## Analytics Endpoints

### Dashboard Analytics
```
GET /analytics/dashboard
Authorization: Bearer <token> (Admin only)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 42,
    "totalContent": 18,
    "totalViews": 156,
    "contentByType": {
      "prompt": 9,
      "tutorial": 5,
      "caseStudy": 3
    },
    "popularContent": [
      {
        "id": 1,
        "title": "Analyze customer churn",
        "view_count": 28
      }
    ],
    "engagement": {
      "usersWithSaves": 15,
      "usersWithViews": 32
    }
  }
}
```

### Content Analytics
```
GET /analytics/content/:id
Authorization: Bearer <token> (Admin only)
```

### User Analytics
```
GET /analytics/users
Authorization: Bearer <token> (Admin only)
```

### Track Event
```
POST /analytics/event
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventType": "prompt_copied",
  "contentId": 1,
  "metadata": { "custom": "data" }
}
```

---

## Notifications Endpoints

### Get Notifications
```
GET /notifications
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "type": "achievement",
      "title": "New Achievement",
      "message": "You've viewed 10 prompts!",
      "link": "/content/1",
      "read": false,
      "created_at": "2026-06-29T19:00:00Z"
    }
  ]
}
```

### Mark as Read
```
POST /notifications/:id/mark-read
Authorization: Bearer <token>
```

### Mark All as Read
```
POST /notifications/mark-all-read
Authorization: Bearer <token>
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., already saved) |
| 500 | Server Error |

---

## Rate Limiting

- Auth endpoints: 5 requests per minute per IP
- Content endpoints: 30 requests per minute per user
- Analytics endpoints: 10 requests per minute per user

Headers included in responses:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 28
X-RateLimit-Reset: 1782759900
```

---

## Examples

### Complete Flow

1. **Register:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "Data Analyst",
    "industry": "Tech",
    "department": "Analytics"
  }'
```

2. **Get content for user's role/industry:**
```bash
curl http://localhost:5001/api/content \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '?type=prompt&role=Data%20Analyst&industry=Tech'
```

3. **Save a prompt:**
```bash
curl -X POST http://localhost:5001/api/content/1/save \
  -H "Authorization: Bearer <token>"
```

4. **Get dashboard stats:**
```bash
curl http://localhost:5001/api/analytics/dashboard \
  -H "Authorization: Bearer <token>"
```

---

## Webhook Events (Future)

Future versions will support webhooks for:
- `content.created` - New content published
- `content.viewed` - Content viewed milestone
- `user.achievement` - User achievement unlocked
- `analytics.alert` - Analytics threshold crossed

---

## API Versioning

Current version: v1 (path prefix will be `/api/v1` in future versions)

Backward compatibility will be maintained for minor version updates.

