const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { getUserAddress, updateUserAddress, getUserProfile } = require('../controllers/userController');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Address routes
router.get('/address', getUserAddress);
router.put('/address', updateUserAddress);
router.get('/profile', getUserProfile);

module.exports = router;
