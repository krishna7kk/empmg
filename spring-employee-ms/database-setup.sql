-- MySQL Database Setup Script for Employee Management System
-- Run this script to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS employee_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE employee_management;

-- Create user (optional - you can use root)
-- CREATE USER IF NOT EXISTS 'emp_user'@'localhost' IDENTIFIED BY 'emp_password';
-- GRANT ALL PRIVILEGES ON employee_management.* TO 'emp_user'@'localhost';
-- FLUSH PRIVILEGES;

-- The tables will be created automatically by Hibernate/JPA
-- But here's the manual table creation script if needed:

/*
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_department (department),
    INDEX idx_is_active (is_active),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- Show database info
SELECT 'Database employee_management created successfully!' as message;
SHOW TABLES;
