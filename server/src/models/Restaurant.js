const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String, required: true },
  coverImage: { type: String, default: '' },
  description: { type: String, default: '' },
  cuisine: [{ type: String, required: true }],
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  ratingCount: { type: Number, default: 120 },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
  costForTwo: { type: Number, default: 300 },
  deliveryTime: { type: String, default: '25-35 min' },
  deliveryFee: { type: Number, default: 30 },
  minOrder: { type: Number, default: 99 },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: 'Mumbai' },
    state: { type: String, default: 'Maharashtra' },
    postalCode: { type: String, default: '' }
  },
  location: {
    lat: { type: Number, default: 19.076 },
    lng: { type: Number, default: 72.8777 }
  },
  isVegOnly: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: true },
  tags: [{ type: String }],
  offerText: { type: String, default: '' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

restaurantSchema.index({ name: 'text', cuisine: 'text', 'address.city': 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
