# YunHuTongXin App - APK Build Script (PowerShell)

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "YunHuTongXin App - APK Build Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:Path = "C:\Program Files\nodejs;C:\Program Files\Android\Android Studio\jbr\bin;C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools;C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\tools;C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\tools\bin;" + $env:Path
$env:NODE_PATH = "C:\Program Files\nodejs"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"

# Check if Node.js is installed
if (-not (Test-Path "C:\Program Files\nodejs\node.exe")) {
    Write-Host "ERROR: Node.js not found" -ForegroundColor Red
    Write-Host "Please download and install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Node.js installed" -ForegroundColor Green

# Check if npm is installed
if (-not (Test-Path "C:\Program Files\nodejs\npm.cmd")) {
    Write-Host "ERROR: npm not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] npm installed" -ForegroundColor Green

# Check if Java is installed
if (-not (Test-Path "C:\Program Files\Android\Android Studio\jbr\bin\java.exe")) {
    Write-Host "ERROR: Java not found" -ForegroundColor Red
    Write-Host "Please ensure Android Studio is properly installed" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Java installed" -ForegroundColor Green

# Check if Android SDK is installed
if (-not (Test-Path "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools")) {
    Write-Host "ERROR: Android SDK not found" -ForegroundColor Red
    Write-Host "Please ensure Android Studio is properly installed" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Android SDK installed" -ForegroundColor Green

# Check if Cordova is installed
$cordovaPath = "$env:APPDATA\npm\cordova.cmd"
if (-not (Test-Path $cordovaPath)) {
    Write-Host "Installing Apache Cordova..." -ForegroundColor Yellow
    & "C:\Program Files\nodejs\npm.cmd" install -g cordova
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Cordova installation failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Cordova installed" -ForegroundColor Green
} else {
    Write-Host "[OK] Cordova already installed" -ForegroundColor Green
}

# Check if Cordova is available
if (-not (Test-Path $cordovaPath)) {
    Write-Host "ERROR: Cordova command not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Cordova command available" -ForegroundColor Green

# Create Cordova project
Write-Host "Creating Cordova project..." -ForegroundColor Yellow
if (Test-Path "yunhutongxin") {
    Write-Host "Project directory exists, cleaning..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "yunhutongxin"
}

& $cordovaPath create yunhutongxin com.yunhutongxin.app "YunHuTongXin"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create Cordova project" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Cordova project created" -ForegroundColor Green

# Enter project directory
Set-Location "yunhutongxin"

# Add Android platform
Write-Host "Adding Android platform..." -ForegroundColor Yellow
& $cordovaPath platform add android
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to add Android platform" -ForegroundColor Red
    Set-Location ".."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Android platform added" -ForegroundColor Green

# Copy application files
Write-Host "Copying application files..." -ForegroundColor Yellow
if (Test-Path "www") {
    Remove-Item -Recurse -Force "www"
}

New-Item -ItemType Directory -Path "www" | Out-Null
Copy-Item "..\index.html" "www\index.html"
Copy-Item "..\script.js" "www\script.js"
Copy-Item "..\styles.css" "www\styles.css"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to copy application files" -ForegroundColor Red
    Set-Location ".."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Application files copied" -ForegroundColor Green

# Build APK
Write-Host "Building APK file..." -ForegroundColor Yellow
Write-Host "Note: First build may take a long time, please be patient..." -ForegroundColor Cyan
& $cordovaPath build android
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to build APK" -ForegroundColor Red
    Write-Host "Please check if Android Studio is properly installed and SDK is complete" -ForegroundColor Yellow
    Set-Location ".."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] APK built successfully" -ForegroundColor Green

# Find APK file
$apkFile = Get-ChildItem -Path "platforms\android" -Filter "*.apk" -Recurse | Select-Object -First 1

if ($apkFile) {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "APK Build Complete!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "APK location: $($apkFile.FullName)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please transfer this APK file to your Android device and install" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Green
} else {
    Write-Host "ERROR: APK file not found" -ForegroundColor Red
    Set-Location ".."
    Read-Host "Press Enter to exit"
    exit 1
}

# Exit
Set-Location ".."
Write-Host ""
Read-Host "Press Enter to exit"
exit 0
