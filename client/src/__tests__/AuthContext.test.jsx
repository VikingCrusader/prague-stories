import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// services/api.js reads import.meta.env (Vite-only syntax) at module scope,
// which the CJS Babel transform used for Jest can't parse — stub it out so
// AuthContext (which imports authAPI purely for the initial getMe() check)
// can be loaded without pulling in the real axios client.
jest.mock('../services/api', () => ({
  authAPI: { getMe: jest.fn(() => Promise.reject(new Error('no session'))) },
}));

import { AuthProvider, useAuth } from '../context/AuthContext';

const BASE_USER = { _id: 'u1', username: 'explorer', totalXP: 40, explorerLevel: 1 };

function Harness() {
  const { user, levelUpEvent, login, applyProgress, clearLevelUpEvent } = useAuth();
  return (
    <div>
      <button onClick={() => login('tok', BASE_USER)}>login</button>
      <button onClick={() => applyProgress({ level: 2, title: 'Tourist', progress: 40, nextLevelXP: 240 }, 140)}>
        checkin-level-up
      </button>
      <button onClick={() => applyProgress({ level: 1, title: 'Newcomer', progress: 62, nextLevelXP: 80 }, 60)}>
        checkin-same-level
      </button>
      <button onClick={clearLevelUpEvent}>dismiss</button>
      <div data-testid="xp">{user?.totalXP ?? 'none'}</div>
      <div data-testid="level">{user?.explorerLevel ?? 'none'}</div>
      <div data-testid="levelup">{levelUpEvent ? `LEVEL ${levelUpEvent.level}: ${levelUpEvent.title}` : 'none'}</div>
    </div>
  );
}

function renderHarness() {
  return render(
    <AuthProvider>
      <Harness />
    </AuthProvider>
  );
}

describe('AuthContext — applyProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('a check-in that raises explorerLevel updates the user and queues a level-up event', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByRole('button', { name: 'login' }));

    await user.click(screen.getByRole('button', { name: 'checkin-level-up' }));

    expect(screen.getByTestId('xp')).toHaveTextContent('140');
    expect(screen.getByTestId('level')).toHaveTextContent('2');
    expect(screen.getByTestId('levelup')).toHaveTextContent('LEVEL 2: Tourist');
  });

  test('a check-in that stays within the same level updates XP but does not queue a level-up event', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByRole('button', { name: 'login' }));

    await user.click(screen.getByRole('button', { name: 'checkin-same-level' }));

    expect(screen.getByTestId('xp')).toHaveTextContent('60');
    expect(screen.getByTestId('level')).toHaveTextContent('1');
    expect(screen.getByTestId('levelup')).toHaveTextContent('none');
  });

  test('clearLevelUpEvent resets the pending celebration', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByRole('button', { name: 'login' }));
    await user.click(screen.getByRole('button', { name: 'checkin-level-up' }));
    expect(screen.getByTestId('levelup')).toHaveTextContent('LEVEL 2: Tourist');

    await user.click(screen.getByRole('button', { name: 'dismiss' }));

    expect(screen.getByTestId('levelup')).toHaveTextContent('none');
  });

  test('applyProgress before login (no user yet) does not crash and stays a no-op', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'checkin-level-up' }));

    expect(screen.getByTestId('xp')).toHaveTextContent('none');
    expect(screen.getByTestId('levelup')).toHaveTextContent('none');
  });

  test('two level-ups in a row: dismissing the first does not resurface it after the second', async () => {
    const user = userEvent.setup();
    renderHarness();
    await user.click(screen.getByRole('button', { name: 'login' }));

    await user.click(screen.getByRole('button', { name: 'checkin-level-up' }));
    expect(screen.getByTestId('levelup')).toHaveTextContent('LEVEL 2: Tourist');
    await user.click(screen.getByRole('button', { name: 'dismiss' }));
    expect(screen.getByTestId('levelup')).toHaveTextContent('none');

    // Level is now 2; re-clicking the same "checkin-level-up" button (which
    // always reports level 2) should no longer count as crossing a boundary.
    await user.click(screen.getByRole('button', { name: 'checkin-level-up' }));
    expect(screen.getByTestId('levelup')).toHaveTextContent('none');
  });
});
