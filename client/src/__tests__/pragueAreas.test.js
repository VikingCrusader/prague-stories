import data from '../utils/pragueAreas.json';
import { areaIn } from '../utils/pragueAreas';

describe('areaIn', () => {
  test('finds the quarter and district of a point in Prague', () => {
    expect(areaIn(data, 50.1035, 14.4385)).toEqual({ quarter: 'Holešovice', district: 'Praha 7' }); // Holešovice market
    expect(areaIn(data, 50.0905, 14.4005)).toEqual({ quarter: 'Hradčany', district: 'Praha 1' }); // Prague Castle
    expect(areaIn(data, 50.0926, 14.4520)).toEqual({ quarter: 'Karlín', district: 'Praha 8' }); // Karlín Palace
  });

  test('finds a point on a bridge, between two simplified boundaries', () => {
    // Štefánikův most over the Vltava, stored as Holešovice on its card.
    expect(areaIn(data, 50.0943, 14.4268)?.district).toBe('Praha 7');
  });

  test('returns null outside Prague', () => {
    expect(areaIn(data, 49.9481, 15.2683)).toBeNull(); // Kutná Hora
    expect(areaIn(data, 50.2, 14.3)).toBeNull();
  });
});
