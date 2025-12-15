@echo off
title DI CHO TIEN LOI - LAUNCHER

echo ====================================================
echo      KHOI DONG HE THONG FULL-STACK (AUTO)
echo ====================================================

:: 1. Lay duong dan thu muc hien tai
set "PROJECT_ROOT=%~dp0"

:: 2. Cap nhat IP tu dong (Goi file python con)
echo [1/3] Dang kiem tra va cap nhat IP...
python "%PROJECT_ROOT%auto_update_ip.py"

:: 3. Mo cua so Backend
echo [2/3] Dang bat Server Backend (Node.js)...
start "Backend Server (Port 5000)" cmd /k "cd /d "%PROJECT_ROOT%" && node app.js"

:: 4. Mo cua so Frontend
echo [3/3] Dang bat App Frontend (Expo)...
:: Cho 2 giay de Server kip chay
timeout /t 2 >nul
start "Frontend App (Expo)" cmd /k "cd /d "%PROJECT_ROOT%\di-cho-tien-loi-app" && npx expo start -c"

echo.
echo ====================================================
echo             DA KHOI DONG XONG!
echo ====================================================
echo.
echo Hay quet ma QR o cua so Frontend de su dung.
echo (Ban co the thu nho cua so nay, dung tat no).
echo.
pause
