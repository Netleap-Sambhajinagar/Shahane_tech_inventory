const db = require('./models/database');

async function fixOrderItems() {
    try {
        console.log('Checking order_items table...');
        
        // Check if table exists
        const [tableCheck] = await db.query('SHOW TABLES LIKE "order_items"');
        if (tableCheck.length === 0) {
            console.log('Creating order_items table...');
            await db.query(`
                CREATE TABLE IF NOT EXISTS order_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    order_id VARCHAR(50) NOT NULL,
                    product_id VARCHAR(50) NOT NULL,
                    product_name VARCHAR(255) NOT NULL,
                    quantity INT NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('order_items table created');
        }
        
        // Check existing orders
        const [orders] = await db.query('SELECT * FROM orders');
        console.log(`Found ${orders.length} orders in database`);
        
        for (const order of orders) {
            const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.order_id]);
            console.log(`Order ${order.order_id}: ${items.length} items`);
            
            if (items.length === 0) {
                console.log(`No items found for order ${order.order_id}. You may need to create sample items.`);
            }
        }
        
        console.log('Check completed. Restart backend server and try dispatching an order.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixOrderItems();
