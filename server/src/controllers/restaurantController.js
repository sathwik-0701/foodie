const Restaurant = require('../models/Restaurant');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// @desc Get all restaurants with search & filters
// @route GET /api/restaurants
const getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, isVegOnly, sort, rating } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (search) {
        query.$text = { $search: search };
      }
      if (cuisine) {
        query.cuisine = cuisine;
      }
      if (isVegOnly === 'true') {
        query.isVegOnly = true;
      }
      if (rating) {
        query.rating = { $gte: parseFloat(rating) };
      }

      let sortOptions = {};
      if (sort === 'rating') sortOptions.rating = -1;
      else if (sort === 'price_low') sortOptions.costForTwo = 1;
      else if (sort === 'price_high') sortOptions.costForTwo = -1;

      const restaurants = await Restaurant.find(query).sort(sortOptions);
      return res.json({ success: true, count: restaurants.length, data: restaurants });
    } else {
      const list = mockStore.getRestaurants({ search, cuisine, isVegOnly, sort });
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get restaurant by ID or slug
// @route GET /api/restaurants/:id
const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const restaurant = await Restaurant.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }]
      });
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({ success: true, data: restaurant });
    } else {
      const restaurant = mockStore.getRestaurantById(id);
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'Restaurant not found' });
      }
      return res.json({ success: true, data: restaurant });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create new restaurant (Admin / Owner)
// @route POST /api/restaurants
const createRestaurant = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const restaurant = await Restaurant.create({ ...req.body, slug });
      return res.status(201).json({ success: true, data: restaurant });
    } else {
      const restaurant = mockStore.addRestaurant(req.body);
      return res.status(201).json({ success: true, data: restaurant });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update restaurant
// @route PUT /api/restaurants/:id
const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
      return res.json({ success: true, data: restaurant });
    } else {
      const restaurant = mockStore.updateRestaurant(id, req.body);
      if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
      return res.json({ success: true, data: restaurant });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete restaurant
// @route DELETE /api/restaurants/:id
const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const restaurant = await Restaurant.findByIdAndDelete(id);
      if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
      return res.json({ success: true, message: 'Restaurant deleted successfully' });
    } else {
      mockStore.deleteRestaurant(id);
      return res.json({ success: true, message: 'Restaurant deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
