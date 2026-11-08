// When Explore puts the title, filters and map in a side column (2026-11-08, user's
// call): any 2K screen, and from 1180 x 700 a compact version of it (1080p, MacBooks,
// iPads held sideways). Narrower or shorter windows keep the stacked layout. Goes by
// the window's size, not the device: a MacBook's is shorter than a 1080p screen's.
export const EXPLORE_SIDE_QUERY = '(min-width: 2400px), (min-width: 1180px) and (min-height: 700px)';

// The side column plus its gap (the values in pixelart.css: --explore-side-w).
export const exploreSideWidth = (screen) => (screen >= 2400 ? 464 : Math.min(440, Math.max(340, screen * 0.23)) + 20);
