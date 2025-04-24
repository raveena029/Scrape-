-- Create database
CREATE DATABASE IF NOT EXISTS snu_mart;
USE snu_mart;

-- Products table
`CREATE TABLE products (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    unitAvailable INT DEFAULT 0,
    location VARCHAR(50),
    floatDiscount DECIMAL(5, 2) DEFAULT 0,
    minThreshold INT DEFAULT 10,
    maxCapacity INT DEFAULT 100,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`

-- Inventory table
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId VARCHAR(10) NOT NULL,
    quantity INT DEFAULT 0,
    location VARCHAR(50),
    reorderLevel INT DEFAULT 10,
    maxCapacity INT DEFAULT 100,
    lastRestock TIMESTAMP NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Store sections table
CREATE TABLE store_sections (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    position VARCHAR(20)
);

-- Section products mapping
CREATE TABLE section_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sectionId VARCHAR(10) NOT NULL,
    productId VARCHAR(10) NOT NULL,
    aisle VARCHAR(50),
    shelf VARCHAR(50),
    FOREIGN KEY (sectionId) REFERENCES store_sections(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100),
    role ENUM('cashier', 'manager', 'admin') DEFAULT 'cashier',
    lastLogin TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promotions table
CREATE TABLE promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discountType ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discountValue DECIMAL(10, 2) NOT NULL,
    applicableToAll BOOLEAN DEFAULT FALSE,
    productId VARCHAR(10),
    category VARCHAR(50),
    startDate DATE,
    endDate DATE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
);

-- Insert sample data
-- Store sections
INSERT INTO store_sections (id, name, type, position) VALUES
('A', 'Dairy', 'refrigerated', 'middle-left'),
('B', 'Bakery', 'ambient', 'top-right'),
('C', 'Produce', 'refrigerated', 'top-left'),
('D', 'Meat', 'refrigerated', 'middle-right'),
('E', 'Checkout', 'service', 'bottom');

-- Products
INSERT INTO products (id, name, category, price, unitAvailable, location, floatDiscount, minThreshold, maxCapacity) VALUES
-- Dairy Products
('PRD001', 'Milk', 'Dairy', 3.99, 50, 'A1', 0, 10, 100),
('PRD002', 'Cheese', 'Dairy', 4.99, 40, 'A2', 0, 8, 80),
('PRD003', 'Yogurt', 'Dairy', 2.99, 0, 'A3', 0, 15, 90),

-- Bakery Products
('PRD004', 'Bread', 'Bakery', 2.49, 30, 'B1', 0, 5, 50),
('PRD005', 'Bagel', 'Bakery', 1.99, 0, 'B2', 0, 10, 60),
('PRD006', 'Croissant', 'Bakery', 1.49, 25, 'B3', 0, 8, 40),

-- Produce Products
('PRD007', 'Apple', 'Produce', 0.99, 100, 'C1', 0, 20, 150),
('PRD008', 'Banana', 'Produce', 0.59, 80, 'C2', 0, 15, 120),
('PRD009', 'Carrot', 'Produce', 1.29, 60, 'C3', 0, 12, 100),

-- Meat Products
('PRD010', 'Chicken', 'Meat', 8.99, 20, 'D1', 0, 5, 30),
('PRD011', 'Beef', 'Meat', 12.99, 0, 'D2', 0, 4, 25),
('PRD012', 'Pork', 'Meat', 9.99, 15, 'D3', 0, 5, 30);

-- Inventory
INSERT INTO inventory (productId, quantity, location, reorderLevel, maxCapacity, lastRestock) VALUES
('PRD001', 50, 'A1', 10, 100, NOW()),
('PRD002', 40, 'A2', 8, 80, NOW()),
('PRD003', 0, 'A3', 15, 90, NOW()),
('PRD004', 30, 'B1', 5, 50, NOW()),
('PRD005', 0, 'B2', 10, 60, NOW()),
('PRD006', 25, 'B3', 8, 40, NOW()),
('PRD007', 100, 'C1', 20, 150, NOW()),
('PRD008', 80, 'C2', 15, 120, NOW()),
('PRD009', 60, 'C3', 12, 100, NOW()),
('PRD010', 20, 'D1', 5, 30, NOW()),
('PRD011', 0, 'D2', 4, 25, NOW()),
('PRD012', 15, 'D3', 5, 30, NOW());

-- Section products mapping
INSERT INTO section_products (sectionId, productId, aisle, shelf) VALUES
('A', 'PRD001', 'A1', 'TOP'),
('A', 'PRD002', 'A2', 'MIDDLE'),
('A', 'PRD003', 'A3', 'BOTTOM'),
('B', 'PRD004', 'B1', 'TOP'),
('B', 'PRD005', 'B2', 'MIDDLE'),
('B', 'PRD006', 'B3', 'BOTTOM'),
('C', 'PRD007', 'C1', 'TOP'),
('C', 'PRD008', 'C2', 'MIDDLE'),
('C', 'PRD009', 'C3', 'BOTTOM'),
('D', 'PRD010', 'D1', 'TOP'),
('D', 'PRD011', 'D2', 'MIDDLE'),
('D', 'PRD012', 'D3', 'BOTTOM');

-- Users
INSERT INTO users (username, password, fullName, role, lastLogin) VALUES
('admin1', 'password123', 'Admin User', 'admin', NOW()),
('manager1', 'password123', 'John Manager', 'manager', NOW()),
('cashier1', 'password123', 'Alice Cashier', 'cashier', NOW());

-- Promotions
INSERT INTO promotions (name, description, discountType, discountValue, applicableToAll, productId, category, startDate, endDate, isActive) VALUES
('Summer Sale', '20% off on dairy products', 'percentage', 20.00, false, NULL, 'Dairy', '2025-04-01', '2025-04-30', true),
('Fresh Produce', '10% off on all produce', 'percentage', 10.00, false, NULL, 'Produce', '2025-04-01', '2025-04-30', true),
('Meat Special', '$2 off on chicken', 'fixed', 2.00, false, 'PRD010', NULL, '2025-04-01', '2025-04-30', true);

-- Update store_sections table structure
ALTER TABLE store_sections 
ADD COLUMN position VARCHAR(50) AFTER type,
ADD COLUMN dimensions JSON AFTER position;

-- Update section_products table to include shelf information
ALTER TABLE section_products
ADD COLUMN shelf VARCHAR(50) AFTER aisle;

-- Add indexes for better performance
CREATE INDEX idx_section_product ON section_products(sectionId, productId);
CREATE INDEX idx_product_section ON section_products(productId, sectionId);

-- Add sample data
INSERT INTO store_sections (id, name, type, position) VALUES
('A', 'Dairy', 'refrigerated', 'middle-left'),
('B', 'Bakery', 'ambient', 'top-right'),
('C', 'Produce', 'refrigerated', 'top-left'),
('D', 'Meat', 'refrigerated', 'middle-right'),
('E', 'Checkout', 'service', 'bottom');