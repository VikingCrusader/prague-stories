import { useLayoutEffect } from 'react';

// The profile on a computer is one screen with no scrolling (2026-11-08, user's
// call), at any screen size. The layout is compact and has fixed columns
// (pixelart.css, `.profile-body` under ONE_PAGE), so at about 1080p it fits at
// close to its normal size; the page is then zoomed a little to fit exactly:
// larger on big screens, smaller on small ones. Phones, portrait screens such as
// an upright iPad, and very short windows keep the normal scrolling page, and a
// 2K screen or larger keeps the normal
// wide layout, which fits it already (user's call).
export const ONE_PAGE = '(min-width: 1024px) and (max-width: 2399px) and (min-height: 500px) and (orientation: landscape), (min-width: 2400px) and (min-height: 500px) and (max-height: 1199px)';
// Macs and iPads (iPadOS reports itself as a Mac; an iPhone is too narrow to get here).
export const IS_APPLE = /Macintosh|Mac OS X/.test(navigator.userAgent);
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.6;
// The three columns need about this much width, so a narrow, tall window can't zoom in.
const MIN_LAYOUT_WIDTH = 1500;

let rectsIgnoreZoom;
// An element's box in viewport pixels inside the zoomed profile. Chrome before
// 128 reports a zoomed element's getBoundingClientRect divided by its zoom,
// later versions (and other browsers) in viewport pixels.
export function viewportRect(el) {
  if (rectsIgnoreZoom === undefined) {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;width:100px;zoom:2';
    document.body.append(probe);
    rectsIgnoreZoom = probe.getBoundingClientRect().width < 150;
    probe.remove();
  }
  const r = el.getBoundingClientRect();
  const zoom = (rectsIgnoreZoom && parseFloat(el.closest('.profile-body, .location-grid')?.style.zoom)) || 1;
  return { left: r.left * zoom, top: r.top * zoom, right: r.right * zoom, bottom: r.bottom * zoom, width: r.width * zoom, height: r.height * zoom };
}

// The largest zoom that fits, by halves.
function solveZoom(kids, body, bottom, maxZoom) {
  const setZoom = zoom => kids.forEach(k => { k.style.zoom = zoom; });
  const fits = zoom => {
    setZoom(zoom);
    return viewportRect(body).bottom <= bottom;
  };
  if (fits(maxZoom)) return maxZoom;
  let low = MIN_ZOOM;
  let high = maxZoom;
  for (let i = 0; i < 8; i++) {
    const middle = (low + high) / 2;
    if (fits(middle)) low = middle;
    else high = middle;
  }
  setZoom(low);
  return low;
}

function fitPage(body) {
  const page = body.parentElement;
  const kids = [...page.children];
  kids.forEach(k => { k.style.zoom = ''; });
  body.style.height = '';
  body.classList.remove('profile-body--tall', 'profile-body--apple');
  if (!window.matchMedia(ONE_PAGE).matches) return;
  const pageRect = page.getBoundingClientRect();
  const bottom = pageRect.bottom - parseFloat(getComputedStyle(page).paddingBottom);
  const width = pageRect.width - 2 * parseFloat(getComputedStyle(page).paddingLeft);
  const maxZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, width / MIN_LAYOUT_WIDTH));
  // On a Mac or iPad: two rows of rarities, and a third row of achievements if the
  // page needn't shrink for it.
  let zoom;
  if (IS_APPLE) {
    body.classList.add('profile-body--apple', 'profile-body--tall');
    zoom = solveZoom(kids, body, bottom, maxZoom);
    if (zoom < maxZoom) body.classList.remove('profile-body--tall');
  }
  if (!body.classList.contains('profile-body--tall')) zoom = solveZoom(kids, body, bottom, maxZoom);
  // The cards share out whatever the zoom left over.
  body.style.height = `${(bottom - viewportRect(body).top) / zoom}px`;
}

// `ref` is `.profile-body`, a child of the page. Runs now, after web fonts load
// and whenever the page changes size.
export function useFitPage(ref, deps) {
  useLayoutEffect(() => {
    const body = ref.current;
    if (!body) return undefined;
    const run = () => fitPage(body);
    run();
    document.fonts?.ready.then(run);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(run) : null;
    ro?.observe(body.parentElement);
    return () => ro?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
