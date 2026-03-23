const db = require('./models/database');

async function checkSchema() {
  try {
    const [rows] = await db.query('DESCRIBE products');
    console.log('Current products table schema:');
    rows.forEach(row => {
      console.log(`Field: ${row.Field}, Type: ${row.Type}, Null: ${row.Null}, Default: ${row.Default}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSchema();
