import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LanguageProvider, useT } from '../context/LanguageContext';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';

function Harness() {
  const t = useT();
  return (
    <>
      <LanguageSwitcher />
      <h1>{t('explore.titleGuest')}</h1>
    </>
  );
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('clicking the CZ button switches the displayed UI text to Czech', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Harness />
      </LanguageProvider>
    );

    expect(screen.getByRole('heading')).toHaveTextContent('Login to Explore Prague!');

    await user.click(screen.getByRole('button', { name: 'CZ' }));

    expect(screen.getByRole('heading')).toHaveTextContent('Přihlaste se a prozkoumejte Prahu!');
  });
});
