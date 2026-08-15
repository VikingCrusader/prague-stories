# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Backend (run from server/)
npm run dev          # nodemon on port 5000
npm run start        # production start
npm test              # Jest unit + controller integration tests (mongodb-memory-server)

# Frontend (run from client/)
npm run dev          # Vite dev server on port 5173
npm run build        # production build
npm test              # Jest unit/component tests
npm run test:e2e      # Playwright e2e (client/e2e/), mocks the backend via page.route

# Data scripts (run from server/)
node src/data/seedLocations.js    # upsert seeded location cards (idempotent)
node src/data/seedHistoryEvents.js # upsert History Timeline events (idempotent, $setOnInsert — see caveat below)
npm run export:locations          # export DB → static seed files
npm run sync:covers               # sync Cloudinary cover images to local

# Data scripts (run from client/)
npm run generate:covers           # rescan public/pixel-art/ → rebuild src/utils/coverManifest.json
```

There is no linter configured.

### Testing

- Server tests live in `server/__tests__/`. `rarityMap.test.js` and `gamification.test.js` are pure-function unit tests. `authController.test.js`, `locationController.test.js`, `checkinController.test.js`, `userController.test.js`, and `historyController.test.js` are integration tests that spin up an in-memory MongoDB (`mongodb-memory-server`) and drive the real Express app via `supertest` — they exercise actual Mongoose behavior (unique indexes, populate, lean) rather than mocking the models.
- `server/src/app.js` exports the Express app with no `listen()` call; `server/src/index.js` is the thin entry point that connects to Mongo and starts listening. Tests import `app.js` directly so they never need a real `MONGO_URI` or open a port.
- External calls (Cloudinary upload, Gemini description generation) are mocked in tests via `jest.unstable_mockModule`, not exercised for real.
- Client tests: `client/src/__tests__/` (Jest + RTL) for units/components, `client/e2e/` (Playwright) for full-page flows with the backend mocked via `page.route`.

## Architecture

This is a MERN monorepo (`client/` + `server/`) with no shared package between them.

### Backend (`server/src/`)

Express app with ES modules (`"type": "module"`). Entry point is `index.js` — mounts five route groups:

- `/api/auth` — register, login, `GET /me`
- `/api/locations` — CRUD + cover upload; GET routes use `optionalAuth` (populates `req.user` when a JWT is present but doesn't block unauthenticated requests); write routes use `protect`
- `/api/checkins` — check-in, history (no undo — check-ins are permanent once made)
- `/api/user` — XP progress, achievements
- `/api/history` — History Timeline events, read-only (`optionalAuth`, no write routes — content is hand-curated via a seed script, not user-submitted; see **History Timeline** below)

**Key patterns:**
- Location slugs are the canonical identifier throughout (not `_id`). All routes are `:slug`-based.
- `GET /api/locations` excludes the `description` field (too heavy for the grid). `GET /api/locations/:slug` includes it and triggers **lazy Gemini description generation** if any language is missing — it generates, saves to DB, and returns in the same request.
- GPS distance validation happens in the checkin controller. In `NODE_ENV=development` the check is skipped entirely so local testing works without being in Prague.
- Rarity and XP are coupled: `RARITY_XP` in `data/rarityMap.js` is the single source of truth. `createLocation` and `updateLocation` both call it to keep `xpReward` in sync with `rarity`.

**Models:**
- `Location` — `name` (EN display), `slug`, `localizedNames: { cz, zh }`, `labels[]`, `coordinates: { lat, lng }`, `description: { en, cz, zh }`, `rarity`, `xpReward`, `wikipediaUrl`, `coverImage`, `pixelArtKey`, `addedBy` (`null` = preset, `ObjectId` = user-added)
- `CheckIn` — `user`, `location` (ObjectId ref), `createdAt`
- `User` — `username`, `email`, `passwordHash`, `xp`, `achievements[]`
- `HistoryEvent` — `slug`, `era` (key into `data/historyEras.js`), `startYear` (numeric sort/timeline anchor, negative = BCE), `year` (display string, English-only regardless of UI language — see **History Timeline** below), `title`/`hookLine`/`summary: { en, cz, zh }`, `tone` (`humorous`/`serious`, stored but not yet read by the frontend), `relatedLandmarks: [{ slug, relation: { en, cz, zh } }]`, `wikipediaUrl`, `image` (optional static path, e.g. `/history/prehistory.webp`)

**Gamification** (`services/gamification.js`): `LEVELS` array and `ACHIEVEMENTS` array are the authoritative definitions for all level thresholds and achievement logic. `evaluateAchievements` runs on every check-in. Achievements fire once and are stored on the User document.

**Adding new locations (`data/seedLocations.js`):**
- Every entry needs a full `description: { en, cz, zh }` — all three languages, not just `en`.
- English description structure: an opening paragraph of ~50 words that introduces the location simply and humorously, followed by one or two main-text paragraphs with the substantive detail, followed by a final Bonus paragraph. CZ and ZH mirror this structure.
- Do not include Czech-name/place-name translations anywhere in the EN or ZH description text — in particular, no parenthetical Czech-translation note in the EN/ZH opening paragraph (e.g. no `Welcome to X (Český název)!` pattern).
- Don't add a `landmark` label to any new entry.
- `rarity` must be one of `common`, `rare`, `superior`, `epic`, `mythic` — never `legend` (reserved for the existing grand landmarks). `xpReward` stays in sync automatically via `RARITY_XP` in `data/rarityMap.js`.
- `coordinates` are supplied by the user for each new location — don't look them up.
- After writing the new entries, run `node src/data/seedLocations.js` (from `server/`) to upsert them into the database — just run it once the content is done, no need to ask first.

**History Timeline** (`models/HistoryEvent.js`, `data/historyEras.js`, `data/seedHistoryEvents.js`, `controllers/historyController.js`): a second, separate content type from Location — hand-curated historical events grouped into six eras, browsable at `/history` on the frontend. Only Era 1 (`legends-origins`, "Legends & Origins") has real content so far; the other five exist only as placeholders. `data/historyEras.js` is a static config (same reasoning as `RARITY_XP` in `rarityMap.js` — small, rarely-changing enum, not worth a DB collection) listing all six eras with `key`, `order`, `themeClass`, `title: { en, cz, zh }`, and `hasContent` (`true` only for `legends-origins`; flip it manually once an era's events are seeded). `GET /api/history` returns `{ eras, events }` in one payload — no list/detail split like `/api/locations`, since event copy is a few short hand-written sentences rather than a heavy lazily-generated description. Each event's `relatedLandmarks` stores bare Location slugs; the controller resolves them against the live `locations` collection in one batched query, enriches each with the full Location document (`-description` projection) plus a per-request `unlocked` flag computed the same way `getLocations` does it (via `CheckIn` lookup against `optionalAuth`'s `req.user`), and **silently drops any slug that doesn't resolve** rather than sending the client a dead link.

**Adding new history events (`data/seedHistoryEvents.js`):**
- Every event needs `title`, `hookLine` (one-sentence hook), and `summary` (2–3 sentences) in all three languages.
- `era` must match a `key` in `data/historyEras.js`. `startYear` is the numeric sort/timeline-position anchor (negative = BCE) — for legendary/undated content, anchor it to the era's own conventional/narrative dating rather than a stricter archaeological date if the two diverge, so the timeline still reads in the intended story order (see the comment on `founding-of-vysehrad` for the actual case this came up).
- `relatedLandmarks` slugs must already exist in the `Location` collection — grep `seedLocations.js` (or query the live DB) before adding one, since an unresolved slug is silently dropped by the controller, not an error you'll see. **Known caveat:** the `prague-castle`, `st-vitus-cathedral`, and `vysehrad` Location slugs currently have mismatched `name` fields (e.g. slug `prague-castle` is named "St. Vitus Cathedral") — a pre-existing production data bug, unrelated to this feature. Avoid linking to those three slugs until it's fixed.
- Chinese text follows the same rule as Location descriptions: no parenthetical foreign-language name glosses (e.g. no `莉布谢（Libuše）`) — just the Chinese name. A genuine content aside (not a name translation) is fine to keep in parentheses.
- `image` is optional — a static file dropped into `client/public/history/` and referenced by its `/history/<file>.webp` path; renders as a banner between the summary and the Wikipedia link when present.
- After writing new entries, run `node src/data/seedHistoryEvents.js` (from `server/`) to upsert them — just run it once content is done, no need to ask first. It's `$setOnInsert`-based like `seedLocations.js`, so **editing an already-seeded event's fields in the source file does not update the live DB** on a re-run — sync a live edit manually (e.g. `HistoryEvent.updateOne({ slug }, { $set: { ... } })`) or delete-and-reseed.

### Frontend (`client/src/`)

React 18 + Vite SPA, deployed to Vercel. `vercel.json` lives in `client/` (not repo root) for SPA rewrite rules to apply.

**Routing** (`App.jsx`): All routes use `<ProtectedRoute guestOk>`. `ProtectedRoute` auto-calls `continueAsGuest()` via `useEffect` when a `guestOk` route is accessed without a user session — so unauthenticated visitors land in guest mode instead of being redirected to `/login`.

**State:**
- `AuthContext` — `user` (JWT-authenticated), `guest` (sessionStorage flag), `loading`. The `guest` flag controls UI differences (no collect button, no add location, guest-specific titles).
- `LanguageContext` — `lang` (`en`/`cz`/`zh`), `zhVariant` (`cn`/`tw`). `useT(key)` is the translation hook used everywhere. `useConvert()` applies opencc-js for Traditional Chinese conversion. Language persists in `localStorage`.

**API layer** (`services/api.js`): Single axios instance pointing to `localhost:5000` in dev and `prague-stories-api.onrender.com` in prod. JWT attached via request interceptor from `localStorage`.

**i18n:** All UI strings live in the `T` object in `LanguageContext.jsx`. Location display names follow the rule: `name` IS the English display field; generic terms (church, bridge) are translated, proper place/person names stay Czech. `localizedNames.cz` and `localizedNames.zh` are always set alongside any change to `name`.

**Location descriptions:** The `description` field on list endpoints is excluded. `LocationDetail` fetches the single-location endpoint to get the full object including descriptions. The lazy Gemini fallback on the server means descriptions populate on first open.

**Pixel art:** `utils/pixelArtMap.js` maps a `pixelArtKey`/label to an emoji, used as the last-resort fallback when no image loads at all. New cards get pixel art generated externally and dropped into `client/public/pixel-art/`; the map entry must be added manually.

**Cover images (local-first):** Location covers load from `client/public/pixel-art/` before ever touching Cloudinary, to keep image traffic off Cloudinary's quota — Cloudinary stays fully wired up as the fallback/upload backend, just not the default read path. `utils/coverManifest.json` (generated by `npm run generate:covers`, see Commands) maps `slug -> filename`, since files are named `<slug>.<ext>` or `<slug>-v<timestamp>.<ext>` (the versioned form is a cache-buster used both by regenerated external pixel art and by the dev-mode cover-upload endpoint, which also patches this manifest directly — see `updateCoverManifest` in `locationController.js`). `utils/localCover.js`'s `getLocalCoverPath(slug)` does the lookup. `LocationCard`, `LocationDetail`, and `MapPage`'s `SidebarDetail` each try, in order: local manifest match → `location.coverImage` (Cloudinary) → emoji fallback (`getArt`). Because local always wins when a manifest entry exists, a cover edited through the app (which only touches Cloudinary + the DB in production — see `uploadCoverImage`) won't visibly update until the local copy is refreshed too: run `node src/data/syncCovers.js --refresh` (server/) to re-download every location's current Cloudinary image over its stale local file (plain `node src/data/syncCovers.js`, no flag, only fills in slugs with no local file at all), then `npm run generate:covers` (client/) to rebuild the manifest. After manually dropping new art into `pixel-art/` outside the upload endpoint, rerun `npm run generate:covers` to pick it up.

**Labels:** The primary label is always first in the array (used for AI description generation fallback). Label strings must match the keys in `LanguageContext`'s `T` object (`label.*`).

**Rarity:** Six tiers: `common / rare / superior / epic / mythic / legend`. XP: 10 / 20 / 30 / 50 / 70 / 100. The `superior` tier colour is `#2c8c03`.

**History Timeline** (`pages/HistoryPage.jsx`, `components/history/`, `styles/history.css`): `/history` renders every seeded event as a continuous vertical feed (`HistoryEventSection`, one per event) next to a sticky sidebar nav (`HistorySidebar`, grouped by era) — a normal scrollable page with persistent navigation, not a click-to-swap detail pane. `HistoryPage` tracks which sidebar entry is highlighted with a plain `scroll` listener (rAF-throttled) that finds the last section whose top has crossed a trigger line near the top of the viewport, not `IntersectionObserver` — an earlier version using the observer's `isIntersecting` entries picked the wrong "active" section when multiple sections partially overlapped the trigger band. Clicking a sidebar entry calls `scrollIntoView({ behavior: 'smooth' })` on the matching section.
  - **Sticky-positioning gotcha:** `.guide-page` (shared by `GuidePage`, `RandomDrawPage`, and `HistoryPage`) sets `overflow-y: auto` in `pixelart.css`. `#root` only has `min-height` (not `height`), so `.guide-page` never actually needs to scroll internally in practice — the real scrolling always happens at the window level — but the `overflow-y: auto` declaration alone still makes it a CSS "scroll container", which silently breaks `position: sticky` on any descendant (sticky computes against the nearest scroll container, and `.guide-page`'s own `scrollTop` never moves). `history.css` overrides it back to `overflow-y: visible`, scoped to `.history-page` only — don't remove that override, and don't add `position: sticky` inside `.guide-page` on another page without adding the same kind of scoped override.
  - **Sidebar z-index gotcha:** `.history-sidebar` sets `z-index: 10` — not decorative. `.loc-card` (used inside the feed's `.location-grid`) is `position: relative`, and both it and the sticky sidebar are otherwise `z-index: auto`, which stack by DOM order — the feed's cards come after the sidebar in the markup, so without an explicit z-index they paint *over* the sidebar as they scroll underneath it. Only visible on mobile (below the `820px` breakpoint), where `.history-layout` stacks to a column and the full-width sidebar and full-width feed share the same horizontal space — on desktop they sit side by side and never visually overlap, so this is easy to break without noticing on a desktop-only check. Don't remove the z-index.
  - Related landmarks render as the actual `LocationCard` component inside the shared `.location-grid` class from `pixelart.css` (Explore's own grid, completely unwrapped) so card sizing/equal-row-height matches Explore exactly. The relation caption text renders in a *second*, separate `.location-grid` directly below the card grid, using the identical `grid-template-columns` — two grids of equal width with the same `auto-fill` track always resolve to the same column boundaries, so the Nth caption lines up under the Nth card. An earlier version put the caption inside each card's own wrapper, which broke the grid's equal-height stretch; don't reintroduce a per-card wrapper without solving that again.
  - `unlocked` is force-set to `true` when a landmark is passed to `LocationCard` here — History isn't a discovery/gamification context (the event text already names the place), so Explore's "???" mystery treatment never applies on this page, regardless of the requester's real check-in state.
  - Clicking a landmark card opens the real `LocationDetail` as an overlay on top of the History page itself (`HistoryPage` owns `openLandmarkSlug` state and renders `<LocationDetail>` directly, same pattern `RandomDrawPage` uses) — not a navigation to `/explore`.

## Deployment

- Frontend → Vercel (root set to `client/`)
- Backend → Render (`prague-stories-api.onrender.com`)
- Images → Cloudinary (`prague-stories/covers/<slug>`)
- DB → MongoDB Atlas
