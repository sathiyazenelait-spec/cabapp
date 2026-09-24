$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PWD }

$ws = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')

# 1. Main System Shortcut
$mainBat = Join-Path $ScriptDir "Launch_App.bat"
$s1 = $ws.CreateShortcut((Join-Path $desktop "School Cab Management System.lnk"))
$s1.TargetPath = $mainBat
$s1.WorkingDirectory = $ScriptDir
$s1.Description = "Launch School & College Cab Management System (Backends & Web Portal)"
$s1.IconLocation = "$env:SystemRoot\System32\shell32.dll,14"
$s1.Save()

# 2. Parent App Mobile Runner Shortcut
$parentBat = Join-Path $ScriptDir "Run_Parent_App.bat"
$s2 = $ws.CreateShortcut((Join-Path $desktop "Run Parent App (Mobile & Emulator).lnk"))
$s2.TargetPath = $parentBat
$s2.WorkingDirectory = $ScriptDir
$s2.Description = "Run Parent App directly on connected Mobile Device or Android Emulator"
$s2.IconLocation = "$env:SystemRoot\System32\shell32.dll,15"
$s2.Save()

# Also update Open Parent App (Android Studio).lnk to directly run the app
$s2Old = $ws.CreateShortcut((Join-Path $desktop "Open Parent App (Android Studio).lnk"))
$s2Old.TargetPath = $parentBat
$s2Old.WorkingDirectory = $ScriptDir
$s2Old.Description = "Run Parent App directly on Mobile Device or Emulator"
$s2Old.IconLocation = "$env:SystemRoot\System32\shell32.dll,15"
$s2Old.Save()

# 3. Driver App Mobile Runner Shortcut
$driverBat = Join-Path $ScriptDir "Run_Driver_App.bat"
$s3 = $ws.CreateShortcut((Join-Path $desktop "Run Driver App (Mobile & Emulator).lnk"))
$s3.TargetPath = $driverBat
$s3.WorkingDirectory = $ScriptDir
$s3.Description = "Run Driver App directly on connected Mobile Device or Android Emulator"
$s3.IconLocation = "$env:SystemRoot\System32\shell32.dll,43"
$s3.Save()

# Also update Open Driver App (Android Studio).lnk
$s3Old = $ws.CreateShortcut((Join-Path $desktop "Open Driver App (Android Studio).lnk"))
$s3Old.TargetPath = $driverBat
$s3Old.WorkingDirectory = $ScriptDir
$s3Old.Description = "Run Driver App directly on Mobile Device or Emulator"
$s3Old.IconLocation = "$env:SystemRoot\System32\shell32.dll,43"
$s3Old.Save()

# 4. Android Emulator Shortcut
$emuBat = Join-Path $ScriptDir "Start_Android_Emulator.bat"
$s4 = $ws.CreateShortcut((Join-Path $desktop "Start Android Emulator.lnk"))
$s4.TargetPath = $emuBat
$s4.WorkingDirectory = $ScriptDir
$s4.Description = "Start Android Emulator GUI Window"
$s4.IconLocation = "$env:SystemRoot\System32\shell32.dll,18"
$s4.Save()

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  Desktop Shortcuts Created & Updated Successfully!" -ForegroundColor Green
Write-Host "  1. School Cab Management System.lnk" -ForegroundColor White
Write-Host "  2. Run Parent App (Mobile & Emulator).lnk" -ForegroundColor White
Write-Host "  3. Run Driver App (Mobile & Emulator).lnk" -ForegroundColor White
Write-Host "  4. Start Android Emulator.lnk" -ForegroundColor White
Write-Host "==================================================================" -ForegroundColor Cyan
