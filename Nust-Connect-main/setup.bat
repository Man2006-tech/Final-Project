@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ===================================================
echo Setting up NUST Connect Project...
echo ===================================================
echo.

:: Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if Java is installed
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH!
    echo Please install Java JDK 17 or higher
    pause
    exit /b 1
)

echo 1. Checking Backend (Spring Boot)...
echo Current Directory: %CD%
if exist "Backend\nustconnect\mvnw.cmd" (
    echo - Found Maven Wrapper.
    echo - Cleaning previous builds...
    cd "Backend\nustconnect"
    
    REM Clean any previous builds
    if exist "target" rmdir /s /q "target"
    
    echo - Installing Backend dependencies (this may take a few minutes)...
    call mvnw.cmd clean install -DskipTests -U
    if !errorlevel! neq 0 (
        echo.
        echo - ERROR: Backend build failed!
        echo - Common fixes:
        echo   1. Check if MySQL is running
        echo   2. Verify application.properties has correct DB credentials
        echo   3. Check if port 8081 is available
        echo   4. Try running: mvnw.cmd clean install -X for detailed logs
        cd /d "%~dp0"
        pause
        exit /b 1
    )
    cd /d "%~dp0"
    echo - Backend dependencies installed successfully!
) else (
    echo - ERROR: mvnw.cmd not found in Backend\nustconnect!
    echo - Please check if the folder structure is correct.
    echo - Expected path: %~dp0Backend\nustconnect\mvnw.cmd
    pause
    exit /b 1
)

echo.
echo 2. Checking Frontend (React + Vite)...
if exist "Frontend\package.json" (
    echo - Found package.json.
    
    REM Clean node_modules and package-lock if they exist
    cd "Frontend"
    if exist "node_modules" (
        echo - Removing old node_modules...
        rmdir /s /q "node_modules"
    )
    if exist "package-lock.json" (
        echo - Removing old package-lock.json...
        del /f /q "package-lock.json"
    )
    
    echo - Installing Frontend dependencies (this may take a few minutes)...
    call npm install --legacy-peer-deps
    if !errorlevel! neq 0 (
        echo.
        echo - ERROR: Frontend npm install failed!
        echo - Trying with --force flag...
        call npm install --force
        if !errorlevel! neq 0 (
            echo - ERROR: Still failed. Please check your internet connection.
            cd /d "%~dp0"
            pause
            exit /b 1
        )
    )
    
    REM Verify vite is installed
    if not exist "node_modules\.bin\vite.cmd" (
        echo - WARNING: Vite not found after installation!
        echo - Installing vite explicitly...
        call npm install vite --save-dev
    )
    
    cd /d "%~dp0"
    echo - Frontend dependencies installed successfully!
) else (
    echo - ERROR: package.json not found in Frontend!
    echo - Expected path: %~dp0Frontend\package.json
    pause
    exit /b 1
)

echo.
echo ===================================================
echo Setup Complete!
echo ===================================================
echo.
echo Next steps:
echo 1. Ensure MySQL is running on localhost:3306
echo 2. Create database 'nustconnect' if it doesn't exist
echo 3. Update Backend/nustconnect/src/main/resources/application.properties
echo    with your MySQL credentials
echo 4. Run run_project.bat to start the application
echo.
echo ===================================================
pause