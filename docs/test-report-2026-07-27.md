# Prague Stories — Test Report

| | |
|---|---|
| **Prepared by** | QA (Junior) |
| **Date** | 2026-07-27 |
| **Branch** | `main` @ `0345c9a` |
| **Environment** | Windows 11, Node v25.2.1, npm 11.6.2 |
| **Scope** | Backend unit/integration, frontend unit/component, end-to-end (Playwright) |

## 1. Summary

All automated test suites in the repository were executed locally and **all tests passed**. No failures, flaky retries, or skipped tests were observed in this run.

| Suite | Framework | Test Suites | Tests | Result | Duration |
|---|---|---|---|---|---|
| Backend (`server/`) | Jest + Supertest + mongodb-memory-server | 6 | 150 | ✅ Pass | 7.3s |
| Frontend unit/component (`client/src`) | Jest + React Testing Library | 6 | 59 | ✅ Pass | 4.7s |
| End-to-end (`client/e2e`) | Playwright (Chromium) | 6 spec files | 27 | ✅ Pass | 11.4s |
| **Total** | | **18** | **236** | **✅ 236/236 Pass** | ~23s |

No linter is configured in this project (per `CLAUDE.md`), so no static analysis results are included in this report.

## 2. Backend — `npm test` (server/)

Command: `npm test` (runs Jest with `--experimental-vm-modules` for ESM support)

Integration tests spin up a real Express app (`app.js`) against an in-memory MongoDB instance (`mongodb-memory-server`) via Supertest, rather than mocking Mongoose. External services (Cloudinary, Gemini) are mocked.

| Test Suite | Tests | Result | Notes |
|---|---|---|---|
| `rarityMap.test.js` | — | ✅ Pass | Pure-function tests: rarity tiers, XP values are correct and strictly ascending |
| `gamification.test.js` | — | ✅ Pass | `calculateLevel` thresholds/progress, `evaluateAchievements` logic for all 10+ achievement conditions |
| `authController.test.js` | — | ✅ Pass | Register (incl. password hashing, duplicate email/username), login (correct/incorrect creds), `GET /me` (incl. missing/invalid token) |
| `checkinController.test.js` | — | ✅ Pass | Check-in (auth, GPS validation on/off, duplicate check-in, achievement unlock), history, undo (incl. XP refund, XP floor at 0) |
| `locationController.test.js` | — | ✅ Pass | List/detail endpoints, lazy Gemini description generation (incl. graceful failure), create/update/delete, cover upload validation |
| `userController.test.js` | — | ✅ Pass | Profile, XP progress, achievement catalogue (guest vs. authenticated) |

**Total: 150/150 tests passed across 6 suites.**

### Observation

`locationController.test.js` includes a test that deliberately simulates a Gemini API failure ("AI description generation failed: Gemini is down"). The resulting `console.error` output appearing in the test log is **expected behavior being exercised**, not a test failure — the assertion confirms the endpoint still returns the location successfully when AI generation fails. Flagging this here only so it isn't mistaken for an error on a future read of raw CI logs.

## 3. Frontend Unit/Component — `npm test` (client/)

Command: `npm test` (Jest + React Testing Library)

| Test Suite | Result | Notes |
|---|---|---|
| `geolocation.test.js` | ✅ Pass | Position cache, pub/sub notifications, `getCurrentPosition` cache freshness (60s), permission-denied and unavailable-geolocation error paths |
| `locName.test.js` | ✅ Pass | `getLocName` display-name resolution across en/cz/zh, including fallback rules |
| `rarity.test.js` | ✅ Pass | `RARITY_XP`/`RARITY_COLOR`/`RARITY_LABEL` consistency, cross-checked against server-side values |
| `pixelArtMap.test.js` | ✅ Pass | `getArt` emoji fallback chain (pixelArtKey → label → default pin), `LABEL_DEFINITIONS`/`LABEL_COLORS` completeness |
| `LocationCard.test.jsx` | ✅ Pass | Locked cards show "???"; unlocked cards show the real name |
| `LanguageSwitcher.test.jsx` | ✅ Pass | Clicking CZ switches displayed UI text to Czech |

**Total: 59/59 tests passed across 6 suites.**

## 4. End-to-End — `npm run test:e2e` (client/e2e)

Command: `npm run test:e2e` (Playwright, Chromium, backend mocked via `page.route`)

| Spec File | Scenarios Covered | Result |
|---|---|---|
| `auth.spec.js` | Guest auto-continue, unknown route redirect, register (success + duplicate email), login (success + wrong credentials), guest fallback link, logout | ✅ 8/8 |
| `checkin.spec.js` | Check-in awards XP and flips card, check-in unlocking an achievement shows both toasts, undo relocks card | ✅ 3/3 |
| `dashboard.spec.js` | Level/XP/stat cards render, achievement modal for unlocked (shows date) and locked (shows LOCKED, no date) | ✅ 3/3 |
| `explore.spec.js` | Guest sees locked/unlocked cards, clicking unlocked card opens detail view, language switch persists after reload | ✅ 3/3 |
| `filters.spec.js` | Search (match + no-match empty state), "My Collections" filter, label filter, rarity filter, "All" clears filters, Top Rarity sort | ✅ 7/7 |
| `googleMapsNav.spec.js` | Clicking cover image / fallback art / sidebar image opens Google Maps directions | ✅ 3/3 |

**Total: 27/27 tests passed** (single Chromium project, 8 parallel workers).

## 5. Coverage Assessment

Functional areas with automated coverage:
- Authentication (register/login/session, guest mode)
- Check-in flow (GPS validation, XP award/refund, achievement unlocking, duplicate prevention)
- Gamification (level curve, all achievement conditions, XP floor)
- Location CRUD, lazy AI description generation and its failure path
- Explore grid (search, label/rarity filters, sorting, collection filter)
- i18n (en/cz/zh display names, language switch persistence)
- Rarity/XP consistency between client and server
- Google Maps deep-link navigation from cover/fallback/sidebar images

### Gaps / Suggested Follow-ups
- E2E suite runs on **Chromium only** — no cross-browser (Firefox/WebKit) or mobile-viewport pass is configured.
- No visual regression / screenshot-diff testing.
- No load or performance testing on the backend.
- Cover image upload (`POST /api/locations/:slug/cover`) is unit-tested for validation errors but the actual Cloudinary upload path is mocked, not tested against a real (or sandboxed) Cloudinary account.
- No automated accessibility (a11y) audit found in the suite.

These are noted as opportunities for future test-plan expansion, not defects — everything currently in scope passed.

## 6. Conclusion

The `main` branch at commit `0345c9a` passes all 236 automated tests across backend, frontend unit, and end-to-end layers with zero failures. The build is in a healthy, releasable state from a test-automation standpoint, with the coverage gaps above recommended as next additions to the test plan.
