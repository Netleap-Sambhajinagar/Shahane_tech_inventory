// db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

// Convert to promise-based pool
const db = pool.promise();

// Test the connection immediately
(async () => {
    try {
        await db.query('SELECT 1'); // simple query to check connection
        console.log('✅ Database connected successfully!');
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
})();

module.exports = db;