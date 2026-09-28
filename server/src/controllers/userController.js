const Address = require('../models/Address');
const Favorite = require('../models/Favorite');
const Restaurant = require('../models/Restaurant');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// Addresses
const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (getIsConnected()) {
      const addresses = await Address.find({ userId });
      return res.json({ success: true, data: addresses });
    } else {
      const addresses = mockStore.getAddresses(userId);
      return res.json({ success: true, data: addresses });
    }
  } catch (error) { next(error); }
};

const addAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (getIsConnected()) {
      if (req.body.isDefault) {
        await Address.updateMany({ userId }, { isDefault: false });
      }
      const address = await Address.create({ ...req.body, userId });
      return res.status(201).json({ success: true, data: address });
    } else {
      const address = mockStore.addAddress({ ...req.body, userId });
      return res.status(201).json({ success: true, data: address });
    }
  } catch (error) { next(error); }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Address.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Address removed' });
    } else {
      mockStore.deleteAddress(id);
      return res.json({ success: true, message: 'Address removed' });
    }
  } catch (error) { next(error); }
};

// Favorites
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (getIsConnected()) {
      const favorites = await Favorite.find({ userId }).populate('restaurantId');
      const restaurants = favorites.map(f => f.restaurantId).filter(Boolean);
      return res.json({ success: true, data: restaurants });
    } else {
      const restaurants = mockStore.getFavorites(userId);
      return res.json({ success: true, data: restaurants });
    }
  } catch (error) { next(error); }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { restaurantId } = req.body;

    if (!restaurantId) return res.status(400).json({ success: false, message: 'restaurantId is required' });

    if (getIsConnected()) {
      const existing = await Favorite.findOne({ userId, restaurantId });
      if (existing) {
        await Favorite.findByIdAndDelete(existing._id);
        return res.json({ success: true, favorited: false, message: 'Removed from favorites' });
      } else {
        await Favorite.create({ userId, restaurantId });
        return res.json({ success: true, favorited: true, message: 'Saved to favorites' });
      }
    } else {
      const result = mockStore.toggleFavorite(userId, restaurantId);
      return res.json({ success: true, ...result, message: result.favorited ? 'Saved to favorites' : 'Removed from favorites' });
    }
  } catch (error) { next(error); }
};

module.exports = {
  getAddresses,
  addAddress,
  deleteAddress,
  getFavorites,
  toggleFavorite
};
