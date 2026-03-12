const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllOrders);
router.post('/', createOrder);

module.exports = router;
