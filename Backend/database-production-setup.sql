-- Employee Management System - Production Database Setup
-- MySQL 8.0+ Production Configuration

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS employee_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE employee_management;

-- Create production user with limited privileges
CREATE USER IF NOT EXISTS 'emp_prod_user'@'%' IDENTIFIED BY 'secure_production_password_2024!';

-- Grant necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_management.* TO 'emp_prod_user'@'%';
GRANT CREATE, ALTER, INDEX, REFERENCES ON employee_management.* TO 'emp_prod_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Create employees table with production optimizations
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    salary DECIMAL(12,2) NOT NULL,
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_department (department),
    INDEX idx_position (position),
    INDEX idx_hire_date (hire_date),
    INDEX idx_active (is_active),
    INDEX idx_email (email),
    INDEX idx_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create departments table for referential integrity
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    manager_id BIGINT,
    budget DECIMAL(15,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default departments
INSERT IGNORE INTO departments (name, description, budget) VALUES
('Engineering', 'Software development and technical operations', 500000.00),
('Human Resources', 'Employee relations and organizational development', 200000.00),
('Marketing', 'Brand promotion and customer acquisition', 300000.00),
('Sales', 'Revenue generation and client relationships', 400000.00),
('Finance', 'Financial planning and accounting', 250000.00),
('Operations', 'Business operations and process management', 350000.00);

-- Create audit table for tracking changes
CREATE TABLE IF NOT EXISTS employee_audit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_employee_id (employee_id),
    INDEX idx_action (action),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create performance monitoring table
CREATE TABLE IF NOT EXISTS system_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_metric_name (metric_name),
    INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample production data (minimal for production)
INSERT IGNORE INTO employees (first_name, last_name, email, phone, department, position, salary, hire_date) VALUES
('System', 'Administrator', 'admin@company.com', '+1-555-0001', 'Engineering', 'System Administrator', 75000.00, '2024-01-01'),
('Demo', 'User', 'demo@company.com', '+1-555-0002', 'Human Resources', 'HR Specialist', 55000.00, '2024-01-15');

-- Create stored procedures for common operations
DELIMITER //

-- Procedure to get employee statistics
CREATE PROCEDURE IF NOT EXISTS GetEmployeeStatistics()
BEGIN
    SELECT 
        COUNT(*) as total_employees,
        COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_employees,
        COUNT(DISTINCT department) as total_departments,
        AVG(salary) as average_salary,
        MIN(hire_date) as earliest_hire_date,
        MAX(hire_date) as latest_hire_date
    FROM employees;
END //

-- Procedure to get department summary
CREATE PROCEDURE IF NOT EXISTS GetDepartmentSummary()
BEGIN
    SELECT 
        e.department,
        COUNT(*) as employee_count,
        AVG(e.salary) as avg_salary,
        MIN(e.salary) as min_salary,
        MAX(e.salary) as max_salary,
        d.budget as department_budget
    FROM employees e
    LEFT JOIN departments d ON e.department = d.name
    WHERE e.is_active = TRUE
    GROUP BY e.department, d.budget
    ORDER BY employee_count DESC;
END //

DELIMITER ;

-- Create views for common queries
CREATE OR REPLACE VIEW active_employees AS
SELECT 
    id, first_name, last_name, email, phone, 
    department, position, salary, hire_date,
    DATEDIFF(CURDATE(), hire_date) as days_employed
FROM employees 
WHERE is_active = TRUE;

CREATE OR REPLACE VIEW department_summary AS
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    SUM(salary) as total_salary_cost
FROM employees 
WHERE is_active = TRUE
GROUP BY department;

-- Set up database configuration for production
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB if available
SET GLOBAL query_cache_size = 67108864; -- 64MB
SET GLOBAL max_connections = 200;

-- Show final status
SELECT 'Production database setup completed successfully!' as status;
SELECT COUNT(*) as total_employees FROM employees;
SELECT COUNT(*) as total_departments FROM departments;
