@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ===================================================
echo Starting NUST Connect (MySQL Database)
echo ===================================================

REM Check if dependencies are installed
if not exist "Frontend\node_modules" (
    echo [WARNING] Frontend dependencies not found.
    echo Please run setup.bat first!
    pause
    exit /b 1
)

if not exist "Backend\nustconnect\target" (
    echo [WARNING] Backend build not found.
    echo Please run setup.bat first!
    pause
    exit /b 1
)

REM Check if MySQL is running
echo Checking MySQL connection...
mysql -u root -p -e "SELECT 1;" >nul 2>&1
if !errorlevel! neq 0 (
    echo [WARNING] Cannot connect to MySQL.
    echo Please ensure MySQL is running and accessible.
    echo You may need to start MySQL service or check credentials.
    echo.
    choice /C YN /M "Continue anyway"
    if !errorlevel! neq 1 (
        exit /b 1
    )
)

REM Check if ports are available
echo Checking if ports are available...
netstat -ano | findstr ":8081" >nul
if !errorlevel! equ 0 (
    echo [WARNING] Port 8081 is already in use!
    echo Backend may fail to start.
    pause
)

netstat -ano | findstr ":5174" >nul
if !errorlevel! equ 0 (
    echo [WARNING] Port 5174 is already in use!
    echo Frontend may fail to start.
    pause
)

echo.
echo Starting Backend (MySQL on port 8081)...
start "NUST Connect Backend" cmd /k "cd /d "%~dp0Backend\nustconnect" && mvnw.cmd spring-boot:run"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

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
echo.
echo Both services are starting in separate windows.
echo Close those windows to stop the services.
echo ===================================================
pause