# 使用Android Studio构建APK指南

## 前提条件
- Node.js已安装 ✓
- npm已安装 ✓
- Java已安装 ✓
- Android SDK已安装 ✓
- Cordova已安装 ✓

## 构建步骤

### 方法1：使用Android Studio构建（推荐）

1. **打开Android Studio**
   - 启动Android Studio应用程序

2. **打开Cordova项目**
   - 点击 "Open an Existing Project"
   - 导航到：`C:\Users\zszs7\Documents\trae_projects\wenjuandiaocha\yunhutongxin\platforms\android`
   - 选择该文件夹并点击"OK"
   - 等待Gradle同步完成（可能需要几分钟）

3. **构建APK**
   - 点击菜单栏：Build > Build Bundle(s) / APK(s) > Build APK(s)
   - 等待构建完成（首次构建可能需要较长时间）

4. **查找APK文件**
   - 构建完成后，会弹出通知，点击"locate"
   - APK文件通常位于：`yunhutongxin\platforms\android\app\build\outputs\apk\debug\app-debug.apk`

### 方法2：使用命令行构建（需要Gradle）

如果Android Studio无法使用，可以尝试以下步骤：

1. **下载Gradle**
   - 访问：https://gradle.org/releases/
   - 下载最新版本的Gradle（二进制文件）
   - 解压到：`C:\gradle`

2. **设置环境变量**
   - 添加到PATH：`C:\gradle\bin`

3. **运行构建命令**
   ```powershell
   cd C:\Users\zszs7\Documents\trae_projects\wenjuandiaocha\yunhutongxin\platforms\android
   gradlew assembleDebug
   ```

## 常见问题

### Q: Gradle同步失败
A: 检查网络连接，确保可以访问Gradle仓库。如果在中国，可能需要配置Gradle镜像。

### Q: 构建失败，提示SDK版本问题
A: 在Android Studio中，打开SDK Manager，确保安装了所需的SDK版本和构建工具。

### Q: APK文件在哪里？
A: 默认位置：`yunhutongxin\platforms\android\app\build\outputs\apk\debug\app-debug.apk`

## 安装APK到Android设备

1. 将APK文件传输到Android设备
2. 在设备上启用"未知来源"安装
3. 点击APK文件进行安装

## 注意事项

- 首次构建可能需要下载大量依赖，请确保网络连接稳定
- 构建过程可能需要10-30分钟，请耐心等待
- 如果构建失败，请检查错误信息并确保所有依赖都已正确安装
