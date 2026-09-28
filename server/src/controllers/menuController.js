const MenuItem = require('../models/MenuItem');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// @desc Get menu items (filtered by restaurantId or category)
// @route GET /api/menu
const getMenuItems = async (req, res, next) => {
  try {
    const { restaurantId, category, search } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (restaurantId) query.restaurantId = restaurantId;
      if (category) query.category = category;
      if (search) query.$text = { $search: search };

      const items = await MenuItem.find(query);
      return res.json({ success: true, count: items.length, data: items });
    } else {
      let items = mockStore.getMenuItems(restaurantId, category);
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
      }
      return res.json({ success: true, count: items.length, data: items });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create menu item
// @route POST /api/menu
const createMenuItem = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const item = await MenuItem.create(req.body);
      return res.status(201).json({ success: true, data: item });
    } else {
      const item = mockStore.addMenuItem(req.body);
      return res.status(201).json({ success: true, data: item });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update menu item
// @route PUT /api/menu/:id
const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
      return res.json({ success: true, data: item });
    } else {
      const item = mockStore.updateMenuItem(id, req.body);
      return res.json({ success: true, data: item });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete menu item
// @route DELETE /api/menu/:id
const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await MenuItem.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Menu item deleted' });
    } else {
      mockStore.deleteMenuItem(id);
      return res.json({ success: true, message: 'Menu item deleted' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };
