@echo off
echo ========================================
echo   EMPLOYEE MANAGEMENT SYSTEM - PRODUCTION
echo ========================================

echo.
echo [1/3] Starting Backend Server...
echo Backend will run on: http://localhost:8080
echo.

cd spring-employee-ms
start "Employee Backend" java -jar target/employee-management-system-1.0.0.jar --spring.profiles.active=dev

echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo.
echo [2/3] Starting Frontend Server...
echo Frontend will run on: http://localhost:3000
echo.

cd ..\ems
start "Employee Frontend" npx serve -s dist -l 3000

echo Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Opening Application...
timeout /t 3 /nobreak > nul
start http://localhost:3000

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your Employee Management System is running:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8080
echo   API:      http://localhost:8080/api/demo/
echo.
echo Press any key to view system status...
pause > nul

echo.
echo Checking system status...
echo.
echo Backend Health:
curl -s http://localhost:8080/api/demo/health 2>nul || echo "Backend not responding"

echo.
echo Frontend Status:
curl -s http://localhost:3000 2>nul | findstr "Employee" || echo "Frontend not responding"

echo.
echo To stop the servers:
echo   1. Close the backend terminal window
echo   2. Close the frontend terminal window
echo   3. Or press Ctrl+C in each terminal
echo.
pause
