const db = require('./models/database');

async function createTestOrder() {
    try {
        console.log('Creating test order with items...');
        
        // Get existing order
        const [orders] = await db.query('SELECT * FROM orders LIMIT 1');
        
        if (orders.length === 0) {
            console.log('No orders found. Creating a test order first...');
            
            // Create a test order
            const [orderResult] = await db.query(
                'INSERT INTO orders (order_id, customer_id, city, state, customer_type, order_date, prize, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                ['ORD-TEST-001', 'CUST-001', 'Mumbai', 'Maharashtra', 'Regular', '2025-01-15', 150.00, 'Pending']
            );
            
            const orderId = orderResult.insertId;
            const order_id = 'ORD-TEST-001';
            
            // Add order items
            await db.query(
                'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [order_id, 'P001', 'Hinged Box', 25, 2.80]
            );
            
            await db.query(
                'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [order_id, 'P002', 'Catering Box', 15, 2.17]
            );
            
            console.log('Test order and items created successfully!');
            console.log('Order ID:', orderId);
            console.log('Order Number:', order_id);
        } else {
            const order = orders[0];
            console.log('Adding items to existing order:', order.order_id);
            
            // Add items to existing order
            await db.query(
                'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [order.order_id, 'P001', 'Hinged Box', 25, 2.80]
            );
            
            await db.query(
                'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [order.order_id, 'P002', 'Catering Box', 15, 2.17]
            );
            
            console.log('Items added to existing order successfully!');
        }
        
        console.log('Test setup completed. You can now try dispatching products.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestOrder();
