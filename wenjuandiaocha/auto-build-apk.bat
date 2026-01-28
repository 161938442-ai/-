@echo off
setlocal enabledelayedexpansion

set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\zszs7\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools;%PATH%

cd /d "%~dp0"

echo ====================================
echo Automated APK Build Script
echo ====================================
echo.

echo Method 1: Using Cordova CLI
echo.

cd ..\..
call cordova build android

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo Build successful using Cordova CLI!
    echo ====================================
    echo.
    echo APK location: platforms\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    goto :success
)

echo.
echo ====================================
echo Cordova CLI failed, trying Method 2
echo ====================================
echo.

cd platforms\android

echo Method 2: Using Gradle directly
echo.

if exist "gradlew.bat" (
    call gradlew.bat assembleDebug
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ====================================
        echo Build successful using Gradle!
        echo ====================================
        echo.
        echo APK location: app\build\outputs\apk\debug\app-debug.apk
        echo.
        goto :success
    )
)

echo.
echo ====================================
echo All automated methods failed
echo ====================================
echo.
echo Please use Android Studio to build manually:
echo 1. Run open-and-build.bat
echo 2. Wait for Android Studio to open
echo 3. Click Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo 4. Wait for build to complete
echo.
goto :end

:success
echo.
echo ====================================
echo Build completed successfully!
echo ====================================
echo.
echo You can find the APK at:
echo platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo.

:end
endlocal
pause
