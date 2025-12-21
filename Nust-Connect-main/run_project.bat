@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Starting NUST Connect (MySQL Database)
echo ===================================================

REM Check if dependencies are installed
if not exist "Frontend\node_modules" (
    echo [WARNING] Frontend dependencies not found.
    echo Please run setup.bat first!
    pause
    exit /b
)

echo.
echo Starting Backend (MySQL on port 8081)...
start "NUST Connect Backend" cmd /k "cd /d "%~dp0Backend\nustconnect" && mvnw.cmd spring-boot:run"

echo.
echo Starting Frontend (Vite on port 5174)...
start "NUST Connect Frontend" cmd /k "cd /d "%~dp0Frontend" && npm run dev"

echo.
echo ===================================================
echo Project started!
echo - Backend API: http://localhost:8081
echo - Frontend:    http://localhost:5174
echo - Database:    MySQL (localhost:3306/nustconnect)
echo ===================================================
pause
