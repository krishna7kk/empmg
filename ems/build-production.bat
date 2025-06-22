@echo off
echo ========================================
echo   Frontend Production Build
echo ========================================
echo.

echo [1/4] Cleaning previous builds...
if exist "dist" rmdir /s /q dist
echo ✅ Cleaned dist directory

echo.
echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo [3/4] Running production build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Production build completed

echo.
echo [4/4] Build verification...
if exist "dist\index.html" (
    echo ✅ Build artifacts created successfully
    echo.
    echo Build Output:
    dir dist /b
    echo.
    echo Build Size:
    for /f %%i in ('dir dist /s /-c ^| find "bytes"') do echo %%i
) else (
    echo ❌ Build verification failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Production Build Complete!
echo ========================================
echo.
echo Build location: %CD%\dist
echo.
echo Ready for deployment to:
echo - Netlify (drag and drop dist folder)
echo - Vercel (connect GitHub repository)
echo - Static hosting (upload dist contents)
echo.

pause
