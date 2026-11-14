// "Put Praguedex on your home screen" after signing up (2026-11-14, user's
// call): shown once, on phones and tablets only, never inside the installed
// app. The welcome board doesn't ask (a guest hasn't decided to play yet), and
// on an iPhone an installed web app is the only way to get the 50 m alerts.
//
// RegisterPage marks it pending; InstallPrompt (in App's ProximityDetector)
// shows it once nothing else is asking (location consent decided, the
// notification opt-in answered) and clears the mark for good on any answer.

const PENDING_KEY = 'installPromptPending';

// Chrome on Android hands over its own install dialog through this event,
// fired early in the page's life, so it is caught at load and kept.
let deferredPrompt = null;
const subs = new Set();
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    subs.forEach(cb => cb());
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    clearInstallPrompt();
    subs.forEach(cb => cb());
  });
}

export function subscribeToInstallPrompt(cb) {
  subs.add(cb);
  return () => subs.delete(cb);
}

export const canInstallNatively = () => deferredPrompt != null;

// Opens Chrome's own install dialog; resolves to true if the user accepted.
export async function installNatively() {
  const prompt = deferredPrompt;
  if (!prompt) return false;
  deferredPrompt = null;
  prompt.prompt();
  const { outcome } = await prompt.userChoice;
  return outcome === 'accepted';
}

export function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Phones and tablets, iPadOS included (it reports itself as a Mac).
export function isHandheld() {
  const ua = navigator.userAgent;
  return /Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export function markInstallPromptPending() {
  try {
    if (isHandheld() && !isStandalone()) localStorage.setItem(PENDING_KEY, '1');
  } catch (_) { /* storage blocked: no prompt, nothing lost */ }
}

export function isInstallPromptPending() {
  try { return localStorage.getItem(PENDING_KEY) === '1'; } catch (_) { return false; }
}

export function clearInstallPrompt() {
  try { localStorage.removeItem(PENDING_KEY); } catch (_) { /* ignore */ }
}
