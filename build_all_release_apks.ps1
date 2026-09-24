# ==============================================================================
# SafePassage AI - Standalone Production APK Builder & Deployer
# Builds standalone Android APKs for Parent, Driver, and Student/Working Apps
# ==============================================================================

param (
    [switch]$InstallOnEmulator,
    [string]$TargetApp = "all" # options: "all", "parent", "driver", "student"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PWD }

$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = $sdkPath }
$env:PATH = "$sdkPath\platform-tools;$sdkPath\emulator;$env:PATH"

$adbExe = "$sdkPath\platform-tools\adb.exe"
$distDir = Join-Path $ScriptDir "dist-apks"

if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  SafePassage AI - Standalone Release APK Builder" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "Output Directory: $distDir" -ForegroundColor Yellow
Write-Host ""

function Build-AppReleaseApk {
    param (
        [string]$AppName,
        [string]$AppFolderName,
        [string]$OutputApkName
    )

    Write-Host "`n>>> [BUILDING] $AppName from ./$AppFolderName ..." -ForegroundColor Cyan
    $appPath = Join-Path $ScriptDir $AppFolderName
    $androidPath = Join-Path $appPath "android"

    if (-not (Test-Path $androidPath)) {
        Write-Host "  [WARN] Android directory not found at $androidPath. Skipping." -ForegroundColor Yellow
        return
    }

    Push-Location $androidPath
    try {
        Write-Host "  -> Running Gradle release build (./gradlew assembleRelease)..." -ForegroundColor White
        
        if ($IsWindows -or $env:OS -match "Windows") {
            & .\gradlew.bat assembleRelease
        } else {
            & ./gradlew assembleRelease
        }

        $generatedApk = Join-Path $androidPath "app\build\outputs\apk\release\app-release.apk"
        if (-not (Test-Path $generatedApk)) {
            $generatedApk = Join-Path $androidPath "app\build\outputs\apk\release\app-release-unsigned.apk"
        }

        if (Test-Path $generatedApk) {
            $targetPath = Join-Path $distDir $OutputApkName
            Copy-Item -Path $generatedApk -Destination $targetPath -Force
            Write-Host "  [SUCCESS] $OutputApkName created at $targetPath" -ForegroundColor Green

            if ($InstallOnEmulator -and (Test-Path $adbExe)) {
                Write-Host "  -> Installing $OutputApkName to active Android Emulator / Phone..." -ForegroundColor Cyan
                & $adbExe install -r $targetPath
                Write-Host "  [INSTALLED] App installed on device successfully!" -ForegroundColor Green
            }
        } else {
            Write-Host "  [ERROR] Release APK was not found at expected path: $generatedApk" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  [BUILD ERROR] Failed to compile $AppName : $_" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }
}

# 1. Build Parent App
if ($TargetApp -eq "all" -or $TargetApp -eq "parent") {
    Build-AppReleaseApk -AppName "Parent Live Tracking App" -AppFolderName "frontend-mobile-parent" -OutputApkName "SafePassage_Parent_v2.4.apk"
}

# 2. Build Driver App
if ($TargetApp -eq "all" -or $TargetApp -eq "driver") {
    Build-AppReleaseApk -AppName "Driver & Fleet Cockpit App" -AppFolderName "frontend-mobile-driver" -OutputApkName "SafePassage_Driver_Fleet_v2.4.apk"
}

# 3. Build Student App
if ($TargetApp -eq "all" -or $TargetApp -eq "student") {
    Build-AppReleaseApk -AppName "Student & Professional Pass App" -AppFolderName "frontend-mobile" -OutputApkName "SafePassage_Student_Pass_v2.4.apk"
}

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host "  All standalone APKs are compiled and stored in: $distDir" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
