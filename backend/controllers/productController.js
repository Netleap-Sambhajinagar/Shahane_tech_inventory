const db = require('../models/database');
const fs = require('fs');
const path = require('path');

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
    const { product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, images, description, current_stock } = req.body;
    
    // Debug: Log the received data
    console.log('Received data:', { product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, images, description, current_stock });
    console.log('Images type:', typeof images);
    console.log('Images value:', images);
    
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
            images: images ? JSON.stringify(images) : null,
            description: description || null,
            current_stock: current_stock === '' ? null : parseInt(current_stock) || 0
        };
        
        const [result] = await db.query(
            'INSERT INTO products (product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, images, description, current_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [processedData.product_id, processedData.name, processedData.size, processedData.packaging_quantity, processedData.purchase_price, processedData.old_price, processedData.min_order, processedData.delivery_date, processedData.images, processedData.description, processedData.current_stock]
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
    const { product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, images, description, current_stock, quantity_sold, restock_priority } = req.body;
    
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
            images: images ? JSON.stringify(images) : null,
            description: description || null,
            current_stock: current_stock === '' ? null : parseInt(current_stock) || 0,
            quantity_sold: quantity_sold === '' ? null : parseInt(quantity_sold) || 0,
            restock_priority: restock_priority === '' ? null : parseInt(restock_priority) || 0
        };
        
        const [result] = await db.query(
            'UPDATE products SET product_id = ?, name = ?, size = ?, packaging_quantity = ?, purchase_price = ?, old_price = ?, min_order = ?, delivery_date = ?, images = ?, description = ?, current_stock = ?, quantity_sold = ?, restock_priority = ? WHERE id = ?',
            [processedData.product_id, processedData.name, processedData.size, processedData.packaging_quantity, processedData.purchase_price, processedData.old_price, processedData.min_order, processedData.delivery_date, processedData.images, processedData.description, processedData.current_stock, processedData.quantity_sold, processedData.restock_priority, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Update product error:', err);
        next(err);
    }
};

// @desc    Search products
// @route   GET /api/products/search?q=query
exports.searchProducts = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const [rows] = await db.query(
            'SELECT * FROM products WHERE name LIKE ? OR product_id LIKE ? OR description LIKE ? OR size LIKE ?',
            [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        // First, get the product to retrieve image paths
        const [products] = await db.query('SELECT images FROM products WHERE id = ?', [req.params.id]);
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = products[0];
        
        // Delete associated image files
        if (product.images) {
            let imagePaths;
            try {
                imagePaths = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
            } catch (err) {
                console.error('Error parsing images JSON:', err);
                imagePaths = [];
            }

            // Delete each image file
            for (const imagePath of imagePaths) {
                if (imagePath && imagePath.trim()) {
                    // Remove leading /uploads/ if present and construct correct file path
                    let cleanPath = imagePath;
                    if (imagePath.startsWith('/uploads/')) {
                        cleanPath = imagePath.substring(8); // Remove '/uploads/'
                    } else if (imagePath.startsWith('uploads/')) {
                        cleanPath = imagePath.substring(7); // Remove 'uploads/'
                    }
                    
                    // Remove any leading slash from cleanPath
                    if (cleanPath.startsWith('/')) {
                        cleanPath = cleanPath.substring(1);
                    }
                    
                    const filePath = path.join(__dirname, '..', 'public', 'uploads', cleanPath);
                    
                    console.log(`Original image path: ${imagePath}`);
                    console.log(`Attempting to delete image file: ${filePath}`);
                    
                    try {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                            console.log(`Successfully deleted image file: ${filePath}`);
                        } else {
                            console.log(`Image file not found: ${filePath}`);
                        }
                    } catch (fileErr) {
                        console.error(`Error deleting image file ${filePath}:`, fileErr);
                        // Continue with product deletion even if file deletion fails
                    }
                }
            }
        }

        // Delete the product record
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product and associated images deleted successfully' });
    } catch (err) {
        console.error('Delete product error:', err);
        next(err);
    }
};
