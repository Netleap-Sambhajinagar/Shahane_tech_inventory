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
        origin: [
            "http://localhost:5173", 
            "http://localhost:5174",
            "https://shahane-tech-inventory-28z006n1a-netleapproject-debugs-projects.vercel.app",
            "https://shahane-tech-inventor-git-8a10a4-netleapproject-debugs-projects.vercel.app",
            "https://your-vercel-app-url.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://shahane-tech-inventory-28z006n1a-netleapproject-debugs-projects.vercel.app",
    "https://shahane-tech-inventor-git-8a10a4-netleapproject-debugs-projects.vercel.app",
    "https://your-vercel-app-url.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json());

// Serve static files from public folder with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static('public/uploads'));

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
