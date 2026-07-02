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

function renderCard(overrides = {}) {
  const location = { ...baseLocation, ...overrides };
  return render(
    <LanguageProvider>
      <LocationCard location={location} onClick={() => {}} />
    </LanguageProvider>
  );
}

describe('LocationCard', () => {
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
