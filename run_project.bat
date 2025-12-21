@echo off
echo Starting NUST Connect...

echo Starting Backend...
start "NUST Connect Backend" cmd /k "cd Nust-Connect-main\Backend\nustconnect && .\mvnw.cmd spring-boot:run"

echo Starting Frontend...
start "NUST Connect Frontend" cmd /k "cd Nust-Connect-main\Frontend && npm run dev"

echo ===================================================
echo Project started!
echo - Backend will be available at http://localhost:8081
echo - Frontend will be available at http://localhost:5174
echo ===================================================

REM Open the browser automatically
start http://localhost:5174
pause
