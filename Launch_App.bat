@echo off
cd /d "%~dp0"
title School & College Cab Management System - Launcher
color 0b

echo ==================================================================
echo   School & College Cab Management System - App Launcher
echo ==================================================================
echo.
echo [1/3] Checking MySQL & Database setup...
echo [2/3] Launching Spring Boot Microservice Backends & Web App...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0run_backend_and_portal.ps1"

pause
