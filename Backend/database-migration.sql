-- Employee Management System - Database Migration Script
-- Use this to migrate from development to production

-- Backup existing data (run this first)
-- mysqldump -u root -p ems > backup_$(date +%Y%m%d_%H%M%S).sql

-- Migration from development 'ems' database to production 'employee_management'
USE employee_management;

-- Migrate employees data from development database
INSERT IGNORE INTO employees (id, first_name, last_name, email, phone, department, position, salary, hire_date, is_active, created_at, updated_at)
SELECT 
    id, 
    first_name, 
    last_name, 
    email, 
    phone, 
    department, 
    position, 
    salary, 
    hire_date,
    TRUE as is_active,
    NOW() as created_at,
    NOW() as updated_at
FROM ems.employees
WHERE email NOT IN (SELECT email FROM employee_management.employees);

-- Update auto-increment to avoid conflicts
SET @max_id = (SELECT COALESCE(MAX(id), 0) FROM employees);
SET @sql = CONCAT('ALTER TABLE employees AUTO_INCREMENT = ', @max_id + 1);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify migration
SELECT 
    'Migration Summary' as info,
    COUNT(*) as total_migrated_employees
FROM employees 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR);

-- Show department distribution after migration
SELECT 
    department,
    COUNT(*) as employee_count
FROM employees 
GROUP BY department
ORDER BY employee_count DESC;
