const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['USER', 'SUPPORT_AGENT', 'SYSTEM'], required: true },
  senderName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const supportTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true },
  restaurantName: { type: String, default: 'Foodie Outlet' },
  issueCategory: {
    type: String,
    enum: ['FOOD_QUALITY', 'MISSING_ITEM', 'LATE_DELIVERY', 'WRONG_ORDER', 'PAYMENT_REFUND', 'OTHER'],
    required: true
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'IN_PROGRESS'
  },
  assignedAgent: {
    name: { type: String, default: 'Sarah Jenkins (Senior Support Lead)' },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '+1-800-FOODIE-HELP' }
  },
  messages: [chatMessageSchema],
  resolution: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
