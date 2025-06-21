@echo off
echo Starting Employee Management System...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

REM Check if MySQL is running (optional check)
echo Checking MySQL connection...
mysql -u root -p -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Could not connect to MySQL
    echo Please ensure MySQL is running and credentials are correct
    echo.
)

REM Start the application
echo Starting Spring Boot application...
echo Access the application at: http://localhost:8080
echo Press Ctrl+C to stop the application
echo.

mvnw.cmd spring-boot:run

pause
