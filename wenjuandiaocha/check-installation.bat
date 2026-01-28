@echo off

echo ====================================
echo 检查安装状态
echo ====================================
echo.

:: 检查Node.js
echo [1/4] 检查Node.js安装状态...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node.js已安装
    node -v
) else (
    echo ❌ Node.js未安装或未添加到环境变量
    echo 请从 https://nodejs.org/ 下载并安装Node.js
    echo 安装完成后，请重启电脑
)
echo.

:: 检查npm
echo [2/4] 检查npm安装状态...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ npm已安装
    npm -v
) else (
    echo ❌ npm未安装或未添加到环境变量
    echo npm应该随Node.js一起安装
)
echo.

:: 检查Java
echo [3/4] 检查Java安装状态...
where java >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Java已安装
    java -version
) else (
    echo ❌ Java未安装或未添加到环境变量
    echo Android Studio应该包含Java，请确保Android Studio已正确安装
)
echo.

:: 检查Android SDK
echo [4/4] 检查Android SDK安装状态...
set "ANDROID_HOME="
if exist "%LOCALAPPDATA%\Android\Sdk" (
    set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
    echo ✅ Android SDK已安装在用户目录
    echo 路径：%ANDROID_HOME%
) else if exist "C:\Android\Sdk" (
    set "ANDROID_HOME=C:\Android\Sdk"
    echo ✅ Android SDK已安装在系统目录
    echo 路径：%ANDROID_HOME%
) else if exist "%APPDATA%\..\Local\Android\Sdk" (
    set "ANDROID_HOME=%APPDATA%\..\Local\Android\Sdk"
    echo ✅ Android SDK已安装
    echo 路径：%ANDROID_HOME%
) else (
    echo ❌ 未找到Android SDK
    echo 请确保Android Studio已正确安装并下载了SDK
)
echo.

:: 检查adb工具
echo [5/5] 检查adb工具...
where adb >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ adb工具已安装
    adb version
) else (
    echo ❌ adb工具未安装
    echo adb工具应该包含在Android SDK中
)
echo.

:: 总结
echo ====================================
echo 安装状态总结
echo ====================================
echo.

if defined ANDROID_HOME (
    echo ✅ 基本组件已安装，可以继续构建APK
    echo.
    echo 下一步：运行 build-apk.bat 脚本
) else (
    echo ❌ 某些组件未安装，请先完成安装
    echo.
    echo 需要安装的组件：
    echo   1. Node.js - 从 https://nodejs.org/ 下载
    echo   2. Android Studio - 从 https://developer.android.com/studio 下载
    echo.
    echo 安装完成后，请重启电脑并重新运行此脚本
)

echo.
echo 按任意键退出...
pause >nul