const express = require('express');
const { getDashboardStats, getUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);

module.exports = router;
