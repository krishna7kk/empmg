@echo off
echo ========================================
echo   Backend Docker Setup
echo ========================================
echo.

echo Starting MySQL database and Backend application...
echo.

REM Start MySQL first
echo [1/2] Starting MySQL database...
docker-compose up -d mysql

echo Waiting for MySQL to be ready...
timeout /t 15 /nobreak > nul

REM Uncomment the backend service in docker-compose.yml and start it
echo [2/2] Starting Backend application...
docker-compose up -d

echo.
echo ========================================
echo   Backend Services Started
echo ========================================
echo.
echo MySQL Database: http://localhost:3306
echo Backend API: http://localhost:8080
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop services:
echo   docker-compose down
echo.

pause
