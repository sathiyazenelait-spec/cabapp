@echo off
title Start Android Emulator
color 0b

echo ==================================================================
echo   Starting Android Virtual Device (AVD) GUI Emulator
echo ==================================================================
echo.

set "EMU_PATH=%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe"
if not exist "%EMU_PATH%" (
    echo Error: Android Emulator not found at %EMU_PATH%
    pause
    exit /b 1
)

echo Launching Pixel 3a Emulator...
start "" "%EMU_PATH%" -avd Pixel_3a_API_34_extension_level_7_x86_64 -no-snapshot-load -gpu auto

echo Emulator window launched!
timeout /t 3 >nul
exit /b 0
