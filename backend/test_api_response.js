const db = require('./models/database');

async function testApiResponse() {
  try {
    // Simulate the API call that frontend makes
    const [rows] = await db.query('SELECT * FROM products LIMIT 3');
    
    console.log('API Response (first 3 products):');
    rows.forEach(row => {
      console.log(`\nProduct ID: ${row.id}`);
      console.log(`Name: ${row.name}`);
      console.log(`Image URL: ${row.image_url}`);
      console.log(`Full URL: ${row.image_url ? `http://localhost:5000${row.image_url}` : 'No image'}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testApiResponse();
