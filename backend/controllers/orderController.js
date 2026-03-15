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

// @desc    Update order
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res, next) => {
    const { order_id, customer_id, city, state, customer_type, order_date, prize, status } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE orders SET order_id = ?, customer_id = ?, city = ?, state = ?, customer_type = ?, order_date = ?, prize = ?, status = ? WHERE id = ?',
            [order_id, customer_id, city, state, customer_type, order_date, prize, status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
exports.deleteOrder = async (req, res, next) => {
    try {
        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        next(err);
    }
};
