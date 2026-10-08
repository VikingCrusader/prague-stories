import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// services/api.js uses import.meta.env (Vite-only), so it's stubbed here.
const mockGetMe = jest.fn();
const mockSavePreferences = jest.fn(() => Promise.resolve({}));
jest.mock('../services/api', () => ({
  authAPI: { getMe: (...a) => mockGetMe(...a) },
  userAPI: { savePreferences: (...a) => mockSavePreferences(...a) },
}));

import { AuthProvider, useAuth } from '../context/AuthContext';
import { LanguageProvider, useLang } from '../context/LanguageContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import PreferenceSync from '../components/shared/PreferenceSync';

const USER = { _id: 'u1', username: 'explorer', totalXP: 0, explorerLevel: 1 };

function Probe() {
  const { login } = useAuth();
  const { lang, changeLang } = useLang();
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="state">{`${theme}/${lang}`}</div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>toggle-theme</button>
      <button onClick={() => changeLang('cz')}>to-cz</button>
      <button onClick={() => login('tok', { ...USER, preferences: { theme: 'light', lang: 'en', zhVariant: null } })}>login</button>
    </div>
  );
}

function renderApp() {
  return render(
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <PreferenceSync />
          <Probe />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  mockGetMe.mockReset();
  mockSavePreferences.mockClear();
});

test('a restored session applies the preferences saved on the account', async () => {
  localStorage.setItem('token', 'tok');
  mockGetMe.mockResolvedValue({ data: { user: { ...USER, preferences: { theme: 'dark', lang: 'cz', zhVariant: null } } } });
  renderApp();
  await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('dark/cz'));
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(mockSavePreferences).not.toHaveBeenCalled();
});

test('an account with no saved preferences gets the current ones', async () => {
  localStorage.setItem('token', 'tok');
  mockGetMe.mockResolvedValue({ data: { user: { ...USER, preferences: { theme: null, lang: null, zhVariant: null } } } });
  renderApp();
  await waitFor(() => expect(mockSavePreferences).toHaveBeenCalledWith({ theme: 'light', lang: 'en', zhVariant: 'cn' }));
});

test('changes made while signed in are saved', async () => {
  localStorage.setItem('token', 'tok');
  mockGetMe.mockResolvedValue({ data: { user: { ...USER, preferences: { theme: 'dark', lang: 'en', zhVariant: 'cn' } } } });
  renderApp();
  await waitFor(() => expect(mockGetMe).toHaveBeenCalled());
  await act(async () => {});
  await userEvent.click(screen.getByText('toggle-theme'));
  await waitFor(() => expect(mockSavePreferences).toHaveBeenLastCalledWith({ theme: 'light', lang: 'en', zhVariant: 'cn' }));
});

test('a choice made while signed out (login page) wins over the account and is saved', async () => {
  mockGetMe.mockRejectedValue(new Error('no session'));
  renderApp();
  await userEvent.click(screen.getByText('toggle-theme')); // light -> dark
  await userEvent.click(screen.getByText('to-cz'));
  await userEvent.click(screen.getByText('login'));     // account says light/en
  await waitFor(() => expect(mockSavePreferences).toHaveBeenCalledWith({ theme: 'dark', lang: 'cz', zhVariant: 'cn' }));
  expect(screen.getByTestId('state')).toHaveTextContent('dark/cz');
});
