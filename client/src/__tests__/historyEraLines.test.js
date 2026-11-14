import { HISTORY_ERA_LINES, WRITTEN_ERAS } from '../utils/historyEraLines';
import { HISTORY_ERAS as historyEras } from '../../../server/src/data/historyEras.js';

// The Guide's era list must follow the server's eras (keys, order, titles).
describe('history era lines', () => {
  it('has every era, in order, with the server titles', () => {
    const server = [...historyEras].sort((a, b) => a.order - b.order);
    expect(HISTORY_ERA_LINES.map(e => e.key)).toEqual(server.map(e => e.key));
    for (const [i, e] of HISTORY_ERA_LINES.entries()) expect(e.title).toEqual(server[i].title);
  });
  it('has a line in every language', () => {
    for (const e of HISTORY_ERA_LINES) for (const lang of ['en', 'cz', 'zh']) expect(e.line[lang]?.trim()).toBeTruthy();
  });
  it('marks as written exactly the eras the server has content for', () => {
    expect([...WRITTEN_ERAS].sort()).toEqual(historyEras.filter(e => e.hasContent).map(e => e.key).sort());
  });
});
