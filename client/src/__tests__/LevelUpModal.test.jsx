import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// See AuthContext.test.jsx — services/api.js uses import.meta.env, which the
// Jest/Babel CJS transform can't parse, so it's stubbed out.
jest.mock('../services/api', () => ({
  authAPI: { getMe: jest.fn(() => Promise.reject(new Error('no session'))) },
}));

jest.mock('../utils/sound', () => ({
  playLevelUpSound: jest.fn(),
}));

import { AuthProvider, useAuth } from '../context/AuthContext';
import { LanguageProvider, useLang } from '../context/LanguageContext';
import LevelUpModal from '../components/shared/LevelUpModal';
import { playLevelUpSound } from '../utils/sound';

const BASE_USER = { _id: 'u1', username: 'explorer', totalXP: 40, explorerLevel: 1 };
const LEVEL_INFO = {
  level: 2,
  title: 'Tourist',
  title_cz: 'Turista',
  title_zh: '游客',
  progress: 40,
  nextLevelXP: 240,
};

function Harness() {
  const { login, applyProgress } = useAuth();
  const { changeLang } = useLang();
  return (
    <div>
      <button onClick={() => login('tok', BASE_USER)}>login</button>
      <button onClick={() => applyProgress(LEVEL_INFO, 140)}>level-up</button>
      <button onClick={() => changeLang('cz')}>cz</button>
      <button onClick={() => changeLang('zh')}>zh</button>
    </div>
  );
}

function renderApp() {
  return render(
    <AuthProvider>
      <LanguageProvider>
        <Harness />
        <LevelUpModal />
      </LanguageProvider>
    </AuthProvider>
  );
}

describe('LevelUpModal', () => {
  beforeEach(() => {
    localStorage.clear();
    playLevelUpSound.mockClear();
  });

  test('renders nothing when there is no pending level-up event', () => {
    renderApp();
    expect(screen.queryByText(/LEVEL UP!/)).not.toBeInTheDocument();
    expect(playLevelUpSound).not.toHaveBeenCalled();
  });

  test('shows the celebration and plays the sound once a check-in crosses a level boundary', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'login' }));
    await user.click(screen.getByRole('button', { name: 'level-up' }));

    expect(screen.getByText(/LEVEL UP!/)).toBeInTheDocument();
    expect(screen.getByText('LEVEL 2')).toBeInTheDocument();
    expect(screen.getByText('Tourist')).toBeInTheDocument();
    expect(playLevelUpSound).toHaveBeenCalledTimes(1);
  });

  test('dismisses on Continue click', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'login' }));
    await user.click(screen.getByRole('button', { name: 'level-up' }));
    expect(screen.getByText(/LEVEL UP!/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.queryByText(/LEVEL UP!/)).not.toBeInTheDocument();
  });

  test('dismisses when clicking the overlay outside the modal card', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'login' }));
    await user.click(screen.getByRole('button', { name: 'level-up' }));
    const overlay = screen.getByText(/LEVEL UP!/).closest('.px-overlay');
    expect(overlay).not.toBeNull();

    await user.click(overlay);
    expect(screen.queryByText(/LEVEL UP!/)).not.toBeInTheDocument();
  });

  test('localizes the title and headline when the active language is Czech', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'login' }));
    await user.click(screen.getByRole('button', { name: 'cz' }));
    await user.click(screen.getByRole('button', { name: 'level-up' }));

    expect(screen.getByText(/POSTUP NA ÚROVEŇ!/)).toBeInTheDocument();
    expect(screen.getByText('Turista')).toBeInTheDocument();
  });

  test('localizes the title when the active language is Chinese', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'login' }));
    await user.click(screen.getByRole('button', { name: 'zh' }));
    await user.click(screen.getByRole('button', { name: 'level-up' }));

    expect(screen.getByText(/升级了！/)).toBeInTheDocument();
    expect(screen.getByText('游客')).toBeInTheDocument();
  });
});
