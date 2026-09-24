@echo off
cd /d "%~dp0"
title Launch Driver Mobile App on Phone / Emulator
color 0b

echo ==================================================================
echo   Starting Driver Mobile App (Mobile Phone / Emulator Launcher)
echo ==================================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0run_driver_mobile.ps1"

pause
