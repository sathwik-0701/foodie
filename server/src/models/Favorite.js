const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
}, { timestamps: true });

favoriteSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
