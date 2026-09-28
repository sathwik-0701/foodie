const Category = require('../models/Category');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// @desc Get all categories
// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const categories = await Category.find().sort({ order: 1 });
      return res.json({ success: true, count: categories.length, data: categories });
    } else {
      const categories = mockStore.getCategories();
      return res.json({ success: true, count: categories.length, data: categories });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create category
// @route POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, image, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (getIsConnected()) {
      const category = await Category.create({ name, slug, image, description });
      return res.status(201).json({ success: true, data: category });
    } else {
      const category = mockStore.addCategory({ name, slug, image, description });
      return res.status(201).json({ success: true, data: category });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update category
// @route PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
      return res.json({ success: true, data: category });
    } else {
      const category = mockStore.updateCategory(id, req.body);
      return res.json({ success: true, data: category });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Delete category
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Category.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Category deleted' });
    } else {
      mockStore.deleteCategory(id);
      return res.json({ success: true, message: 'Category deleted' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
