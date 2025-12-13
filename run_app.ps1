# Script to run Nust Connect Application

Write-Host "Starting Nust Connect..." -ForegroundColor Cyan

# Start Backend
Write-Host "Starting Backend (Spring Boot)..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c .\mvnw.cmd spring-boot:run" -WorkingDirectory ".\Backend\nustconnect"

# Start Frontend
Write-Host "Starting Frontend (Vite)..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c npm.cmd run dev" -WorkingDirectory ".\Frontend"

Write-Host "Application starting..." -ForegroundColor Cyan
Write-Host "Backend will be available at http://localhost:8081" -ForegroundColor Gray
Write-Host "Frontend will be available at http://localhost:5174" -ForegroundColor Gray
