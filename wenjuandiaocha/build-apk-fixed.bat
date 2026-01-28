@echo off

echo ====================================
echo YunHuTongXin App - APK Build Script
echo ====================================
echo.

:: Set environment variables
set NODE_PATH=C:\Program Files\nodejs
set NPM_PATH=C:\Program Files\nodejs
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\zszs7\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\zszs7\AppData\Local\Android\Sdk

:: Add paths to PATH
set PATH=%NODE_PATH%;%NPM_PATH%;%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

:: Check if Node.js is installed
if not exist "%NODE_PATH%\node.exe" (
    echo ERROR: Node.js not found
    echo Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js installed

:: Check if npm is installed
if not exist "%NPM_PATH%\npm.cmd" (
    echo ERROR: npm not found
    pause
    exit /b 1
)

echo [OK] npm installed

:: Check if Java is installed
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo ERROR: Java not found
    echo Please ensure Android Studio is properly installed
    pause
    exit /b 1
)

echo [OK] Java installed

:: Check if Android SDK is installed
if not exist "%ANDROID_HOME%\platform-tools" (
    echo ERROR: Android SDK not found
    echo Please ensure Android Studio is properly installed
    pause
    exit /b 1
)

echo [OK] Android SDK installed

:: Install Cordova
echo Installing Apache Cordova...
"%NPM_PATH%\npm.cmd" install -g cordova
if %errorlevel% neq 0 (
    echo ERROR: Cordova installation failed
    pause
    exit /b 1
)

echo [OK] Cordova installed

:: Check if Cordova is installed successfully
if not exist "%APPDATA%\npm\cordova.cmd" (
    echo ERROR: Cordova command not found
    pause
    exit /b 1
)

echo [OK] Cordova command available

:: Create Cordova project
echo Creating Cordova project...
if exist "yunhutongxin" (
    echo Project directory exists, cleaning...
    rd /s /q "yunhutongxin"
)

"%APPDATA%\npm\cordova.cmd" create yunhutongxin com.yunhutongxin.app "YunHuTongXin"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create Cordova project
    pause
    exit /b 1
)

echo [OK] Cordova project created

:: Enter project directory
cd yunhutongxin

:: Add Android platform
echo Adding Android platform...
"%APPDATA%\npm\cordova.cmd" platform add android
if %errorlevel% neq 0 (
    echo ERROR: Failed to add Android platform
    pause
    exit /b 1
)

echo [OK] Android platform added

:: Copy application files
echo Copying application files...
if exist "www" (
    rd /s /q "www"
)

mkdir www
copy "..\index.html" "www\index.html"
copy "..\script.js" "www\script.js"
copy "..\styles.css" "www\styles.css"

if %errorlevel% neq 0 (
    echo ERROR: Failed to copy application files
    pause
    exit /b 1
)

echo [OK] Application files copied

:: Build APK
echo Building APK file...
echo Note: First build may take a long time, please be patient...
"%APPDATA%\npm\cordova.cmd" build android
if %errorlevel% neq 0 (
    echo ERROR: Failed to build APK
    echo Please check if Android Studio is properly installed and SDK is complete
    pause
    exit /b 1
)

echo [OK] APK built successfully

:: Find APK file
for /r "platforms\android" %%f in (*.apk) do (
    set "apk_file=%%f"
)

if defined apk_file (
    echo.
    echo ====================================
    echo APK Build Complete!
    echo ====================================
    echo APK location: %apk_file%
    echo.
    echo Please transfer this APK file to your Android device and install
    echo ====================================
) else (
    echo ERROR: APK file not found
    pause
    exit /b 1
)

:: Exit
echo.
echo Press any key to exit...
pause >nul
exit /b 0
