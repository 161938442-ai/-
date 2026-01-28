# APK构建指南

## 当前状态
- Cordova项目已创建：yunhutongxin
- Android平台已添加：yunhutongxin\platforms\android
- 所有应用文件已复制到项目中

## 构建APK的步骤

### 方法1：使用Android Studio（推荐）

1. **打开Android Studio项目**
   - 双击运行：`yunhutongxin\platforms\android\open-and-build.bat`
   - 或手动打开：`C:\Program Files\Android\Android Studio\bin\studio64.exe`
   - 然后打开项目：`yunhutongxin\platforms\android`

2. **等待Gradle同步**
   - Android Studio会自动开始Gradle同步
   - 等待同步完成（可能需要几分钟）
   - 如果提示下载依赖，点击同意

3. **构建APK**
   - 点击菜单：`Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`
   - 等待构建完成（可能需要5-10分钟）

4. **查找APK文件**
   - 构建完成后，会弹出通知
   - 点击通知中的"locate"链接
   - 或直接访问：`yunhutongxin\platforms\android\app\build\outputs\apk\debug\app-debug.apk`

### 方法2：使用命令行（需要完整的Gradle环境）

如果您的系统已正确配置Gradle，可以运行：
```bash
cd yunhutongxin\platforms\android
gradlew.bat assembleDebug
```

## 常见问题

### 问题1：Gradle同步失败
**解决方案：**
- 打开Android Studio
- 点击 `File` -> `Invalidate Caches / Restart`
- 选择 `Invalidate and Restart`
- 等待Android Studio重新启动
- 再次尝试同步

### 问题2：构建时提示SDK版本不匹配
**解决方案：**
- 打开 `yunhutongxin\platforms\android\app\build.gradle`
- 检查 `compileSdkVersion` 和 `targetSdkVersion`
- 确保它们与您安装的SDK版本匹配

### 问题3：构建过程中断
**解决方案：**
- 运行 `yunhutongxin\platforms\android\fix-android-studio-stuck.bat`
- 清理缓存后重新构建

## APK安装

### 在Android手机上安装

1. **启用未知来源应用**
   - 打开手机设置
   - 进入 `安全` 或 `隐私`
   - 启用 `允许安装未知来源应用`

2. **传输APK到手机**
   - 通过USB连接手机
   - 将 `app-debug.apk` 复制到手机
   - 或通过云存储、邮件等方式传输

3. **安装APK**
   - 在手机上打开文件管理器
   - 找到 `app-debug.apk` 文件
   - 点击安装
   - 按照提示完成安装

## 应用功能

安装后，应用将包含以下功能：
- 教师端：创建问卷、查看AI分析结果
- 学生端：填写问卷
- 管理员端：上传资源包、管理数据
- 所有数据存储在本地（IndexedDB）
- 支持离线使用

## 技术支持

如果遇到问题：
1. 检查Android Studio是否正确安装
2. 确认Android SDK是否完整
3. 查看Android Studio的构建日志
4. 运行 `check-installation.ps1` 检查环境

## 文件位置

- 项目根目录：`C:\Users\zszs7\Documents\trae_projects\wenjuandiaocha`
- Cordova项目：`yunhutongxin`
- Android平台：`yunhutongxin\platforms\android`
- APK输出：`yunhutongxin\platforms\android\app\build\outputs\apk\debug\app-debug.apk`
