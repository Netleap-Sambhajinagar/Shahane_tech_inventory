const db = require('../models/database');

// @desc    Get all products
// @route   GET /api/products
exports.getAllProducts = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// @desc    Create product
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
    const { product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, image_url, description, current_stock } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO products (product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, image_url, description, current_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, image_url, description, current_stock]
        );
        res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
    } catch (err) {
        next(err);
    }
};
