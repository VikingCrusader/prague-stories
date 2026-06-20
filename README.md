# Prague Stories

A gamified city exploration diary for Prague — built with the MERN stack.

Unlock 100 real Prague landmarks, earn XP, collect achievements, and read AI-generated descriptions in English, Czech, and Chinese.

## Features

- JWT authentication (register / login)
- 100 preset Prague landmarks across 6 categories
- Check in to locations to unlock them and earn XP
- Add custom locations to the map
- Gamified dashboard: explorer level, XP bar, unlock %, 10 achievements
- Interactive Leaflet map with locked/unlocked markers
- AI-generated descriptions via Claude API (EN / CZ / ZH)
- Pixel art retro UI

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 + Vite, React Router v6, Leaflet / react-leaflet |
| Backend  | Node.js + Express (ES modules) |
| Database | MongoDB + Mongoose |
| Auth     | JWT (jsonwebtoken + bcryptjs) |
| AI       | Anthropic Claude API (claude-haiku) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env and fill in:
#   MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY

# 3. Seed the 100 Prague locations
cd server && npm run seed

# 4. Start the backend (port 5000)
npm run dev

# 5. Start the frontend (port 5173) — in a new terminal
cd ../client && npm run dev
```

Open `http://localhost:5173`, register an account, and start exploring.

## Project Structure

```
prague-stories/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, LocationCard, MapView, Dashboard…
│       ├── context/      # AuthContext, LanguageContext
│       ├── pages/        # Explore, Map, Dashboard, Login, Register
│       ├── services/     # Axios API layer
│       └── utils/        # pixelArtMap, category helpers
└── server/          # Express backend
    └── src/
        ├── models/       # User, Location, CheckIn
        ├── routes/       # /api/auth, /api/locations, /api/checkins, /api/user
        ├── controllers/  # Business logic
        ├── services/     # claudeService, gamification
        └── data/         # 100 preset locations + seed script
```

## API Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Returns JWT |
| GET | `/api/locations` | optional | All locations (with unlock status if authed) |
| GET | `/api/locations/:slug` | optional | Single location + lazy AI description |
| POST | `/api/locations` | ✓ | Add custom location |
| GET | `/api/checkins` | ✓ | User's check-in history |
| POST | `/api/checkins/:slug` | ✓ | Check in, award XP, evaluate achievements |
| DELETE | `/api/checkins/:slug` | ✓ | Undo check-in |
| GET | `/api/user/progress` | ✓ | XP, level, unlock %, category stats |
| GET | `/api/user/achievements` | ✓ | All 10 achievements with unlock status |

## Gamification

**8 Explorer Levels:** Newcomer → Tourist → Wanderer → Explorer → Adventurer → Veteran → Master Explorer → Prague Legend

**10 Achievements:** First Step, Urban Explorer, Adventurer, Half Century, Prague Century, History Buff, Food Pilgrim, Hidden Gem Hunter, Castle Conqueror, Cartographer

## Environment Variables

```env
# server/.env
MONGO_URI=mongodb://localhost:27017/prague-stories
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
```

## License

MIT
