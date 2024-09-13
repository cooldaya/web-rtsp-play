@echo off
REM 添加当前文件夹至 path 环境变量
call add-current-path.bat

cd /d %~dp0
start mediamtx.exe