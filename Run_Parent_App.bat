@echo off
cd /d "%~dp0"
title Launch Parent Mobile App on Phone / Emulator
color 0a

echo ==================================================================
echo   Starting Parent Mobile App (Mobile Phone / Emulator Launcher)
echo ==================================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0run_parent_mobile.ps1"

pause
