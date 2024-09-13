@echo off
REM 添加当前路径到system path下
echo ---------------------------------------
set pan=%~d0
set filePath=%~p0 
set filePath=%pan%%filePath:~0,-2%
echo current path: %filePath%

REM 添加PATH环境变量：如果已经存在则不添加
echo ---------------------------------------
SET is_path_added=0
SET add_path=%filePath%
SET MYPATHCOPY=%PATH%
call :search1
call set xx=%Path%;%add_path%

if %is_path_added%==0 (
	:: wmic ENVIRONMENT where "name='Path' and username='<system>'" set VariableValue="%xx%"
	setx PATH "%xx%" /M
)


REM 方法1
:search1
for /f "tokens=1* delims=;" %%a in ("%MYPATHCOPY%") do (
	if "%add_path%"=="%%a" (
		goto :isFinded
	)
	set MYPATHCOPY=%%b
	goto :search1
)
goto :EOF

:isFinded
echo The path already exists: %add_path%
set is_path_added=1
goto :EOF
