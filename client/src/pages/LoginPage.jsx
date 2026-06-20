import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT } from '../context/LanguageContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      navigate('/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="px-title">{t('auth.login')}</h1>
        <p className="subtitle">{t('auth.loginSubtitle')}</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input className="px-input" name="email" type="email" value={form.email} onChange={handle} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input className="px-input" name="password" type="password" value={form.password} onChange={handle} required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="px-btn px-btn--gold px-btn--lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.enterPrague')}
          </button>
        </form>
        <p className="form-link">
          {t('auth.noAccount')} <Link to="/register">{t('auth.registerHere')}</Link>
        </p>
      </div>
    </div>
  );
}
