const db = require('./models/database');

(async () => {
  try {
    const [rows] = await db.query('SELECT id, admin_id, name, email, password, role FROM admins');
    console.log('Admins in database:');
    rows.forEach(admin => {
      console.log(`ID: ${admin.id}, Email: ${admin.email}, Password: ${admin.password.substring(0, 20)}...`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
