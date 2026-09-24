@echo off
title Driver Mobile App Launcher
color 0b

echo ==================================================================
echo   Driver Mobile App - Launcher
echo ==================================================================
echo.
echo [1] Run Driver App on Mobile Device / Android Emulator (Recommended)
echo [2] Open Project in Android Studio IDE
echo.
set /p choice="Enter your choice (1 or 2, default is 1): "

if "%choice%"=="2" goto open_studio
goto run_app

:run_app
echo.
echo Starting Driver Mobile App on Device/Emulator...
powershell -ExecutionPolicy Bypass -File "%~dp0run_driver_mobile.ps1"
goto end

:open_studio
set "STUDIO_PATH=C:\Program Files\Android\Android Studio\bin\studio64.exe"
set "PROJECT_PATH=%~dp0frontend-mobile-driver\android"

if exist "%STUDIO_PATH%" (
    start "" "%STUDIO_PATH%" "%PROJECT_PATH%"
    echo Driver App project opened in Android Studio!
) else (
    echo Android Studio was not found at %STUDIO_PATH%.
    explorer "%PROJECT_PATH%"
)

:end
pause
