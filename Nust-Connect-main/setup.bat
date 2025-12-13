@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Setting up NUST Connect Project...
echo ===================================================

echo.
echo 1. Checking Backend (Spring Boot)...
echo Current Directory: %CD%

if exist "Backend\nustconnect\mvnw.cmd" (
    echo - Found Maven Wrapper.
    echo - Installing Backend dependencies...
    cd "Backend\nustconnect"
    call mvnw.cmd clean install -DskipTests
    cd /d "%~dp0"
) else (
    echo - ERROR: mvnw.cmd not found in Backend\nustconnect!
    echo - Please check if the folder structure is correct.
    pause
    exit /b
)

echo.
echo 2. Checking Frontend (React + Vite)...
if exist "Frontend\package.json" (
    echo - Found package.json.
    echo - Installing Frontend dependencies (npm install)...
    cd "Frontend"
    call npm install --legacy-peer-deps
    cd /d "%~dp0"
) else (
    echo - ERROR: package.json not found in Frontend!
    pause
    exit /b
)

echo.
echo ===================================================
echo Setup Complete! You can now run the project using run_project.bat
echo ===================================================
pause
