import { useRef } from 'react';
import { useFitOneLine } from '../../hooks/useFitOneLine';

// The History page heading and its one-paragraph overview, in Explore's
// title and intro styles. HistoryPage renders it twice: at the top of the
// feed column on desktop (aligned with the cards), and above the sidebar on
// phones, where the sidebar comes first; CSS shows one or the other.
export default function HistoryHero({ t, convert, placement }) {
  const titleRef = useRef(null);
  // Short title: keep the base size, only shrink if it can't fit (like
  // Explore's area names). The hidden copy measures 0 wide and is skipped.
  useFitOneLine(titleRef, [t, placement], { maxScale: 1 });
  return (
    <header className={`history-hero history-hero--${placement}`}>
      <h1 ref={titleRef} className="px-title explore-title explore-title--fit">{convert(t('history.heroTitle'))}</h1>
      <p className="explore-area-blurb">{convert(t('history.heroIntro'))}</p>
    </header>
  );
}
