import axiosClient from './axiosClient';

export const supportApi = {
  createTicket: (data) => axiosClient.post('/support/tickets', data),
  getTickets: () => axiosClient.get('/support/tickets'),
  getTicketById: (id) => axiosClient.get(`/support/tickets/${id}`),
  addMessage: (id, message) => axiosClient.post(`/support/tickets/${id}/messages`, { message })
};
