# Prague Stories

A gamified city exploration diary for Prague — built with the MERN stack.

Unlock 129 real Prague landmarks, earn XP, collect achievements, and read trilingual descriptions in English, Czech, and Chinese.

## Features

- JWT authentication (register / login)
- 129 preset Prague landmarks across 5 categories
- Check in to locations to unlock them and earn XP
- Add, edit, and delete custom locations
- Gamified dashboard: explorer level, XP bar, unlock %, 10 achievements
- Interactive Leaflet map with locked/unlocked markers
- AI-generated descriptions via Gemini API (EN / CZ / ZH)
- Full UI localisation: English, Czech, and Chinese (ZH/EN/CZ toggle)
- Localized place names — Czech and Chinese names for all 129 locations
- Pixel art retro UI with [Ark Pixel Font](https://github.com/TakWolf/ark-pixel-font) in Chinese mode
- Geolocation-based check-in — must be within 200m of the location to check in
- Google Maps navigation link on every location (opens turn-by-turn directions)
- Custom locations support a cover photo, description, and Wikipedia URL
- Automatic proximity detection: prompts check-in when within 100m of an unvisited location
- Check-in success overlay: shows "CHECKED IN!", XP earned, and any unlocked achievements for 2.5 s before the modal auto-closes
- Explore grid refreshes instantly after check-in without waiting for the modal to close
- Explore grid sorts cards by proximity to the user's current GPS position (closest first), with live distance shown on each card ("340 m", "1.2 km")
- 129 preset Prague locations across 5 categories (expanded through batch 7)
- 117 Gemini-generated pixel art images — every original location card has a unique illustration, served as lossy WebP (quality 90)

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

# 3. Seed the 129 Prague locations
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
        └── data/         # 129 preset locations, seed scripts
```

## API Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Returns JWT |
| GET | `/api/locations` | optional | All locations (with unlock status if authed) |
| GET | `/api/locations/:slug` | optional | Single location + lazy AI description |
| POST | `/api/locations` | ✓ | Add custom location |
| PUT | `/api/locations/:slug` | ✓ | Update location (name, coords, descriptions, category, cover photo, etc.) |
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

## Changelog

### [1.1.1] — 2026-06-21

**UI: rename check-in to collect; convert batch-7 pixel art to WebP**

- "Check In" → "Collect" (EN), "Sbírat" (CZ), "打卡" (ZH); filter "Discovered" → "My Collections"
- All 8 batch-7 pixel art images converted from PNG to WebP (quality 90)

### [1.1.0] — 2026-06-21

**Add 7 new preset locations (batch 7)**

- Nemocnice Motol, Atrium Flora, Café Louvre, Czech National Bank, Palladium Prague, Charles University Faculty of Arts, Lehká nejistota (Michal Trpák sculpture)
- All 7 fully attributed: coordinates, categories, XP/difficulty, EN/CZ/ZH descriptions and localized names

### [1.0.9] — 2026-06-21

**Detail modal 1:1 image; batch-6 pixel art WebP conversion**

- Location detail modal hero image is now a responsive 1:1 square (was fixed 220 px)
- All 6 batch-6 pixel art images converted from PNG to WebP (quality 90)

### [1.0.8] — 2026-06-21

**Add 6 new preset locations (batch 6)**

- Grand Hotel Prague Towers, Muzeum Policie ČR, Vyšehrad Railway Bridge, Great Strahov Stadium, Staroměstská vodárenská věž, Národní technická knihovna
- All 6 fully attributed: coordinates, categories, XP/difficulty, EN/CZ/ZH descriptions and localized names

### [1.0.7] — 2026-06-21

**Convert all pixel art to lossy WebP (quality 90)**

- All 117 pixel art images converted from PNG to WebP; `LocationCard` and `LocationDetail` updated accordingly

### [1.0.6] — 2026-06-21

**Complete pixel art coverage — 117 Gemini-generated images**

- Every location card now has a unique Gemini-generated pixel art illustration (117 images total, up from ~46)
- Covers all 5 categories across all 118+ active locations

### [1.0.5] — 2026-06-21

**Sort Explore grid by distance; show distance on every card**

- Explore grid now sorts location cards closest-first based on the user's live GPS position
- Each card displays the distance from the user's current location ("340 m", "1.2 km")
- Distance badge is hidden when GPS is unavailable; cards revert to server order until position is acquired

### [1.0.4] — 2026-06-21

**GPS corrections round 4 — 33 locations across cultural / natural / entertainment / hidden-gem**

- Largest fixes: Technical Museum lng ~2.3 km, Císařský Ostrov lng ~2.5 km, Háje lng ~2.9 km, Letňany lat ~1.8 km, Prokopské Valley lat ~1.5 km, Museum of Communism lat ~590 m (relocated building), Hvězda Game Reserve lat ~1.2 km

### [1.0.3] — 2026-06-21

**GPS corrections round 3 — 8 historical locations re-audited via Google Maps / Wikidata**

- Corrected Loreta (~200 m lng), Old Town Hall (~190 m lat), Schwarzenberg Palace (~250 m), Dalibor Tower (~110 m), Lobkowicz Palace (~100 m), Vítkov National Memorial (~480 m), Charles University Carolinum (~310 m lng), Olšanské hřbitovy (~640 m)

### [1.0.2] — 2026-06-21

**Remove Food category; second round of GPS corrections**

- Removed `food` category — 16 locations merged into `entertainment`; `Food Pilgrim` achievement replaced by `Night Out`
- Corrected 20 more GPS errors; largest: Sapa Praha ~2.4 km, Smíchovské nádraží ~890 m, Cross Club ~560 m, O2 Arena ~410 m

### [1.0.1] — 2026-06-21

**GPS coordinate corrections, in-app location editing, and dev-mode open permissions**

- Corrected GPS coordinates for 19 preset locations (errors ranged from ~80 m to ~2 km)
- Added `PUT /api/locations/:slug` and `EditLocationForm` — full in-modal editing of all location fields including EN/CZ/ZH names and descriptions
- Edit and delete now available to any authenticated user (dev convenience)
- Fixed Chinese modal title font size

### [1.0.0] — 2026-06-21

**Delete custom locations, 136-location dataset, localized names backfill, and player guide**

- Added `DELETE /api/locations/:slug` — owner-only delete for custom locations; cascades to check-ins; preset locations return 403
- Two-step confirm delete button in location detail modal (visible to owner only)
- Expanded preset dataset to 136 locations; backfilled EN/CZ/ZH descriptions and localized names for all
- Added `GUIDE.md` — player-facing how-to in a humorous RPG tone

### [0.9.2] — 2026-06-20

**Navigate to location detail after proximity check-in**

- After a successful proximity-prompt check-in, the app navigates to `/explore` and automatically opens the location detail modal for the checked-in location
- Route state is cleared after the modal opens so back/forward navigation does not re-open it

### [0.9.1] — 2026-06-20

**Fix: proximity check-in does not refresh the Explore grid**

- After a successful proximity-prompt check-in, `ProximityDetector` now dispatches a `proximity-checkin` browser event with the location slug
- `ExplorePage` and `MapPage` listen for this event and immediately flip the matching location to `unlocked: true` in their local state, updating the "N preset locations unlocked" counter and map markers without a full re-fetch

### [0.9.0] — 2026-06-20

**Check-in reliability and UX polish**

- Fixed repeated check-in failures ("Could not get your location"): `getCurrentPosition` now reuses the position already held by the background `watchPosition` (proximity detection) when it is less than 60 s old, making check-in from the location detail modal instant. Falls back to a fresh acquisition with a 15 s timeout and 30 s `maximumAge`
- Added "Locating…" pixel-art status label while geolocation is running, so the button no longer appears frozen
- Added check-in success overlay in the location detail modal — shows **CHECKED IN!** in green pixel font plus XP earned and any newly unlocked achievements for 2.5 s before the modal auto-closes
- Fixed grid not refreshing after check-in: the Explore grid now marks the location as discovered the instant the API call succeeds, not after the 2.5 s overlay completes
- Modal auto-close is handled by a `useEffect` with cleanup so a stale timer can never close a subsequently opened modal

### [0.8.0] — 2026-06-20

**Discovered filter**

- Added a "✓ Discovered" filter button to the Explore grid showing only locations the current user has checked in to
- Label localised in EN / CZ / ZH

### [0.7.0] — 2026-06-20

**Location detail cover image**

- Location detail modal now shows the pixel art image (e.g. `dancing-house.png`) as a full-width hero above the description
- Falls back to emoji + coloured header only when no image file exists
- User-uploaded `coverImage` (base64) takes priority over the pixel art path

### [0.6.0] — 2026-06-20

**Automatic proximity discovery**

- `watchPosition` runs in the background while the user is logged in (all pages)
- When the user enters a 100m radius of an unvisited location, a gold banner prompts "You discovered {name}! Check in now?"
- Check-in sends the already-captured GPS coords; server still validates within 200m
- On success, shows "+XP ★" for 2.5 seconds then auto-dismisses
- Each location is prompted at most once per session to avoid repeat notifications
- Prompt label fully localised in EN / CZ / ZH

### [0.5.0] — 2026-06-20

**Richer custom locations**

- Add Location form now accepts a cover photo (JPG/PNG/WebP, max 1 MB), stored as a base64 data URL in MongoDB
- Form now has a description textarea; user-provided description is stored as `description.en` and displayed immediately without waiting for AI generation
- AI lazy-generation now only triggers when the English description is missing (previously required all three languages to be present)
- Cover photo previews in the form header as soon as a file is selected
- Cover photo shown on location cards and in the detail modal header (with gradient overlay); falls back to pixel art for preset locations
- Google Maps navigation link is automatically included for all custom locations (generated from coordinates)

### [0.4.0] — 2026-06-20

**Google Maps navigation**

- Added a "Navigate on Google Maps" link to every location detail modal and map sidebar
- Link opens Google Maps directions to the location's coordinates (`/maps/dir/?api=1&destination=lat,lng`)
- Link label is fully localised: EN / CZ / ZH

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
- Added `localizedNames` field to the `Location` model; seeded Czech and Chinese names for all 136 locations (`npm run seed:localnames`)
- Added `getLocName()` utility; location names on cards, modals, map tooltips, and sidebar now display in the active language
- Integrated [Ark Pixel Font (方舟像素字体)](https://github.com/TakWolf/ark-pixel-font) for Chinese mode — self-hosted via two `unicode-range` `@font-face` declarations (Latin subset + Simplified Chinese subset) in `client/public/fonts/`
- CSS overrides ensure all `Press Start 2P` elements (including inline-styled ones) switch to ArkPixel in ZH mode
- Added pixel art images for 46 key landmarks (expanded to 117 in v1.0.6)
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
