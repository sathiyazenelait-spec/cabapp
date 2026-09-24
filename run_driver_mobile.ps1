param (
    [string]$AvdName
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PWD }

$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = $sdkPath }
$env:PATH = "$sdkPath\platform-tools;$sdkPath\emulator;$env:PATH"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  Driver Mobile App - Automated Device & Emulator Launcher" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check for Connected Devices (Physical Phone or already-running Emulator)
Write-Host "[1/4] Checking for connected Android devices or emulators..." -ForegroundColor Yellow
$adbExe = "$sdkPath\platform-tools\adb.exe"
$emulatorExe = "$sdkPath\emulator\emulator.exe"

if (-not (Test-Path $adbExe)) {
    Write-Host "Error: ADB not found at $adbExe. Please check Android SDK installation." -ForegroundColor Red
    pause
    exit 1
}

# Start ADB server
& $adbExe start-server | Out-Null

$rawDevices = & $adbExe devices
$connectedDevices = @($rawDevices | Where-Object { $_ -match "\bdevice\b" -and $_ -notmatch "List of devices" })

if ($connectedDevices.Count -gt 0) {
    Write-Host "  Found active Android device(s):" -ForegroundColor Green
    foreach ($dev in $connectedDevices) {
        Write-Host "  -> $dev" -ForegroundColor White
    }
} else {
    Write-Host "  No active Android device detected. Starting Android Emulator..." -ForegroundColor Yellow
    
    if (Test-Path $emulatorExe) {
        $rawAvds = & $emulatorExe -list-avds
        $avds = @($rawAvds | Where-Object { $_ -notmatch "^INFO" -and $_ -notmatch "^WARNING" -and $_.Trim() -ne "" })
        if ($avds -and $avds.Count -gt 0) {
            $selectedAvd = if ($AvdName) { $AvdName } else { $avds[0].Trim() }
            Write-Host "  -> Launching AVD: $selectedAvd ..." -ForegroundColor Cyan
            Start-Process -FilePath $emulatorExe -ArgumentList "-avd", $selectedAvd, "-gpu", "swiftshader_indirect", "-no-audio", "-no-snapshot-load"
            
            Write-Host "  -> Waiting for emulator to connect to ADB (this may take up to 2-3 minutes on cold boot)..." -ForegroundColor Yellow
            $deviceConnected = $false
            $timeoutSeconds = 180
            $elapsed = 0
            while (-not $deviceConnected -and $elapsed -lt $timeoutSeconds) {
                Start-Sleep -Seconds 3
                $elapsed += 3
                $devicesList = & $adbExe devices 2>$null
                if ($devicesList -match "\b(emulator-\d+|device)\s+device\b") {
                    $deviceConnected = $true
                }
            }

            if ($deviceConnected) {
                Write-Host "  -> Waiting for system boot to complete..." -ForegroundColor Yellow
                $booted = $false
                $bootElapsed = 0
                while (-not $booted -and $bootElapsed -lt 120) {
                    Start-Sleep -Seconds 3
                    $bootElapsed += 3
                    $bootStatus = & $adbExe shell getprop sys.boot_completed 2>$null
                    if ($bootStatus -match "1") {
                        $booted = $true
                    }
                }
                if ($booted) {
                    Write-Host "  Emulator booted and ready!" -ForegroundColor Green
                } else {
                    Write-Host "  Emulator device is connected, proceeding..." -ForegroundColor Yellow
                }
            } else {
                Write-Host "  Warning: Emulator took longer than expected to connect. Proceeding anyway..." -ForegroundColor Yellow
            }
        } else {
            Write-Host "  No Android Virtual Devices (AVD) found. Please connect your mobile phone with USB debugging enabled or create an AVD in Android Studio." -ForegroundColor Red
        }
    } else {
        Write-Host "  Emulator executable not found at $emulatorExe" -ForegroundColor Red
    }
}

# 2. Reverse Ports for React Native Metro and Driver Backend API
Write-Host "`n[2/4] Configuring network reverse ports (Metro: 8091, Driver Backend: 8084)..." -ForegroundColor Yellow
& $adbExe reverse tcp:8091 tcp:8091 2>$null
& $adbExe reverse tcp:8084 tcp:8084 2>$null
& $adbExe reverse tcp:8081 tcp:8091 2>$null
& $adbExe reverse tcp:8081 tcp:8081 2>$null
Write-Host "  Ports reversed successfully." -ForegroundColor Green

# 3. Start Metro Bundler in Dedicated Window
Write-Host "`n[3/4] Launching Driver App Metro Bundler on Port 8091..." -ForegroundColor Yellow
$driverAppDir = Join-Path $ScriptDir "frontend-mobile-driver"

$metroCmd = "`$Host.UI.RawUI.WindowTitle = 'Driver-Mobile-Metro (Port 8091)'; Write-Host '=========================================' -ForegroundColor Cyan; Write-Host ' Driver Mobile App Metro Bundler (Port 8091)' -ForegroundColor Green; Write-Host '=========================================' -ForegroundColor Cyan; npx react-native start --port 8091"
Start-Process powershell -WorkingDirectory $driverAppDir -ArgumentList "-NoExit", "-Command", $metroCmd

# 4. Build and Run the App on the Device/Emulator
Write-Host "`n[4/4] Building and launching Driver App on your mobile / emulator..." -ForegroundColor Yellow
Set-Location $driverAppDir
& npx react-native run-android --port 8091

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host "  Driver Mobile App is running!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
