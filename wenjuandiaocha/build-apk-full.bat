@echo off
setlocal enabledelayedexpansion

echo ====================================
echo 云护童心应用 - 完整APK构建脚本
echo ====================================
echo.

:: 设置环境变量
set NODE_PATH=C:\Program Files\nodejs
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\zszs7\AppData\Local\Android\Sdk
set PATH=%NODE_PATH%;%NODE_PATH%\node_modules\.bin;%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

:: 检查Node.js
if not exist "%NODE_PATH%\node.exe" (
    echo 错误：未找到Node.js
    echo 请先安装Node.js
    pause
    exit /b 1
)

echo ✅ Node.js已安装

:: 安装Cordova
echo 正在安装Cordova...
npm install -g cordova
if %errorlevel% neq 0 (
    echo 错误：Cordova安装失败
    pause
    exit /b 1
)

echo ✅ Cordova已安装

:: 清理旧项目
if exist "yunhutongxin" (
    echo 清理旧项目...
    rd /s /q "yunhutongxin"
)

:: 创建新项目
echo 创建Cordova项目...
cordova create yunhutongxin com.yunhutongxin.app "云护童心"
if %errorlevel% neq 0 (
    echo 错误：项目创建失败
    pause
    exit /b 1
)

echo ✅ 项目创建成功

:: 进入项目目录
cd yunhutongxin

:: 添加Android平台
echo 添加Android平台...
cordova platform add android
if %errorlevel% neq 0 (
    echo 错误：添加Android平台失败
    pause
    exit /b 1
)

echo ✅ Android平台添加成功

:: 复制应用文件
echo 复制应用文件...
copy ..\index.html www\index.html
copy ..\script.js www\script.js
copy ..\styles.css www\styles.css

if %errorlevel% neq 0 (
    echo 错误：复制文件失败
    pause
    exit /b 1
)

echo ✅ 应用文件复制成功

:: 构建APK
echo 构建APK文件...
echo 注意：首次构建可能需要较长时间，请耐心等待...
cordova build android
if %errorlevel% neq 0 (
    echo 错误：构建APK失败
    echo 请检查Android Studio是否正确安装
    pause
    exit /b 1
)

echo ✅ APK构建成功

:: 查找APK文件
for /r "platforms\android" %%f in (*.apk) do (
    set "apk_file=%%f"
    goto :found
)

:found
if defined apk_file (
    echo.
    echo ====================================
    echo 🎉 APK构建完成！
    echo ====================================
    echo APK文件位置：!apk_file!
    echo.
    echo 请将此APK文件传输到Android设备并安装
    echo ====================================
) else (
    echo 错误：未找到APK文件
    pause
    exit /b 1
)

:: 退出
cd ..
echo.
echo 构建脚本执行完成！
echo.
pause
endlocal