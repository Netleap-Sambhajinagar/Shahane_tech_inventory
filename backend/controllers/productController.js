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
        // Convert empty strings to null or appropriate default values for numeric fields
        const processedData = {
            product_id: product_id || null,
            name: name || null,
            size: size || null,
            packaging_quantity: packaging_quantity === '' ? null : parseInt(packaging_quantity) || 0,
            purchase_price: purchase_price === '' ? null : parseFloat(purchase_price) || 0,
            old_price: old_price === '' ? null : parseFloat(old_price) || null,
            min_order: min_order === '' ? null : parseInt(min_order) || null,
            delivery_date: delivery_date || null,
            image_url: image_url || null,
            description: description || null,
            current_stock: current_stock === '' ? null : parseInt(current_stock) || 0
        };
        
        const [result] = await db.query(
            'INSERT INTO products (product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, image_url, description, current_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [processedData.product_id, processedData.name, processedData.size, processedData.packaging_quantity, processedData.purchase_price, processedData.old_price, processedData.min_order, processedData.delivery_date, processedData.image_url, processedData.description, processedData.current_stock]
        );
        res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
    } catch (err) {
        console.error('Create product error:', err);
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
    const { product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, image_url, description, current_stock, quantity_sold, restock_priority } = req.body;
    
    try {
        // Convert empty strings to null or appropriate default values for numeric fields
        const processedData = {
            product_id: product_id || null,
            name: name || null,
            size: size || null,
            packaging_quantity: packaging_quantity === '' ? null : parseInt(packaging_quantity) || 0,
            purchase_price: purchase_price === '' ? null : parseFloat(purchase_price) || 0,
            old_price: old_price === '' ? null : parseFloat(old_price) || null,
            min_order: min_order === '' ? null : parseInt(min_order) || null,
            delivery_date: delivery_date || null,
            image_url: image_url || null,
            description: description || null,
            current_stock: current_stock === '' ? null : parseInt(current_stock) || 0,
            quantity_sold: quantity_sold === '' ? null : parseInt(quantity_sold) || 0,
            restock_priority: restock_priority === '' ? null : parseInt(restock_priority) || 0
        };
        
        const [result] = await db.query(
            'UPDATE products SET product_id = ?, name = ?, size = ?, packaging_quantity = ?, purchase_price = ?, old_price = ?, min_order = ?, delivery_date = ?, image_url = ?, description = ?, current_stock = ?, quantity_sold = ?, restock_priority = ? WHERE id = ?',
            [processedData.product_id, processedData.name, processedData.size, processedData.packaging_quantity, processedData.purchase_price, processedData.old_price, processedData.min_order, processedData.delivery_date, processedData.image_url, processedData.description, processedData.current_stock, processedData.quantity_sold, processedData.restock_priority, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Update product error:', err);
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        next(err);
    }
};
