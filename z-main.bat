@echo off
if "%1"=="" (
    start "" /min "%~f0" hidden
    exit
)

call ./gen-rtsp.bat
call ./start-convert-server.bat