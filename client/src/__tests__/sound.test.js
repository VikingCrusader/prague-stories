// sound.js caches the AudioContext instance in module-level state (_ctx).
// Each test gets a fresh module instance via jest.resetModules() + require()
// so a mocked/missing AudioContext in one test never leaks into the next
// (same pattern used for geolocation.js's module-level cache).
function installFakeAudioContext() {
  const oscillators = [];

  class FakeGain {
    constructor() {
      this.gain = {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      };
    }
    connect() {}
  }

  class FakeOscillator {
    constructor() {
      this.type = '';
      this.frequency = { value: 0 };
      this.start = jest.fn();
      this.stop = jest.fn();
    }
    connect() {}
  }

  class FakeAudioContext {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
    }
    createOscillator() {
      const osc = new FakeOscillator();
      oscillators.push(osc);
      return osc;
    }
    createGain() {
      return new FakeGain();
    }
  }

  window.AudioContext = FakeAudioContext;
  return oscillators;
}

describe('sound', () => {
  let playUnlockSound, playLevelUpSound;

  beforeEach(() => {
    jest.resetModules();
    delete window.AudioContext;
    delete window.webkitAudioContext;
    navigator.vibrate = jest.fn();
    ({ playUnlockSound, playLevelUpSound } = require('../utils/sound.js'));
  });

  afterEach(() => {
    delete window.AudioContext;
    delete window.webkitAudioContext;
    delete navigator.vibrate;
    jest.restoreAllMocks();
  });

  describe('playUnlockSound', () => {
    test('vibrates with a short pattern for a common-tier unlock', () => {
      installFakeAudioContext();
      playUnlockSound('common');
      expect(navigator.vibrate).toHaveBeenCalledWith([60, 30, 120]);
    });

    test('vibrates with a longer pattern for epic/mythic/legend tiers', () => {
      installFakeAudioContext();
      playUnlockSound('epic');
      expect(navigator.vibrate).toHaveBeenCalledWith([80, 40, 80, 40, 200]);
    });

    test('defaults to the common vibration pattern when rarity is omitted', () => {
      installFakeAudioContext();
      playUnlockSound();
      expect(navigator.vibrate).toHaveBeenCalledWith([60, 30, 120]);
    });

    test('plays a 4-note arpeggio for common tiers', () => {
      const oscillators = installFakeAudioContext();
      playUnlockSound('common');
      expect(oscillators).toHaveLength(4);
    });

    test('plays a longer fanfare for epic/mythic/legend tiers', () => {
      const oscillators = installFakeAudioContext();
      playUnlockSound('legend');
      expect(oscillators.length).toBeGreaterThan(4);
    });

    test('does not throw when AudioContext is unavailable', () => {
      expect(() => playUnlockSound('legend')).not.toThrow();
    });
  });

  describe('playLevelUpSound', () => {
    test('vibrates with its own distinct pattern, different from any unlock pattern', () => {
      installFakeAudioContext();
      playLevelUpSound();
      expect(navigator.vibrate).toHaveBeenCalledWith([90, 50, 90, 50, 90, 50, 260]);
      expect(navigator.vibrate).not.toHaveBeenCalledWith([60, 30, 120]);
      expect(navigator.vibrate).not.toHaveBeenCalledWith([80, 40, 80, 40, 200]);
    });

    test('plays a bigger fanfare (12 notes: two runs + a held chord)', () => {
      const oscillators = installFakeAudioContext();
      playLevelUpSound();
      expect(oscillators).toHaveLength(12);
    });

    test('does not throw when AudioContext is unavailable', () => {
      expect(() => playLevelUpSound()).not.toThrow();
    });

    test('does not throw when navigator.vibrate is unavailable', () => {
      delete navigator.vibrate;
      installFakeAudioContext();
      expect(() => playLevelUpSound()).not.toThrow();
    });
  });
});
