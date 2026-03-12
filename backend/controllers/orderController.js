const db = require('../models/database');

// @desc    Get all orders
// @route   GET /api/orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders');
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
    const { order_id, customer_id, city, state, customer_type, order_date, prize, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO orders (order_id, customer_id, city, state, customer_type, order_date, prize, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [order_id, customer_id, city, state, customer_type, order_date, prize, status]
        );
        res.status(201).json({ id: result.insertId, message: 'Order created successfully' });
    } catch (err) {
        next(err);
    }
};
