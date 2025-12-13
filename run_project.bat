@echo off
echo Starting NUST Connect...

echo Starting Backend...
start "NUST Connect Backend" cmd /k "cd Backend\nustconnect && .\mvnw.cmd spring-boot:run"

echo Starting Frontend...
start "NUST Connect Frontend" cmd /k "cd Frontend && npm run dev"

echo ===================================================
echo Project started!
echo - Backend will be available at http://localhost:8081
echo - Frontend will be available at http://localhost:5173 (or next available port)
echo ===================================================
pause
