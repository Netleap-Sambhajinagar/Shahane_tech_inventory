CREATE DATABASE IF NOT EXISTS shahane_tech;
USE shahane_tech;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    packaging_quantity INT,
    purchase_price DECIMAL(10, 2),
    old_price DECIMAL(10, 2),
    min_order INT,
    delivery_date VARCHAR(100),
    image_url TEXT,
    description TEXT,
    quantity_sold INT DEFAULT 0,
    current_stock INT DEFAULT 0,
    restock_priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_id VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    customer_type ENUM('New', 'Regular', 'VIP') DEFAULT 'New',
    order_date DATE,
    prize DECIMAL(10, 2),
    status ENUM('Pending', 'In transmit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    cancellation_reason VARCHAR(255),
    cancellation_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Sample Data for Products
INSERT INTO products (product_id, name, size, packaging_quantity, purchase_price, old_price, min_order, delivery_date, description, current_stock)
VALUES 
('P001', 'Hinged Box', '250ml', 1000, 2.80, 3.00, 1000, 'thu,29 jan', 'Designed for convenience and durability...', 5000),
('P002', 'Catering Box', '700 ml', 1500, 2.17, 2.50, 1500, 'fri,30 jan', 'Ideal for large volume catering...', 3989);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(10),
    detailed_address TEXT,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data for User & Admin
INSERT INTO users (user_id, first_name, last_name, email, phone_number, city, state, zip_code, detailed_address)
VALUES ('U001', 'Juned', 'Khan', 'juned09may@gmail.com', '1234567890', 'Pune', 'Maharashtra', '431001', 'Sample detailed address');

INSERT INTO admins (admin_id, name, email, password)
VALUES ('A001', 'Admin Shahane', 'admin@gmail.com', 'admin123');
