import { closestAchievements } from '../utils/achievementText';

const ach = (id, current, target, unlocked = false) => ({ id, unlocked, progress: { current, target } });

test('only started, locked achievements, nearest to done first', () => {
  const list = [ach('half', 5, 10), ach('done', 10, 10, true), ach('fresh', 0, 10), ach('near', 9, 10), ach('over', 12, 10), { id: 'none', unlocked: false }];
  expect(closestAchievements(list, 5).map(a => a.id)).toEqual(['near', 'half']);
});

test('among equal shares the fewest steps left comes first, and the list is cut to n', () => {
  const list = [ach('big', 50, 100), ach('small', 1, 2), ach('other', 1, 4)];
  expect(closestAchievements(list, 2).map(a => a.id)).toEqual(['small', 'big']);
});
