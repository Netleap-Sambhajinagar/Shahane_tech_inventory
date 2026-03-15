const db = require('../models/database');

// @desc    Get all orders
// @route   GET /api/orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders');
        
        // Get order items for each order (handle gracefully if table doesn't exist)
        const ordersWithItems = await Promise.all(rows.map(async (order) => {
            try {
                const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.order_id]);
                return {
                    ...order,
                    items: items
                };
            } catch (err) {
                // If order_items table doesn't exist or other error, return empty items
                console.log(`Error getting items for order ${order.order_id}:`, err.message);
                return {
                    ...order,
                    items: []
                };
            }
        }));
        
        res.json(ordersWithItems);
    } catch (err) {
        next(err);
    }
};

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
    console.log('Request body:', req.body); // Debug log
    
    const { order_id, customer_id, city, state, customer_type, order_date, prize, status, items } = req.body;
    
    // Generate order_id if not provided
    const generatedOrderId = order_id || `ORD-${Date.now()}`;
    
    // Ensure all NOT NULL fields have values
    const finalCustomerId = customer_id || `CUST${Date.now()}`;
    const finalCity = city || 'Mumbai';
    const finalState = state || 'Maharashtra';
    const finalCustomerType = customer_type || 'Regular';
    const finalOrderDate = order_date || new Date().toISOString().split('T')[0];
    const finalPrize = prize || 0;
    const finalStatus = status || 'Pending';
    
    console.log('Final order data:', {
        order_id: generatedOrderId,
        customer_id: finalCustomerId,
        city: finalCity,
        state: finalState,
        customer_type: finalCustomerType,
        order_date: finalOrderDate,
        prize: finalPrize,
        status: finalStatus,
        items: items
    }); // Debug log
    
    try {
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Create the order
        const [result] = await db.query(
            'INSERT INTO orders (order_id, customer_id, city, state, customer_type, order_date, prize, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [generatedOrderId, finalCustomerId, finalCity, finalState, finalCustomerType, finalOrderDate, finalPrize, finalStatus]
        );
        
        // Store order items
        if (items && Array.isArray(items)) {
            for (const item of items) {
                const { product_id, name, quantity, price } = item;
                
                // Validate product_id exists
                if (!product_id) {
                    throw new Error(`Product ID is required for item: ${name || 'Unknown'}`);
                }
                
                // Validate product exists (handle both product_id and database id)
                const [productRows] = await db.query('SELECT * FROM products WHERE product_id = ? OR id = ?', [product_id, product_id]);
                
                if (productRows.length === 0) {
                    throw new Error(`Product with ID ${product_id} not found`);
                }
                
                const product = productRows[0];
                // Use the actual product_id from the found product for order_items
                const actualProductId = product.product_id;
                const currentStock = product.current_stock || 0;
                const orderQuantity = parseInt(quantity) || 0;
                
                // Check if enough stock is available (reserve stock but don't deduct yet)
                if (currentStock < orderQuantity) {
                    throw new Error(`Insufficient stock for product ${name}. Available: ${currentStock}, Requested: ${orderQuantity}`);
                }
                
                // Insert order item
                await db.query(
                    'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
                    [generatedOrderId, actualProductId, name, orderQuantity, price]
                );
            }
        }
        
        // Commit transaction
        await db.query('COMMIT');
        
        // Emit notification to connected admin clients
        const io = req.app.get('io');
        if (io) {
            const notificationData = {
                type: 'new_order',
                message: `New order ${generatedOrderId} received from ${finalCity}`,
                order: {
                    order_id: generatedOrderId,
                    customer_id: finalCustomerId,
                    city: finalCity,
                    state: finalState,
                    customer_type: finalCustomerType,
                    order_date: finalOrderDate,
                    prize: finalPrize,
                    status: finalStatus,
                    items: items || []
                },
                timestamp: new Date().toISOString()
            };
            
            io.emit('new_order', notificationData);
            console.log('Notification emitted for new order:', generatedOrderId);
        }
        
        res.status(201).json({ 
            id: result.insertId, 
            order_id: generatedOrderId,
            message: 'Order created successfully' 
        });
    } catch (err) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        console.error('Create order error:', err);
        res.status(500).json({ 
            error: 'Failed to create order',
            details: err.message 
        });
    }
};

// @desc    Dispatch specific product from order
// @route   PUT /api/orders/:orderId/dispatch/:productId
exports.dispatchProduct = async (req, res, next) => {
    const { orderId, productId } = req.params;
    const { quantity } = req.body; // Optional: specify quantity to dispatch
    
    console.log(`=== DISPATCH PRODUCT DEBUG ===`);
    console.log(`OrderId: ${orderId}, ProductId: ${productId}`);
    console.log(`Request body:`, req.body);
    console.log(`Request params:`, req.params);
    console.log(`================================`);
    
    try {
        console.log(`Dispatching product ${productId} from order ${orderId}`);
        
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Get order details
        const [orderRows] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        console.log(`Order query result: ${orderRows.length} rows found`);
        
        if (orderRows.length === 0) {
            await db.query('ROLLBACK');
            console.log('Order not found');
            return res.status(404).json({ message: 'Order not found' });
        }
        
        const order = orderRows[0];
        console.log(`Found order: ${order.order_id}`);
        
        // Get order item
        const [itemRows] = await db.query('SELECT * FROM order_items WHERE order_id = ? AND product_id = ?', [order.order_id, productId]);
        console.log(`Order items query result: ${itemRows.length} rows found`);
        
        if (itemRows.length === 0) {
            await db.query('ROLLBACK');
            console.log('Product not found in this order');
            return res.status(404).json({ message: 'Product not found in this order' });
        }
        
        const orderItem = itemRows[0];
        const availableQuantity = orderItem.quantity;
        const dispatchQuantity = quantity ? parseInt(quantity) : availableQuantity;
        
        console.log(`Available quantity: ${availableQuantity}, Dispatch quantity: ${dispatchQuantity}`);
        
        if (dispatchQuantity > availableQuantity) {
            await db.query('ROLLBACK');
            console.log('Insufficient quantity');
            return res.status(400).json({ message: `Cannot dispatch ${dispatchQuantity} units. Only ${availableQuantity} available in order` });
        }
        
        // Get current product details (handle both product_id and database id)
        const [productRows] = await db.query('SELECT * FROM products WHERE product_id = ? OR id = ?', [productId, productId]);
        console.log(`Product query result: ${productRows.length} rows found`);
        
        if (productRows.length === 0) {
            await db.query('ROLLBACK');
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const product = productRows[0];
        // Use the actual product_id for updates
        const actualProductId = product.product_id;
        const currentStock = product.current_stock || 0;
        const quantitySold = product.quantity_sold || 0;
        
        console.log(`Current stock: ${currentStock}, Current sold: ${quantitySold}`);
        
        // Update inventory
        const newStock = currentStock - dispatchQuantity;
        const newQuantitySold = quantitySold + dispatchQuantity;
        
        // Calculate restock priority
        let newRestockPriority = product.restock_priority || 0;
        if (newStock <= 0) {
            newRestockPriority = 1; // Out of stock
        } else if (newStock <= 10) {
            newRestockPriority = 2; // Low stock
        } else if (newStock <= 50) {
            newRestockPriority = 3; // Medium stock
        } else {
            newRestockPriority = 5; // Good stock
        }
        
        console.log(`New stock: ${newStock}, New sold: ${newQuantitySold}, New priority: ${newRestockPriority}`);
        
        // Update product inventory
        const [updateResult] = await db.query(
            'UPDATE products SET current_stock = ?, quantity_sold = ?, restock_priority = ? WHERE product_id = ?',
            [newStock, newQuantitySold, newRestockPriority, actualProductId]
        );
        
        console.log(`Product update result: ${updateResult.affectedRows} rows affected`);
        
        // Update or remove order item based on remaining quantity
        const remainingQuantity = availableQuantity - dispatchQuantity;
        if (remainingQuantity > 0) {
            await db.query(
                'UPDATE order_items SET quantity = ? WHERE order_id = ? AND product_id = ?',
                [remainingQuantity, order.order_id, actualProductId]
            );
            console.log(`Updated order item quantity to ${remainingQuantity}`);
        } else {
            // Remove item completely if all quantity dispatched
            await db.query(
                'DELETE FROM order_items WHERE order_id = ? AND product_id = ?',
                [order.order_id, actualProductId]
            );
            console.log('Removed order item completely');
        }
        
        // Check if all items are dispatched, then update order status
        const [remainingItems] = await db.query('SELECT COUNT(*) as count FROM order_items WHERE order_id = ?', [order.order_id]);
        console.log(`Remaining order items: ${remainingItems[0].count}`);
        
        if (remainingItems[0].count === 0 && order.status === 'Pending') {
            await db.query('UPDATE orders SET status = ? WHERE id = ?', ['In transmit', orderId]);
            console.log('Updated order status to In transmit');
        }
        
        // Commit transaction
        await db.query('COMMIT');
        
        console.log(`Successfully dispatched ${dispatchQuantity} units of product ${productId}:`);
        console.log(`Stock: ${currentStock} → ${newStock}, Sold: ${quantitySold} → ${newQuantitySold}, Priority: ${newRestockPriority}`);
        
        res.json({ 
            message: 'Product dispatched successfully',
            dispatchedQuantity: dispatchQuantity,
            remainingQuantity: remainingQuantity,
            inventory: {
                currentStock: newStock,
                quantitySold: newQuantitySold,
                restockPriority: newRestockPriority
            }
        });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Dispatch product error:', err);
        console.error('Full error:', err);
        res.status(500).json({ 
            error: 'Failed to dispatch product',
            details: err.message 
        });
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
exports.updateOrder = async (req, res, next) => {
    const { order_id, customer_id, city, state, customer_type, order_date, prize, status, cancellation_reason, cancellation_description } = req.body;
    
    try {
        // Get current order details to check status change
        const [currentOrderRows] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        
        if (currentOrderRows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        const currentOrder = currentOrderRows[0];
        const currentStatus = currentOrder.status;
        const newStatus = status;
        
        // Start transaction for inventory updates
        await db.query('START TRANSACTION');
        
        // Build dynamic query based on provided fields
        const fields = [];
        const values = [];
        
        if (order_id !== undefined && order_id !== null) {
            fields.push('order_id = ?');
            values.push(order_id);
        }
        if (customer_id !== undefined && customer_id !== null) {
            fields.push('customer_id = ?');
            values.push(customer_id);
        }
        if (city !== undefined && city !== null) {
            fields.push('city = ?');
            values.push(city);
        }
        if (state !== undefined && state !== null) {
            fields.push('state = ?');
            values.push(state);
        }
        if (customer_type !== undefined && customer_type !== null) {
            fields.push('customer_type = ?');
            values.push(customer_type);
        }
        if (order_date !== undefined && order_date !== null) {
            fields.push('order_date = ?');
            values.push(order_date);
        }
        if (prize !== undefined && prize !== null) {
            fields.push('prize = ?');
            values.push(prize);
        }
        if (status !== undefined && status !== null) {
            fields.push('status = ?');
            values.push(status);
        }
        if (cancellation_reason !== undefined && cancellation_reason !== null) {
            fields.push('cancellation_reason = ?');
            values.push(cancellation_reason);
        }
        if (cancellation_description !== undefined && cancellation_description !== null) {
            fields.push('cancellation_description = ?');
            values.push(cancellation_description);
        }
        
        if (fields.length === 0) {
            await db.query('ROLLBACK');
            return res.status(400).json({ message: 'No fields to update' });
        }
        
        // Update order
        const [result] = await db.query(
            `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
            [...values, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Handle inventory updates when order is dispatched (status changes from Pending to In transmit)
        if (currentStatus === 'Pending' && newStatus === 'In transmit') {
            console.log(`Processing inventory updates for order ${currentOrder.order_id}`);
            
            // Get order items
            const [orderItems] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [currentOrder.order_id]);
            
            console.log(`Found ${orderItems.length} order items for order ${currentOrder.order_id}`);
            console.log('Order items:', orderItems);
            
            if (orderItems.length === 0) {
                console.log('No order items found - checking if order_items table exists');
                // Check if order_items table exists
                const [tableCheck] = await db.query('SHOW TABLES LIKE "order_items"');
                console.log('Order items table exists:', tableCheck.length > 0);
            }
            
            for (const item of orderItems) {
                const { product_id, quantity } = item;
                console.log(`Processing item: ${product_id}, quantity: ${quantity}`);
                
                // Get current product details
                const [productRows] = await db.query('SELECT * FROM products WHERE product_id = ?', [product_id]);
                
                if (productRows.length === 0) {
                    console.error(`Product with ID ${product_id} not found`);
                    throw new Error(`Product with ID ${product_id} not found`);
                }
                
                const product = productRows[0];
                const currentStock = product.current_stock || 0;
                const quantitySold = product.quantity_sold || 0;
                const orderQuantity = parseInt(quantity) || 0;
                
                console.log(`Product ${product_id} - Current Stock: ${currentStock}, Current Sold: ${quantitySold}, Order Quantity: ${orderQuantity}`);
                
                // Update inventory (now actually deduct stock and update sales)
                const newStock = currentStock - orderQuantity;
                const newQuantitySold = quantitySold + orderQuantity;
                
                // Calculate restock priority based on current stock level
                let newRestockPriority = product.restock_priority || 0;
                if (newStock <= 0) {
                    newRestockPriority = 1; // Highest priority - out of stock
                } else if (newStock <= 10) {
                    newRestockPriority = 2; // High priority - low stock
                } else if (newStock <= 50) {
                    newRestockPriority = 3; // Medium priority
                } else {
                    newRestockPriority = 5; // Low priority
                }
                
                console.log(`Updating product ${product_id}: Stock: ${currentStock} → ${newStock}, Sold: ${quantitySold} → ${newQuantitySold}, Priority: ${newRestockPriority}`);
                
                // Update product with new inventory values
                const [updateResult] = await db.query(
                    'UPDATE products SET current_stock = ?, quantity_sold = ?, restock_priority = ? WHERE product_id = ?',
                    [newStock, newQuantitySold, newRestockPriority, product_id]
                );
                
                console.log(`Update result for ${product_id}: ${updateResult.affectedRows} rows affected`);
            }
        } else {
            console.log(`No inventory update needed. Status: ${currentStatus} → ${newStatus}`);
        }
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        console.error('Update order error:', err);
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
