import axiosClient from './axiosClient';

export const userApi = {
  getAddresses: () => axiosClient.get('/users/addresses'),
  addAddress: (data) => axiosClient.post('/users/addresses', data),
  deleteAddress: (id) => axiosClient.delete(`/users/addresses/${id}`),
  getFavorites: () => axiosClient.get('/users/favorites'),
  toggleFavorite: (restaurantId) => axiosClient.post('/users/favorites/toggle', { restaurantId })
};
