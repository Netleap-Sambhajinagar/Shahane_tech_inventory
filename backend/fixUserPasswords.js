const bcrypt = require('bcryptjs');
const db = require('./models/database');

(async () => {
  try {
    const [users] = await db.query('SELECT id, email, password FROM users');
    
    for (const user of users) {
      // If password is null or not hashed
      if (!user.password || !user.password.startsWith('$2b$')) {
        const passwordToHash = user.password || 'password123'; // Default for null
        console.log(`Hashing password for user: ${user.email}`);
        const hashedPassword = await bcrypt.hash(passwordToHash, 10);
        
        await db.query(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );
        
        console.log(`✅ Updated password for ${user.email} (Default if null: password123)`);
      } else {
        console.log(`✅ Password already hashed for ${user.email}`);
      }
    }
    
    console.log('\nAll user passwords have been updated!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
