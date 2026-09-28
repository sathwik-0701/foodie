const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category: { type: String, required: true }, // e.g. "Salad", "Rolls", "Desserts", "Starters", "Main Course"
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  isBestseller: { type: Boolean, default: false },
  rating: { type: Number, default: 4.6 },
  ratingCount: { type: Number, default: 45 }
}, { timestamps: true });

menuItemSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
