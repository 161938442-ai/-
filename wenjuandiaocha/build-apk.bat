@echo off

echo ====================================
echo 云护童心应用 - APK构建脚本
echo ====================================
echo.

:: 设置环境变量
set NODE_PATH=C:\Program Files\nodejs
set NPM_PATH=C:\Program Files\nodejs
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\zszs7\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\zszs7\AppData\Local\Android\Sdk

:: 将路径添加到PATH
set PATH=%NODE_PATH%;%NPM_PATH%;%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%PATH%

:: 检查Node.js是否安装
if not exist "%NODE_PATH%\node.exe" (
    echo 错误：未找到Node.js，请确保已正确安装
    echo 请从 https://nodejs.org/ 下载并安装Node.js
    pause
    exit /b 1
)

echo ✅ Node.js已安装

:: 检查npm是否安装
if not exist "%NPM_PATH%\npm.cmd" (
    echo 错误：未找到npm，请确保Node.js已正确安装
    pause
    exit /b 1
)

echo ✅ npm已安装

:: 检查Java是否安装
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo 错误：未找到Java，请确保Android Studio已正确安装
    pause
    exit /b 1
)

echo ✅ Java已安装

:: 检查Android SDK是否安装
if not exist "%ANDROID_HOME%\platform-tools" (
    echo 错误：未找到Android SDK，请确保Android Studio已正确安装
    pause
    exit /b 1
)

echo ✅ Android SDK已安装

:: 安装Cordova
echo 正在安装Apache Cordova...
"%NPM_PATH%\npm.cmd" install -g cordova
if %errorlevel% neq 0 (
    echo 错误：Cordova安装失败
    pause
    exit /b 1
)

echo ✅ Cordova已安装

:: 检查Cordova是否安装成功
if not exist "%APPDATA%\npm\cordova.cmd" (
    echo 错误：Cordova安装成功但未找到命令
    echo 请手动将Cordova的路径添加到系统环境变量
    pause
    exit /b 1
)

echo ✅ Cordova已添加到环境变量

:: 创建Cordova项目
echo 正在创建Cordova项目...
if exist "yunhutongxin" (
    echo 项目目录已存在，正在清理...
    rd /s /q "yunhutongxin"
)

"%APPDATA%\npm\cordova.cmd" create yunhutongxin com.yunhutongxin.app "云护童心"
if %errorlevel% neq 0 (
    echo 错误：创建Cordova项目失败
    pause
    exit /b 1
)

echo ✅ Cordova项目创建成功

:: 进入项目目录
cd yunhutongxin

:: 添加Android平台
echo 正在添加Android平台...
"%APPDATA%\npm\cordova.cmd" platform add android
if %errorlevel% neq 0 (
    echo 错误：添加Android平台失败
    pause
    exit /b 1
)

echo ✅ Android平台添加成功

:: 复制应用文件
echo 正在复制应用文件...
if exist "www" (
    rd /s /q "www"
)

mkdir www
copy "..\index.html" "www\index.html"
copy "..\script.js" "www\script.js"
copy "..\styles.css" "www\styles.css"

if %errorlevel% neq 0 (
    echo 错误：复制应用文件失败
    pause
    exit /b 1
)

echo ✅ 应用文件复制成功

:: 构建APK
echo 正在构建APK文件...
echo 注意：首次构建可能需要较长时间，请耐心等待...
"%APPDATA%\npm\cordova.cmd" build android
if %errorlevel% neq 0 (
    echo 错误：构建APK失败
    echo 请检查Android Studio是否正确安装，以及SDK是否完整
    pause
    exit /b 1
)

echo ✅ APK构建成功

:: 查找APK文件
for /r "platforms\android" %%f in (*.apk) do (
    set "apk_file=%%f"
)

if defined apk_file (
    echo.
    echo ====================================
    echo 🎉 APK构建完成！
    echo ====================================
    echo APK文件位置：%apk_file%
    echo.
    echo 请将此APK文件传输到Android设备并安装
    echo ====================================
) else (
    echo 错误：未找到构建的APK文件
    pause
    exit /b 1
)

:: 退出
echo.
echo 按任意键退出...
pause >nul
exit /b 0