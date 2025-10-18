# 🏝️ Pattaya Directory - Backend API

Express.js + MongoDB REST API for the Pattaya Directory event management platform.

## 🚀 Features

- ✅ RESTful API endpoints
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication
- ✅ Role-based authorization (Admin/User)
- ✅ Advanced filtering & sorting
- ✅ Pagination support
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Security headers (Helmet)
- ✅ Rate limiting
- ✅ Request logging (Morgan)
- ✅ Data compression

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
```

## 🔧 Configuration

Edit `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pattaya-directory
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@pattayadirectory.com
ADMIN_PASSWORD=Admin@123
```

## 🗄️ Database Setup

```bash
# Seed database with sample data
npm run seed
```

This will create:
- Admin user account
- 6 sample events
- 3 location records

## 🏃‍♂️ Running the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:5000`

## 📡 API Endpoints

### Events

```
GET    /api/events              - Get all events (with filters)
GET    /api/events/featured     - Get featured events
GET    /api/events/upcoming     - Get upcoming events
GET    /api/events/popular      - Get popular events
GET    /api/events/:id          - Get single event
POST   /api/events/:id/view     - Increment view count
POST   /api/events              - Create event (Admin)
PUT    /api/events/:id          - Update event (Admin)
DELETE /api/events/:id          - Delete event (Admin)
PATCH  /api/events/:id/feature  - Toggle featured (Admin)
```

### Query Parameters for GET /api/events

```
?type=concert              - Filter by event type
?location=Beach Road       - Filter by location
?priceCategory=free        - Filter by price category
?search=music              - Search in title/description
?sort=popular              - Sort by: date, popular, newest, price-low, price-high
?page=1                    - Page number
?limit=12                  - Items per page
```

### Authentication

```
POST   /api/auth/register       - Register user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user (Protected)
PUT    /api/auth/updatedetails  - Update user details (Protected)
PUT    /api/auth/updatepassword - Update password (Protected)
```

### Locations

```
GET    /api/locations           - Get all locations
GET    /api/locations/:id       - Get single location
POST   /api/locations           - Create location (Admin)
PUT    /api/locations/:id       - Update location (Admin)
DELETE /api/locations/:id       - Delete location (Admin)
```

## 🔐 Authentication

Protected routes require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Login to get token:

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@pattayadirectory.com",
  "password": "Admin@123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@pattayadirectory.com",
    "role": "admin"
  }
}
```

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "count": 6,
  "total": 6,
  "page": 1,
  "pages": 1,
  "data": [...]
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [...]
}
```

## 🧪 Testing with cURL

```bash
# Get all events
curl http://localhost:5000/api/events

# Get featured events
curl http://localhost:5000/api/events/featured

# Filter events
curl "http://localhost:5000/api/events?type=concert&sort=popular"

# Create event (requires admin token)
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Event",
    "description": "Event description",
    "date": "2025-12-31",
    "time": "20:00",
    "location": "Beach Road",
    "type": "concert",
    "price": 1000
  }'
```

## 📁 Project Structure

```
server/
├── config/
│   └── database.js         - MongoDB connection
├── controllers/
│   ├── authController.js   - Authentication logic
│   ├── eventController.js  - Event CRUD operations
│   └── locationController.js
├── middleware/
│   └── auth.js            - JWT authentication
├── models/
│   ├── Event.js           - Event schema
│   ├── Location.js        - Location schema
│   └── User.js            - User schema
├── routes/
│   ├── auth.js            - Auth routes
│   ├── events.js          - Event routes
│   └── locations.js       - Location routes
├── scripts/
│   └── seedData.js        - Database seeding
├── .env.example
├── index.js               - Main server file
└── package.json
```

## 🔒 Security Features

- Helmet for security headers
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- JWT token authentication
- Password hashing with bcrypt
- Input validation & sanitization
- MongoDB injection prevention

## 📝 License

MIT

## 👨‍💻 Author

fixmycvapp
```

---

## 🎉 **COMPLETE! YOUR BACKEND API IS READY!**

### ✨ **What You Got:**

1. ✅ **Complete Express Server** - Production-ready with security
2. ✅ **MongoDB Integration** - Mongoose models with validation
3. ✅ **JWT Authentication** - Secure user authentication
4. ✅ **CRUD Operations** - All event operations
5. ✅ **Advanced Filtering** - Type, location, price, search
6. ✅ **Sorting & Pagination** - Efficient data retrieval
7. ✅ **Admin Protection** - Role-based access control
8. ✅ **Seed Data** - Sample events for testing
9. ✅ **Error Handling** - Comprehensive error responses
10. ✅ **API Documentation** - Complete README

### 🚀 **Quick Start:**

```bash
# Install dependencies
cd server
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI

# Seed database
npm run seed

# Start server
npm run dev
```

### 📡 **Test the API:**

```bash
# Health check
curl http://localhost:5000/api/health

# Get all events
curl http://localhost:5000/api/events

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pattayadirectory.com","password":"Admin@123"}'
```

**Your production-ready backend API is complete! 🎊🚀**