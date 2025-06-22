@echo off
echo ========================================
echo   Docker Path Fix for Employee MS
echo ========================================
echo.

echo Current directory: %CD%
echo.

echo Checking for Docker configurations...
echo.

if exist "docker-compose.fullstack.yml" (
    echo ✅ Found full-stack configuration
    echo.
    echo Starting full-stack deployment...
    docker-compose -f docker-compose.fullstack.yml up -d
    echo.
    echo Services started:
    echo - Frontend: http://localhost
    echo - Backend: http://localhost:8080
    echo - MySQL: localhost:3306
) else if exist "Backend\docker-compose.yml" (
    echo ✅ Found backend configuration
    echo.
    echo Starting backend services...
    cd Backend
    docker-compose up -d
    echo.
    echo Services started:
    echo - Backend: http://localhost:8080
    echo - MySQL: localhost:3306
) else if exist "docker-compose.yml" (
    echo ✅ Found local docker-compose.yml
    echo.
    echo Starting services...
    docker-compose up -d
) else (
    echo ❌ No Docker configuration found in current directory
    echo.
    echo Please run this script from:
    echo - Root directory (employee-ms/) for full-stack
    echo - Backend/ directory for backend only
    echo.
    echo Available configurations:
    if exist "..\docker-compose.fullstack.yml" echo - Full-stack: ..\docker-compose.fullstack.yml
    if exist "docker-compose.yml" echo - Backend: docker-compose.yml
)

echo.
pause
