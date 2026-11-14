// The welcome window a guest gets on Explore (GuideWelcome.jsx, 2026-11-14,
// user's call): a small board of the Guide's own tiles. It shows once per guest
// session: every press of "Continue without login" starts a new one
// (resetGuideWelcome), and so does guest mode in a new tab; within the session,
// coming back to Explore doesn't show it again. The location consent dialog
// waits for it (LocationConsentDialog), so the two never stack.
//
// `localStorage.guideWelcomeOff = '1'` switches it off on this device; only the
// tests use it (Playwright's storageState can't set sessionStorage).

const KEY = 'guideWelcomeSeen';
const OFF = 'guideWelcomeOff';

let _seenMemory = false;
let _open = false;
const _subs = new Set();
const notify = () => _subs.forEach(cb => cb());

export function guideWelcomeSeen() {
  try { if (localStorage.getItem(OFF) === '1') return true; } catch { /* blocked storage */ }
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return _seenMemory; }
}

export function markGuideWelcomeSeen() {
  _seenMemory = true;
  try { sessionStorage.setItem(KEY, '1'); } catch { /* the memory copy holds */ }
  notify();
}

// "Continue without login": a new guest visit, so the welcome shows again.
export function resetGuideWelcome() {
  _seenMemory = false;
  try { sessionStorage.removeItem(KEY); } catch { /* blocked storage */ }
  notify();
}

// While the board is on screen (a dev-mode StrictMode remount turns it off and
// on again, which is why this isn't done with "seen" alone).
export function setGuideWelcomeOpen(open) {
  _open = open;
  notify();
}
export const guideWelcomeOpen = () => _open;

export function subscribeGuideWelcome(cb) {
  _subs.add(cb);
  return () => _subs.delete(cb);
}
