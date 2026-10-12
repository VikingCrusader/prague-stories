import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';

// Gold, silver and bronze for the top three ranks.
const MEDAL = { 1: 'leaderboard__rank--gold', 2: 'leaderboard__rank--silver', 3: 'leaderboard__rank--bronze' };

function Row({ e, t, lang, convert }) {
  const title = lang === 'zh' ? (e.title_zh ?? e.title) : lang === 'cz' ? (e.title_cz ?? e.title) : e.title;
  return (
    <tr className={e.isMe ? 'leaderboard__me' : undefined}>
      <td className={`leaderboard__rank ${MEDAL[e.rank] || ''}`}>{e.rank}</td>
      <td className="leaderboard__name">
        {/* Opens their public profile (ExplorerPage). */}
        <Link to={`/explorer/${encodeURIComponent(e.username)}`} className="leaderboard__link">{e.username}</Link>
        {e.isMe && <span className="leaderboard__you">{t('leaderboard.you')}</span>}
      </td>
      <td className="leaderboard__level">Lv {e.level}<span className="leaderboard__title"> · {convert(title)}</span></td>
      <td className="leaderboard__cards">{(e.cards ?? 0).toLocaleString(lang === 'cz' ? 'cs-CZ' : 'en-US')}</td>
      <td className="leaderboard__xp">{e.totalXP.toLocaleString(lang === 'cz' ? 'cs-CZ' : 'en-US')}</td>
    </tr>
  );
}

// XP leaderboard of every explorer with XP (GET /api/user/leaderboard). Open
// to guests too; a signed-in user's own row is highlighted, and shown below
// the table if they are outside the top 100.
export default function LeaderboardPage() {
  const { user } = useAuth();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    userAPI.getLeaderboard().then(res => setData(res.data)).catch(() => setFailed(true));
  }, [user]);

  return (
    <div className="guide-page leaderboard-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>{t('leaderboard.title')}</h1>
        <p className="guide-intro">{t('leaderboard.tagline')}</p>

        {failed ? (
          <p className="guide-body" style={{ color: 'var(--text-muted)' }}>{t('leaderboard.error')}</p>
        ) : !data ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : data.entries.length === 0 ? (
          <p className="guide-body" style={{ color: 'var(--text-muted)' }}>{t('leaderboard.empty')}</p>
        ) : (
          <>
            <p className="leaderboard__total">{t('leaderboard.total', { n: data.total })}</p>
            <div className="leaderboard__scroll">
              <table className="leaderboard">
                <thead>
                  <tr>
                    <th>{t('leaderboard.rank')}</th>
                    <th>{t('leaderboard.explorer')}</th>
                    <th>{t('leaderboard.level')}</th>
                    <th className="leaderboard__cards">{t('leaderboard.cards')}</th>
                    <th className="leaderboard__xp">{t('leaderboard.xp')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.entries.map(e => <Row key={e.username} e={e} t={t} lang={lang} convert={convert} />)}
                  {data.me && (
                    <>
                      <tr className="leaderboard__gap"><td colSpan={5}>…</td></tr>
                      <Row e={data.me} t={t} lang={lang} convert={convert} />
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!user && <p className="guide-body" style={{ color: 'var(--text-muted)', marginTop: 16 }}>{t('leaderboard.guestNote')}</p>}
      </div>
    </div>
  );
}
