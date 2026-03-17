const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Admin frontend URL
        methods: ["GET", "POST"]
    }
});

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

// Public customer routes (no authentication required)
app.get('/api/customer/orders', async (req, res) => {
    try {
        const db = require('./models/database');
        const [rows] = await db.query('SELECT * FROM orders');
        
        // Get order items for each order
        const ordersWithItems = await Promise.all(rows.map(async (order) => {
            try {
                const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.order_id]);
                return {
                    ...order,
                    items: items
                };
            } catch (err) {
                console.log(`Error getting items for order ${order.order_id}:`, err.message);
                return {
                    ...order,
                    items: []
                };
            }
        }));
        
        res.json(ordersWithItems);
    } catch (err) {
        console.error('Error fetching customer orders:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

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

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Admin connected for notifications:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Admin disconnected:', socket.id);
    });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});