const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models/database');

exports.registerUser = async (req, res, next) => {
    const { user_id, first_name, last_name, email, password, phone_number } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (user_id, first_name, last_name, email, password, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, first_name, last_name, email, hashedPassword, phone_number]
        );
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        next(err);
    }
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: rows[0].id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { id: rows[0].id, name: rows[0].first_name, role: 'user' } });
    } catch (err) {
        next(err);
    }
};

exports.registerAdmin = async (req, res, next) => {
    const { admin_id, name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO admins (admin_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [admin_id, name, email, hashedPassword, role || 'Admin']
        );
        res.status(201).json({ message: 'Admin registered' });
    } catch (err) {
        next(err);
    }
};

exports.loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: rows[0].id, role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, admin: { id: rows[0].id, name: rows[0].name, role: 'admin' } });
    } catch (err) {
        next(err);
    }
};
