import { getLocalCoverPath, toThumbPath, toCloudThumbUrl } from '../utils/localCover.js';

jest.mock('../utils/coverManifest.json', () => ({
  'with-version': 'with-version-v1790002621854.webp',
  'no-version': 'no-version.webp',
}));

const cloud = (seconds) =>
  `https://res.cloudinary.com/demo/image/upload/v${seconds}/prague-stories/covers/x.webp`;

describe('getLocalCoverPath', () => {
  test('returns null for a slug with no manifest entry', () => {
    expect(getLocalCoverPath('missing')).toBeNull();
    expect(getLocalCoverPath('missing', cloud(1790002621))).toBeNull();
  });

  test('returns the local path when no Cloudinary URL is given', () => {
    expect(getLocalCoverPath('with-version')).toBe('/pixel-art/with-version-v1790002621854.webp');
  });

  test('local wins when the Cloudinary upload is older than the local file', () => {
    expect(getLocalCoverPath('with-version', cloud(1789980823))).toBe(
      '/pixel-art/with-version-v1790002621854.webp'
    );
  });

  test('Cloudinary wins (returns null) when it was uploaded after the local file', () => {
    expect(getLocalCoverPath('with-version', cloud(1790002700))).toBeNull();
  });

  test('local wins when the two timestamps fall in the same second', () => {
    expect(getLocalCoverPath('with-version', cloud(1790002621))).toBe(
      '/pixel-art/with-version-v1790002621854.webp'
    );
  });

  test('a local file with no version timestamp always wins', () => {
    expect(getLocalCoverPath('no-version', cloud(1790009999))).toBe('/pixel-art/no-version.webp');
  });

  test('a Cloudinary URL without a version segment does not override local', () => {
    expect(
      getLocalCoverPath('with-version', 'https://res.cloudinary.com/demo/image/upload/x.webp')
    ).toBe('/pixel-art/with-version-v1790002621854.webp');
  });
});

describe('card thumbnails', () => {
  test('toThumbPath points a local cover at its thumbs/ copy', () => {
    expect(toThumbPath('/pixel-art/with-version-v1790002621854.webp'))
      .toBe('/pixel-art/thumbs/with-version-v1790002621854.webp');
    expect(toThumbPath(null)).toBeNull();
  });

  test('toCloudThumbUrl adds a resize transform to Cloudinary URLs only', () => {
    expect(toCloudThumbUrl('https://res.cloudinary.com/x/image/upload/v1784204857/prague-stories/covers/a.webp'))
      .toBe('https://res.cloudinary.com/x/image/upload/f_auto,q_auto,w_480/v1784204857/prague-stories/covers/a.webp');
    expect(toCloudThumbUrl('/pixel-art/a-1782389478834.webp')).toBe('/pixel-art/a-1782389478834.webp');
  });
});
