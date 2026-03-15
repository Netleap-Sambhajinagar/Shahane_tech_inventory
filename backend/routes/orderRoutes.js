const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllOrders);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
