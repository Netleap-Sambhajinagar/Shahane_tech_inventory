const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    console.log('Auth middleware - Headers:', req.headers);
    console.log('Auth middleware - Authorization header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        console.log('Auth middleware - Token verified successfully');
        next();
    } catch (err) {
        console.log('Auth middleware - Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
