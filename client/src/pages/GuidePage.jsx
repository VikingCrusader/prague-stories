import { useLang, useConvert } from '../context/LanguageContext';
import { CONTENT, deepConvert } from '../utils/guideContent';
import GuideBoard from '../components/guide/GuideBoard';

// The Guide: the overview board on every screen (2026-11-13, user's design;
// the long single column it replaced is gone). The text is in
// utils/guideContent.js, mirrored in GUIDE.md at the repo root.
export default function GuidePage() {
  const { lang } = useLang();
  const convert = useConvert();
  const c = deepConvert(CONTENT[lang] || CONTENT.en, convert);
  return <div className="guide-page"><GuideBoard c={c} /></div>;
}
