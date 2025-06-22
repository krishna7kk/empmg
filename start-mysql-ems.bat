@echo off
echo ========================================
echo   Employee Management System - MySQL
echo ========================================
echo.

echo Starting Employee Management System with MySQL database...
echo Database: ems
echo Port: 8080
echo.

cd Backend

echo Building application...
call mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Starting application...
echo.
echo Available endpoints:
echo - Web Interface: http://localhost:8080
echo - REST API: http://localhost:8080/api/employees
echo - Health Check: http://localhost:8080/api/employees/health
echo - Demo API: http://localhost:8080/api/demo
echo.

java -jar target/employee-management-system-1.0.0.jar

pause
