import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT } from '../context/LanguageContext';

const SCENE = `  _     _              /\\   /\\
 | |   | |   O ⚔     /  \\_/  \\
 | |   | |   |       / CASTLE  \\
 |_|___|_|  / \\     /___________\\
 | |   | |      |  []  []  []  |
 |_|___|_|______|_______________|
  TYN CHURCH        HRADCANY`;

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [form, setForm]     = useState({ username: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.token, res.data.user);
      navigate('/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ maxWidth: 480 }}>
        <pre style={{
          fontFamily: "'VT323', monospace",
          fontSize: 13,
          lineHeight: 1.35,
          color: 'var(--gold)',
          textAlign: 'center',
          marginBottom: 18,
          opacity: 0.85,
          overflow: 'hidden',
        }}>{SCENE}</pre>

        <h1 className="px-title">{t('auth.register')}</h1>
        <p className="subtitle">{t('auth.registerSubtitle')}</p>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 22, marginTop: 4 }}>
          {t('auth.registerFlavor')}
        </p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">{t('auth.username')}</label>
            <input className="px-input" name="username" value={form.username} onChange={handle} required minLength={3} maxLength={30} autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input className="px-input" name="email" type="email" value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input className="px-input" name="password" type="password" value={form.password} onChange={handle} required minLength={6} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="px-btn px-btn--gold px-btn--lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.startExploring')}
          </button>
        </form>
        <p className="form-link">
          {t('auth.haveAccount')} <Link to="/login">{t('auth.loginHere')}</Link>
        </p>
      </div>
    </div>
  );
}
