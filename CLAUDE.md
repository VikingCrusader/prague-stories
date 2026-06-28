# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Backend (run from server/)
npm run dev          # nodemon on port 5000
npm run start        # production start

# Frontend (run from client/)
npm run dev          # Vite dev server on port 5173
npm run build        # production build

# Data scripts (run from server/)
node src/data/seedLocations.js    # upsert seeded location cards (idempotent)
npm run export:locations          # export DB → static seed files
npm run sync:covers               # sync Cloudinary cover images to local
```

No test suite exists. There is no linter configured.

## Architecture

This is a MERN monorepo (`client/` + `server/`) with no shared package between them.

### Backend (`server/src/`)

Express app with ES modules (`"type": "module"`). Entry point is `index.js` — mounts four route groups:

- `/api/auth` — register, login, `GET /me`
- `/api/locations` — CRUD + cover upload; GET routes use `optionalAuth` (populates `req.user` when a JWT is present but doesn't block unauthenticated requests); write routes use `protect`
- `/api/checkins` — check-in, undo, history
- `/api/user` — XP progress, achievements

**Key patterns:**
- Location slugs are the canonical identifier throughout (not `_id`). All routes are `:slug`-based.
- `GET /api/locations` excludes the `description` field (too heavy for the grid). `GET /api/locations/:slug` includes it and triggers **lazy Gemini description generation** if any language is missing — it generates, saves to DB, and returns in the same request.
- GPS distance validation happens in the checkin controller. In `NODE_ENV=development` the check is skipped entirely so local testing works without being in Prague.
- Rarity and XP are coupled: `RARITY_XP` in `data/rarityMap.js` is the single source of truth. `createLocation` and `updateLocation` both call it to keep `xpReward` in sync with `rarity`.

**Models:**
- `Location` — `name` (EN display), `slug`, `localizedNames: { cz, zh }`, `labels[]`, `coordinates: { lat, lng }`, `description: { en, cz, zh }`, `rarity`, `xpReward`, `wikipediaUrl`, `coverImage`, `pixelArtKey`, `addedBy` (`null` = preset, `ObjectId` = user-added)
- `CheckIn` — `user`, `location` (ObjectId ref), `createdAt`
- `User` — `username`, `email`, `passwordHash`, `xp`, `achievements[]`

**Gamification** (`services/gamification.js`): `LEVELS` array and `ACHIEVEMENTS` array are the authoritative definitions for all level thresholds and achievement logic. `evaluateAchievements` runs on every check-in. Achievements fire once and are stored on the User document.

### Frontend (`client/src/`)

React 18 + Vite SPA, deployed to Vercel. `vercel.json` lives in `client/` (not repo root) for SPA rewrite rules to apply.

**Routing** (`App.jsx`): All routes use `<ProtectedRoute guestOk>`. `ProtectedRoute` auto-calls `continueAsGuest()` via `useEffect` when a `guestOk` route is accessed without a user session — so unauthenticated visitors land in guest mode instead of being redirected to `/login`.

**State:**
- `AuthContext` — `user` (JWT-authenticated), `guest` (sessionStorage flag), `loading`. The `guest` flag controls UI differences (no collect button, no add location, guest-specific titles).
- `LanguageContext` — `lang` (`en`/`cz`/`zh`), `zhVariant` (`cn`/`tw`). `useT(key)` is the translation hook used everywhere. `useConvert()` applies opencc-js for Traditional Chinese conversion. Language persists in `localStorage`.

**API layer** (`services/api.js`): Single axios instance pointing to `localhost:5000` in dev and `prague-stories-api.onrender.com` in prod. JWT attached via request interceptor from `localStorage`.

**i18n:** All UI strings live in the `T` object in `LanguageContext.jsx`. Location display names follow the rule: `name` IS the English display field; generic terms (church, bridge) are translated, proper place/person names stay Czech. `localizedNames.cz` and `localizedNames.zh` are always set alongside any change to `name`.

**Location descriptions:** The `description` field on list endpoints is excluded. `LocationDetail` fetches the single-location endpoint to get the full object including descriptions. The lazy Gemini fallback on the server means descriptions populate on first open.

**Pixel art:** `utils/pixelArtMap.js` maps slugs to local WebP paths (`/pixel-art/<filename>.webp`). New cards get pixel art generated externally and dropped into `client/public/pixel-art/`; the map entry must be added manually.

**Labels:** The primary label is always first in the array (used for AI description generation fallback). Label strings must match the keys in `LanguageContext`'s `T` object (`label.*`).

**Rarity:** Six tiers: `common / rare / superior / epic / mythic / legend`. XP: 10 / 20 / 30 / 50 / 70 / 100. The `superior` tier colour is `#2c8c03`.

## Deployment

- Frontend → Vercel (root set to `client/`)
- Backend → Render (`prague-stories-api.onrender.com`)
- Images → Cloudinary (`prague-stories/covers/<slug>`)
- DB → MongoDB Atlas
