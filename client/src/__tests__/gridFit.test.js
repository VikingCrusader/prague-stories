import { gridFit } from '../hooks/useFitRows';

const rowsHeight = (zoom, rows) => (385 * rows + 16 * (rows - 1)) * zoom;

test.each([
  ['1080p at 125% display scaling', 1115, 594, 2, 6],
  ['1080p at 100%', 1412, 806, 2, 6],
  ['13-inch MacBook', 1032, 656, 2, 5],
  ['2K in a browser window', 2048, 1122, 3, 9],
])('%s: the rows fit', (_, width, height, rows, columns) => {
  const grid = gridFit(width, height, rows);
  expect(grid.columns).toBe(columns);
  // A few px over at most: the MacBook is held at the smallest readable size.
  expect(rowsHeight(grid.zoom, rows)).toBeLessThanOrEqual(height + 14);
});

test('a touch screen accepts a little cut off for bigger cards (13-inch iPad sideways)', () => {
  expect(gridFit(958, 757, 2).columns).toBe(5);
  expect(gridFit(958, 757, 2, 32).columns).toBe(4);
  expect(gridFit(958, 749, 2, 32).columns).toBe(4); // English and Czech: a taller count line above
});

test('with room to spare it keeps the usual size', () => {
  expect(gridFit(2048, 1400, 3)).toEqual({ columns: 8, zoom: 1 });
});

test('never scales cards up, and never below a readable size', () => {
  expect(gridFit(1500, 2000, 2).zoom).toBe(1);
  expect(gridFit(800, 400, 2).zoom).toBeGreaterThanOrEqual(0.72);
});
