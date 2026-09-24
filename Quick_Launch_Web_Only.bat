@echo off
title School & College Cab Management - Web Prototype Simulator
color 0a

echo ==================================================================
echo   Opening Web Prototype Simulator (Vite + React)
echo ==================================================================
echo.
echo Starting Web Server at http://localhost:5173 and opening browser...
echo.

cd /d "%~dp0web-prototype"
node ./node_modules/vite/bin/vite.js --open

pause
