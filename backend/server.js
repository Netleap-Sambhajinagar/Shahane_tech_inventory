const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);

app.get("/", (req, res) => {
    res.send("Shahane Tech API is running 🚀");
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});