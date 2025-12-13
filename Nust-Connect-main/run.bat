@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Starting NUST Connect System
echo ===================================================

REM Auto-cleanup previous sessions
echo.
echo [Auto-Cleanup] Checking for zombie processes...
call stop.bat >nul 2>&1
echo [Auto-Cleanup] Done.

REM Check if dependencies are installed
if not exist "Frontend\node_modules" (
    echo [WARNING] Frontend dependencies not found.
    echo Please run setup.bat first!
    pause
    exit /b
)

echo.
echo 1. Starting Backend Server...
echo The backend runs on port 8081.
start "NUST Connect Backend" cmd /k "cd /d "%~dp0Backend\nustconnect" && mvnw.cmd spring-boot:run"

echo.
echo 2. Starting Frontend Dev Server...
echo The frontend runs on port 5174.
start "NUST Connect Frontend" cmd /k "cd /d "%~dp0Frontend" && npm.cmd run dev"

echo.
echo ===================================================
echo System Starting...
echo - Backend: http://localhost:8081
echo - Frontend: http://localhost:5174
echo.
echo Keep this window open or minimize it.
echo Close the popup windows to stop the servers.
echo ===================================================
pause
