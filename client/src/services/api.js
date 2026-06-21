import axios from 'axios';

const BASE_URL = import.meta.env.PROD
  ? 'https://prague-stories-api.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

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
  getAll:  (params)       => api.get('/locations', { params }),
  getOne:  (slug)         => api.get(`/locations/${slug}`),
  create:  (data)         => api.post('/locations', data),
  update:  (slug, data)   => api.put(`/locations/${slug}`, data),
  remove:  (slug)         => api.delete(`/locations/${slug}`),
};

export const checkinAPI = {
  getAll:  ()              => api.get('/checkins'),
  checkIn: (slug, { note, lat, lng } = {}) => api.post(`/checkins/${slug}`, { note, lat, lng }),
  undo:    (slug)          => api.delete(`/checkins/${slug}`),
};

export const userAPI = {
  getProgress:     () => api.get('/user/progress'),
  getAchievements: () => api.get('/user/achievements'),
};
