const SupportTicket = require('../models/SupportTicket');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

// @desc Create support ticket for order issue
// @route POST /api/support/tickets
const createTicket = async (req, res, next) => {
  try {
    const { orderId, restaurantName, issueCategory, description } = req.body;
    const userId = req.user ? req.user._id : 'usr_demo';
    const userName = req.user ? req.user.name : 'Demo Customer';

    if (!orderId || !issueCategory || !description) {
      return res.status(400).json({ success: false, message: 'Please provide orderId, issueCategory, and description' });
    }

    const ticketPayload = {
      userId,
      userName,
      orderId,
      restaurantName: restaurantName || 'Foodie Outlet',
      issueCategory,
      description
    };

    if (getIsConnected()) {
      const ticketId = 'SUP-' + Math.floor(10000 + Math.random() * 90000);
      const ticket = await SupportTicket.create({
        ...ticketPayload,
        ticketId,
        assignedAgent: {
          name: 'Sarah Jenkins (Senior Support Lead)',
          phone: '+1-800-FOODIE-HELP'
        },
        messages: [
          {
            sender: 'SYSTEM',
            senderName: 'Foodie Assistant',
            message: `Ticket #${ticketId} created. Support Agent Sarah Jenkins assigned to order ${orderId}.`
          },
          {
            sender: 'USER',
            senderName: userName,
            message: description
          },
          {
            sender: 'SUPPORT_AGENT',
            senderName: 'Sarah Jenkins',
            message: `Hello ${userName}, I am so sorry to hear about your experience with ${restaurantName || 'this order'}. I have reviewed your concern (${issueCategory}) and I am initiating a full refund / replacement resolution right now!`
          }
        ]
      });

      return res.status(201).json({ success: true, message: 'Support ticket created and executive assigned', data: ticket });
    } else {
      const ticket = mockStore.createTicket(ticketPayload);
      return res.status(201).json({ success: true, message: 'Support ticket created and executive assigned', data: ticket });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get user's support tickets
// @route GET /api/support/tickets
const getTickets = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'usr_demo';
    if (getIsConnected()) {
      const tickets = await SupportTicket.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: tickets.length, data: tickets });
    } else {
      const tickets = mockStore.getTickets(userId);
      return res.json({ success: true, count: tickets.length, data: tickets });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get single ticket details
// @route GET /api/support/tickets/:id
const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const ticket = await SupportTicket.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }] });
      if (!ticket) return res.status(404).json({ success: false, message: 'Support ticket not found' });
      return res.json({ success: true, data: ticket });
    } else {
      const ticket = mockStore.getTicketById(id);
      if (!ticket) return res.status(404).json({ success: false, message: 'Support ticket not found' });
      return res.json({ success: true, data: ticket });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Add message to support ticket
// @route POST /api/support/tickets/:id/messages
const addMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userName = req.user ? req.user.name : 'Customer';

    if (!message) return res.status(400).json({ success: false, message: 'Message cannot be empty' });

    if (getIsConnected()) {
      const ticket = await SupportTicket.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { ticketId: id }] });
      if (!ticket) return res.status(404).json({ success: false, message: 'Support ticket not found' });

      ticket.messages.push({
        sender: 'USER',
        senderName: userName,
        message,
        timestamp: new Date()
      });

      const text = message.toLowerCase();
      let botReply = "Thank you for contacting Foodie AI Assistant! I have logged your concern and notified Senior Support Executive Sarah Jenkins. Is there anything else I can assist you with?";

      if (text.includes('food') || text.includes('bad') || text.includes('taste') || text.includes('quality') || text.includes('cold') || text.includes('raw')) {
        botReply = "I am deeply sorry that the food quality was not satisfactory! I have automatically approved a 100% Instant Refund of your order total to your account. Refund Reference ID: #REF-99412.";
      } else if (text.includes('refund') || text.includes('money') || text.includes('pay')) {
        botReply = "Your refund request has been verified and processed! The total order amount will be credited back to your payment method within 5 minutes.";
      } else if (text.includes('late') || text.includes('delay') || text.includes('where') || text.includes('driver') || text.includes('time')) {
        botReply = "I checked live GPS tracking: Your delivery executive Rahul is 0.5 km away and arriving in 3 minutes!";
      }

      // Instant reply from Support Agent / AI Bot
      ticket.messages.push({
        sender: 'SUPPORT_AGENT',
        senderName: 'Sarah Jenkins (Foodie AI Bot Lead)',
        message: botReply,
        timestamp: new Date()
      });

      await ticket.save();
      return res.json({ success: true, data: ticket });
    } else {
      const text = message.toLowerCase();
      let botReply = "Thank you for contacting Foodie AI Assistant! I have logged your concern and notified Senior Support Executive Sarah Jenkins. Is there anything else I can assist you with?";

      if (text.includes('food') || text.includes('bad') || text.includes('taste') || text.includes('quality') || text.includes('cold') || text.includes('raw')) {
        botReply = "I am deeply sorry that the food quality was not satisfactory! I have automatically approved a 100% Instant Refund of your order total to your account. Refund Reference ID: #REF-99412.";
      } else if (text.includes('refund') || text.includes('money') || text.includes('pay')) {
        botReply = "Your refund request has been verified and processed! The total order amount will be credited back to your payment method within 5 minutes.";
      } else if (text.includes('late') || text.includes('delay') || text.includes('where') || text.includes('driver') || text.includes('time')) {
        botReply = "I checked live GPS tracking: Your delivery executive Rahul is 0.5 km away and arriving in 3 minutes!";
      }

      const ticket = mockStore.addMessageToTicket(id, {
        sender: 'USER',
        senderName: userName,
        message
      });
      if (!ticket) return res.status(404).json({ success: false, message: 'Support ticket not found' });

      // Instant reply
      mockStore.addMessageToTicket(id, {
        sender: 'SUPPORT_AGENT',
        senderName: 'Sarah Jenkins (Foodie AI Bot Lead)',
        message: botReply
      });

      return res.json({ success: true, data: mockStore.getTicketById(id) });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket, getTickets, getTicketById, addMessage };
