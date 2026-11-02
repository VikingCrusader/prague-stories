import axios from 'axios';
import { announceAchievements } from '../utils/achievementEvents';
import { HUNT_WIN_SOUND_MS } from '../utils/sound';

const BASE_URL = import.meta.env.PROD
  ? 'https://prague-stories-api.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

// Any response may carry newly unlocked achievements (a check-in, a
// treasure-hunt find, app load, the achievements page): announce them. After
// a find they wait for the hunt fanfare, after a check-in for the card
// unlock sound.
api.interceptors.response.use(res => {
  const list = res.data?.newAchievements;
  if (Array.isArray(list) && list.length) {
    const url = res.config?.url || '';
    const delay = url.includes('/random-draw/guess') ? HUNT_WIN_SOUND_MS + 200
      : url.startsWith('/checkins') ? 1200 : 300;
    announceAchievements(list, delay);
  }
  return res;
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

export const locationAPI = {
  getAll:       (params)       => api.get('/locations', { params }),
  getOne:       (slug)         => api.get(`/locations/${slug}`),
  create:       (data)         => api.post('/locations', data),
  update:       (slug, data)   => api.put(`/locations/${slug}`, data),
  remove:       (slug)         => api.delete(`/locations/${slug}`),
  uploadCover:  (slug, file)   => {
    const fd = new FormData();
    fd.append('cover', file);
    return api.post(`/locations/${slug}/cover`, fd);
  },
};

// Tells listeners (useProximityDetection) that a card was just collected, so
// the 50 m "discovery" alert doesn't fire for it afterwards. `slug` is null
// when the caller doesn't know it (a treasure-hunt find).
export const COLLECTED_EVENT = 'location-collected';
function announceCollected(slug = null) {
  try { window.dispatchEvent(new CustomEvent(COLLECTED_EVENT, { detail: { slug } })); } catch (_) {}
}

export const checkinAPI = {
  getAll:  ()              => api.get('/checkins'),
  checkIn: (slug, { note, lat, lng } = {}) => api.post(`/checkins/${slug}`, { note, lat, lng })
    .then(res => { announceCollected(slug); return res; }),
};

export const historyAPI = {
  getAll: (lang) => api.get('/history', { params: { lang } }),
};

export const userAPI = {
  getProgress:      () => api.get('/user/progress'),
  getAchievements:  () => api.get('/user/achievements'),
  getLeaderboard:   () => api.get('/user/leaderboard'),
  getExplorer:      (username) => api.get(`/user/explorers/${encodeURIComponent(username)}`),
  // `pos` ({ lat, lng }, optional) lets the server compute a treasure hunt's distance clue.
  getRandomDraw:    (pos) => api.get('/user/random-draw', { params: pos ? { lat: pos.lat, lng: pos.lng } : undefined }),
  // Starts a treasure hunt (the route name dates from the retired open draw).
  drawRandomLocation: (pos) => api.post('/user/random-draw', { ...(pos || {}) }),
  guessTreasure:    (pos) => api.post('/user/random-draw/guess', pos)
    .then(res => { if (res.data?.hit) announceCollected(); return res; }),
  // Takes a clue ('labels', 'direction' or 'distance') for half a step of multiplier.
  takeHuntClue:     pos => api.post('/user/random-draw/clue', pos || {}),
  getTreasures:     () => api.get('/user/treasures'),
  getHistoryProgress:  ()     => api.get('/user/history-progress'),
  saveHistoryProgress: (slug) => api.put('/user/history-progress', { slug }),
  savePreferences:     (prefs) => api.put('/user/preferences', prefs),
  saveLocationConsent: (decision) => api.put('/user/location-consent', decision),
};

// Same save as userAPI.saveHistoryProgress, but survives the page being
// closed or reloaded mid-request (fetch keepalive; sendBeacon can't send the
// Authorization header). Used when the History page is hidden or unloaded.
export function saveHistoryProgressOnExit(slug) {
  const token = localStorage.getItem('token');
  if (!token) return;
  fetch(`${BASE_URL}/user/history-progress`, {
    method: 'PUT',
    keepalive: true,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ slug }),
  }).catch(() => {});
}
