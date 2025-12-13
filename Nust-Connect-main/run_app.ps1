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






now do the next pages complete 
Complaints
events
jobs
LostFound
Marketplace
Rides
in separate files also tell if any other file needs changes
make separet files not one and also tell if code is changing in another file as well so changes are made side by side and also tell where to modify code and where to create any new file with folder and make it very beautiful dynamic kind of