Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Check Installation Status" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Node.js is installed" -ForegroundColor Green
        Write-Host "Version: $nodeVersion" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please download and install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host "After installation, please restart your computer" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please download and install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, please restart your computer" -ForegroundColor Yellow
}
Write-Host ""

# Check npm
Write-Host "[2/4] Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] npm is installed" -ForegroundColor Green
        Write-Host "Version: $npmVersion" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] npm is not installed or not in PATH" -ForegroundColor Red
        Write-Host "npm should be installed with Node.js" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "npm should be installed with Node.js" -ForegroundColor Yellow
}
Write-Host ""

# Check Java
Write-Host "[3/4] Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Java is installed" -ForegroundColor Green
        Write-Host "Version: $javaVersion" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] Java is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Android Studio should include Java, please ensure Android Studio is properly installed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Android Studio should include Java, please ensure Android Studio is properly installed" -ForegroundColor Yellow
}
Write-Host ""

# Check Android SDK
Write-Host "[4/4] Checking Android SDK installation..." -ForegroundColor Yellow
$androidHome = $env:ANDROID_HOME
if ([string]::IsNullOrEmpty($androidHome)) {
    # Try to find Android SDK in common locations
    $possiblePaths = @(
        "$env:LOCALAPPDATA\Android\Sdk",
        "C:\Android\Sdk",
        "$env:APPDATA\..\Local\Android\Sdk"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $androidHome = $path
            break
        }
    }
}

if (-not [string]::IsNullOrEmpty($androidHome)) {
    Write-Host "[OK] Android SDK is installed" -ForegroundColor Green
    Write-Host "Path: $androidHome" -ForegroundColor Gray
} else {
    Write-Host "[ERROR] Android SDK not found" -ForegroundColor Red
    Write-Host "Please ensure Android Studio is properly installed and SDK is downloaded" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Installation Status Summary" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$nodeInstalled = $false
try {
    node -v | Out-Null
    $nodeInstalled = $true
} catch {}

if ($nodeInstalled) {
    Write-Host "[OK] Basic components are installed, you can proceed to build APK" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Run build-apk.bat script" -ForegroundColor Yellow
} else {
    Write-Host "[ERROR] Some components are not installed, please complete installation first" -ForegroundColor Red
    Write-Host ""
    Write-Host "Required components:" -ForegroundColor Yellow
    Write-Host "  1. Node.js - Download from: https://nodejs.org/" -ForegroundColor White
    Write-Host "  2. Android Studio - Download from: https://developer.android.com/studio" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, please restart your computer and run this script again" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")