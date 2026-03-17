const db = require('./models/database');

async function checkProducts() {
    try {
        console.log('Checking current products in database...');
        
        const [products] = await db.query('SELECT id, product_id, name FROM products');
        console.log('Products in database:');
        products.forEach(product => {
            console.log(`- Database ID: ${product.id}, Product ID: ${product.product_id}, Name: ${product.name}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkProducts();
