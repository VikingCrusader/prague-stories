import { startOfPragueWeek } from '../src/utils/pragueTime.js';

describe('startOfPragueWeek', () => {
  test('a Wednesday in winter goes back to Monday 0:00 Prague (23:00 UTC on Sunday)', () => {
    expect(startOfPragueWeek(new Date('2026-11-04T12:00:00Z')).toISOString()).toBe('2026-11-01T23:00:00.000Z');
  });
  test('summer time: Monday 0:00 Prague is 22:00 UTC on Sunday', () => {
    expect(startOfPragueWeek(new Date('2026-07-16T08:00:00Z')).toISOString()).toBe('2026-07-12T22:00:00.000Z');
  });
  test('Sunday late evening still belongs to the week that began on Monday', () => {
    // 22:30 UTC on Sunday 8 Nov = 23:30 Sunday in Prague.
    expect(startOfPragueWeek(new Date('2026-11-08T22:30:00Z')).toISOString()).toBe('2026-11-01T23:00:00.000Z');
  });
  test('just after midnight on Monday in Prague starts the new week (still Sunday in UTC)', () => {
    // 23:05 UTC on Sunday 8 Nov = 0:05 Monday 9 Nov in Prague.
    expect(startOfPragueWeek(new Date('2026-11-08T23:05:00Z')).toISOString()).toBe('2026-11-08T23:00:00.000Z');
  });
  test('the week that contains the switch to winter time starts on summer time', () => {
    // Clocks went back on Sunday 25 Oct 2026; that week began Monday 19 Oct (summer time).
    expect(startOfPragueWeek(new Date('2026-10-25T12:00:00Z')).toISOString()).toBe('2026-10-18T22:00:00.000Z');
  });
});
