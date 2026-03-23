const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder, updateOrder, deleteOrder, dispatchProduct } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllOrders);
router.post('/', protect, createOrder);
router.put('/:orderId/dispatch/:productId', protect, dispatchProduct); // Put this before /:id
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
