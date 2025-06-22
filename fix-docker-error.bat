@echo off
echo ========================================
echo   Docker Error Fix Script
echo ========================================
echo.

echo Fixing Docker image availability error...
echo.

echo [1/4] Backing up original Dockerfile...
if exist "Backend\Dockerfile.backup" (
    echo Backup already exists
) else (
    copy "Backend\Dockerfile" "Backend\Dockerfile.backup"
    echo ✅ Backup created
)

echo.
echo [2/4] Checking available Dockerfile options...
if exist "Backend\Dockerfile.simple" (
    echo ✅ Simple Dockerfile available
    set /p useSimple="Use simple Dockerfile? (y/N): "
    if /i "%useSimple%"=="y" (
        copy "Backend\Dockerfile.simple" "Backend\Dockerfile"
        echo ✅ Using simple Dockerfile
        goto build
    )
)

if exist "Backend\Dockerfile.alternative" (
    echo ✅ Alternative Dockerfile available
    set /p useAlt="Use alternative Dockerfile? (y/N): "
    if /i "%useAlt%"=="y" (
        copy "Backend\Dockerfile.alternative" "Backend\Dockerfile"
        echo ✅ Using alternative Dockerfile
        goto build
    )
)

echo Using fixed main Dockerfile...

:build
echo.
echo [3/4] Testing Docker build...
cd Backend
docker build -t employee-backend-test .
if %errorlevel% equ 0 (
    echo ✅ Docker build successful!
    echo.
    echo [4/4] Cleaning up test image...
    docker rmi employee-backend-test
    echo ✅ Test image removed
    echo.
    echo ========================================
    echo   Docker Error Fixed!
    echo ========================================
    echo.
    echo You can now run:
    echo   docker-compose -f docker-compose.production.yml up -d
    echo.
) else (
    echo ❌ Docker build failed
    echo.
    echo Trying with pre-built JAR approach...
    echo.
    echo Building JAR locally...
    mvn clean package -DskipTests
    if %errorlevel% equ 0 (
        echo ✅ JAR built successfully
        echo.
        echo Creating runtime-only Dockerfile...
        echo FROM openjdk:21-jre-slim > Dockerfile.runtime
        echo RUN apt-get update ^&^& apt-get install -y curl ^&^& rm -rf /var/lib/apt/lists/* >> Dockerfile.runtime
        echo WORKDIR /app >> Dockerfile.runtime
        echo COPY target/employee-management-system-1.0.0.jar app.jar >> Dockerfile.runtime
        echo EXPOSE 8080 >> Dockerfile.runtime
        echo HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD curl -f http://localhost:8080/actuator/health ^|^| exit 1 >> Dockerfile.runtime
        echo CMD ["java", "-jar", "app.jar"] >> Dockerfile.runtime
        
        echo Testing runtime Dockerfile...
        docker build -f Dockerfile.runtime -t employee-backend-runtime .
        if %errorlevel% equ 0 (
            echo ✅ Runtime Docker build successful!
            copy Dockerfile.runtime Dockerfile
            echo ✅ Updated main Dockerfile
            docker rmi employee-backend-runtime
        ) else (
            echo ❌ All Docker builds failed
            echo.
            echo Alternative deployment options:
            echo 1. Deploy to Heroku: heroku create your-app ^&^& git subtree push --prefix=Backend heroku main
            echo 2. Run locally: java -jar target/employee-management-system-1.0.0.jar
            echo 3. Use Railway: railway deploy
        )
    ) else (
        echo ❌ JAR build also failed
        echo Please check Maven configuration and try again
    )
)

cd ..
echo.
pause
