@echo off
Setlocal EnableDelayedExpansion
if "%1" == "/?" echo Creating the same directory in new path and recoding all .txt files from cp866 to UTF-8.
set /P file_name="Choose file name: "
set file_prefix=utf8
echo D | xcopy %file_name% %file_prefix%%file_name% /Y /E
pushd %file_prefix%%file_name%
IF ERRORLEVEL 1 goto :errorpoint
for /R %%f in (*.txt) do ren %%f %%~nf.tmp
for /R %%f in (*.tmp) do ( 
	iconv -f cp866 -t utf-8 %%f > %%~pnf.txt 
	del %%f
)
popd
goto :exit
:errorpoint
echo This directory does not exist
:exit
