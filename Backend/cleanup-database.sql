-- Cleanup script for existing EMS database
-- Run this to fix any data issues before connecting Spring Boot

USE ems;

-- Show current table structure
DESCRIBE employees;

-- Fix any zero dates in existing data
UPDATE employees 
SET hire_date = '2020-01-01' 
WHERE hire_date = '0000-00-00' OR hire_date IS NULL;

UPDATE employees 
SET created_at = NOW() 
WHERE created_at = '0000-00-00 00:00:00' OR created_at IS NULL;

UPDATE employees 
SET updated_at = NOW() 
WHERE updated_at = '0000-00-00 00:00:00' OR updated_at IS NULL;

-- Add missing columns if they don't exist
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS id BIGINT AUTO_INCREMENT PRIMARY KEY FIRST;

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50) NOT NULL DEFAULT '';

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50) NOT NULL DEFAULT '';

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS email VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS department VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS position VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS hire_date DATE NOT NULL DEFAULT '2020-01-01';

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS salary DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add unique constraint on email if it doesn't exist
ALTER TABLE employees 
ADD CONSTRAINT uk_employee_email UNIQUE (email);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_is_active ON employees(is_active);

-- Show final table structure
DESCRIBE employees;

-- Show sample data
SELECT COUNT(*) as total_employees FROM employees;
SELECT * FROM employees LIMIT 5;

SELECT 'Database cleanup completed successfully!' as message;
