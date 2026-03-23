const db = require('./models/database');

async function migrateImages() {
  try {
    console.log('Starting migration for multiple images support...');
    
    // Add new images column
    await db.query(`
      ALTER TABLE products 
      ADD COLUMN images TEXT 
      COMMENT 'JSON array of image URLs, first image is main image'
    `);
    
    console.log('Added images column to products table');
    
    // Migrate existing single image_url to new images format
    const [products] = await db.query('SELECT id, image_url FROM products WHERE image_url IS NOT NULL');
    
    for (const product of products) {
      const imagesArray = JSON.stringify([product.image_url]);
      await db.query('UPDATE products SET images = ? WHERE id = ?', [imagesArray, product.id]);
      console.log(`Migrated product ${product.id}: ${product.image_url} -> [${product.image_url}]`);
    }
    
    console.log('Migration completed successfully!');
    console.log(`Migrated ${products.length} products to new images format`);
    
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Images column already exists, skipping migration');
      process.exit(0);
    }
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrateImages();
