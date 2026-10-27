@echo off
cd /d "%~dp0"
echo ==============================================
echo   Mad Vervet PMS - dev server
echo   Open:  http://localhost:5173
echo   Stop:  press Ctrl+C in this window
echo ==============================================
call npm run dev
