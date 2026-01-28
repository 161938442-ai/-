@echo off

echo ====================================
echo Fix Android Studio Stuck Issue
echo ====================================
echo.

echo Step 1: Closing Android Studio...
taskkill /F /IM studio64.exe 2>nul
taskkill /F /IM java.exe 2>nul
timeout /t 2 >nul

echo Step 2: Cleaning Gradle cache...
if exist "%USERPROFILE%\.gradle\caches" (
    echo Deleting Gradle cache...
    rd /s /q "%USERPROFILE%\.gradle\caches"
)

echo Step 3: Cleaning project build files...
if exist "yunhutongxin\platforms\android\.gradle" (
    echo Deleting project .gradle folder...
    rd /s /q "yunhutongxin\platforms\android\.gradle"
)

if exist "yunhutongxin\platforms\android\app\build" (
    echo Deleting app build folder...
    rd /s /q "yunhutongxin\platforms\android\app\build"
)

if exist "yunhutongxin\platforms\android\build" (
    echo Deleting build folder...
    rd /s /q "yunhutongxin\platforms\android\build"
)

echo.
echo ====================================
echo Cleanup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Double-click open-android-studio.bat to reopen Android Studio
echo 2. Wait for Gradle sync to complete (may take 10-30 minutes)
echo 3. Click: Build > Build Bundle(s) / APK(s) > Build APK(s)
echo 4. Wait for build to complete
echo ====================================
echo.

pause
