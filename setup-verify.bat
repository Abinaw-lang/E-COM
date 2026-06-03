@echo off
REM E-Commerce Application - Setup Verification Script (Windows)
REM Color codes not supported in batch, using simple checks

cls
echo.
echo ========================================================
echo  E-Commerce Application - Setup Verification
echo ========================================================
echo.

REM Check Node.js
echo [1/7] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo + Node.js is installed: %NODE_VERSION%
) else (
    echo - Node.js is not installed. Please install Node.js v16+
    pause
    exit /b 1
)

REM Check npm
echo [2/7] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo + npm is installed: v%NPM_VERSION%
) else (
    echo - npm is not installed
    pause
    exit /b 1
)

REM Check Git
echo [3/7] Checking Git...
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo + Git is installed
) else (
    echo - Git is not installed (optional but recommended)
)

REM Check Backend .env
echo [4/7] Checking Backend configuration...
if exist "backend\.env" (
    echo + Backend .env file exists
    
    findstr "MONGODB_URI" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo   + MONGODB_URI is configured
    ) else (
        echo   - MONGODB_URI is missing
    )
    
    findstr "JWT_SECRET" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo   + JWT_SECRET is configured
    ) else (
        echo   - JWT_SECRET is missing
    )
    
    findstr "RAZORPAY_KEY_ID" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo   + RAZORPAY_KEY_ID is configured
    ) else (
        echo   - RAZORPAY_KEY_ID is missing
    )
) else (
    echo - Backend .env file not found
    echo   Run: copy backend\.env.example backend\.env
)

REM Check Frontend .env
echo [5/7] Checking Frontend configuration...
if exist "frontend\.env" (
    echo + Frontend .env file exists
    
    findstr "VITE_API_URL" frontend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo   + VITE_API_URL is configured
    ) else (
        echo   - VITE_API_URL is missing
    )
) else (
    echo - Frontend .env file not found
    echo   Run: copy frontend\.env.example frontend\.env
)

REM Check Backend dependencies
echo [6/7] Checking Backend dependencies...
if exist "backend\node_modules" (
    echo + Backend dependencies are installed
) else (
    echo - Backend dependencies not installed
    echo   Run: cd backend ^&^& npm install
)

REM Check Frontend dependencies
echo [7/7] Checking Frontend dependencies...
if exist "frontend\node_modules" (
    echo + Frontend dependencies are installed
) else (
    echo - Frontend dependencies not installed
    echo   Run: cd frontend ^&^& npm install
)

echo.
echo ========================================================
echo  Verification Complete
echo ========================================================
echo.
echo Next Steps:
echo 1. Ensure all environment variables are configured
echo 2. Start Backend:   cd backend ^&^& npm run dev
echo 3. Start Frontend:  cd frontend ^&^& npm run dev
echo 4. Open http://localhost:5173 in your browser
echo.
echo For detailed setup instructions, see QUICKSTART.md
echo.
pause
