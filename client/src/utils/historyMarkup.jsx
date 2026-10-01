// Inline markup shared by the History cards (HistoryEventSection,
// HistoryOverviewCard).

// In-text cross-reference: "[[link:some-slug]]display text[[/link]]" inside
// a summary paragraph becomes an underlined, clickable span that jumps to
// that other event's own section further up/down the same feed — for a
// phrase like "Otakar's 1254 charter" that should point straight at
// jewish-community-charter-1254 instead of just naming it in prose. Kept
// separate from the [[quote:N]] marker (chronicleQuoteSchema's own
// mechanism): that one replaces an entire paragraph with a blockquote,
// this one sits inline mid-sentence, so it needs its own regex pass over
// each paragraph's text rather than a whole-paragraph match. Runs after
// convert() has already been applied to the full summary string (same as
// the quote marker) — plain ASCII brackets and a lowercase-kebab slug
// survive the zh-TW conversion untouched either way.
//
// "[[b]]emphasized text[[/b]]" is the same idea for plain emphasis rather
// than a cross-reference — renders as <strong>, no click behavior. Added
// 2026-09-02 at the user's request to bold a load-bearing sentence (Hus's
// own core positions) and reused going forward for similarly key content —
// a summary sentence that states a card's central claim outright, not
// routine detail. Both markers share one regex pass (alternation) so they
// can appear in the same paragraph in either order.
const INLINE_MARKUP_RE = /\[\[link:([a-z0-9-]+)\]\](.*?)\[\[\/link\]\]|\[\[b\]\](.*?)\[\[\/b\]\]/g;

export function renderInlineLinks(text, onNavigateToEvent) {
  if (!text.includes('[[link:') && !text.includes('[[b]]')) return text;
  const nodes = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  INLINE_MARKUP_RE.lastIndex = 0;
  while ((match = INLINE_MARKUP_RE.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [full, slug, linkLabel, boldText] = match;
    if (slug) {
      nodes.push(
        <span
          key={`link-${key++}`}
          role="button"
          tabIndex={0}
          className="history-event__inline-link"
          onClick={() => onNavigateToEvent?.(slug)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigateToEvent?.(slug);
            }
          }}
        >
          {linkLabel}
        </span>
      );
    } else {
      nodes.push(<strong key={`bold-${key++}`}>{boldText}</strong>);
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
