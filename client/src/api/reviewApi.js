import axiosClient from './axiosClient';

export const reviewApi = {
  getByRestaurant: (restaurantId) => axiosClient.get(`/reviews/restaurant/${restaurantId}`),
  addReview: (data) => axiosClient.post('/reviews', data)
};
