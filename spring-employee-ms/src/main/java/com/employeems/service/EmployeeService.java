package com.employeems.service;

import com.employeems.entity.Employee;
import com.employeems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    // Get all active employees
    public List<Employee> getAllActiveEmployees() {
        return employeeRepository.findByIsActiveTrue();
    }
    
    // Get employees with pagination
    public Page<Employee> getActiveEmployees(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return employeeRepository.findByIsActiveTrue(pageable);
    }
    
    // Get employee by ID
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }
    
    // Save employee
    public Employee saveEmployee(Employee employee) {
        validateEmployee(employee);
        return employeeRepository.save(employee);
    }
    
    // Update employee
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        
        // Validate email uniqueness for update
        if (!employee.getEmail().equals(employeeDetails.getEmail()) && 
            employeeRepository.existsByEmailAndIdNot(employeeDetails.getEmail(), id)) {
            throw new RuntimeException("Email already exists");
        }
        
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setPosition(employeeDetails.getPosition());
        employee.setHireDate(employeeDetails.getHireDate());
        employee.setSalary(employeeDetails.getSalary());
        
        return employeeRepository.save(employee);
    }
    
    // Soft delete employee
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employee.setIsActive(false);
        employeeRepository.save(employee);
    }
    
    // Hard delete employee (for admin use)
    public void hardDeleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
    
    // Search employees
    public Page<Employee> searchEmployees(String searchTerm, int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return employeeRepository.searchActiveEmployees(searchTerm, pageable);
    }
    
    // Get employees by department
    public Page<Employee> getEmployeesByDepartment(String department, int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return employeeRepository.findByDepartmentAndIsActiveTrue(department, pageable);
    }
    
    // Get employee statistics
    public Map<String, Object> getEmployeeStatistics() {
        long totalEmployees = employeeRepository.countByIsActiveTrue();
        List<Object[]> departmentCounts = employeeRepository.countEmployeesByDepartment();
        
        Map<String, Long> departmentStats = departmentCounts.stream()
                .collect(Collectors.toMap(
                    row -> (String) row[0],
                    row -> (Long) row[1]
                ));
        
        return Map.of(
            "totalEmployees", totalEmployees,
            "departmentStats", departmentStats,
            "departments", employeeRepository.findAllDepartments()
        );
    }
    
    // Get all departments
    public List<String> getAllDepartments() {
        return employeeRepository.findAllDepartments();
    }
    
    // Validate employee
    private void validateEmployee(Employee employee) {
        if (employee.getId() == null && employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
    }
    
    // Check if employee exists
    public boolean existsById(Long id) {
        return employeeRepository.existsById(id);
    }
}
