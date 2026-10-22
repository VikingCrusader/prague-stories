import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// services/api.js uses import.meta.env (Vite-only), so it's stubbed here.
const mockGetMe = jest.fn();
const mockSaveConsent = jest.fn(() => Promise.resolve({}));
jest.mock('../services/api', () => ({
  authAPI: { getMe: (...a) => mockGetMe(...a) },
  userAPI: { saveLocationConsent: (...a) => mockSaveConsent(...a) },
}));

import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import LocationConsentDialog from '../components/shared/LocationConsentDialog';
import LocationConsentSync from '../components/shared/LocationConsentSync';
import {
  LOCATION_CONSENT_VERSION, getLocationConsent, setLocationConsent, requestLocationConsent,
} from '../utils/locationConsent';

const USER = { _id: 'u1', username: 'explorer', totalXP: 0, explorerLevel: 1 };

function renderApp(path = '/explore') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <LanguageProvider>
          <LocationConsentSync />
          <LocationConsentDialog />
        </LanguageProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  mockGetMe.mockReset();
  mockSaveConsent.mockClear();
});

describe('LocationConsentDialog', () => {
  test('asks on first open, with both answers equally offered, and remembers "Not now"', async () => {
    renderApp();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const allow = screen.getByRole('button', { name: 'Allow location' });
    const deny = screen.getByRole('button', { name: 'Not now' });
    expect(allow.className).toBe(deny.className);
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');

    await userEvent.click(deny);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(getLocationConsent()).toMatchObject({ granted: false, version: LOCATION_CONSENT_VERSION });
  });

  test('stays away once decided, and comes back when a feature needs the position', async () => {
    setLocationConsent(false);
    renderApp();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    let answer;
    act(() => { requestLocationConsent().then(a => { answer = a; }); });
    await userEvent.click(await screen.findByRole('button', { name: 'Allow location' }));
    await waitFor(() => expect(answer).toBe(true));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('is not laid over the Privacy page, which has the same choice', () => {
    renderApp('/privacy');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('LocationConsentSync', () => {
  test('saves a decision made on this device to the account', async () => {
    setLocationConsent(true, '2026-10-22T10:00:00.000Z');
    localStorage.setItem('token', 'tok');
    mockGetMe.mockResolvedValue({ data: { user: { ...USER, locationConsent: { granted: null, version: null, decidedAt: null } } } });
    renderApp();
    await waitFor(() => expect(mockSaveConsent).toHaveBeenCalledWith({ granted: true, version: LOCATION_CONSENT_VERSION }));
  });

  test('applies a newer decision from the account, e.g. a withdrawal on another device', async () => {
    setLocationConsent(true, '2026-10-20T10:00:00.000Z');
    localStorage.setItem('token', 'tok');
    mockGetMe.mockResolvedValue({ data: { user: { ...USER, locationConsent: { granted: false, version: LOCATION_CONSENT_VERSION, decidedAt: '2026-10-21T10:00:00.000Z' } } } });
    renderApp();
    await waitFor(() => expect(getLocationConsent()).toMatchObject({ granted: false, at: '2026-10-21T10:00:00.000Z' }));
    expect(mockSaveConsent).not.toHaveBeenCalled();
  });

  test('saves a later change while signed in', async () => {
    localStorage.setItem('token', 'tok');
    mockGetMe.mockResolvedValue({ data: { user: { ...USER, locationConsent: { granted: true, version: LOCATION_CONSENT_VERSION, decidedAt: '2026-10-21T10:00:00.000Z' } } } });
    renderApp();
    await waitFor(() => expect(getLocationConsent()).toMatchObject({ granted: true }));
    act(() => { setLocationConsent(false); });
    await waitFor(() => expect(mockSaveConsent).toHaveBeenCalledWith({ granted: false, version: LOCATION_CONSENT_VERSION }));
  });
});
