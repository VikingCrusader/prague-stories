# Changelog

All notable changes to Prague Stories are documented here.

---

## [1.0.4] — 2026-06-21

**GPS corrections round 4 — cultural, natural, entertainment, hidden-gem re-audit via Google Maps / Wikidata**

- 33 additional coordinate corrections across all remaining categories:
  - Critical (>500 m): Technical Museum lng ~2.3 km off; Císařský Ostrov lng ~2.5 km off; Háje lng ~2.9 km off; Letňany lat ~1.8 km off; Prokopské Valley lat ~1.5 km off; Kunratický Forest combined ~1.4 km; Hvězda Game Reserve lat ~1.2 km off
  - Large (200–600 m): Museum of Communism lat ~590 m (museum relocated to V Celnici); Vinohrady Rose Garden lat ~550 m; Žluté lázně ~545 m; Hráz Hostivař ~475 m; DOX Centre ~330 m; Petřín Hill/Tower/Mirror Maze each ~200–205 m; Riegrovy Sady lng ~360 m
  - Medium (100–200 m): Mucha Museum lat ~178 m; Czech Museum of Music lng ~175 m; Anděl lat ~155 m; Střelecký Ostrov lng ~200 m; Kafka rotating head ~155 m; U Fleků ~230 m; Vojanovy Sady lat ~110 m; Nový Svět lng ~245 m

---

## [1.0.3] — 2026-06-21

**GPS corrections round 3 — historical category re-audit via Google Maps / Wikidata**

- Corrected 8 historical location coordinates (re-audited against Google Maps and Wikidata):
  - Loreta Prague: longitude corrected ~200 m (14.3946 → 14.3918)
  - Old Town Hall: latitude corrected ~190 m (50.0872 → 50.0855)
  - Schwarzenberg Palace: ~250 m off in both axes (50.0910/14.3988 → 50.0889/14.3969)
  - Dalibor Tower: ~110 m off (50.0916/14.4040 → 50.0923/14.4050)
  - Lobkowicz Palace: ~100 m off (50.0908/14.4042 → 50.0916/14.4049)
  - Vítkov National Memorial: ~480 m off (50.0862/14.4564 → 50.0887/14.4500)
  - Charles University (Carolinum): ~310 m off in longitude (50.0852/14.4195 → 50.0865/14.4235)
  - Olšanské hřbitovy: ~640 m off (50.0778/14.4644 → 50.0810/14.4722)

---

## [1.0.2] — 2026-06-21

**Remove Food & Drink category; second round of GPS corrections**

- Removed the `food` category — all 16 food & drink locations (pubs, cafes, markets, breweries) merged into `entertainment`
- Removed `food` from Location model enum, category selects, filter lists, dashboard breakdown, i18n keys, CSS variables, and badge styles
- Replaced `Food Pilgrim` achievement with `Night Out` — check in to 10 entertainment locations
- Corrected 20 more GPS coordinate errors (second audit pass):
  - Critical: Sapa Praha longitude off by ~2.4 km; Aquapalace ~1 km; Smíchovské nádraží ~890 m; Cross Club ~560 m; O2 Arena ~410 m; Karlín ~680 m; Pankrác Skyline ~545 m
  - Medium: Kotva, Žižkov TV Tower, Kampa Island, Čertovka, Malá Strana, Wenceslas Square, Bethlehem Chapel, John Lennon Wall, Náměstí Míru, Václav Havel Airport, Josefov, Vyšehrad Rock, Prague Zoo

---

## [1.0.1] — 2026-06-21

**GPS coordinate corrections, in-app location editing, and dev-mode open permissions**

- Audited all 136 preset location coordinates against Wikipedia/Google Maps; corrected 19 locations with errors ranging from ~80 m (National Museum) to ~2 km (Prague Planetarium longitude, Divoká Šárka)
  - Largest fixes: Divoká Šárka (~1 km), Nusle Bridge (~600 m), Heydrich Assassination Site (~700 m), Prague Planetarium (~2 km lng shift into wrong district)
- Added `PUT /api/locations/:slug` endpoint — accepts partial updates to name, localizedNames (CZ/ZH), category, coordinates, description (EN/CZ/ZH), wikipediaUrl, coverImage, xpReward, difficulty
- Added `EditLocationForm` — full in-modal edit form pre-populated from existing location data; fields for EN/CZ/ZH names, coordinates, descriptions, category, XP/difficulty, Wikipedia URL, cover photo
- Edit and delete actions are now available to any authenticated user (dev convenience; will be tightened before final release)
- Fixed Chinese modal title font size rendering at 11px — added `font-size: 20px !important` override for `.px-title` in ZH mode
- Added `updateCoordinates.js` migration script (`npm run update:coords`) for one-off coordinate patches

---

## [1.0.0] — 2026-06-21

**Delete custom locations, 136-location dataset, localized names backfill, and player guide**

- Added `DELETE /api/locations/:slug` endpoint — only the user who created a location can delete it; preset locations return `403`; all check-ins for the deleted location are also removed
- Delete button in location detail modal renders only for the owner of a non-preset location; requires a two-step confirm to prevent accidental deletions; resets on blur
- Grid and toast update immediately on deletion without a full re-fetch
- Added Bohnice and Letňany to the preset dataset, bringing the total to 136 locations
- Corrected Bohnice description: hospital built 1906–1911, Easter egg updated to the first Czech dynamite factory (1870) and the Polish-city street naming scheme (Czech-Polish friendship project)
- Backfilled Czech and Chinese localized names for 30 locations added since the initial `seed:localnames` run (batches 2–6)
- Added `GUIDE.md` — player-facing how-to in a humorous RPG tone covering all screens, mechanics, check-in flow, achievements, and tips; kept separate from the technical `README.md`

---

## [0.9.2] — 2026-06-20

**Navigate to location detail after proximity check-in**

- After a successful proximity-prompt check-in, the app navigates to `/explore` and automatically opens the location detail modal for the checked-in location
- Route state is cleared after the modal opens so back/forward navigation does not re-open it

---

## [0.9.1] — 2026-06-20

**Fix: proximity check-in does not refresh the Explore grid**

- After a successful proximity-prompt check-in, `ProximityDetector` now dispatches a `proximity-checkin` browser event with the location slug
- `ExplorePage` and `MapPage` listen for this event and immediately flip the matching location to `unlocked: true` in their local state, updating the "N preset locations unlocked" counter and map markers without a full re-fetch

---

## [0.9.0] — 2026-06-20

**Check-in reliability and UX polish**

- Fixed repeated check-in failures ("Could not get your location"): `getCurrentPosition` now reuses the position already held by the background `watchPosition` (proximity detection) when it is less than 60 s old, making check-in from the location detail modal instant. Falls back to a fresh acquisition with a 15 s timeout and 30 s `maximumAge`
- Added "Locating…" pixel-art status label while geolocation is running, so the button no longer appears frozen
- Added check-in success overlay in the location detail modal — shows **CHECKED IN!** in green pixel font plus XP earned and any newly unlocked achievements for 2.5 s before the modal auto-closes
- Fixed grid not refreshing after check-in: the Explore grid now marks the location as discovered the instant the API call succeeds, not after the 2.5 s overlay completes
- Modal auto-close is handled by a `useEffect` with cleanup so a stale timer can never close a subsequently opened modal

---

## [0.8.0] — 2026-06-20

**Discovered filter**

- Added a "✓ Discovered" filter button to the Explore grid showing only locations the current user has checked in to
- Label localised in EN / CZ / ZH

---

## [0.7.0] — 2026-06-20

**Location detail cover image**

- Location detail modal now shows the pixel art image (e.g. `dancing-house.png`) as a full-width hero above the description
- Falls back to emoji + coloured header only when no image file exists
- User-uploaded `coverImage` (base64) takes priority over the pixel art path

---

## [0.6.0] — 2026-06-20

**Automatic proximity discovery**

- `watchPosition` runs in the background while the user is logged in (all pages)
- When the user enters a 100 m radius of an unvisited location, a gold banner prompts "You discovered {name}! Check in now?"
- Check-in sends the already-captured GPS coords; server still validates within 200 m
- On success, shows "+XP ★" for 2.5 seconds then auto-dismisses
- Each location is prompted at most once per session to avoid repeat notifications
- Prompt label fully localised in EN / CZ / ZH

---

## [0.5.0] — 2026-06-20

**Richer custom locations**

- Add Location form now accepts a cover photo (JPG/PNG/WebP, max 1 MB), stored as a base64 data URL in MongoDB
- Form now has a description textarea; user-provided description is stored as `description.en` and displayed immediately without waiting for AI generation
- AI lazy-generation now only triggers when the English description is missing
- Cover photo previews in the form header as soon as a file is selected
- Cover photo shown on location cards and in the detail modal header (with gradient overlay); falls back to pixel art for preset locations
- Google Maps navigation link is automatically included for all custom locations

---

## [0.4.0] — 2026-06-20

**Google Maps navigation**

- Added a "Navigate on Google Maps" link to every location detail modal and map sidebar
- Link opens Google Maps directions to the location's coordinates (`/maps/dir/?api=1&destination=lat,lng`)
- Link label is fully localised: EN / CZ / ZH

---

## [0.3.0] — 2026-06-20

**Deployment and geolocation check-in**

- Added geolocation-based check-in: browser requests GPS on check-in and backend validates user is within 200 m using Haversine formula; returns `403` if too far
- Distance check is bypassed when `NODE_ENV=development`
- Frontend surfaces geolocation and backend errors inline below the check-in button
- Production API URL (`https://prague-stories-api.onrender.com`) auto-selected via `import.meta.env.PROD`
- CORS now allows `https://prague-stories.vercel.app` in addition to `localhost:5173`
- Added `engines: { node: ">=18.0.0" }` to `server/package.json` for Render compatibility

---

## [0.2.0] — 2026-06-20

**Full UI i18n and localized place names**

- Rewrote `LanguageContext` with a ~60-key `T` translations object and `useT()` hook; all components and pages now use it instead of hardcoded English strings
- Language switcher (EN / CZ / ZH) now switches the entire UI, not just location descriptions
- Added `localizedNames` field to the `Location` model; seeded Czech and Chinese names for all 106 locations (`npm run seed:localnames`)
- Added `getLocName()` utility; location names on cards, modals, map tooltips, and sidebar now display in the active language
- Integrated Ark Pixel Font for Chinese mode — self-hosted via two `unicode-range` `@font-face` declarations
- Added pixel art images for 46 key landmarks
- Switched AI description backend from Claude (Anthropic) to Gemini (Google); env var renamed to `GEMINI_API_KEY`
- Expanded location count from 100 to 106

---

## [0.1.0] — 2026-06-20

**Initial release**

- JWT authentication (register / login / me)
- 100 preset Prague landmarks with seed script across 6 categories
- Check-in system: earn XP per location, undo support
- 8 explorer levels and 10 achievements with automatic unlock evaluation
- Lazy AI-generated descriptions (EN / CZ / ZH)
- React + Vite frontend with pixel art retro UI (Press Start 2P / VT323 fonts)
- Explore grid with category filters and search
- Interactive Leaflet map with gold/grey unlocked/locked markers
- Location detail modal with description and Wikipedia link
- Dashboard: progress ring, XP bar, category breakdown, achievement grid
- Add custom locations form
