import axiosClient from './axiosClient';

export const restaurantApi = {
  getAll: (params) => axiosClient.get('/restaurants', { params }),
  getById: (id) => axiosClient.get(`/restaurants/${id}`),
  create: (data) => axiosClient.post('/restaurants', data),
  update: (id, data) => axiosClient.put(`/restaurants/${id}`, data),
  delete: (id) => axiosClient.delete(`/restaurants/${id}`)
};
