# Prague Stories

A gamified city exploration diary for Prague — built with the MERN stack.

Unlock 255 real Prague landmarks, earn XP, collect achievements, and read trilingual descriptions in English, Czech, and Chinese.

## Features

- JWT authentication (register / login)
- 255 preset Prague landmarks across 5 categories
- Hearthstone-style rarity system: common / rare / epic / mythic / legend — XP rewards 10 / 20 / 30 / 40 / 50
- Card border and name color driven by rarity; rarity filter dropdown on Explore grid and Map sidebar
- Check in to locations to unlock them and earn XP
- Add and edit custom locations
- Gamified dashboard: explorer level, XP bar, unlock %, 10 achievements
- Interactive Leaflet map with locked/unlocked markers
- AI-generated descriptions via Gemini API (EN / CZ / ZH), stored as three paragraphs
- Full UI localisation: English, Czech, and Chinese (ZH/EN/CZ toggle)
- Localized place names — Czech and Chinese names for all 255 locations
- Pixel art retro UI with [Ark Pixel Font](https://github.com/TakWolf/ark-pixel-font) in Chinese mode
- Geolocation-based check-in — must be within 200 m of the location to check in
- Google Maps navigation link on every location (opens turn-by-turn directions)
- Custom locations support a cover photo, description, and Wikipedia URL
- Automatic proximity detection: prompts check-in when within 100 m of an unvisited location
- Check-in success overlay: shows "CHECKED IN!", XP earned, and any unlocked achievements for 2.5 s before the modal auto-closes
- Explore grid refreshes instantly after check-in without waiting for the modal to close
- Explore grid sorts cards by proximity to the user's current GPS position (closest first), with live distance shown on each card ("340 m", "1.2 km")
- Gemini-generated pixel art images for every original location card, served as lossy WebP (quality 90)
- Fully responsive mobile layout: two-row navbar, 2-column grid, bottom-sheet modals
- Map sidebar: square pixel art banner + "View Detail" button that opens the full location modal on the Explore page
- Czech original name shown as a small caption below the EN/ZH card name on the explore grid
- Apple system font (PingFang SC) as immediate fallback for Chinese text when the pixel font fails to load on mobile

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 + Vite, React Router v6, Leaflet / react-leaflet |
| Backend  | Node.js + Express (ES modules) |
| Database | MongoDB + Mongoose |
| Auth     | JWT (jsonwebtoken + bcryptjs) |
| AI       | Google Gemini API |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)
- A [Google Gemini API key](https://aistudio.google.com/)

### Setup

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env and fill in:
#   MONGO_URI, JWT_SECRET, GEMINI_API_KEY

# 3. Seed the 255 Prague locations
cd server && npm run seed && npm run seed:new

# 4. Seed trilingual descriptions and localized names
npm run seed:static && npm run seed:localnames

# 5. Start the backend (port 5000)
npm run dev

# 6. Start the frontend (port 5173) — in a new terminal
cd ../client && npm run dev
```

Open `http://localhost:5173`, register an account, and start exploring.

> **Note:** Check-in distance validation is skipped when `NODE_ENV=development`, so you can test locally without being in Prague.

## Project Structure

```
prague-stories/
├── client/          # React + Vite frontend
│   ├── public/
│   │   └── fonts/        # Ark Pixel Font (self-hosted woff2 subsets)
│   └── src/
│       ├── components/   # Navbar, LocationCard, MapView, Dashboard…
│       ├── context/      # AuthContext, LanguageContext (i18n)
│       ├── pages/        # Explore, Map, Dashboard, Login, Register
│       ├── services/     # Axios API layer
│       └── utils/        # pixelArtMap, locName (localized names)
└── server/          # Express backend
    └── src/
        ├── models/       # User, Location (+ localizedNames), CheckIn
        ├── routes/       # /api/auth, /api/locations, /api/checkins, /api/user
        ├── controllers/  # Business logic
        ├── services/     # geminiService, gamification
        └── data/         # 255 preset locations, seed scripts, rarityMap
```

## API Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Returns JWT |
| GET | `/api/locations` | optional | All locations (with unlock status if authed) |
| GET | `/api/locations/:slug` | optional | Single location + lazy AI description |
| POST | `/api/locations` | ✓ | Add custom location |
| PUT | `/api/locations/:slug` | ✓ | Update location (name, coords, descriptions, rarity, cover photo, etc.) |
| DELETE | `/api/locations/:slug` | ✓ | Delete location (cascades check-ins) |
| GET | `/api/checkins` | ✓ | User's check-in history |
| POST | `/api/checkins/:slug` | ✓ | Check in, award XP, evaluate achievements |
| DELETE | `/api/checkins/:slug` | ✓ | Undo check-in |
| GET | `/api/user/progress` | ✓ | XP, level, unlock %, category stats |
| GET | `/api/user/achievements` | ✓ | All 10 achievements with unlock status |

## Gamification

**8 Explorer Levels:** Newcomer → Tourist → Wanderer → Explorer → Adventurer → Veteran → Master Explorer → Prague Legend

**10 Achievements:** First Step, Urban Explorer, Adventurer, Half Century, Prague Century, History Buff, Night Out, Hidden Gem Hunter, Castle Conqueror, Cartographer

## Localisation

The UI supports three languages toggled via the EN / CZ / ZH buttons in the navbar. All interface text, category labels, and location names switch accordingly. In Chinese mode the pixel font switches to [Ark Pixel Font (方舟像素字体)](https://github.com/TakWolf/ark-pixel-font) — a CJK-compatible pixel typeface — loaded from self-hosted woff2 files in `client/public/fonts/`.

## Environment Variables

```env
# server/.env
MONGO_URI=mongodb://localhost:27017/prague-stories
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_ORIGIN=https://prague-stories.vercel.app
PORT=5000
NODE_ENV=development
```

## License

MIT
