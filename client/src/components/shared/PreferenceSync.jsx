import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { userAPI } from '../../services/api';

// Keeps a signed-in user's display preferences (theme, language, Chinese
// script) on their account, so they follow them to any device.
//  - On sign-in (or session restore): if the reader changed a setting while
//    signed out (navbar toggle or language tabs), that choice wins and is
//    saved to the account. Otherwise the account's saved settings are applied; if it
//    has none yet, the current ones become its first saved settings.
//  - While signed in, every change is saved.
// Renders nothing.
export default function PreferenceSync() {
  const { user } = useAuth();
  const { lang, changeLang, zhVariant, changeZhVariant } = useLang();
  const { theme, setTheme } = useTheme();

  const syncedUserRef = useRef(null);       // user id we've synced for
  const lastSavedRef = useRef(null);        // prefs last known to be on the server
  const changedSignedOutRef = useRef(false);
  const mountedRef = useRef(false);
  // Account settings being applied; the save effect waits until the state
  // has caught up with them instead of saving the old local values.
  const applyingRef = useRef(null);

  const save = (prefs) => {
    lastSavedRef.current = prefs;
    userAPI.savePreferences(prefs).catch(() => {});
  };

  // Note changes made while signed out (ignoring the initial values).
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    if (!user) changedSignedOutRef.current = true;
  }, [theme, lang, zhVariant]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sign-in / sign-out.
  useEffect(() => {
    if (!user) { syncedUserRef.current = null; applyingRef.current = null; return; }
    if (syncedUserRef.current === user._id) return;
    syncedUserRef.current = user._id;

    const saved = user.preferences ?? {};
    const hasSaved = Boolean(saved.theme || saved.lang || saved.zhVariant);
    if (hasSaved && !changedSignedOutRef.current) {
      const next = {
        theme: saved.theme ?? theme,
        lang: saved.lang ?? lang,
        zhVariant: saved.zhVariant ?? zhVariant,
      };
      lastSavedRef.current = next;
      applyingRef.current = next;
      if (next.theme !== theme) setTheme(next.theme);
      if (next.lang !== lang) changeLang(next.lang);
      if (next.zhVariant !== zhVariant) changeZhVariant(next.zhVariant);
    } else {
      save({ theme, lang, zhVariant });
    }
    changedSignedOutRef.current = false;
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save changes while signed in.
  useEffect(() => {
    if (!user || syncedUserRef.current !== user._id) return;
    const applying = applyingRef.current;
    if (applying) {
      if (applying.theme === theme && applying.lang === lang && applying.zhVariant === zhVariant) {
        applyingRef.current = null;
      }
      return;
    }
    const last = lastSavedRef.current;
    if (last && last.theme === theme && last.lang === lang && last.zhVariant === zhVariant) return;
    save({ theme, lang, zhVariant });
  }, [theme, lang, zhVariant, user]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
