# Changelog

All notable changes to Prague Stories are documented here.

---

## [1.5.1] — 2026-06-26

**Fix: cover photo upload always applies on browser refresh**

- `uploadCoverImage` now saves the uploaded file as `{slug}-v{timestamp}.webp` instead of `{slug}.webp`, ensuring the URL changes on every upload
- Prevents browser cache from serving the old image when the filename was identical to an existing pixel-art file — previously made the save appear to fail even though the file was overwritten

---

## [1.5.0] — 2026-06-25

**Dashboard overhaul, achievement i18n, achievement logic fixes**

### Dashboard — guest access

- Guests can now enter the Dashboard; server returns zeroed stats + full static achievement/level definitions via `optionalAuth` middleware
- Guest title replaces "Explorer Dashboard" with a localized call-to-action in EN / CZ / ZH (`dashboard.titleGuest`)
- Navbar now shows Dashboard link for guests

### Dashboard — UI changes

- Category breakdown replaced with a compact flex-wrap chip grid (multiple labels per row); guests see all labels with 0 counts
- New **Rarity Breakdown** strip spanning full card width below the category grid — shows ◆ Common / Rare / Epic / Mythic / Legendary counts in each rarity's color
- `rarityCount` added to both authenticated and guest `/api/user/progress` responses
- `totalPreset` and `presetCheckins` now count all locations (not just `addedBy: null`) to reflect locations added via the admin flow
- Translation fixes: `'of {n} preset'` → `'of {n} location cards'`; `'total visits'` / `'总访问次数'` → `'collected'` / `'次收集'`; `'预设'` → `'地点卡片'`

### Achievement badges

- Badges in the grid now clamp name to 2 lines and description to 2 lines (`-webkit-line-clamp`) with `…` overflow — consistent card height across the grid
- All badges are clickable and open a full detail modal (icon, full name, full description, unlock date or LOCKED label)

### Achievement & level i18n

- All 8 explorer level titles now have `title_cz` / `title_zh` fields; `calculateLevel()` returns them; level badge and roadmap render in the active language
- All achievements now have `name_cz` / `name_zh` / `description_cz` / `description_zh`; `getAchievements` API includes localized fields; `AchievementBadge` picks the right language with Traditional Chinese conversion applied

### Achievement logic fixes (all previously non-functional)

- `checkinController`: `categoryCount` (built from non-existent `location.category`) replaced with `labelCount` (built from `location.labels`); `totalLocations` added to stats via `Location.countDocuments({})`
- `bridge_collector`: was missing `check` function entirely → crashed every check-in; fixed to `labelCount["bridge"] >= 10`
- `artist`: was filtering `checkedSlugs` by substring match on slug strings → fixed to `labelCount["cultural"] >= 20`
- `church_passionate`: same wrong approach → fixed to `labelCount["church"] >= 50`
- `history_buff`, `gem_hunter`: used `categoryCount` → fixed to `labelCount["historical"]` / `labelCount["hidden-gem"]`
- `leisure_seeker`: used `categoryCount["entertainment"]` (no such label) → fixed to `labelCount["restaurants-and-cafes"] + labelCount["park"] >= 30`
- `veni_vidi_vici`: `labelCount` was not in stats → now available after controller fix
- `king_of_prague`: `totalLocations` was not in stats → now available after controller fix
- `subway_maniac`: `"letňany"` slug had Czech special char → corrected to `"letnany"`

### New achievements

- **I'm the King of Prague** — check in all locations
- **Veni, Vidi, Vici** — check in 10 landmark locations
- **Subway Maniac** — check in all 6 Prague metro terminal stations
- **Why are there no penguins in southern pole?** — check in Jižní pól Prahy
- **Bridge Collector** — check in 10 bridge locations
- **Artist** — check in 20 cultural locations
- **Church Passionate** — check in 50 church locations
- **Leisure Seeker** — check in 30 restaurant/park locations

### Traditional Chinese additions

- `TW_OVERRIDES` expanded: `軟件 → 軟體`, `地鐵 → 捷運`

---

## [1.4.0] — 2026-06-25

**Guest mode, Traditional Chinese toggle, rarity always visible**

### Guest mode

- Added "Continue without login" button on the login page
- Guests can browse Explore, Map, and Guide; cannot collect, add/edit locations, or access Dashboard
- `AuthContext`: added `guest` boolean state (persisted in `sessionStorage`) and `continueAsGuest()` action; `login()` clears guest state
- `ProtectedRoute`: new `guestOk` prop — passes through when `guest && guestOk`; Dashboard route stays auth-only
- `Navbar`: guests see Explore / Map / Guide links; Dashboard link hidden; gold "Login" button replaces logout; `navbar__right .lang-tabs { margin-bottom: 0 }` alignment fix
- `LocationDetail`: "Log in to collect" button replaces the collect/undo buttons for guests
- `ExplorePage`: Add Location header button and grid `onAddClick` both hidden for guests; page title changes to "Login to Explore Prague!" in guest mode
- `MapPage` sidebar: "Log in to collect" button replaces collect/undo for guests
- New i18n keys in EN / CZ / ZH: `auth.continueAsGuest`, `auth.loginToCollect`, `nav.login`, `explore.titleGuest`

### Rarity visible on locked cards

- Grid card border, rarity diamond, and rarity label now always show the rarity color regardless of locked state (was `transparent` / `rgba(255,255,255,0.2)` / `'???'` for locked)

### Traditional / Simplified Chinese toggle

- Installed `opencc-js` for Simplified → Traditional conversion
- `LanguageContext`: added `zhVariant` state (`'cn'` | `'tw'`, persisted in `localStorage`); lazy `toTW` singleton initialized on first use; post-processing override table (`服務器 → 伺服器`)
- New `useConvert()` hook — returns a function that converts a raw string to Traditional if `lang === 'zh' && zhVariant === 'tw'`; no-op for all other modes
- `LanguageSwitcher`: 繁 / 简 toggle appears only when ZH is selected
- `useT()`: applies `toTW` to every translated string in Traditional mode
- `LocationCard`: `useConvert()` applied to card name (`getLocName`), label name, and rarity label
- `LocationGrid`: `useConvert()` applied to label filter pills and rarity filter pills
- `LocationDetail`: `useConvert()` applied to card name, rarity label, label pills, and DB description text
- `MapPage` SidebarDetail: `useConvert()` applied to DB description text
- `GuidePage`: `deepConvert()` recursively converts the entire `CONTENT` object (all strings, arrays, nested objects) — no per-string changes needed

---

## [1.3.0] — 2026-06-25

**Custom location overhaul: file upload, isPreset removal, form parity, add-form fixes**

### Cover image upload pipeline

- Replaced base64 cover photo storage with a dedicated `POST /api/locations/:slug/cover` endpoint
- Server uses `multer` (in-memory storage) + `sharp` to convert any JPEG/PNG/WebP upload to WebP at quality 85, saved to `client/public/pixel-art/{slug}.webp` alongside built-in cards
- Previous cover file is deleted before writing the new one
- Client: `locationAPI.uploadCover(slug, file)` sends `multipart/form-data`; raw `File` object used (no FileReader/base64); `URL.createObjectURL` for preview
- Two-step create flow: JSON `POST /locations` creates the location, then a separate cover upload — nested `try/catch` ensures `onAdded` is called even if the cover upload fails, preventing duplicate location creation on retry
- No file size limits on client or server

### isPreset removal

- `isPreset: Boolean` field removed from `Location` model; replaced by `addedBy: null` (built-in) vs. `addedBy: ObjectId` (custom) as the natural discriminator
- All controllers, user stats, check-in stats, and export scripts updated: `{ isPreset: true }` → `{ addedBy: null }`, `location.isPreset` → `!location.addedBy`
- Zero DB migration required

### AddLocationForm parity with EditLocationForm

- Rewritten to match EditLocationForm: Name EN / CZ / ZH, combined Latitude,Longitude coordinate field, Rarity select with XP preview, trilingual description textareas with paste-segmentation, label pills
- `noValidate autoComplete="off"` on form; explicit React name validation runs before coordinates — fixes browser-native constraint validation triggering one field at a time and appearing to "lose" values
- Cover photo field accepts JPEG / PNG / WebP; preview replaces the modal header on selection

### Stats fix

- `LocationGrid` `total` was `locations.filter(l => !l.addedBy).length` (255 built-ins only) while `filtered.length` counted all; both now use `locations.length` for consistency

---

## [1.2.4] — 2026-06-25

**Legendary boss descriptions, guide and rarity label updates**

- Added extended "boss" descriptions for all Legendary-tier locations
- Guide page rarity table and label descriptions updated to reflect the 5-tier system including Mythic
- Removed spent one-shot migration scripts from `server/src/data/`

---

## [1.2.3] — 2026-06-25

**Mythic rarity tier, description/rarity revert fixes, Guide overhaul, batch21 pixel art**

### New feature: Mythic rarity
- Added `mythic` tier between Epic and Legend: color `#c40202` (crimson), XP: 40, EN: Mythic / CZ: Mýtické / ZH: 神话
- `Location.js` model enum updated to `['common','rare','epic','mythic','legend']`
- `rarityMap.js`: `RARITY_XP` updated to `{ common:10, rare:20, epic:30, mythic:40, legend:50 }`
- `client/src/utils/rarity.js`: mythic added to `RARITY_XP`, `RARITY_COLOR`, `RARITY_LABEL`
- Mythic added to rarity filter dropdowns on Explore grid and Map sidebar
- `EditLocationForm`: was missing mythic from hardcoded rarity list — fixed
- Guide page and GUIDE.md: mythic row added to XP table; Common/Legend tier descriptions updated to reflect their design philosophy

### Bug fixes
- **Rarity edits reverting**: deleted `updateRarity.js` — this one-shot script was bulk-overriding every location's rarity/xpReward from `rarityMap.js` whenever run, undoing all manual edits made via the Edit UI; rarity is now set exclusively through the Edit form
- **Description edits reverting**: fixed race condition in `getLocation` controller — previously used `location.save()` which serialised the entire Mongoose document from fetch time; if Gemini took >5 s to generate, a concurrent user edit would be silently overwritten when `save()` completed; now uses `Location.updateOne({ $set: patch })` with dot-path keys and only writes languages whose description field is empty

### Guide page
- Removed emojis from category list and tips section
- Explore section rewritten: replaced obsolete 5-category table with label-based filter description (labels are granular and stackable)
- Fixed ZH syntax crash: unescaped ASCII double quotes inside a double-quoted string on line 161

### Data & assets
- `migrateDescGreeting.js` (new): prepends "Brave explorer, " / "Odvážný průzkumníku, " / "勇敢的探险家，" to all 17 batch21 location descriptions in the DB to match the style of every other preset location; idempotent (skips locations that already have the greeting)
- 17 WebP pixel art files added for batch21 locations (converted from PNG at quality 90 via ffmpeg)

---

## [1.2.2] — 2026-06-25

**Location set: −2 removed, +17 new locations added (255 total)**

### Data
- Removed `klementinum` (duplicate of National Library) and `prague-city-gallery` from DB and rarityMap; cascaded check-in deletion
- Added 17 new Prague locations with full EN/CZ/ZH descriptions, coordinates, rarity, and localizedNames:
  - Stone Bell House, Church of Sts. Simon and Jude, Čech Bridge (common)
  - Church of Our Lady of Sorrows, Church of St. Apollinaris, Nusle Town Hall, Hussite Congregation Smíchov, Černý Most (common)
  - Apolinář Maternity Hospital, Church of the Sacred Heart, Svatopluk Čech Gardens, Parukářka, Church of the Assumption (Modřany), City Tower, Kobylisy, Basilica of St. Margaret (rare)
  - Hussite Congregation Vinohrady (epic)
- `rarityMap.js` updated: klementinum → replaced with husuv-sbor-vinohrady (epic); 8 rare slugs added; prague-city-gallery removed

---

## [1.2.1] — 2026-06-24

**Rarity UI: card borders, name colors, rarity filter, mobile alignment**

### UI
- Grid card border color driven by rarity: common `#EBE8D9`, rare `#87CEEB`, epic `#BA55D3`, legend `#FFD700`; locked cards get transparent border
- Location name text color = rarity color on grid cards, detail modal, and map sidebar
- Removed `+XP` from grid card footer; footer now shows only rarity diamond + label (left) and distance badge (right)
- Detail modal (`px-modal`) border now overrides to rarity color
- Added **Rarity** dropdown filter beside the existing **Labels** filter on both Explore grid and Map sidebar; opening one closes the other; OR-logic — multiple rarities can be active simultaneously; cleared by the **All** button
- Grid filter bar on mobile wraps to 2×2 layout (All/Discovered row 1, Labels/Rarity row 2) instead of cramming 4 items into one row
- Map sidebar filter buttons split container width equally (`flex: 1`, `width: 100%`)
- Common rarity color adjusted `#FFFFF0` → `#EBE8D9`
- Added `grid.filterRarity` i18n key: EN "Rarity" / CZ "Vzácnost" / ZH "稀有度"

---

## [1.2.0] — 2026-06-24

**Rarity system — replaces difficulty entirely**

### Breaking change
- `difficulty` field removed from `Location` model and all UI; replaced by Hearthstone-style `rarity` enum

### Backend
- `Location.js`: removed `difficulty`; added `rarity: { type: String, enum: ['common','rare','epic','legend'], default: 'common' }`; `xpReward` default 15 → 10
- `locationController.js`: `updateLocation` derives `xpReward` from `RARITY_XP[rarity]`; `createLocation` defaults to `common` / 10 XP
- `server/src/data/rarityMap.js` (new) — authoritative slug→rarity map for all 240 locations with exported `SLUG_RARITY`, `RARITY_XP`, `getRarity(slug)`
- `server/src/data/updateRarity.js` (new) — one-shot migration; ran successfully, all 240 DB locations updated

### Rarity distribution (240 locations)
- **Legend** (12, 5%) — Prague's great iconic landmarks and remotest outskirts (prague-castle, charles-bridge, astronomical-clock, vysehrad, dancing-house…)
- **Epic** (38, 16%) — Hidden gems; specialist knowledge required (klementinum, novy-svet, lidice, sapa-praha, muzeum-studene-valky…)
- **Rare** (90, 37%) — Worth seeking out; known to curious visitors (pinkas-synagogue, mucha-museum, john-lennon-wall, petrin-tower…)
- **Common** (100, 42%) — Neighbourhood churches, everyday streets, quarter squares

### Client
- `client/src/utils/rarity.js` (new) — exports `RARITY_XP`, `RARITY_COLOR`, `RARITY_LABEL` (EN/CZ/ZH)
- `EditLocationForm`: replaced difficulty + xpReward selects with a single colored rarity `<select>`
- `LocationCard`: rarity diamond gem + colored label in card footer
- `LocationDetail`: rarity gem + label + XP in modal header row
- `MapPage` sidebar: rarity gem + label + XP in SidebarDetail

---

## [1.1.19] — 2026-06-24

**Description segmentation: migration, paste detection, map sidebar fix**

### Data migration
- Ran `segmentDescriptions.js` — detected and re-segmented 200 DB descriptions stored as a single flat string; all descriptions now formatted as three paragraphs separated by `\n\n`

### UI
- `EditLocationForm`: added `segmentDesc()` + `handleDescPaste()` — auto-splits pasted flat descriptions into three paragraphs on paste using unlock-keyword detection (`Unlock` / `Odemkni` / `解锁`) and midpoint sentence boundary; only intercepts paste if no `\n\n` already present
- `MapPage` SidebarDetail: fixed description rendering — was joining all paragraphs into one `<p>` block; now splits on `\n`, filters empty lines, and renders each paragraph as a separate `<p style={{ marginBottom: 10 }}`

---

## [1.1.18] — 2026-06-24

**4 new Josefov cards: ceremonial hall, two synagogues, Jewish Town Hall**

### Data
- Added 4 new Prague locations (Josefov / Jewish Quarter):
  - **New Ceremonial Hall** (`nova-obradni-sin`) — 1906 Neo-Romanesque Chevra Kadisha building beside the Old Jewish Cemetery; exhibition on Jewish burial customs (Historical)
  - **High Synagogue** (`vysoka-synagoga`) — 1568, prayer hall on the upper floor by design; Nazi inventory records became postwar restitution evidence (Historical)
  - **Jerusalem Synagogue** (`jerusalem-synagogue`) — Prague's largest synagogue (1906), Moorish Revival + Art Nouveau; nicknamed Jubilee Synagogue for Franz Joseph's jubilee (Historical)
  - **Jewish Town Hall** (`zidovska-radnice`) — Original 1577 Maisel commission, Baroque rebuild 1763; famous counter-clockwise Hebrew clock; Judenrat seat in WWII (Historical, Municipal)
- Added EN/CZ/ZH RPG descriptions ("Brave explorer" voice) with easter eggs for all 4

---

## [1.1.17] — 2026-06-24

**PNG → WebP conversion (quality 90)**

### Assets
- Converted 17 PNG pixel-art images to WebP at quality 90 (ffmpeg): celetna, charles-bridge, klementinum, kostel-sv-frantiska-z-assisi, kostel-sv-hastala, kostel-sv-jakuba-stare-mesto, kostel-sv-jilji, kostel-sv-klimenta, kostel-sv-petra-na-porici, kostel-sv-salvatora, maiselova-synagoga, national-museum, nova-radnice-marianske-namesti, pinkas-synagogue, powder-tower, prague-castle, strahov-library

---

## [1.1.16] — 2026-06-24

**11 new location cards: Old Town churches, Strahov Library, Celetná**

### Data
- Added 11 new Prague locations via `seedNewLocations.js`:
  - **Celetná** — medieval Royal Route street with Cubist lamppost easter egg (Historical, Landmark)
  - **Strahov Library** — Baroque library with cabinet of curiosities (Cultural, Academy, 25 XP)
  - **Church of St. James the Greater** (Old Town) — Gothic/Baroque church famous for its mummified arm (Historical, Church, 25 XP)
  - **New Town Hall** (Mariánské náměstí) — 1911 Art Nouveau building with Golem-creator Rabbi Loew and Iron Man statues (Historical, Municipal)
  - **Maisel Synagogue** — 1590 Renaissance synagogue rebuilt Neo-Gothic; Maisel bankrolled Habsburgs, Habsburgs took everything (Historical, 20 XP)
  - **Church of St. Giles** — 1371 Gothic, Dominican-run with Reiner frescoes; same order as the Inquisition (Historical, Church)
  - **Church of St. Castulus** — Quiet 13th-century Gothic gem; martyr thrown into a pit; name is 700 years of Czech telephone (Hidden Gem, Church)
  - **Church of St. Francis of Assisi** — Built by Knights of the Cross (only Bohemian Crusader order, still next door); Last Judgment dome (Historical, Church)
  - **Church of the Holy Saviour** — 1578 Jesuit church built to stare down the Clementinum; one of Prague's first Baroque buildings (Historical, Church)
  - **Church of St. Clement** (Klimentská) — Gothic church that served Catholics, Hussites, Catholics again; patron saint thrown into sea on an anchor (Historical, Church)
  - **Church of St. Peter at Poříčí** — One of Prague's oldest churches (12th c.); still standing quietly as Na Poříčí became a shopping street (Historical, Church)
- Added EN/CZ/ZH descriptions for all 11 locations via `seedDescriptionsStatic.js` — segmented paragraphs, humorous, gamified tone, historical context, easter eggs, Chinese description priority
- Note: user listed item #9 (Kostel nejsv. Salvátora) without coordinates — approximate coordinates used (50.08621, 14.41395); items #3 and #10 were duplicate entries for the same church (Jakuba Většího) — added once

---

## [1.1.15] — 2026-06-23

**Mobile label fix, grid sizing, and typography tweaks**

### UI
- Detail modal labels on mobile: hidden from image header, shown below Wikipedia/Google Maps links instead; desktop layout unchanged
- `label-pill-sm` (grid card superior label): forced single line (`white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`); `min-width: 0` added to `loc-card__body` and `loc-card__labels` to prevent flex overflow
- EN/CZ grid card superior label: font size 15px → 18px, weight 700 → 500
- Grid card min-width: 200px → 230px (all languages)
- `loc-card__cz-name` now explicitly uses ArkPixel font so EN mode matches ZH rendering
- Detail modal title: 12px → 14px
- `detail-label-pill`: base font 12px → 9px; ZH override keeps 13px

---

## [1.1.14] — 2026-06-23

**Municipal label, label editor modal, default label fix, description save bug fix**

### New feature
- Added `Municipal` classification label (`🏢`, EN: Municipal / CZ: Obecní / ZH: 市政, color `#2a4a2a`) — covers town halls, administrative buildings, municipal infrastructure
- Added `LabelEditorModal` — lightweight dedicated modal for editing a location's labels without opening the full edit form; accessible via "Edit Labels" in the location detail panel; shows all labels as toggleable pills with emoji

### Bug fixes
- Fixed description edits not persisting: `updateLocation` was assigning a plain object to a Mongoose subdocument without calling `markModified`, so Mongoose silently skipped the field on `save()`; now sets fields individually and calls `markModified('description')` and `markModified('localizedNames')`
- Fixed `hidden-gem` pre-selected by default in Add Location and Edit Location forms — default is now an empty selection; server-side `createLocation` fallback also changed from `['hidden-gem']` to `[]`

---

## [1.1.13] — 2026-06-23

**Batches 17–19 — 20 new locations + pixel art WebPs**

### New locations (20)
- Basilica of Saints Peter and Paul (historical, 25 XP) — Neo-Gothic twin-spire landmark atop Vyšehrad; houses the Přemyslid royal tombs
- Storch House (historical, 15 XP) — Art Nouveau facade on Old Town Square with a massive St. Wenceslas fresco
- Staré Purkrabství (historical, 20 XP) — medieval Old Burgrave's house within Vyšehrad fortress
- Church of St. Pancras (historical, 20 XP) — Romanesque-origin parish church in Praha 4; one of Prague's oldest continuous parishes
- Kavčí Hory Television Centre (cultural, 20 XP) — Czech Television's main broadcast campus on the Pankrác plateau, built 1975
- Centrotex Building (hidden-gem, 15 XP) — Brutalist 1970s foreign-trade headquarters on Václavské náměstí
- Radio Free Europe (cultural, 20 XP) — former Federal Parliament building repurposed as RFE/RL HQ; symbol of Cold War information warfare
- Petřín Rose Garden (natural, 15 XP) — terraced hilltop garden with hundreds of rose varieties above Malá Strana
- Church of St. Wenceslas, Smíchov (historical, 15 XP) — Neo-Baroque church completed 1881; interior mosaics by František Sequens
- Strahov Monastery Church (historical, 20 XP) — Baroque Church of the Assumption of the Virgin Mary within Strahov complex; 17th-century organ
- Jan Hus Monument (historical, 20 XP) — Ladislav Šaloun's 1915 Art Nouveau sculpture anchoring Old Town Square; unveiled on the 500th anniversary of Hus's execution
- Marian Column (historical, 20 XP) — 17th-century Baroque plague column re-erected 2020; destroyed 1918, rebuilt from original fragments
- Narrowest Street in Prague (hidden-gem, 20 XP) — Vinárna Čertovka alley off Mostecká; has its own pedestrian traffic light
- Malá Strana Bridge Tower (historical, 20 XP) — paired Gothic towers guarding the Malá Strana end of Charles Bridge; older tower dates to 12th century
- Palacký Bridge (historical, 20 XP) — 1878 neo-Gothic bridge; allegorical sandstone groups at each corner by Myslbek
- Palacký Square (historical, 20 XP) — Nové Město square anchored by Myslbek's 1912 equestrian monument to František Palacký, father of Czech historiography
- Faust House (hidden-gem, 25 XP) — Renaissance mansion tied to alchemical legend; reputedly home to Edward Kelley; Baroque remodel conceals earlier laboratory rooms
- Štvanice Island (entertainment, 20 XP) — Vltava island with a storied 1930s ice-hockey arena; first artificial ice rink in Czechoslovakia
- Prague Public Transport Museum (cultural, 15 XP) — historic tram depot in Střešovice with 50+ vehicles spanning 1886 to modern day
- Garden on the Ramparts (natural, 20 XP) — Renaissance terraced garden below Prague Castle's southern walls; UNESCO World Heritage views
- All 20 have full EN/CZ/ZH descriptions, `localizedNames` (CZ + ZH), coordinates, Wikipedia links, and WebP pixel art

---

## [1.1.12] — 2026-06-23

**Grid card sizing and typography polish**

### UI
- Desktop grid cards enlarged: taller image area, bigger location name font, increased padding for a more spacious feel; mobile layout unchanged
- Czech caption below location names is now bolder and larger
- Chinese name display scaled up for better readability in ZH mode

---

## [1.1.11] — 2026-06-23

**UI polish: Czech name caption on grid cards, Apple font fallback for mobile Chinese**

### UI
- Grid cards now show the Czech original name as a small caption below the EN/ZH display name (hidden when language is already Czech or card is locked)
- Reordered zh font-family fallback stack: `ArkPixel → PingFang SC → Hiragino Sans GB → -apple-system → …` — Apple devices now get their native Chinese font immediately if the pixel font fails to load, without waiting for network fonts

---

## [1.1.10] — 2026-06-23

**Bug fix: ProximityPrompt "+XP" auto-dismiss**

### Bug fix
- Fixed `ProximityPrompt` check-in flow: `onCheckIn` (which calls `markCheckedIn` → `setDiscovery(null)`) was called immediately after the API response, dismissing the prompt before "+XP ★" could render for its 2.5-second window
- Fix: `onCheckIn` is now deferred inside `setTimeout(..., 2500)` so `discovery` stays non-null while "+XP ★" is displayed; `markCheckedIn` naturally dismisses the prompt after the delay

---

## [1.1.9] — 2026-06-22

**English name audit, pixel art for batches 14–15, code cleanup**

### English name localisation (35 cards)
- Audited all 173 preset `name` fields — the sole English display field (`getLocName` returns `name` for `lang='en'`; no `localizedNames.en` exists)
- 35 cards had Czech names where English was expected; all corrected via targeted `$set` update (not `$setOnInsert`)
- Rule applied: generic building/infrastructure terms translate (kostel → Church of…, most → Bridge, lávka → Footbridge, nádraží → Station, knihovna → Library, muzeum → Museum, nemocnice → Hospital, náměstí → Square, letohrádek → Summer Palace, zámek → Chateau, hřbitov → Cemetery, rokle → Gorge); proper place/person names stay Czech (Kačerov, Pařížská, Na Příkopě, Národní třída, Anděl, Karlín…)
- `localizedNames.cz` set for every card whose `name` was changed, preserving Czech subtitles
- `seedNewLocations.js` names synced to match DB (source-of-truth alignment)
- Selected corrections: "kostel Sv. archanděla Michaela" → "Church of the Archangel Michael"; "Most Legií" → "Legion Bridge"; "Olšanské hřbitovy" → "Olšany Cemeteries"; "Místodržitelský letohrádek" → "Viceroy's Summer Palace"; "ČVUT" → "Czech Technical University in Prague"; and 30 more

### Assets
- 9 new WebP pixel art files added for batches 14–15 cards + Týn Church (converted from PNG at quality 90, originals removed): `kacerov`, `parizska`, `kostel-sv-krize`, `na-prikope`, `kostel-sv-mikulase-stare-mesto`, `jizni-pol-prahy`, `kostel-sv-jindricha`, `kostel-panny-marie-snezne`, `tyn-church`
- Trailing-space filename `jizni-pol-prahy .webp` corrected to `jizni-pol-prahy.webp`

### Code cleanup
- Removed `server/src/data/migrateFoodCategory.js` (one-shot migration, already applied)
- Removed `migrate:food` npm script from `package.json`

---

## [1.1.8] — 2026-06-22

**Batches 12 & 13 — 10 new locations, coordinate sync, WebP conversions**

### New locations — batch 12 (5)
- Florenc Bus Terminal (entertainment, 15 XP) — Prague's main long-distance bus hub; Communist-era workers' depot now handling FlixBus to Berlin, Vienna, Warsaw; hear a dozen languages in three minutes
- Westfield Chodov (entertainment, 15 XP) — Central Europe's largest mall grafted onto a 1970s Communist housing estate; built directly above Chodov metro so you exit the train into H&M without stepping outside
- Místodržitelský letohrádek (historical, 20 XP) — 14th-century royal hunting lodge in Stromovka, rebuilt Baroque for Rudolf II; converted into a public newspaper reading room in the 19th century — one of the world's earliest public leisure libraries
- Zličín (hidden-gem, 20 XP) — westernmost metro terminus of Line B; home of the first post-Communist Czech IKEA (1996); medieval church of Sts. Peter and Paul predates the metro by 800 years
- Sluneční náměstí (hidden-gem, 15 XP) — "Sunny Square" in Nové Butovice; rare Communist-era integrated transport+retail+residential unit planned as one; sits on the plateau above Prokop Valley

### New locations — batch 13 (5)
- Řepy (hidden-gem, 15 XP) — western Prague frontier split between 1970s panel estate and surviving Baroque village core; independent municipality until 1968 absorption into Greater Prague
- Lhotka (hidden-gem, 15 XP) — Prague 12 district on the Vltava valley escarpment; name derived from medieval Czech for tax-exempt settler grants; southern edge drops into wild ravines most Praguers have never walked
- V Tower (hidden-gem, 20 XP) — sleek glass skyscraper on the Pankrác plateau; upper floors command unobstructed sightlines across the entire Prague basin to the Bohemian hills 30 km distant
- Kostel sv. Václava — Vršovice (historical, 20 XP) — Josef Gočár's 1930 Functionalist masterpiece; stark concrete tower, modernist nave; a church built in the visual language of industry dedicated to Bohemia's most politically charged saint
- ČVUT (cultural, 20 XP) — Czech Technical University, founded 1707 as the Prague Engineering School — one of the world's first technical universities outside Paris; alumni include Emil Kolben, who studied under Edison and founded the ČKD industrial conglomerate
- All 10 have full EN/CZ/ZH descriptions, `localizedNames` (CZ + ZH), coordinates, and Wikipedia links

### Seed maintenance
- `seedNewLocations.js` coordinates patched to match live DB values for all 56 active entries via one-shot `patchSeedCoords.js`
- `exportLocations.js` added — queries live DB and regenerates `pragueLocations.js`, `seedDescriptionsStatic.js`, `seedLocalizedNames.js`; run via `npm run export:locations`

### Assets
- All new pixel art PNG/JPG files converted to WebP (quality 90) and originals removed
- No placeholder copies created for new cards — emoji category fallback used until real art is provided

---

## [1.1.7] — 2026-06-22

**Batch 11 locations (5)**

### New locations (5)
- Lidice (historical, 30 XP) — village destroyed by Nazis on 10 June 1942; global defiance renamed dozens of towns after it; today a rose garden and sculpture of 82 children mark the emptied ground
- Vítězné náměstí (historical, 15 XP) — Prague's grandest unfinished square; Antonín Engel's 1920s plan for a monumental civic centrepiece was never completed; the promised central column never built
- Zbraslavský zámek (cultural, 25 XP) — Baroque chateau on the ruins of a 1292 Cistercian monastery that held Přemyslid royal tombs; now home to the National Gallery's Asian art collection at the Berounka–Vltava confluence
- Praha-Bubny Station (historical, 25 XP) — from this platform 50,000+ Prague Jews were deported 1941–1945; the station is being converted into the Station of Memory Holocaust memorial complex
- Náměstí Republiky (historical, 20 XP) — threshold between medieval and modern Prague; the Art Nouveau Municipal House (1912, where Czechoslovak independence was declared) stands on the exact site of the former Royal Court
- All 5 have full EN/CZ/ZH descriptions, `localizedNames` (CZ + ZH), coordinates, Wikipedia links, and WebP pixel art

---

## [1.1.6] — 2026-06-22

**Batch 9 locations, localized names in grid & detail, Chinese font fallback**

### New locations (8)
- Můstek (historical, 15 XP) — Gothic drawbridge foundations preserved under metro A; hinge point between Old Town and Nové Město
- Novomlýnská vodárenská věž (historical, 20 XP) — 16th-century Renaissance water tower; pumped river water to city fountains before modern plumbing
- Šítkovská vodárenská věž (historical, 20 XP) — 15th-century twin tower; base Renaissance, crown Neo-Gothic after 1890 flood rebuild; now a riverside cultural café
- National Library of the Czech Republic (cultural, 20 XP) — Klementinum Baroque Library Hall: vaulted gold-and-fresco room with a 17th-century astronomical globe; 6.5 M documents
- Czech Post Building — Jindřišská (historical, 15 XP) — Neo-Baroque postal HQ beside a 15th-century Gothic bell tower that has rung over the same corner for six hundred years
- Chodovská Fortress (hidden-gem, 25 XP) — 14th-century fortified manor marooned inside a 1970s housing estate; saved from demolition by resident activism
- Národní třída (historical, 20 XP) — bronze memorial at no. 20 marks where riot police beat students on 17 Nov 1989, triggering the Velvet Revolution
- Charles Square / Karlovo náměstí (historical, 20 XP) — largest square in Prague (80,000 m²); medieval relic showground; site of Prague's first defenestration (1419); Faust House at south end
- All 8 have full EN/CZ/ZH descriptions, `localizedNames` (CZ + ZH), coordinates, Wikipedia links, and WebP pixel art

### UI: localized names in grid view
- `GET /api/locations` now returns `localizedNames` (was previously stripped); grid cards display the correct CZ/ZH name in non-English interfaces

### UI: Czech original name subtitle
- Location detail modal and map sidebar now show the Czech original name as a dimmed subtitle below the primary localized title when the active language is EN or ZH

### Chinese font fallback
- Microsoft YaHei promoted to secondary font (immediately after ArkPixel) across all ZH font stacks
- Full system-font fallback chain: ArkPixel → Microsoft YaHei → ZCOOL QingKe HuangYou → Noto Sans SC → PingFang SC → Hiragino Sans GB → SimHei → sans-serif
- Ensures Chinese characters render correctly even when ArkPixel and Google Fonts both fail to load

---

## [1.1.5] — 2026-06-22

**Add 5 new preset locations (batch 8); map sidebar pixel art + View Detail**

- Most Legií (historical, 20 XP) — Legion Bridge, opened June 14 1901; named for the Czechoslovak Legions
- Libeňský most (historical, 25 XP) — 780 m, longest bridge in Prague; completed 1928, Art Deco lamp posts
- Náměstí Hrdinů (historical, 15 XP) — Square of Heroes; site of the last public execution in Bohemia, September 6 1945
- Náměstí I. P. Pavlova (entertainment, 15 XP) — busiest metro interchange in Prague (~118 k daily); named after Ivan Petrovich Pavlov
- Hotel International Prague (historical, 30 XP) — 88 m Stalinist-Gothic tower, completed 1956; cultural monument since July 2000
- All 5 have full EN/CZ/ZH descriptions, localizedNames, coordinates, Wikipedia links, and pixel art
- Map sidebar now shows a full-width square pixel art banner (objectFit: contain) when a location is selected
- Added "View Detail" button in map sidebar — navigates to `/explore` and opens the location's full detail modal
- CORS allowlist expanded to include `localhost:5174` (Vite dev fallback port)

---

## [1.1.4] — 2026-06-21

**In-app Guide page**

- Added Guide page (`/guide`) reachable from the navbar between Map and Dashboard
- Covers all game mechanics in compact, humorous RPG style: quick-start, screens, check-in flow, XP/levels, achievements, tips, FAQ
- Styled with the full pixel art UI (gold step numbers, bordered tip cards, FAQ boxes)
- Full trilingual content: EN / CZ / ZH, switches with the language toggle
- "Explorer" branding throughout; challenge callout in each language
- Nav label localised: "Guide" / "Průvodce" / "攻略"

---

## [1.1.3] — 2026-06-21

**Mobile responsiveness, Chinese navbar fix, and RPG register screen**

- Navbar wraps to two rows on small screens: logo + controls on row 1, nav links centred on row 2
- Chinese mode (ZH) navbar and nav links scaled down to readable sizes on mobile (13px vs 16px desktop)
- Language tabs include a CJK font fallback so "中文" renders correctly in all language modes
- Location grid fixed to 2 columns on mobile; modal switches to a full-width bottom-sheet layout
- Toast, auth box, and dashboard padding tightened for small screens
- Registration page gets RPG/medieval flavor text in all three languages

---

## [1.1.2] — 2026-06-21

**Remove delete card from UI; perf fix for list endpoint**

- Delete button removed from location detail modal — locations can only be deleted directly in the database
- `GET /api/locations` now excludes `description` and `localizedNames` fields, dropping payload from ~1–2 MB to ~30 KB and fixing 15 s load times after full description seeding

---

## [1.1.1] — 2026-06-21

**UI: rename check-in to collect; convert batch-7 pixel art to WebP**

- "Check In" button renamed to "Collect" (EN), "Sbírat" (CZ), "打卡" (ZH — kept colloquial)
- "Undo Visit" renamed to "Uncollect" (EN), "Odebrat" (CZ), "取消收藏？" (ZH)
- "✓ Discovered" filter renamed to "✓ My Collections" / "✓ Moje sbírka" / "✓ 我的收藏"
- "✓ VISITED" badge renamed to "✓ COLLECTED" / "✓ SESBÍRÁNO" / "✓ 已收藏"
- "CHECKED IN!" success overlay renamed to "COLLECTED!"
- Converted all 8 batch-7 pixel art images from PNG to WebP (quality 90): cafe-louvre, czech-national-bank, faculty-of-arts-uk, lehka-nejistota, nemocnice-motol, oc-flora, palladium-prague, rudolfinum

---

## [1.1.0] — 2026-06-21

**Add 7 new preset locations (batch 7)**

- Nemocnice Motol (hidden-gem, 20 XP) — Czech Republic's largest hospital; Praha 5, opened 1978; 2,300+ beds
- Atrium Flora (entertainment, 15 XP) — glass-roofed mall above Flora metro A; next to Olšany Cemetery
- Café Louvre (entertainment, 20 XP) — Prague institution since 1902; Kafka, Einstein, billiard room, communist closure 1948–1992
- Czech National Bank (historical, 20 XP) — neoclassical palace on Na Příkopě; free Monetary Museum in basement
- Palladium Prague (entertainment, 15 XP) — 2007 mall in former Josefov Barracks; medieval stonework visible through floor panel
- Charles University Faculty of Arts (historical, 30 XP) — 1348 faculty on Náměstí Jana Palacha; 21 Dec 2023 shooting commemorated
- Lehká nejistota (hidden-gem, 20 XP) — Michal Trpák's 2015 bronze businessman suspended by umbrella above Na Zbořenci, Praha 2
- All 7 have full EN/CZ/ZH descriptions (gamified, humorous RPG style), localizedNames, coordinates, and pixelArtKey

---

## [1.0.9] — 2026-06-21

**Detail modal image now 1:1 square; batch-6 pixel art converted to WebP**

- Location detail modal hero image changed from fixed 220 px height to `aspect-ratio: 1 / 1` — fully responsive square at any modal width
- Converted all 6 new batch-6 pixel art images from PNG to WebP (quality 90): grand-hotel-prague-towers, muzeum-policie-cr, narodni-technicka-knihovna, staromestska-vodarenska-vez, strahov-stadium, vysehrad-railway-bridge

---

## [1.0.8] — 2026-06-21

**Add 6 new preset locations (batch 6)**

- Grand Hotel Prague Towers (entertainment) — twin-tower luxury hotel; Cold War intelligence anecdotes included
- Muzeum Policie České republiky (cultural) — former Augustinian monastery turned police museum with intact communist-era interrogation rooms
- Vyšehrad Railway Bridge (historical) — iron railway arch crossing the Vltava since 1872, the city's most stoic monument
- Great Strahov Stadium (historical, 30 XP) — world's largest stadium by area; Spartakiad history with aerial human-pixel formations
- Staroměstská vodárenská věž (historical) — Old Town Water Tower (1489): survived Swedish bombardment, ice floods, and gunpowder storage
- Národní technická knihovna (cultural) — 2009 glass-cube NTK in Dejvice with underground campus tunnels
- All 6 have full EN/CZ/ZH descriptions (gamified, humorous RPG style), localizedNames, coordinates, and pixelArtKey

---

## [1.0.7] — 2026-06-21

**Convert all pixel art to lossy WebP (quality 90)**

- Converted all 117 pixel art images from PNG to WebP at quality 90 using `sharp`
- Updated `LocationCard` and `LocationDetail` to load `.webp` instead of `.png`
- Smaller file sizes with equivalent visual quality; all 117 images now served as WebP

---

## [1.0.6] — 2026-06-21

**Complete pixel art coverage — 117 Gemini-generated images across all location cards**

- Added Gemini-generated pixel art for all remaining locations, bringing total coverage to 117 images (up from ~46)
- Every card in the Explore grid now displays a unique pixel art illustration in the card banner
- Covers all 5 categories: historical, cultural, natural, hidden-gem, entertainment
- New images include: Císařský Ostrov, Kunratický Forest, Lake Džbán, Modřanská rokle, Průhonice Park, Žluté lázně, Hráz Hostivař, Soutok Berounky a Vltavy, Suchdol, Trojská lávka, Vinohrady Rose Garden, Centrální park Praha, and more

---

## [1.0.5] — 2026-06-21

**Sort Explore grid by distance; show distance on every card**

- Explore grid now sorts location cards closest-first based on the user's live GPS position
- Each card displays the distance from the user's current location ("340 m", "1.2 km")
- Distance updates reactively as `watchPosition` fires — no extra GPS watch started; the existing proximity-detection watch drives the sort via a shared subscriber pattern in `geolocation.js`
- Distance badge hidden when GPS is unavailable or not yet acquired
- Cards revert to server order while position is loading (no flash of unsorted state)

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
