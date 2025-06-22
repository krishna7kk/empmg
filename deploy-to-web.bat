@echo off
echo ========================================
echo   Deploy Employee MS to Web
echo ========================================
echo.

echo 🚀 Deploying Employee Management System to the Web!
echo.

echo [1/3] Checking build status...
if exist "ems\dist\index.html" (
    echo ✅ Frontend build found and ready
    for %%i in (ems\dist\assets\*.js) do echo   JavaScript: %%~nxi
    for %%i in (ems\dist\assets\*.css) do echo   Stylesheet: %%~nxi
) else (
    echo ❌ Frontend not built. Building now...
    cd ems
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Frontend build failed
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Frontend built successfully
)

echo.
echo [2/3] Deployment platforms ready:
echo.
echo 🌐 FRONTEND DEPLOYMENT (Netlify):
echo   1. Go to: https://netlify.com
echo   2. Sign up/Login with GitHub
echo   3. Drag and drop: ems\dist folder
echo   4. Get instant live URL
echo.
echo ⚙️ BACKEND DEPLOYMENT (Heroku):
echo   1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
echo   2. Run: heroku login
echo   3. Run: heroku create your-app-name
echo   4. Deploy: git subtree push --prefix=Backend heroku main
echo.

echo [3/3] Quick deployment commands:
echo.
echo 📋 COPY AND RUN THESE COMMANDS:
echo.
echo # Backend deployment:
echo heroku login
echo heroku create your-employee-backend
echo heroku addons:create cleardb:ignite
echo cd Backend
echo git init
echo git add .
echo git commit -m "Deploy to Heroku"
echo heroku git:remote -a your-employee-backend
echo git push heroku main
echo.

echo ========================================
echo   Ready for Web Deployment!
echo ========================================
echo.
echo 📦 Build artifacts ready:
echo   Frontend: ems\dist\ (ready for Netlify)
echo   Backend: Backend\target\*.jar (ready for Heroku)
echo.
echo 🌐 Deployment platforms:
echo   Frontend: https://netlify.com (free tier)
echo   Backend: https://heroku.com (free tier)
echo.
echo 📚 Full guide: WEB-DEPLOYMENT-GUIDE.md
echo.
echo 🎯 Expected deployment time: 15-30 minutes
echo 💰 Cost: FREE (using free tiers)
echo.

set /p deploy="Open deployment guide? (y/N): "
if /i "%deploy%"=="y" (
    start WEB-DEPLOYMENT-GUIDE.md
)

echo.
echo 🎉 Your Employee Management System is ready for the web!
echo.
pause
