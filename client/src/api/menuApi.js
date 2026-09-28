import axiosClient from './axiosClient';

export const menuApi = {
  getMenuItems: (params) => axiosClient.get('/menu', { params }),
  create: (data) => axiosClient.post('/menu', data),
  update: (id, data) => axiosClient.put(`/menu/${id}`, data),
  delete: (id) => axiosClient.delete(`/menu/${id}`)
};
