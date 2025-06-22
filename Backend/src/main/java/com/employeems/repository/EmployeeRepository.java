package com.employeems.repository;

import com.employeems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Find active employees
    List<Employee> findByIsActiveTrue();
    Page<Employee> findByIsActiveTrue(Pageable pageable);
    
    // Find by department
    List<Employee> findByDepartmentAndIsActiveTrue(String department);
    Page<Employee> findByDepartmentAndIsActiveTrue(String department, Pageable pageable);
    
    // Find by email
    Optional<Employee> findByEmailAndIsActiveTrue(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    
    // Search functionality
    @Query("SELECT e FROM Employee e WHERE e.isActive = true AND " +
           "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.department) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.position) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Employee> searchActiveEmployees(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Count by department
    @Query("SELECT e.department, COUNT(e) FROM Employee e WHERE e.isActive = true GROUP BY e.department")
    List<Object[]> countEmployeesByDepartment();
    
    // Count active employees
    long countByIsActiveTrue();
    
    // Get all departments
    @Query("SELECT DISTINCT e.department FROM Employee e WHERE e.isActive = true ORDER BY e.department")
    List<String> findAllDepartments();
}
