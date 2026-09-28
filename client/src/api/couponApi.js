import axiosClient from './axiosClient';

export const couponApi = {
  getCoupons: () => axiosClient.get('/coupons'),
  validate: (code, orderTotal) => axiosClient.post('/coupons/validate', { code, orderTotal }),
  create: (data) => axiosClient.post('/coupons', data)
};
