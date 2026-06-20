# Prague Stories

A gamified city exploration diary for Prague — built with the MERN stack.

Unlock 106 real Prague landmarks, earn XP, collect achievements, and read AI-generated descriptions in English, Czech, and Chinese.

## Features

- JWT authentication (register / login)
- 106 preset Prague landmarks across 6 categories
- Check in to locations to unlock them and earn XP
- Add custom locations to the map
- Gamified dashboard: explorer level, XP bar, unlock %, 10 achievements
- Interactive Leaflet map with locked/unlocked markers
- AI-generated descriptions via Gemini API (EN / CZ / ZH)
- Full UI localisation: English, Czech, and Chinese (ZH/EN/CZ toggle)
- Localized place names — Czech and Chinese names for all 106 locations
- Pixel art retro UI with [Ark Pixel Font](https://github.com/TakWolf/ark-pixel-font) in Chinese mode
- Geolocation-based check-in — must be within 200m of the location to check in

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

# 3. Seed the 106 Prague locations
cd server && npm run seed

# 4. Seed Czech and Chinese place names
npm run seed:localnames

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
        └── data/         # 106 preset locations, seed scripts
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

## Changelog

### [0.3.0] — 2026-06-20

**Deployment and geolocation check-in**

- Added geolocation-based check-in: browser requests GPS on check-in and backend validates user is within 200m using Haversine formula; returns `403` if too far
- Distance check is bypassed when `NODE_ENV=development`
- Frontend surfaces geolocation and backend errors inline below the check-in button
- Production API URL (`https://prague-stories-api.onrender.com`) auto-selected via `import.meta.env.PROD`
- CORS now allows `https://prague-stories.vercel.app` in addition to `localhost:5173`
- Added `engines: { node: ">=18.0.0" }` to `server/package.json` for Render compatibility
- Added `.catch()` on `connectDB()` so missing `MONGO_URI` prints a clear error and exits with code 1

### [0.2.0] — 2026-06-20

**Full UI i18n and localized place names**

- Rewrote `LanguageContext` with a ~60-key `T` translations object and `useT()` hook; all components and pages now use it instead of hardcoded English strings
- Language switcher (EN / CZ / ZH) now switches the entire UI, not just location descriptions
- Added `localizedNames` field to the `Location` model; seeded Czech and Chinese names for all 106 locations (`npm run seed:localnames`)
- Added `getLocName()` utility; location names on cards, modals, map tooltips, and sidebar now display in the active language
- Integrated [Ark Pixel Font (方舟像素字体)](https://github.com/TakWolf/ark-pixel-font) for Chinese mode — self-hosted via two `unicode-range` `@font-face` declarations (Latin subset + Simplified Chinese subset) in `client/public/fonts/`
- CSS overrides ensure all `Press Start 2P` elements (including inline-styled ones) switch to ArkPixel in ZH mode
- Added pixel art images for 46 key landmarks
- Switched AI description backend from Claude (Anthropic) to Gemini (Google); env var renamed to `GEMINI_API_KEY`
- Expanded location count from 100 to 106

### [0.1.0] — 2026-06-20

**Initial release**

- JWT authentication (register / login / me)
- 100 preset Prague landmarks with seed script across 6 categories
- Check-in system: earn XP per location, undo support
- 8 explorer levels and 10 achievements with automatic unlock evaluation
- Lazy AI-generated descriptions via Claude API (EN / CZ / ZH)
- React + Vite frontend with pixel art retro UI (Press Start 2P / VT323 fonts)
- Explore grid with category filters and search
- Interactive Leaflet map with gold/grey unlocked/locked markers
- Location detail modal with description and Wikipedia link
- Dashboard: progress ring, XP bar, category breakdown, achievement grid
- Add custom locations form

## License

MIT
