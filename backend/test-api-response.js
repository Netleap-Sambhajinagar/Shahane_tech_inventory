const db = require('./models/database');

async function testApiResponse() {
    try {
        console.log('Testing API response structure...');
        
        // Simulate the getAllOrders function
        const [rows] = await db.query('SELECT * FROM orders');
        console.log(`Found ${rows.length} orders`);
        
        // Get order items for each order
        const ordersWithItems = await Promise.all(rows.map(async (order) => {
            try {
                const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.order_id]);
                return {
                    ...order,
                    items: items
                };
            } catch (err) {
                console.log(`Error getting items for order ${order.order_id}:`, err.message);
                return {
                    ...order,
                    items: []
                };
            }
        }));
        
        console.log('Final API response structure:');
        console.log(JSON.stringify(ordersWithItems, null, 2));
        
        // Check specific orders
        ordersWithItems.forEach((order, index) => {
            console.log(`\nOrder ${index + 1}:`);
            console.log(`- ID: ${order.id}`);
            console.log(`- Order ID: ${order.order_id}`);
            console.log(`- Items count: ${order.items ? order.items.length : 0}`);
            
            if (order.items && order.items.length > 0) {
                order.items.forEach((item, itemIndex) => {
                    console.log(`  - Item ${itemIndex + 1}: ${item.product_id} (${item.product_name}) - Qty: ${item.quantity}`);
                });
            } else {
                console.log(`  - No items found`);
            }
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testApiResponse();
