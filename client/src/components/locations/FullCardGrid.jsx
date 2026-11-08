import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import LocationCard from './LocationCard';
import { useT } from '../../context/LanguageContext';

const PAGE_SIZE = 60;
// `loadOnClick` on a phone: about five screens, one screen holds only four cards.
const PHONE_BATCH = 20;
// What a full-height pop-up leaves for the cards under its title.
const POPUP_CHROME_PX = 90;

// The width a card has on Explore at this screen size: .explore-page is at
// most 1600 px wide with 24 px padding (from 2400 px it has no limit, less the
// 440 px side column and its 24 px gap), its .location-grid is
// auto-fill minmax(230px, 1fr) with 16 px gaps. Phones don't use this, they
// share .location-grid's two columns.
function exploreCardWidth() {
  const screen = document.documentElement.clientWidth;
  const width = screen >= 2400 ? screen - 48 - 464 : Math.min(screen, 1600) - 48;
  const columns = Math.max(1, Math.floor((width + 16) / 246));
  return (width - 16 * (columns - 1)) / columns;
}

// Whole cards at Explore's size, as many to a row as the container holds,
// inside a scrolling pop-up (`scrollRef`). Mounted in batches like Explore's:
// a player can have hundreds of common cards. By default the next batch comes
// on scrolling; with `loadOnClick` a "More" button adds it, a batch being one
// screen of whole rows (measured from the first card) or PHONE_BATCH on phones.
export default function FullCardGrid({ cards, onOpen, scrollRef, loadOnClick = false }) {
  const t = useT();
  const [cardWidth, setCardWidth] = useState(exploreCardWidth);
  const [batch, setBatch] = useState(loadOnClick ? 1 : PAGE_SIZE);
  const [visible, setVisible] = useState(batch);
  const gridRef = useRef(null);
  const sentinelRef = useRef(null);
  const hasMore = visible < cards.length;

  useLayoutEffect(() => {
    if (!loadOnClick) return;
    let size = PHONE_BATCH;
    if (!window.matchMedia('(max-width: 600px)').matches) {
      const columns = getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length;
      const cardHeight = gridRef.current.firstElementChild.getBoundingClientRect().height;
      size = columns * Math.max(1, Math.ceil((window.innerHeight * 0.9 - POPUP_CHROME_PX) / (cardHeight + 16)));
    }
    setBatch(size);
    setVisible(size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => setCardWidth(exploreCardWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (loadOnClick || !el || !hasMore || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setVisible(n => n + PAGE_SIZE);
    }, { root: scrollRef.current, rootMargin: '800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [loadOnClick, hasMore, visible, scrollRef]);

  return (
    <>
      <div ref={gridRef} className="location-grid full-card-grid" style={{ '--card-w': `${cardWidth}px` }}>
        {cards.slice(0, visible).map(loc => <LocationCard key={loc.slug} location={loc} onClick={onOpen} />)}
      </div>
      {hasMore && (loadOnClick
        ? <button type="button" className="filter-btn full-card-grid__more" onClick={() => setVisible(v => v + batch)}>{t('dashboard.loadMore', { n: cards.length - visible })}</button>
        : <div ref={sentinelRef} style={{ height: 1 }} />)}
    </>
  );
}
