package com.employeems.service;

import com.employeems.entity.Employee;
import com.employeems.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DatabaseInitializationService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializationService.class);

    @Autowired
    private DataSource dataSource;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Starting database initialization...");
        
        try {
            // Check and fix database schema
            ensureTableStructure();
            
            // Initialize sample data if table is empty
            initializeSampleData();
            
            logger.info("Database initialization completed successfully!");
            
        } catch (Exception e) {
            logger.error("Error during database initialization: ", e);
            // Don't throw exception to prevent application startup failure
        }
    }

    private void ensureTableStructure() {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            // Check if employees table exists
            try (ResultSet tables = metaData.getTables(null, null, "employees", null)) {
                if (!tables.next()) {
                    logger.info("Creating employees table...");
                    createEmployeesTable(connection);
                } else {
                    logger.info("Employees table exists, checking structure...");
                    ensureColumnsExist(connection, metaData);
                }
            }
            
        } catch (Exception e) {
            logger.error("Error ensuring table structure: ", e);
        }
    }

    private void createEmployeesTable(Connection connection) throws Exception {
        String createTableSQL = """
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """;

        try (Statement statement = connection.createStatement()) {
            statement.execute(createTableSQL);
            logger.info("Employees table created successfully");
        }
    }

    private void ensureColumnsExist(Connection connection, DatabaseMetaData metaData) throws Exception {
        List<String> existingColumns = new ArrayList<>();
        
        // Get existing columns
        try (ResultSet columns = metaData.getColumns(null, null, "employees", null)) {
            while (columns.next()) {
                existingColumns.add(columns.getString("COLUMN_NAME").toLowerCase());
            }
        }

        // Add missing columns
        try (Statement statement = connection.createStatement()) {
            
            if (!existingColumns.contains("id")) {
                statement.execute("ALTER TABLE employees ADD COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY FIRST");
                logger.info("Added id column");
            }
            
            if (!existingColumns.contains("first_name")) {
                statement.execute("ALTER TABLE employees ADD COLUMN first_name VARCHAR(50) NOT NULL DEFAULT ''");
                logger.info("Added first_name column");
            }
            
            if (!existingColumns.contains("last_name")) {
                statement.execute("ALTER TABLE employees ADD COLUMN last_name VARCHAR(50) NOT NULL DEFAULT ''");
                logger.info("Added last_name column");
            }
            
            if (!existingColumns.contains("email")) {
                statement.execute("ALTER TABLE employees ADD COLUMN email VARCHAR(100) NOT NULL DEFAULT ''");
                logger.info("Added email column");
            }
            
            if (!existingColumns.contains("department")) {
                statement.execute("ALTER TABLE employees ADD COLUMN department VARCHAR(100) NOT NULL DEFAULT ''");
                logger.info("Added department column");
            }
            
            if (!existingColumns.contains("position")) {
                statement.execute("ALTER TABLE employees ADD COLUMN position VARCHAR(100) NOT NULL DEFAULT ''");
                logger.info("Added position column");
            }
            
            if (!existingColumns.contains("hire_date")) {
                statement.execute("ALTER TABLE employees ADD COLUMN hire_date DATE NOT NULL DEFAULT '2020-01-01'");
                logger.info("Added hire_date column");
            }
            
            if (!existingColumns.contains("salary")) {
                statement.execute("ALTER TABLE employees ADD COLUMN salary DECIMAL(10,2) DEFAULT 0.00");
                logger.info("Added salary column");
            }
            
            if (!existingColumns.contains("is_active")) {
                statement.execute("ALTER TABLE employees ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE");
                logger.info("Added is_active column");
            }
            
            if (!existingColumns.contains("created_at")) {
                statement.execute("ALTER TABLE employees ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
                logger.info("Added created_at column");
            }
            
            if (!existingColumns.contains("updated_at")) {
                statement.execute("ALTER TABLE employees ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
                logger.info("Added updated_at column");
            }

            // Fix any zero dates
            statement.execute("UPDATE employees SET hire_date = '2020-01-01' WHERE hire_date = '0000-00-00' OR hire_date IS NULL");
            statement.execute("UPDATE employees SET created_at = NOW() WHERE created_at = '0000-00-00 00:00:00' OR created_at IS NULL");
            statement.execute("UPDATE employees SET updated_at = NOW() WHERE updated_at = '0000-00-00 00:00:00' OR updated_at IS NULL");
            
            logger.info("Database schema updated successfully");
        }
    }

    private void initializeSampleData() {
        try {
            long count = employeeRepository.count();
            if (count == 0) {
                logger.info("No employees found, creating sample data...");
                createSampleEmployees();
            } else {
                logger.info("Found {} existing employees, skipping sample data creation", count);
            }
        } catch (Exception e) {
            logger.error("Error initializing sample data: ", e);
        }
    }

    private void createSampleEmployees() {
        List<Employee> sampleEmployees = List.of(
            new Employee("John", "Doe", "john.doe@company.com", "Engineering", "Software Engineer", 
                        LocalDate.of(2022, 1, 15), new BigDecimal("75000.00")),
            new Employee("Jane", "Smith", "jane.smith@company.com", "HR", "HR Manager", 
                        LocalDate.of(2021, 3, 10), new BigDecimal("65000.00")),
            new Employee("Mike", "Johnson", "mike.johnson@company.com", "Sales", "Sales Representative", 
                        LocalDate.of(2023, 6, 1), new BigDecimal("55000.00")),
            new Employee("Sarah", "Williams", "sarah.williams@company.com", "Marketing", "Marketing Specialist", 
                        LocalDate.of(2022, 9, 20), new BigDecimal("60000.00")),
            new Employee("David", "Brown", "david.brown@company.com", "Finance", "Financial Analyst", 
                        LocalDate.of(2021, 11, 5), new BigDecimal("70000.00"))
        );

        try {
            employeeRepository.saveAll(sampleEmployees);
            logger.info("Created {} sample employees", sampleEmployees.size());
        } catch (Exception e) {
            logger.error("Error creating sample employees: ", e);
        }
    }
}
