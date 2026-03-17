const db = require('../models/database');
const jwt = require('jsonwebtoken');

// Get user address
exports.getUserAddress = async (req, res, next) => {
    try {
        console.log('getUserAddress called');
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token:', token ? 'present' : 'missing');
        
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log('Decoded user ID:', decoded.id, 'Role:', decoded.role);
        
        // Check if user is trying to access user endpoints with admin token
        if (decoded.role === 'admin') {
            return res.status(403).json({ message: 'Admin token cannot access user endpoints. Please login as a user.' });
        }
        
        const [rows] = await db.query(
            'SELECT city, state, zip_code, detailed_address FROM users WHERE id = ?',
            [decoded.id]
        );
        console.log('Query result:', rows.length, 'rows found');

        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json({
            city: rows[0].city,
            state: rows[0].state,
            zip_code: rows[0].zip_code,
            detailed_address: rows[0].detailed_address
        });
    } catch (err) {
        console.error('Error in getUserAddress:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please login again.' });
        }
        next(err);
    }
};

// Update user address
exports.updateUserAddress = async (req, res, next) => {
    const { city, state, zip_code, detailed_address } = req.body;
    try {
        console.log('updateUserAddress called');
        console.log('Request body:', { city, state, zip_code, detailed_address });
        
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token:', token ? 'present' : 'missing');
        
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log('Decoded user ID:', decoded.id, 'Role:', decoded.role);
        
        // Check if user is trying to access user endpoints with admin token
        if (decoded.role === 'admin') {
            return res.status(403).json({ message: 'Admin token cannot access user endpoints. Please login as a user.' });
        }
        
        const [result] = await db.query(
            'UPDATE users SET city = ?, state = ?, zip_code = ?, detailed_address = ? WHERE id = ?',
            [city, state, zip_code, detailed_address, decoded.id]
        );
        console.log('Update result:', result);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Address updated successfully' });
    } catch (err) {
        console.error('Error in updateUserAddress:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please login again.' });
        }
        next(err);
    }
};

// Get user profile (including address)
exports.getUserProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const [rows] = await db.query(
            'SELECT user_id, first_name, last_name, email, phone_number, city, state, zip_code, detailed_address FROM users WHERE id = ?',
            [decoded.id]
        );

        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};
