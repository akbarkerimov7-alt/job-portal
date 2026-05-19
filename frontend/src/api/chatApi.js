import api from './axios.js';

export const chatApi = {
  conversations: () => api.get('/chats/conversations'),
  messages: (jobId, participantId) =>
    api.get(`/chats/jobs/${jobId}`, {
      params: participantId ? { participantId } : {},
    }),
  send: (jobId, payload) => api.post(`/chats/jobs/${jobId}/messages`, payload),
};
