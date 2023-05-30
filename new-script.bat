@echo off

set /p "name=Set Userscript Name: "
if not defined name call :Error "No name provided, exiting..."
if exist %name%.pda.user.js call :Error "The script %name%.pda.user.js already exists, cancelling..."


set /p "description=Set Userscript Description: "
(
echo // ==UserScript==
echo // @name         %name%
echo // @namespace    https://github.com/Kwack-Kwack/pda-userscripts
echo // @version      0.0.1
echo // @description  %description%
echo // @author       Kwack [2190604]
echo // @match        https://www.torn.com/*
echo // @grant        none
echo // ==/UserScript==
)>%name%.pda.user.js

echo The file %name%.pda.user.js has been created.
exit /b

:Error 
echo:
echo %~1
exit
