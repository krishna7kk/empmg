package com.employeems.service;

import com.employeems.entity.Employee;
import com.employeems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

// @Service - Temporarily disabled
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize data if the database is empty
        if (employeeRepository.count() == 0) {
            initializeEmployeeData();
        }
    }

    private void initializeEmployeeData() {
        System.out.println("Initializing employee data...");

        // Create sample employees
        Employee[] employees = {
            new Employee("John", "Doe", "john.doe@company.com", "Engineering", "Senior Software Engineer", 
                        LocalDate.of(2022, 1, 15), new BigDecimal("85000.00")),
            new Employee("Jane", "Smith", "jane.smith@company.com", "HR", "HR Manager", 
                        LocalDate.of(2021, 3, 10), new BigDecimal("75000.00")),
            new Employee("Mike", "Johnson", "mike.johnson@company.com", "Sales", "Sales Representative", 
                        LocalDate.of(2022, 6, 20), new BigDecimal("55000.00")),
            new Employee("Sarah", "Williams", "sarah.williams@company.com", "Marketing", "Marketing Specialist", 
                        LocalDate.of(2021, 11, 5), new BigDecimal("60000.00")),
            new Employee("David", "Brown", "david.brown@company.com", "Finance", "Financial Analyst", 
                        LocalDate.of(2022, 2, 28), new BigDecimal("70000.00")),
            new Employee("Emily", "Davis", "emily.davis@company.com", "Engineering", "Frontend Developer", 
                        LocalDate.of(2022, 8, 12), new BigDecimal("78000.00")),
            new Employee("Robert", "Miller", "robert.miller@company.com", "Operations", "Operations Manager", 
                        LocalDate.of(2021, 5, 18), new BigDecimal("82000.00")),
            new Employee("Lisa", "Wilson", "lisa.wilson@company.com", "IT", "System Administrator", 
                        LocalDate.of(2022, 4, 3), new BigDecimal("72000.00")),
            new Employee("James", "Moore", "james.moore@company.com", "Legal", "Legal Counsel", 
                        LocalDate.of(2021, 9, 14), new BigDecimal("95000.00")),
            new Employee("Amanda", "Taylor", "amanda.taylor@company.com", "Customer Service", "Customer Service Manager", 
                        LocalDate.of(2022, 7, 22), new BigDecimal("58000.00")),
            new Employee("Christopher", "Anderson", "chris.anderson@company.com", "Engineering", "Backend Developer", 
                        LocalDate.of(2022, 10, 1), new BigDecimal("80000.00")),
            new Employee("Michelle", "Thomas", "michelle.thomas@company.com", "HR", "HR Specialist", 
                        LocalDate.of(2022, 3, 15), new BigDecimal("52000.00")),
            new Employee("Kevin", "Jackson", "kevin.jackson@company.com", "Sales", "Sales Manager", 
                        LocalDate.of(2021, 7, 8), new BigDecimal("88000.00")),
            new Employee("Nicole", "White", "nicole.white@company.com", "Marketing", "Digital Marketing Manager", 
                        LocalDate.of(2021, 12, 20), new BigDecimal("68000.00")),
            new Employee("Daniel", "Harris", "daniel.harris@company.com", "Finance", "Senior Accountant", 
                        LocalDate.of(2022, 5, 30), new BigDecimal("65000.00")),
            new Employee("Rachel", "Martin", "rachel.martin@company.com", "Research & Development", "Research Scientist", 
                        LocalDate.of(2021, 8, 25), new BigDecimal("92000.00")),
            new Employee("Mark", "Thompson", "mark.thompson@company.com", "IT", "DevOps Engineer", 
                        LocalDate.of(2022, 9, 10), new BigDecimal("85000.00")),
            new Employee("Jessica", "Garcia", "jessica.garcia@company.com", "Operations", "Project Coordinator", 
                        LocalDate.of(2022, 1, 8), new BigDecimal("55000.00")),
            new Employee("Andrew", "Martinez", "andrew.martinez@company.com", "Engineering", "Software Architect", 
                        LocalDate.of(2021, 4, 12), new BigDecimal("105000.00")),
            new Employee("Stephanie", "Robinson", "stephanie.robinson@company.com", "Customer Service", "Customer Support Specialist", 
                        LocalDate.of(2022, 11, 15), new BigDecimal("45000.00"))
        };

        // Save all employees
        for (Employee employee : employees) {
            try {
                employeeRepository.save(employee);
                System.out.println("Created employee: " + employee.getFullName());
            } catch (Exception e) {
                System.err.println("Error creating employee " + employee.getFullName() + ": " + e.getMessage());
            }
        }

        System.out.println("Employee data initialization completed. Total employees: " + employeeRepository.count());
    }
}
