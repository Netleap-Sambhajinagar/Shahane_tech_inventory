const bcrypt = require('bcryptjs');
const db = require('./models/database');

(async () => {
  try {
    // Get all admins with plain text passwords
    const [admins] = await db.query('SELECT id, email, password FROM admins');
    
    for (const admin of admins) {
      // Check if password is already hashed (bcrypt passwords start with $2b$)
      if (!admin.password.startsWith('$2b$')) {
        console.log(`Hashing password for admin: ${admin.email}`);
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        
        await db.query(
          'UPDATE admins SET password = ? WHERE id = ?',
          [hashedPassword, admin.id]
        );
        
        console.log(`✅ Updated password for ${admin.email}`);
      } else {
        console.log(`✅ Password already hashed for ${admin.email}`);
      }
    }
    
    console.log('\nAll admin passwords have been updated!');
    console.log('You can now login with:');
    console.log('Email: admin@gmail.com, Password: admin123');
    console.log('Email: maulimore9696@gmail.com, Password: [original password]');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
