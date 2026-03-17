# Shahane Tech Inventory - Admin Setup Guide

## Overview
The admin functionality has been integrated into the main frontend application for single hosting deployment. The admin panel is now accessible at `/admin` routes.

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Admin/           # Admin components (copied from admin folder)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProductTable.jsx
│   │   │   ├── OrdersTable.jsx
│   │   │   └── LogoutModal.jsx
│   │   └── ...              # Other components
│   ├── pages/
│   │   ├── AdminPages/      # Admin pages (copied from admin folder)
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   └── ...              # Other pages
│   └── App.jsx              # Updated with admin routes
backend/
├── controllers/
│   ├── authController.js    # Admin auth functions
│   ├── productController.js # CRUD operations for products
│   └── orderController.js   # CRUD operations for orders
├── routes/
│   ├── adminRoutes.js       # Admin authentication routes
│   ├── productRoutes.js     # Product CRUD routes
│   └── orderRoutes.js       # Order CRUD routes
├── adminSeed.js             # Admin account setup script
└── server.js               # Main server file
```

## Setup Instructions

### 1. Backend Setup

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Database Configuration:**
   Create a `.env` file in the backend directory:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=shahane_tech
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. **Setup Database:**
   ```bash
   npm run setup-admin
   ```

4. **Start Backend Server:**
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend Server:**
   ```bash
   npm run dev
   ```

## Access Points

### Admin Panel
- **Login URL:** `http://localhost:3000/admin/login`
- **Dashboard URL:** `http://localhost:3000/admin`
- **Default Admin Credentials:**
  - Email: `admin@shahane.tech`
  - Password: `admin123`

### Customer Application
- **Home URL:** `http://localhost:3000/`
- **Login URL:** `http://localhost:3000/login`
- **Signup URL:** `http://localhost:3000/signup`

## API Endpoints

### Admin Authentication
- `POST /api/admins/login` - Admin login
- `POST /api/admins/register` - Admin registration

### Products (Admin CRUD)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders (Admin CRUD)
- `GET /api/orders` - Get all orders (protected)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## Features Implemented

### Admin Dashboard
- **Product Management:** View, add, edit, and delete products
- **Order Management:** View, add, edit, and delete orders
- **Authentication:** Secure admin login/logout
- **Responsive Design:** Modern UI with Tailwind CSS

### Integration Features
- **Single Hosting:** Both admin and customer interfaces run from one frontend
- **Route Separation:** Admin routes prefixed with `/admin`
- **Conditional Navigation:** Navbar hidden on admin pages
- **Shared Backend:** Same API serves both admin and customer data

## Security Notes
- Admin passwords are hashed using bcrypt
- JWT tokens for authentication
- Admin routes protected by authentication middleware
- Environment variables for sensitive configuration

## Deployment Notes
The application is structured for single hosting deployment:
- Frontend serves both customer and admin interfaces
- Backend API handles both customer and admin operations
- Route-based separation ensures proper access control

## Next Steps
1. Add more admin features (analytics, reports, etc.)
2. Implement role-based access control
3. Add email notifications for orders
4. Set up production deployment configuration
