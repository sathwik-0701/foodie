import axiosClient from './axiosClient';

export const orderApi = {
  create: (data) => axiosClient.post('/orders', data),
  getOrders: () => axiosClient.get('/orders'),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  updateStatus: (id, status) => axiosClient.put(`/orders/${id}/status`, { status })
};
