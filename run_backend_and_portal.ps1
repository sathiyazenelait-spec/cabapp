# Run all Backends and the Web Portal for School & College Cab Management System
param (
    [switch]$NoBrowser
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = $PWD }
Set-Location $ScriptDir

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  School & College Cab Management System - Microservices & Portal  " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. Start Spring Boot Microservice Backends
$BackendServices = @(
    @{ Path = "backends\backend-super-admin"; Port = 8082; Name = "Super-Admin-Backend" },
    @{ Path = "backends\backend-cab-owner";   Port = 8083; Name = "Cab-Owner-Backend" },
    @{ Path = "backends\backend-driver";      Port = 8084; Name = "Driver-Backend" },
    @{ Path = "backends\backend-parent";      Port = 8085; Name = "Parent-Backend" },
    @{ Path = "backends\backend-student-work";Port = 8086; Name = "Student-Work-Backend" }
)

Write-Host "`n[1/2] Launching 5 Backend Microservices..." -ForegroundColor Yellow
foreach ($service in $BackendServices) {
    $fullPath = Join-Path $ScriptDir $service.Path
    $name = $service.Name
    $port = $service.Port
    
    if (Test-Path "$fullPath\pom.xml") {
        Write-Host "  -> Starting $name (Port $port)..." -ForegroundColor White
        $cmd = "Write-Host '=========================================' -ForegroundColor Cyan; Write-Host ' Starting $name on port $port...' -ForegroundColor Green; Write-Host '=========================================' -ForegroundColor Cyan; .\mvnw.cmd spring-boot:run"
        Start-Process powershell -WorkingDirectory $fullPath -ArgumentList "-NoExit", "-Command", $cmd
    } else {
        Write-Warning "Could not find pom.xml in $fullPath"
    }
}

# 2. Start Vite Web Portal
Write-Host "`n[2/2] Launching Web Portal Simulator..." -ForegroundColor Yellow
$WebPath = Join-Path $ScriptDir "web-prototype"

if (Test-Path "$WebPath\package.json") {
    Write-Host "  -> Starting Web Portal on http://localhost:5173..." -ForegroundColor Green
    $openArg = if ($NoBrowser) { "" } else { "--open" }
    $cmd = "Write-Host '=========================================' -ForegroundColor Cyan; Write-Host ' Starting Web Portal on port 5173...' -ForegroundColor Green; Write-Host '=========================================' -ForegroundColor Cyan; node ./node_modules/vite/bin/vite.js $openArg"
    Start-Process powershell -WorkingDirectory $WebPath -ArgumentList "-NoExit", "-Command", $cmd
} else {
    Write-Warning "Could not find web-prototype/package.json"
}

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host "  Services Initiated Successfully!" -ForegroundColor Green
Write-Host "  - Web Portal:          http://localhost:5173" -ForegroundColor White
Write-Host "  - Super Admin Backend: http://localhost:8082" -ForegroundColor Gray
Write-Host "  - Cab Owner Backend:   http://localhost:8083" -ForegroundColor Gray
Write-Host "  - Driver Backend:      http://localhost:8084" -ForegroundColor Gray
Write-Host "  - Parent Backend:      http://localhost:8085" -ForegroundColor Gray
Write-Host "  - Student Work Backend:http://localhost:8086" -ForegroundColor Gray
Write-Host "==================================================================" -ForegroundColor Cyan
