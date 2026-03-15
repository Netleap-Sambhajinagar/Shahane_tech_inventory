const bcrypt = require('bcryptjs');
const db = require('./models/database');

async function createAdmin() {
    try {
        const adminId = 'A001';
        const name = 'Admin Shahane';
        const email = 'admin@shahane.tech';
        const password = 'admin123';
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check if admin already exists
        const [existingAdmin] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        
        if (existingAdmin.length > 0) {
            // Update existing admin with hashed password
            await db.query(
                'UPDATE admins SET password = ? WHERE email = ?',
                [hashedPassword, email]
            );
            console.log('Admin password updated successfully');
        } else {
            // Create new admin
            await db.query(
                'INSERT INTO admins (admin_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [adminId, name, email, hashedPassword, 'Super Admin']
            );
            console.log('Admin created successfully');
        }
        
        console.log('Admin Credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Login URL: http://localhost:3000/admin/login');
        
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
}

createAdmin();
