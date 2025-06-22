package com.employeems.controller;

import com.employeems.entity.Employee;
import com.employeems.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/")
public class EmployeeWebController {
    
    @Autowired
    private EmployeeService employeeService;
    
    private final List<String> departments = Arrays.asList(
        "HR", "Engineering", "Marketing", "Sales", "Finance", 
        "Operations", "IT", "Legal", "Customer Service", "Research & Development"
    );
    
    // Home page - redirect to employee list
    @GetMapping("/")
    public String home() {
        return "redirect:/employees";
    }
    
    // Employee list page
    @GetMapping("/employees")
    public String listEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            Model model) {
        
        try {
            Page<Employee> employeePage;
            
            if (search != null && !search.trim().isEmpty()) {
                employeePage = employeeService.searchEmployees(search, page, size, sortBy, sortDirection);
                model.addAttribute("search", search);
            } else if (department != null && !department.trim().isEmpty()) {
                employeePage = employeeService.getEmployeesByDepartment(department, page, size, sortBy, sortDirection);
                model.addAttribute("selectedDepartment", department);
            } else {
                employeePage = employeeService.getActiveEmployees(page, size, sortBy, sortDirection);
            }
            
            model.addAttribute("employees", employeePage.getContent());
            model.addAttribute("currentPage", employeePage.getNumber());
            model.addAttribute("totalPages", employeePage.getTotalPages());
            model.addAttribute("totalItems", employeePage.getTotalElements());
            model.addAttribute("hasNext", employeePage.hasNext());
            model.addAttribute("hasPrevious", employeePage.hasPrevious());
            model.addAttribute("sortBy", sortBy);
            model.addAttribute("sortDirection", sortDirection);
            model.addAttribute("size", size);
            model.addAttribute("departments", departments);
            
            // Get statistics for dashboard
            Map<String, Object> stats = employeeService.getEmployeeStatistics();
            model.addAttribute("statistics", stats);
            
        } catch (Exception e) {
            model.addAttribute("error", "Error loading employees: " + e.getMessage());
        }
        
        return "employees/list";
    }
    
    // Show add employee form
    @GetMapping("/employees/add")
    public String showAddForm(Model model) {
        model.addAttribute("employee", new Employee());
        model.addAttribute("departments", departments);
        model.addAttribute("pageTitle", "Add New Employee");
        return "employees/form";
    }
    
    // Process add employee form
    @PostMapping("/employees/add")
    public String addEmployee(@Valid @ModelAttribute Employee employee, 
                             BindingResult result, 
                             Model model, 
                             RedirectAttributes redirectAttributes) {
        
        if (result.hasErrors()) {
            model.addAttribute("departments", departments);
            model.addAttribute("pageTitle", "Add New Employee");
            return "employees/form";
        }
        
        try {
            employeeService.saveEmployee(employee);
            redirectAttributes.addFlashAttribute("successMessage", 
                "Employee " + employee.getFullName() + " has been added successfully!");
            return "redirect:/employees";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error adding employee: " + e.getMessage());
            model.addAttribute("departments", departments);
            model.addAttribute("pageTitle", "Add New Employee");
            return "employees/form";
        }
    }
    
    // Show edit employee form
    @GetMapping("/employees/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        try {
            Optional<Employee> employee = employeeService.getEmployeeById(id);
            if (employee.isPresent()) {
                model.addAttribute("employee", employee.get());
                model.addAttribute("departments", departments);
                model.addAttribute("pageTitle", "Edit Employee");
                return "employees/form";
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Employee not found!");
                return "redirect:/employees";
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error loading employee: " + e.getMessage());
            return "redirect:/employees";
        }
    }
    
    // Process edit employee form
    @PostMapping("/employees/edit/{id}")
    public String editEmployee(@PathVariable Long id, 
                              @Valid @ModelAttribute Employee employee, 
                              BindingResult result, 
                              Model model, 
                              RedirectAttributes redirectAttributes) {
        
        if (result.hasErrors()) {
            model.addAttribute("departments", departments);
            model.addAttribute("pageTitle", "Edit Employee");
            return "employees/form";
        }
        
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employee);
            redirectAttributes.addFlashAttribute("successMessage", 
                "Employee " + updatedEmployee.getFullName() + " has been updated successfully!");
            return "redirect:/employees";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error updating employee: " + e.getMessage());
            model.addAttribute("departments", departments);
            model.addAttribute("pageTitle", "Edit Employee");
            return "employees/form";
        }
    }
    
    // View employee details
    @GetMapping("/employees/view/{id}")
    public String viewEmployee(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        try {
            Optional<Employee> employee = employeeService.getEmployeeById(id);
            if (employee.isPresent()) {
                model.addAttribute("employee", employee.get());
                return "employees/view";
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Employee not found!");
                return "redirect:/employees";
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error loading employee: " + e.getMessage());
            return "redirect:/employees";
        }
    }
    
    // Delete employee
    @PostMapping("/employees/delete/{id}")
    public String deleteEmployee(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            Optional<Employee> employee = employeeService.getEmployeeById(id);
            if (employee.isPresent()) {
                String employeeName = employee.get().getFullName();
                employeeService.deleteEmployee(id);
                redirectAttributes.addFlashAttribute("successMessage", 
                    "Employee " + employeeName + " has been deleted successfully!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Employee not found!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting employee: " + e.getMessage());
        }
        return "redirect:/employees";
    }
    
    // Dashboard page
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        try {
            Map<String, Object> stats = employeeService.getEmployeeStatistics();
            model.addAttribute("statistics", stats);
            
            // Get recent employees (last 5)
            Page<Employee> recentEmployees = employeeService.getActiveEmployees(0, 5, "createdAt", "desc");
            model.addAttribute("recentEmployees", recentEmployees.getContent());
            
        } catch (Exception e) {
            model.addAttribute("error", "Error loading dashboard: " + e.getMessage());
        }
        
        return "dashboard";
    }
}
