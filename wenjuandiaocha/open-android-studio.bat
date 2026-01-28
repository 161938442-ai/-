@echo off

echo ====================================
echo Opening Android Studio Project
echo ====================================
echo.

:: Check if Android Studio is installed
if not exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    echo ERROR: Android Studio not found
    echo Please install Android Studio first
    pause
    exit /b 1
)

echo Opening Android Studio...
echo Project location: %~dp0yunhutongxin\platforms\android
echo.

:: Open Android Studio with the project
"C:\Program Files\Android\Android Studio\bin\studio64.exe" "%~dp0yunhutongxin\platforms\android"

echo.
echo ====================================
echo Next Steps:
echo ====================================
echo 1. Wait for Gradle sync to complete
echo 2. Click: Build > Build Bundle(s) / APK(s) > Build APK(s)
echo 3. Wait for build to complete
echo 4. Click "locate" to find the APK file
echo ====================================
echo.

pause
