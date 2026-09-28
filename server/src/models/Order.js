const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String }
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  label: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    name: { type: String, required: true },
    flat: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, default: 'Home' }
  },
  itemTotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 30 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'CARD', 'UPI', 'NETBANKING', 'MOCK_PAYMENT'], default: 'MOCK_PAYMENT' },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PAID' },
  orderStatus: {
    type: String,
    enum: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED'
  },
  timeline: [timelineSchema],
  estimatedDeliveryTime: { type: String, default: '30-40 min' },
  specialInstructions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
