@echo off
echo Starting BookVault Library Management System...
echo.

echo Starting PHP Backend...
start "PHP Backend" cmd /k "cd /d C:\Users\ADMIN\library_management_system\backend && php -S localhost:8000 -t public"

timeout /t 3 /nobreak > nul

echo Creating Admin User...
cd /d C:\Users\ADMIN\library_management_system\backend
php create-admin.php

timeout /t 2 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d C:\Users\ADMIN\library_management_system\frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo Opening Browser...
start http://localhost:5173

echo.
echo BookVault is running!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo.
echo Admin Login:
echo Email:    admin@library.com
echo Password: admin123
echo.
pause