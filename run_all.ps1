# Run all Backends, Web Portal, and Mobile Apps for School & College Cab Management System
param (
    [switch]$NoWeb,
    [switch]$NoMobile,
    [switch]$NoBackend,
    [switch]$RunAndroid
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PWD }
Set-Location $ScriptDir

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "  School & College Cab Management System - Master Runner" -ForegroundColor Green
Write-Host "==========================================================================" -ForegroundColor Cyan

# 1. Start 5 Spring Boot Microservice Backends
if (-not $NoBackend) {
    $BackendServices = @(
        @{ Path = "backends\backend-super-admin"; Port = 8082; Name = "Super-Admin-Backend" },
        @{ Path = "backends\backend-cab-owner";   Port = 8083; Name = "Cab-Owner-Backend" },
        @{ Path = "backends\backend-driver";      Port = 8084; Name = "Driver-Backend" },
        @{ Path = "backends\backend-parent";      Port = 8085; Name = "Parent-Backend" },
        @{ Path = "backends\backend-student-work";Port = 8086; Name = "Student-Work-Backend" }
    )

    Write-Host "`n[1/3] Launching 5 Backend Microservices..." -ForegroundColor Yellow
    foreach ($service in $BackendServices) {
        $fullPath = Join-Path $ScriptDir $service.Path
        $name = $service.Name
        $port = $service.Port
        
        if (Test-Path "$fullPath\pom.xml") {
            Write-Host "  -> Starting $name (Port $port)..." -ForegroundColor White
            $cmd = "`$Host.UI.RawUI.WindowTitle = '$name (Port $port)'; Write-Host '=========================================' -ForegroundColor Cyan; Write-Host ' Starting $name on port $port...' -ForegroundColor Green; Write-Host '=========================================' -ForegroundColor Cyan; .\mvnw.cmd spring-boot:run"
            Start-Process powershell -WorkingDirectory $fullPath -ArgumentList "-NoExit", "-Command", $cmd
        } else {
            Write-Warning "Could not find pom.xml in $fullPath"
        }
    }
}

# 2. Start Web Portal (Vite Frontend)
if (-not $NoWeb) {
    Write-Host "`n[2/3] Launching Web Portal Simulator..." -ForegroundColor Yellow
    $WebPath = Join-Path $ScriptDir "web-prototype"

    if (Test-Path "$WebPath\package.json") {
        Write-Host "  -> Starting Web Portal on http://localhost:5173..." -ForegroundColor White
        $cmd = "`$Host.UI.RawUI.WindowTitle = 'Web-Portal-Vite (Port 5173)'; Write-Host '=========================================' -ForegroundColor Cyan; Write-Host ' Starting Web Portal on http://localhost:5173...' -ForegroundColor Green; Write-Host '=========================================' -ForegroundColor Cyan; npm run dev -- --open"
        Start-Process powershell -WorkingDirectory $WebPath -ArgumentList "-NoExit", "-Command", $cmd
    } else {
        Write-Warning "Could not find web-prototype/package.json"
    }
}

# 3. Start 4 React Native Mobile Apps
# Distinct Metro bundler ports to prevent conflicts with backend services (8082-8086) and each other:
# - Student/Professional app: Port 8081
# - Driver app: Port 8091
# - Parent app: Port 8092
# - Super Admin app: Port 8093
if (-not $NoMobile) {
    $MobileApps = @(
        @{ Path = "frontend-mobile";        Port = 8081; Name = "Student-Mobile-App" },
        @{ Path = "frontend-mobile-driver"; Port = 8091; Name = "Driver-Mobile-App" },
        @{ Path = "frontend-mobile-parent"; Port = 8092; Name = "Parent-Mobile-App" },
        @{ Path = "frontend-mobile-admin";  Port = 8093; Name = "Super-Admin-Mobile-App" }
    )

    Write-Host "`n[3/3] Launching 4 React Native Mobile Bundlers..." -ForegroundColor Yellow
    foreach ($app in $MobileApps) {
        $fullPath = Join-Path $ScriptDir $app.Path
        $name = $app.Name
        $port = $app.Port
        
        if (Test-Path "$fullPath\package.json") {
            if ($RunAndroid) {
                Write-Host "  -> Launching Android Build for $name on Port $port..." -ForegroundColor White
                $cmd = "`$Host.UI.RawUI.WindowTitle = '$name (Port $port)'; Write-Host '=========================================' -ForegroundColor Cyan; Write-Host ' Starting $name on port $port...' -ForegroundColor Green; Write-Host '=========================================' -ForegroundColor Cyan; npx react-native run-android --port $port"
                Start-Process powershell -WorkingDirectory $fullPath -ArgumentList "-NoExit", "-Command", $cmd
            } else {
                Write-Host "  -> Starting Metro Bundler for $name on Port $port..." -ForegroundColor White
                $cmd = "`$Host.UI.RawUI.WindowTitle = '$name (Port $port)'; Write-Host '=========================================' -ForegroundColor Cyan; Write-Host ' Starting Metro Bundler for $name on port $port...' -ForegroundColor Green; Write-Host '=========================================' -ForegroundColor Cyan; npx react-native start --port $port"
                Start-Process powershell -WorkingDirectory $fullPath -ArgumentList "-NoExit", "-Command", $cmd
            }
        } else {
            Write-Warning "Could not find package.json in $fullPath"
        }
    }
}

Write-Host "`n==========================================================================" -ForegroundColor Cyan
Write-Host "  All Services Successfully Launched!" -ForegroundColor Green
Write-Host "  ----------------------------------------------------------------------" -ForegroundColor Gray
Write-Host "  [Web Portal]             http://localhost:5173" -ForegroundColor White
Write-Host "  [Super Admin Backend]    http://localhost:8082" -ForegroundColor Gray
Write-Host "  [Cab Owner Backend]      http://localhost:8083" -ForegroundColor Gray
Write-Host "  [Driver Backend]         http://localhost:8084" -ForegroundColor Gray
Write-Host "  [Parent Backend]         http://localhost:8085" -ForegroundColor Gray
Write-Host "  [Student Work Backend]   http://localhost:8086" -ForegroundColor Gray
Write-Host "  [Student Mobile Metro]   http://localhost:8081" -ForegroundColor Gray
Write-Host "  [Driver Mobile Metro]    http://localhost:8091" -ForegroundColor Gray
Write-Host "  [Parent Mobile Metro]    http://localhost:8092" -ForegroundColor Gray
Write-Host "  [Admin Mobile Metro]     http://localhost:8093" -ForegroundColor Gray
Write-Host "==========================================================================" -ForegroundColor Cyan

