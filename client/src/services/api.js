import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

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
  getAll: (params) => api.get('/locations', { params }),
  getOne: (slug)   => api.get(`/locations/${slug}`),
  create: (data)   => api.post('/locations', data),
};

export const checkinAPI = {
  getAll:  ()              => api.get('/checkins'),
  checkIn: (slug, note)    => api.post(`/checkins/${slug}`, { note }),
  undo:    (slug)          => api.delete(`/checkins/${slug}`),
};

export const userAPI = {
  getProgress:     () => api.get('/user/progress'),
  getAchievements: () => api.get('/user/achievements'),
};
