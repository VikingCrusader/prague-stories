import { chapterLabel, zhNumber, roman, noteEra, enteringEra } from '../utils/eraChapter';

describe('era chapter labels', () => {
  it('counts in Chinese and Roman numerals', () => {
    expect([1, 7, 10, 12, 20, 24].map(zhNumber)).toEqual(['一', '七', '十', '十二', '二十', '二十四']);
    expect([1, 4, 7, 9, 14, 19, 24].map(roman)).toEqual(['I', 'IV', 'VII', 'IX', 'XIV', 'XIX', 'XXIV']);
    expect(chapterLabel(7, 'zh')).toBe('第七章');
    expect(chapterLabel(7, 'en')).toBe('Chapter 7');
    expect(chapterLabel(12, 'cz')).toBe('Kapitola 12');
  });
  it('opens an era only when it is entered from another', () => {
    noteEra('a');
    expect(enteringEra('b')).toBe(true);
    expect(enteringEra('a')).toBe(false);
  });
});
