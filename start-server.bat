@echo off

echo 正在启动本地服务器...
echo 请保持此窗口打开，直到您完成使用应用

echo. 
echo 启动中...
echo. 

python -m http.server 8082 --bind 127.0.0.1

pause