const db = require('./models/database');

async function checkOrderData() {
    try {
        console.log('Checking order data...');
        
        // Check orders
        const [orders] = await db.query('SELECT * FROM orders');
        console.log(`Found ${orders.length} orders:`);
        orders.forEach(order => {
            console.log(`- Order ID: ${order.id}, Order Number: ${order.order_id}, Status: ${order.status}`);
        });
        
        // Check order items
        const [orderItems] = await db.query('SELECT * FROM order_items');
        console.log(`\nFound ${orderItems.length} order items:`);
        orderItems.forEach(item => {
            console.log(`- Order: ${item.order_id}, Product: ${item.product_id}, Name: ${item.product_name}, Qty: ${item.quantity}`);
        });
        
        // Check products
        const [products] = await db.query('SELECT product_id, name, current_stock, quantity_sold, restock_priority FROM products LIMIT 5');
        console.log(`\nSample products:`);
        products.forEach(product => {
            console.log(`- ${product.product_id}: ${product.name}, Stock: ${product.current_stock}, Sold: ${product.quantity_sold}, Priority: ${product.restock_priority}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkOrderData();
