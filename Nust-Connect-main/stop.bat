@echo off
echo ===================================================
echo Stopping NUST Connect Processes...
echo ===================================================

echo.
echo 1. Stopping Backend (Port 8081)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081"') do (
    echo - Killing PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo 2. Stopping Frontend (Port 5173 and 5174)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do (
    echo - Killing PID %%a (Port 5173)
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5174"') do (
    echo - Killing PID %%a (Port 5174)
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo ===================================================
echo Cleanup Complete. All servers stopped.
echo ===================================================
timeout /t 2 >nul
