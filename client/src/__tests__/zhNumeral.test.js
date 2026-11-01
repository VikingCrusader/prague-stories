import { toZhNumeral } from '../components/history/HistoryOverviewCard';

describe('toZhNumeral', () => {
  test.each([
    [1, '一'],
    [9, '九'],
    [10, '十'],
    [13, '十三'],
    [15, '十五'],
    [20, '二十'],
    [24, '二十四'],
    [99, '九十九'],
  ])('%i -> %s', (n, expected) => {
    expect(toZhNumeral(n)).toBe(expected);
  });

  test('falls back to Arabic digits outside 1-99', () => {
    expect(toZhNumeral(0)).toBe('0');
    expect(toZhNumeral(100)).toBe('100');
  });
});
