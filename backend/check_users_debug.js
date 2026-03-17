const db = require('./models/database');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const [rows] = await db.query('SELECT id, email, password FROM users');
    console.log('--- Users List ---');
    for (const user of rows) {
      const isHashed = user.password && user.password.startsWith('$2b$');
      console.log(`Email: ${user.email}`);
      console.log(`Is Password Hashed: ${isHashed}`);
      if (!isHashed) {
        console.log(`Password (plain): ${user.password}`);
      }
      console.log('---');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
