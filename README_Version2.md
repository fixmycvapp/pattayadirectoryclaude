# 🏝️ Pattaya Directory

A modern event discovery platform for Pattaya, Thailand. Built with Next.js 14, TypeScript, and Express.

## ✨ Features

- 🔍 **Advanced Search & Filters** - Find events by type, location, price, and date
- 🎫 **Event Listings** - Beautiful card-based layout with hover animations
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🗺️ **Google Maps Integration** - See event locations on interactive maps
- 🎨 **Tropical Theme** - Eye-catching gradient design with blue and teal accents
- ✨ **Smooth Animations** - Powered by Framer Motion
- 🔐 **Admin Dashboard** - Secure CRUD operations for event management

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - Re-usable UI components
- **lucide-react** - Beautiful icons

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB installed and running
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/fixmycvapp/pattayadirectoryclaude.git
cd pattayadirectoryclaude
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

4. **Environment Setup**

Create `.env.local` in root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/pattaya-directory
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

5. **Run the development servers**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run server
```

6. **Open your browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
pattaya-directory/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── events/
│   │   ├── page.tsx         # Events listing
│   │   └── [id]/
│   │       └── page.tsx     # Event detail
│   └── contact/
│       └── page.tsx         # Contact page
├── components/              # React components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── search-bar.tsx
│   ├── event-card.tsx
│   ├── event-filters.tsx
│   ├── featured-events.tsx
│   ├── event-gallery.tsx
│   ├── map-embed.tsx
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities
│   ├── api.ts              # API client
│   ├── utils.ts            # Helper functions
│   ├── constants.ts        # App constants
│   └── types.ts            # TypeScript types
├── server/                  # Express backend
│   ├── index.js            # Server entry
│   ├── config/
│   │   └── database.js     # MongoDB config
│   ├── models/
│   │   ├── Event.js        # Event model
│   │   └── Location.js     # Location model
│   ├── routes/
│   │   ├── events.js       # Event routes
│   │   └── locations.js    # Location routes
│   ├── controllers/
│   │   ├── eventController.js
│   │   └── locationController.js
│   └── middleware/
│       └── auth.js         # JWT auth
└── public/                  # Static assets
```

## 🎯 API Endpoints

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Locations
- `GET /api/locations` - Get all locations

### Query Parameters
```
?type=concert          # Filter by event type
?location=Walking Street  # Filter by location
?price=free           # Filter by price category
?sort=popular         # Sort by popularity
?search=music         # Search events
```

## 🎨 Design System

### Colors
- **Primary Gradient**: Sky 400 → Blue 600
- **Accent**: Teal 500, Orange 500
- **Background**: Slate 50 (light), Slate 900 (dark)

### Components
- Rounded corners (xl)
- Shadow on hover
- Smooth transitions
- Card-based layouts

## 📝 Available Scripts

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run server` - Start Express backend

## 🔒 Authentication

The admin dashboard uses JWT authentication. To access admin features:

1. Create an admin user in MongoDB
2. Login to receive JWT token
3. Include token in Authorization header:
```
Authorization: Bearer <your_token>
```

## 🌍 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Backend (Railway/Heroku)
1. Create new app
2. Connect MongoDB Atlas
3. Set environment variables
4. Deploy from GitHub

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Pattaya tourism for inspiration

## 📧 Contact

For questions or support:
- Email: info@pattayadirectory.com
- Website: [pattayadirectory.com](https://pattayadirectory.com)

---

Made with ❤️ for Pattaya 🏝️