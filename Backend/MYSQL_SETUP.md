# MySQL Setup Guide for Employee Management System

## Overview
The Employee Management System has been configured to use MySQL as the primary database instead of H2. This document outlines the changes made and setup instructions.

## Changes Made

### 1. Dependencies Updated (pom.xml)
- Removed H2 database dependency
- Updated to use `mysql-connector-j` (latest MySQL connector)
- Kept all Spring Boot dependencies for web, JPA, Thymeleaf, and validation

### 2. Database Configuration (application.properties)
- Changed from H2 in-memory database to MySQL
- Updated connection URL: `jdbc:mysql://localhost:3306/employee_management`
- Set MySQL dialect: `org.hibernate.dialect.MySQL8Dialect`
- Changed DDL auto to `update` (safer for production)
- Added connection pool configuration with HikariCP

### 3. Data Initialization
- Created `DataInitializationService.java` for programmatic data loading
- Updated `data.sql` to use MySQL-compatible syntax (`NOW()` instead of `CURRENT_TIMESTAMP`)
- Added `INSERT IGNORE` for safe re-runs

### 4. Templates Updated
- Removed H2 console references from navigation and dashboard
- Updated links to point to API endpoints instead

### 5. Additional Files Created
- `database-setup.sql` - MySQL database creation script
- `docker-compose.yml` - Easy MySQL setup with Docker
- `Dockerfile` - Containerize the Spring Boot application
- `application.yml` - Alternative YAML configuration
- `start.bat` / `start.sh` - Startup scripts for different platforms

## Quick Setup Instructions

### Method 1: Docker (Easiest)
```bash
# Start MySQL
docker-compose up -d mysql

# Run the application
./mvnw spring-boot:run
```

### Method 2: Local MySQL
```bash
# 1. Install MySQL 8.0+
# 2. Create database
mysql -u root -p < database-setup.sql

# 3. Update credentials in application.properties if needed
# 4. Run application
./mvnw spring-boot:run
```

### Method 3: Using Startup Scripts
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

## Database Schema
The application will automatically create the following table structure:

```sql
CREATE TABLE employees (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Default Configuration
- **Database**: `employee_management`
- **Username**: `root`
- **Password**: `password`
- **Port**: `3306`
- **Server Port**: `8080`

## Sample Data
The application will automatically populate 20 sample employees on first run, including:
- Various departments: Engineering, HR, Sales, Marketing, Finance, etc.
- Different positions and salary ranges
- Realistic hire dates and employee information

## Verification Steps
1. Start MySQL service
2. Run the application
3. Visit http://localhost:8080
4. Check that employees are loaded
5. Test CRUD operations
6. Verify API endpoints at http://localhost:8080/api/employees

## Troubleshooting

### Common Issues:
1. **Connection refused**: Ensure MySQL is running
2. **Access denied**: Check username/password in application.properties
3. **Database doesn't exist**: Run database-setup.sql
4. **Port conflicts**: Change server.port in application.properties

### Useful Commands:
```bash
# Check MySQL status
sudo systemctl status mysql

# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use the database
USE employee_management;

# Show tables
SHOW TABLES;

# Check data
SELECT COUNT(*) FROM employees;
```

## Production Considerations
- Change default passwords
- Use environment variables for sensitive configuration
- Set up proper MySQL user with limited privileges
- Configure connection pooling appropriately
- Set `spring.jpa.hibernate.ddl-auto=validate` in production
- Enable SSL for database connections
- Set up database backups

## API Testing
Test the REST API with curl:

```bash
# Get all employees
curl http://localhost:8080/api/employees

# Get employee by ID
curl http://localhost:8080/api/employees/1

# Create new employee
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","department":"IT","position":"Developer","hireDate":"2024-01-01","salary":60000}'
```

The Employee Management System is now fully configured for MySQL and ready for production use!
