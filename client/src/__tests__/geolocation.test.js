import { haversineDistance } from '../utils/geolocation.js';

describe('haversineDistance', () => {
  describe('trivial cases', () => {
    test('same point returns 0', () => {
      expect(haversineDistance(0, 0, 0, 0)).toBe(0);
    });

    test('same Prague coordinates return 0', () => {
      expect(haversineDistance(50.0865, 14.4114, 50.0865, 14.4114)).toBe(0);
    });
  });

  describe('known distances', () => {
    test('1° longitude along equator ≈ 111 195 m', () => {
      const d = haversineDistance(0, 0, 0, 1);
      expect(d).toBeGreaterThan(111000);
      expect(d).toBeLessThan(112000);
    });

    test('1° latitude along prime meridian ≈ 111 195 m', () => {
      const d = haversineDistance(0, 0, 1, 0);
      expect(d).toBeGreaterThan(111000);
      expect(d).toBeLessThan(112000);
    });

    test('Prague Castle to Charles Bridge ≈ 700–1100 m', () => {
      // Prague Castle: ~50.0906, 14.4014 — Charles Bridge: ~50.0865, 14.4114
      const d = haversineDistance(50.0906, 14.4014, 50.0865, 14.4114);
      expect(d).toBeGreaterThan(700);
      expect(d).toBeLessThan(1100);
    });
  });

  describe('mathematical properties', () => {
    test('is symmetric: d(A,B) === d(B,A)', () => {
      const forward = haversineDistance(50.0865, 14.4114, 50.0906, 14.4014);
      const reverse = haversineDistance(50.0906, 14.4014, 50.0865, 14.4114);
      expect(forward).toBeCloseTo(reverse, 6);
    });

    test('satisfies rough triangle inequality', () => {
      const ab = haversineDistance(50.0, 14.0, 50.5, 14.5);
      const bc = haversineDistance(50.5, 14.5, 51.0, 15.0);
      const ac = haversineDistance(50.0, 14.0, 51.0, 15.0);
      expect(ac).toBeLessThanOrEqual(ab + bc + 1); // +1 m for float rounding
    });

    test('distance increases monotonically with separation', () => {
      const d1 = haversineDistance(50, 14, 50, 14.001);
      const d2 = haversineDistance(50, 14, 50, 14.01);
      const d3 = haversineDistance(50, 14, 50, 14.1);
      expect(d1).toBeLessThan(d2);
      expect(d2).toBeLessThan(d3);
    });
  });

  describe('return value', () => {
    test('returns a number in metres', () => {
      const result = haversineDistance(50, 14, 51, 15);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });
});

// The module holds shared state (_cachedPos, _subs). Each test gets a
// fresh instance via jest.resetModules() + require() so state never leaks.
describe('position cache and subscriptions', () => {
  let setCachedPosition, subscribeToPosition, getCurrentPosition;

  beforeEach(() => {
    jest.resetModules();
    ({ setCachedPosition, subscribeToPosition, getCurrentPosition } =
      require('../utils/geolocation.js'));
  });

  afterEach(() => {
    delete global.navigator;
    jest.restoreAllMocks();
  });

  describe('setCachedPosition', () => {
    test('notifies a registered subscriber', () => {
      const cb = jest.fn();
      subscribeToPosition(cb);
      cb.mockClear();
      setCachedPosition(50, 14);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith({ lat: 50, lng: 14 });
    });

    test('notifies multiple subscribers', () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      subscribeToPosition(cb1);
      subscribeToPosition(cb2);
      cb1.mockClear();
      cb2.mockClear();
      setCachedPosition(51, 15);
      expect(cb1).toHaveBeenCalledWith({ lat: 51, lng: 15 });
      expect(cb2).toHaveBeenCalledWith({ lat: 51, lng: 15 });
    });

    test('subsequent calls update the cached value', () => {
      const cb = jest.fn();
      subscribeToPosition(cb);
      cb.mockClear();
      setCachedPosition(50, 14);
      setCachedPosition(51, 15);
      expect(cb).toHaveBeenLastCalledWith({ lat: 51, lng: 15 });
    });
  });

  describe('subscribeToPosition', () => {
    test('does not fire immediately when no cache exists', () => {
      const cb = jest.fn();
      subscribeToPosition(cb);
      expect(cb).not.toHaveBeenCalled();
    });

    test('fires immediately with the cached position', () => {
      setCachedPosition(50, 14);
      const cb = jest.fn();
      subscribeToPosition(cb);
      expect(cb).toHaveBeenCalledWith({ lat: 50, lng: 14 });
    });

    test('returned unsubscribe stops future notifications', () => {
      const cb = jest.fn();
      const unsubscribe = subscribeToPosition(cb);
      cb.mockClear();
      unsubscribe();
      setCachedPosition(52, 16);
      expect(cb).not.toHaveBeenCalled();
    });

    test('unsubscribing one listener does not affect others', () => {
      const cb1 = jest.fn();
      const cb2 = jest.fn();
      const unsubscribe1 = subscribeToPosition(cb1);
      subscribeToPosition(cb2);
      cb1.mockClear();
      cb2.mockClear();
      unsubscribe1();
      setCachedPosition(53, 17);
      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).toHaveBeenCalledWith({ lat: 53, lng: 17 });
    });
  });

  describe('getCurrentPosition', () => {
    test('resolves from cache when it is fresh (< 60 s)', async () => {
      setCachedPosition(50, 14);
      await expect(getCurrentPosition()).resolves.toEqual({ lat: 50, lng: 14 });
    });

    test('bypasses cache when it is older than 60 s', async () => {
      jest.spyOn(Date, 'now')
        .mockReturnValueOnce(1000)           // setCachedPosition → ts = 1000
        .mockReturnValueOnce(1000 + 61_000); // getCurrentPosition check → 61 s later
      setCachedPosition(50, 14);

      global.navigator = {
        geolocation: {
          getCurrentPosition: jest.fn((success) =>
            success({ coords: { latitude: 51, longitude: 15 } })
          ),
        },
      };

      await expect(getCurrentPosition()).resolves.toEqual({ lat: 51, lng: 15 });
    });

    test('rejects with permission-denied message when user blocks location', async () => {
      global.navigator = {
        geolocation: {
          getCurrentPosition: jest.fn((_, error) =>
            error({ code: 1, PERMISSION_DENIED: 1 })
          ),
        },
      };
      await expect(getCurrentPosition()).rejects.toThrow('Location permission denied');
    });

    test('rejects with generic message for other geolocation errors', async () => {
      global.navigator = {
        geolocation: {
          getCurrentPosition: jest.fn((_, error) =>
            error({ code: 2, PERMISSION_DENIED: 1 })
          ),
        },
      };
      await expect(getCurrentPosition()).rejects.toThrow('Could not get your location');
    });

    test('rejects when navigator.geolocation is unavailable', async () => {
      global.navigator = {};
      await expect(getCurrentPosition()).rejects.toThrow('Geolocation is not supported');
    });
  });
});
