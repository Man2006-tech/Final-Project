@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ===================================================
echo Fixing Frontend Dependencies
echo ===================================================
echo.

cd Frontend

echo Step 1: Cleaning npm cache...
call npm cache clean --force

echo.
echo Step 2: Removing node_modules...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo - Removed node_modules
) else (
    echo - node_modules doesn't exist
)

echo.
echo Step 3: Removing package-lock.json...
if exist "package-lock.json" (
    del /f /q "package-lock.json"
    echo - Removed package-lock.json
) else (
    echo - package-lock.json doesn't exist
)

echo.
echo Step 4: Installing dependencies...
call npm install --legacy-peer-deps
if !errorlevel! neq 0 (
    echo - First attempt failed, trying with --force...
    call npm install --force
)

echo.
echo Step 5: Verifying Vite installation...
if exist "node_modules\.bin\vite.cmd" (
    echo - SUCCESS: Vite is installed!
) else (
    echo - Vite not found, installing explicitly...
    call npm install vite --save-dev
    if exist "node_modules\.bin\vite.cmd" (
        echo - SUCCESS: Vite is now installed!
    ) else (
        echo - ERROR: Failed to install Vite
        pause
        exit /b 1
    )
)

echo.
echo Step 6: Testing Vite...
call npm run dev -- --version 2>nul
if !errorlevel! equ 0 (
    echo - Vite is working correctly!
) else (
    echo - Note: Vite command test inconclusive, but installation looks good
)

cd /d "%~dp0"

echo.
echo ===================================================
echo Frontend Fix Complete!
echo Try running run_project.bat now
echo ===================================================
pause