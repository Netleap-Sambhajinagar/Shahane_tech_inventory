const db = require('./models/database');

async function fixTestData() {
    try {
        console.log('Fixing test data...');
        
        // Clear orphaned order items
        await db.query('DELETE FROM order_items');
        console.log('Cleared orphaned order items');
        
        // Create test orders
        const [order1] = await db.query(
            'INSERT INTO orders (order_id, customer_id, city, state, customer_type, order_date, prize, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            ['ORD-1773593497833', 'CUST-001', 'Mumbai', 'Maharashtra', 'Regular', '2025-01-15', 150.00, 'Pending']
        );
        
        const [order2] = await db.query(
            'INSERT INTO orders (order_id, customer_id, city, state, customer_type, order_date, prize, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            ['ORD-1773593803515', 'CUST-002', 'Pune', 'Maharashtra', 'New', '2025-01-15', 50.00, 'Pending']
        );
        
        console.log(`Created orders: ${order1.insertId}, ${order2.insertId}`);
        
        // Add order items for order 1
        await db.query(
            'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
            ['ORD-1773593497833', 'P001', 'Hinged Box', 25, 2.80]
        );
        
        await db.query(
            'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
            ['ORD-1773593497833', 'P002', 'Catering Box', 15, 2.17]
        );
        
        // Add order items for order 2
        await db.query(
            'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
            ['ORD-1773593803515', 'P001', 'Hinged Box', 10, 2.80]
        );
        
        console.log('Added order items');
        
        // Reset product inventory
        await db.query('UPDATE products SET current_stock = 5000, quantity_sold = 0, restock_priority = 0 WHERE product_id IN ("P001", "P002")');
        console.log('Reset product inventory');
        
        // Verify data
        const [orders] = await db.query('SELECT * FROM orders');
        const [items] = await db.query('SELECT * FROM order_items');
        
        console.log(`\nVerification:`);
        console.log(`Orders: ${orders.length}`);
        console.log(`Order items: ${items.length}`);
        
        orders.forEach(order => {
            const orderItems = items.filter(item => item.order_id === order.order_id);
            console.log(`- Order ${order.order_id} (${order.id}): ${orderItems.length} items`);
        });
        
        console.log('✅ Test data fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixTestData();
