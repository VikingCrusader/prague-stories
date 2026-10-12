import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationCard from '../components/locations/LocationCard';
import { LanguageProvider } from '../context/LanguageContext';

const baseLocation = {
  slug: 'charles-bridge',
  name: 'Charles Bridge',
  localizedNames: { cz: 'Karlův most', zh: '查理大桥' },
  labels: ['bridge', 'historical', 'landmark'],
  pixelArtKey: '',
  coverImage: '',
  rarity: 'legend',
  xpReward: 100,
};

function renderCard(overrides = {}, props = {}) {
  const location = { ...baseLocation, ...overrides };
  return render(
    <LanguageProvider>
      <LocationCard location={location} onClick={() => {}} {...props} />
    </LanguageProvider>
  );
}

describe('LocationCard', () => {
  test('a nearby locked card reveals its name but stays locked', () => {
    const { container } = renderCard({ unlocked: false }, { nearby: true, distance: 60 });
    expect(container.querySelector('.loc-card__name')).toHaveTextContent('Charles Bridge');
    const card = container.querySelector('.loc-card');
    expect(card).toHaveClass('loc-card--locked');
    expect(card).toHaveClass('loc-card--nearby');
    expect(container.querySelector('.loc-card__lock')).toBeInTheDocument();
    expect(container.querySelector('.label-pill-sm')).toHaveTextContent('???');
  });

  test('shows NEW only for cards collected in the last 48 hours', () => {
    const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();
    const recent = renderCard({ unlocked: true, _checkedInAt: hoursAgo(5) });
    expect(recent.container.querySelector('.loc-card__new')).toHaveTextContent('NEW');
    recent.unmount();
    const old = renderCard({ unlocked: true, _checkedInAt: hoursAgo(49) });
    expect(old.container.querySelector('.loc-card__new')).toBeNull();
    old.unmount();
    const never = renderCard({ unlocked: true });
    expect(never.container.querySelector('.loc-card__new')).toBeNull();
  });

  test('shows which treasure-hunt guess found the card', () => {
    const found = renderCard({ unlocked: true, _guessAttempt: 1 });
    expect(found.container.querySelector('.loc-card__hunt')).toHaveTextContent('1st try');
    found.unmount();
    const plain = renderCard({ unlocked: true, _guessAttempt: null });
    expect(plain.container.querySelector('.loc-card__hunt')).toBeNull();
    plain.unmount();
    const locked = renderCard({ unlocked: false, _guessAttempt: 2 });
    expect(locked.container.querySelector('.loc-card__hunt')).toBeNull();
  });

  test('nearby has no effect on an unlocked card', () => {
    const { container } = renderCard({ unlocked: true }, { nearby: true });
    expect(container.querySelector('.loc-card')).not.toHaveClass('loc-card--nearby');
  });

  test('shows "???" instead of the real name when locked', () => {
    const { container } = renderCard({ unlocked: false });
    expect(container.querySelector('.loc-card__name')).toHaveTextContent('???');
    expect(screen.queryByText('Charles Bridge')).not.toBeInTheDocument();
  });

  test('shows the real name when unlocked', () => {
    const { container } = renderCard({ unlocked: true });
    expect(container.querySelector('.loc-card__name')).toHaveTextContent('Charles Bridge');
  });
});
