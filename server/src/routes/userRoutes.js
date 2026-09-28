const express = require('express');
const {
  getAddresses,
  addAddress,
  deleteAddress,
  getFavorites,
  toggleFavorite
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);

router.get('/favorites', getFavorites);
router.post('/favorites/toggle', toggleFavorite);

module.exports = router;
