const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getUserLibrary,
  getAllOrders
} = require('../controllers/orderController');

// User routes
router.post('/checkout', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/my-library', getUserLibrary);

// Admin routes
router.get('/all', getAllOrders);

module.exports = router;
