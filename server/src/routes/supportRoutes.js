const express = require('express');
const { createTicket, getTickets, getTicketById, addMessage } = require('../controllers/supportController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/tickets', optionalAuth, createTicket);
router.get('/tickets', optionalAuth, getTickets);
router.get('/tickets/:id', optionalAuth, getTicketById);
router.post('/tickets/:id/messages', optionalAuth, addMessage);

module.exports = router;
