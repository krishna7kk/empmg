package com.employeems.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {
    
    // In-memory storage for demo
    private static List<Map<String, Object>> employees = new ArrayList<>();
    private static Long nextId = 1L;
    
    static {
        // Initialize with sample data
        addSampleEmployee("John", "Doe", "john.doe@company.com", "Engineering", "Software Engineer", "75000");
        addSampleEmployee("Jane", "Smith", "jane.smith@company.com", "HR", "HR Manager", "65000");
        addSampleEmployee("Mike", "Johnson", "mike.johnson@company.com", "Sales", "Sales Rep", "55000");
        addSampleEmployee("Sarah", "Williams", "sarah.williams@company.com", "Marketing", "Marketing Specialist", "60000");
        addSampleEmployee("David", "Brown", "david.brown@company.com", "Finance", "Financial Analyst", "70000");
    }
    
    private static void addSampleEmployee(String firstName, String lastName, String email, String department, String position, String salary) {
        Map<String, Object> employee = new HashMap<>();
        employee.put("id", nextId++);
        employee.put("firstName", firstName);
        employee.put("lastName", lastName);
        employee.put("fullName", firstName + " " + lastName);
        employee.put("email", email);
        employee.put("department", department);
        employee.put("position", position);
        employee.put("salary", salary);
        employee.put("hireDate", "2022-01-15");
        employee.put("isActive", true);
        employees.add(employee);
    }
    
    @GetMapping("/employees")
    public Map<String, Object> getAllEmployees() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", employees);
        response.put("total", employees.size());
        response.put("message", "Employees retrieved successfully");
        return response;
    }
    
    @GetMapping("/employees/{id}")
    public Map<String, Object> getEmployeeById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Map<String, Object>> employee = employees.stream()
            .filter(emp -> emp.get("id").equals(id))
            .findFirst();
            
        if (employee.isPresent()) {
            response.put("success", true);
            response.put("data", employee.get());
            response.put("message", "Employee found");
        } else {
            response.put("success", false);
            response.put("message", "Employee not found");
        }
        
        return response;
    }
    
    @PostMapping("/employees")
    public Map<String, Object> createEmployee(@RequestBody Map<String, Object> employeeData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> newEmployee = new HashMap<>();
            newEmployee.put("id", nextId++);
            newEmployee.put("firstName", employeeData.get("firstName"));
            newEmployee.put("lastName", employeeData.get("lastName"));
            newEmployee.put("fullName", employeeData.get("firstName") + " " + employeeData.get("lastName"));
            newEmployee.put("email", employeeData.get("email"));
            newEmployee.put("department", employeeData.get("department"));
            newEmployee.put("position", employeeData.get("position"));
            newEmployee.put("salary", employeeData.get("salary"));
            newEmployee.put("hireDate", employeeData.getOrDefault("hireDate", "2024-01-01"));
            newEmployee.put("isActive", true);
            
            employees.add(newEmployee);
            
            response.put("success", true);
            response.put("data", newEmployee);
            response.put("message", "Employee created successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating employee: " + e.getMessage());
        }
        
        return response;
    }
    
    @PutMapping("/employees/{id}")
    public Map<String, Object> updateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> employeeData) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Map<String, Object>> employeeOpt = employees.stream()
            .filter(emp -> emp.get("id").equals(id))
            .findFirst();
            
        if (employeeOpt.isPresent()) {
            Map<String, Object> employee = employeeOpt.get();
            employee.put("firstName", employeeData.get("firstName"));
            employee.put("lastName", employeeData.get("lastName"));
            employee.put("fullName", employeeData.get("firstName") + " " + employeeData.get("lastName"));
            employee.put("email", employeeData.get("email"));
            employee.put("department", employeeData.get("department"));
            employee.put("position", employeeData.get("position"));
            employee.put("salary", employeeData.get("salary"));
            
            response.put("success", true);
            response.put("data", employee);
            response.put("message", "Employee updated successfully");
        } else {
            response.put("success", false);
            response.put("message", "Employee not found");
        }
        
        return response;
    }
    
    @DeleteMapping("/employees/{id}")
    public Map<String, Object> deleteEmployee(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        boolean removed = employees.removeIf(emp -> emp.get("id").equals(id));
        
        if (removed) {
            response.put("success", true);
            response.put("message", "Employee deleted successfully");
        } else {
            response.put("success", false);
            response.put("message", "Employee not found");
        }
        
        return response;
    }
    
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Long> departmentStats = new HashMap<>();
        
        // Count employees by department
        for (Map<String, Object> emp : employees) {
            String dept = (String) emp.get("department");
            departmentStats.put(dept, departmentStats.getOrDefault(dept, 0L) + 1);
        }
        
        response.put("success", true);
        response.put("totalEmployees", employees.size());
        response.put("departmentStats", departmentStats);
        response.put("message", "Statistics retrieved successfully");
        
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Employee Management System is running!");
        response.put("timestamp", new Date());
        response.put("employeeCount", employees.size());
        return response;
    }
}
