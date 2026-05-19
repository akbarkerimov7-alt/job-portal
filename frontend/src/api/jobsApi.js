import api from './axios.js';

export const jobsApi = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (payload) => api.post('/jobs/create', payload),
  update: (id, payload) => api.put(`/jobs/update/${id}`, payload),
  remove: (id) => api.delete(`/jobs/delete/${id}`),
  search: (title) => api.get('/jobs/search', { params: { title } }),
  filter: (params) => api.get('/jobs/filter', { params }),
  mine: () => api.get('/jobs/mine'),
};
