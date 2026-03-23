const db = require('./models/database');

async function checkImages() {
  try {
    const [rows] = await db.query('SELECT id, name, image_url FROM products WHERE image_url IS NOT NULL');
    console.log('Products with non-null image URLs:');
    if (rows.length === 0) {
      console.log('No products have image URLs set.');
    } else {
      rows.forEach(row => {
        console.log(`ID: ${row.id}, Name: ${row.name}, Image URL: ${row.image_url}`);
      });
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkImages();
