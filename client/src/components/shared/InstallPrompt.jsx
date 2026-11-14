import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT, useConvert } from '../../context/LanguageContext';
import { canInstallNatively, clearInstallPrompt, installNatively, subscribeToInstallPrompt } from '../../utils/installPrompt';

// The one-time "put it on your home screen" card after signing up
// (utils/installPrompt.js). Styled like NotificationOptIn, in the same spot.
// "Show me how" opens the Guide's Install window; on Android Chrome, when the
// browser offers it, "Install" opens Chrome's own dialog instead.
export default function InstallPrompt({ onDone }) {
  const t = useT();
  const convert = useConvert();
  const navigate = useNavigate();
  const [native, setNative] = useState(canInstallNatively);
  useEffect(() => subscribeToInstallPrompt(() => setNative(canInstallNatively())), []);

  const done = () => { clearInstallPrompt(); onDone(); };
  const showHow = () => { done(); navigate('/guide?open=install'); };
  const install = async () => { await installNatively(); done(); };

  return (
    <div className="install-prompt" role="dialog" aria-labelledby="install-prompt-title">
      <img className="install-prompt__icon" src="/brand/app-icon.png" alt="" />
      <div className="install-prompt__text">
        <p id="install-prompt-title" className="install-prompt__title">{convert(t('install.title'))}</p>
        <p className="install-prompt__body">{convert(t('install.body'))}</p>
      </div>
      <div className="install-prompt__buttons">
        <button type="button" className="px-btn px-btn--gold" onClick={native ? install : showHow}>
          {convert(t(native ? 'install.install' : 'install.how'))}
        </button>
        <button type="button" className="px-btn px-btn--dark" onClick={done}>
          {convert(t('install.later'))}
        </button>
      </div>
    </div>
  );
}
