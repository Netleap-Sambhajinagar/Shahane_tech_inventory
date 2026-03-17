const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        const sql = fs.readFileSync('db.sql', 'utf8');
        await pool.query(sql);
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seed();
