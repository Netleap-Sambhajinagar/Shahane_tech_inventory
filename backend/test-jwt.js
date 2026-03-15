const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('JWT_SECRET from env:', process.env.JWT_SECRET);

// Test token generation and verification
const testToken = jwt.sign(
  { 
    id: 1, 
    email: 'admin@gmail.com',
    role: 'admin' 
  }, 
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '1h' }
);

console.log('Generated test token:', testToken);

// Test verification
try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET || 'secret');
  console.log('Token verification successful:', decoded);
} catch (err) {
  console.log('Token verification failed:', err.message);
}
