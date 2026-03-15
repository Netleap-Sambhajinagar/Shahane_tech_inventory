const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanDatabase() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        // Drop and recreate database
        await pool.query('DROP DATABASE IF EXISTS shahane_tech');
        await pool.query('CREATE DATABASE shahane_tech');
        console.log('✅ Database cleaned and recreated');
        
        await pool.end();
    } catch (err) {
        console.error('❌ Error cleaning database:', err);
        process.exit(1);
    }
}

cleanDatabase();
