import { useState } from 'react';

// An achievement's picture (2026-11-02, pixel-art icons generated from
// docs/achievement-icons.md): public/achievements/<id>.webp, then the shared
// default.webp (a plain brass cup) for an achievement whose icon hasn't been
// drawn yet, then the server's emoji as a last resort. A missing file just
// fails to load (in production the SPA rewrite serves index.html, which also
// fails) and the next step takes over. The surrounding .ach-icon box draws
// the frame and greys out locked achievements.
const SOURCES = (id) => [`/achievements/${id}.webp`, '/achievements/default.webp'];

export default function AchievementIcon({ achievement }) {
  const [step, setStep] = useState(0);
  const sources = achievement?.id ? SOURCES(achievement.id) : [];
  if (step >= sources.length) return achievement?.icon ?? null;
  return (
    <img
      className="ach-icon__img"
      src={sources[step]}
      alt=""
      loading="lazy"
      decoding="async"
      draggable="false"
      onError={() => setStep((s) => s + 1)}
    />
  );
}
