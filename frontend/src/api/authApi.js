import api from './axios.js';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  profile: () => api.get('/profile'),
};
