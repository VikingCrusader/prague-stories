import { pageCache, pageKey } from '../utils/pageCache';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useT } from '../context/LanguageContext';
import ProfileBody from '../components/dashboard/ProfileBody';

// Another explorer's public profile, opened from the leaderboard
// (GET /api/user/explorers/:username). Since 2026-11-03 (user's call) it is
// laid out like the user's own profile (ProfileBody) and no longer lists
// every card they have collected; the treasure and expedition strips show
// their newest few, in full even if the viewer hasn't found them yet (the
// user's call, 2026-10-12).
export default function ExplorerPage() {
  const { username } = useParams();
  const t = useT();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(pageCache.get(`explorer:${username}`) ?? null);
    setError(null);
    userAPI.getExplorer(username)
      .then(res => { pageCache.set(`explorer:${username}`, res.data); setData(res.data); })
      .catch(err => setError(err.response?.status === 404 ? 'notFound' : 'error'));
  }, [username]);

  const back = <Link to="/leaderboard" className="explorer-back">← {t('leaderboard.title')}</Link>;

  if (error) return (
    <div className="dashboard-page">
      {back}
      <p className="guide-body" style={{ color: 'var(--text-muted)', marginTop: 20 }}>
        {t(error === 'notFound' ? 'explorer.notFound' : 'leaderboard.error')}
      </p>
    </div>
  );
  if (!data) return (
    <div className="dashboard-page explorer-page" aria-busy="true">{back}</div>
  );

  return (
    <div className="dashboard-page explorer-page">
      {back}
      <h1 className="px-title dashboard-title" style={{ fontSize: 26, margin: '12px 0 20px' }}>
        {data.username}
        {data.isMe && <span className="leaderboard__you" style={{ fontSize: 14, verticalAlign: 'middle' }}>{t('leaderboard.you')}</span>}
      </h1>
      <ProfileBody progress={data.progress} achievements={data.achievements} username={data.username} own={data.isMe} />
    </div>
  );
}
