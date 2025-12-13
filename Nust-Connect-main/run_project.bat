@echo off
setlocal
cd /d "%~dp0"

echo Starting NUST Connect...

echo Starting Backend...
start "NUST Connect Backend" cmd /k "cd /d "%~dp0Backend\nustconnect" && mvnw.cmd spring-boot:run"

echo Starting Frontend...
start "NUST Connect Frontend" cmd /k "cd /d "%~dp0Frontend" && npm run dev"

echo ===================================================
echo Project started!
echo - Backend will be available at http://localhost:8081
echo - Frontend will be available at http://localhost:5174 (or next available port)
echo ===================================================
pause
