const db = require('./models/database');

async function fixProductImages() {
  try {
    // Update first 5 products to use the existing uploaded image
    const imageUrl = '/uploads/product-1773841822803-258927033.jpg';
    
    const [result] = await db.query(
      'UPDATE products SET image_url = ? WHERE image_url IS NULL LIMIT 5',
      [imageUrl]
    );
    
    console.log(`Updated ${result.affectedRows} products with image URL: ${imageUrl}`);
    
    // Verify the update
    const [rows] = await db.query('SELECT id, name, image_url FROM products WHERE image_url IS NOT NULL LIMIT 6');
    console.log('\nProducts now have images:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}, Image URL: ${row.image_url}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixProductImages();
