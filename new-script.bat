@echo off

set /p "name=Set Userscript Name: "
set /p "description=Set Userscript Description: "
set filename = "%name%.pda.user.js"

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

echo The file %name%.pda.user.js has been created. Press any key to continue...
pause >nul