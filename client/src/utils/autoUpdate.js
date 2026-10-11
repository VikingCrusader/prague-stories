// A phone keeps an installed PWA alive in memory, so reopening it after a
// deploy shows the old version until the user refreshes. Whenever the app
// comes back to the foreground (and every 10 minutes while it stays open),
// fetch /version.json and reload if it names a newer build than this bundle.
// Only reloads while the page is visible, so nothing jumps mid-tap in the
// background; production builds only (version.json comes from vite.config.js).
const CHECK_EVERY_MS = 10 * 60 * 1000;

export function startAutoUpdate() {
  if (typeof __BUILD_ID__ === 'undefined' || !import.meta.env.PROD) return;
  let checking = false;
  const check = async () => {
    if (checking || document.visibilityState !== 'visible') return;
    checking = true;
    try {
      const res = await fetch('/version.json', { cache: 'no-store' });
      if (res.ok) {
        const { build } = await res.json();
        if (build && build !== __BUILD_ID__) window.location.reload();
      }
    } catch {
      // Offline or a flaky network: try again on the next resume.
    } finally {
      checking = false;
    }
  };
  document.addEventListener('visibilitychange', check);
  window.addEventListener('pageshow', e => { if (e.persisted) check(); });
  setInterval(check, CHECK_EVERY_MS);
}
