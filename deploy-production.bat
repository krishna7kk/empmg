@echo off
echo ========================================
echo   Production Deployment Script
echo ========================================
echo.

echo WARNING: This will deploy to PRODUCTION environment!
echo.
set /p confirm="Are you sure you want to continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Deployment cancelled.
    pause
    exit /b 0
)

echo.
echo [1/8] Checking prerequisites...

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running or not installed
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)
echo ✅ Docker is running

REM Check if docker-compose is available
docker-compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available
    pause
    exit /b 1
)
echo ✅ Docker Compose is available

echo.
echo [2/8] Setting up environment variables...
if not exist ".env.production" (
    echo Creating .env.production file...
    echo MYSQL_ROOT_PASSWORD=secure_root_password_2024! > .env.production
    echo MYSQL_PASSWORD=secure_production_password_2024! >> .env.production
    echo JWT_SECRET=your-super-secure-jwt-secret-key-for-production-use-256-bit-key >> .env.production
    echo REDIS_PASSWORD=redis_secure_password_2024! >> .env.production
    echo FRONTEND_URL=https://employee-frontend.netlify.app >> .env.production
    echo BACKEND_URL=http://localhost:8080 >> .env.production
    echo ⚠️  Please update .env.production with your actual production values!
    pause
)
echo ✅ Environment variables configured

echo.
echo [3/8] Building frontend production build...
cd ems
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend build completed

echo.
echo [4/8] Building backend production JAR...
cd Backend
call mvn clean package -DskipTests -Pprod
if %errorlevel% neq 0 (
    echo ❌ Backend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Backend build completed

echo.
echo [5/8] Stopping existing containers...
docker-compose -f docker-compose.production.yml down
echo ✅ Existing containers stopped

echo.
echo [6/8] Building Docker images...
docker-compose -f docker-compose.production.yml build --no-cache
if %errorlevel% neq 0 (
    echo ❌ Docker build failed
    pause
    exit /b 1
)
echo ✅ Docker images built

echo.
echo [7/8] Starting production services...
docker-compose -f docker-compose.production.yml --env-file .env.production up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start services
    pause
    exit /b 1
)
echo ✅ Production services started

echo.
echo [8/8] Verifying deployment...
timeout /t 30 /nobreak > nul
echo Checking service health...

docker-compose -f docker-compose.production.yml ps

echo.
echo Testing backend health...
curl -f http://localhost:8080/api/demo/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy
) else (
    echo ⚠️  Backend health check failed - may still be starting
)

echo.
echo ========================================
echo   Production Deployment Complete!
echo ========================================
echo.
echo Services:
echo - Frontend: http://localhost
echo - Backend:  http://localhost:8080
echo - MySQL:    localhost:3306
echo - Redis:    localhost:6379
echo.
echo To view logs:
echo   docker-compose -f docker-compose.production.yml logs -f
echo.
echo To stop services:
echo   docker-compose -f docker-compose.production.yml down
echo.
echo To update deployment:
echo   Run this script again
echo.

pause
