@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
title QR Kassa - eerste publicatie GitHub Pages

echo ========================================================
echo  QR KASSA FANFARE - EERSTE PUBLICATIE - VERSIE 1.0.0
echo ========================================================
echo.
where git >nul 2>&1
if errorlevel 1 (
  echo FOUT: Git niet gevonden. Installeer Git for Windows en start opnieuw.
  pause
  exit /b 1
)
echo.
echo STAP 1: Maak op GitHub een NIEUWE LEGE PUBLIC repository.
echo Naam aanbevolen: fanfare-qr-kassa
echo Vink GEEN README, .gitignore of license aan.
echo De repository moet PUBLIC zijn voor gratis GitHub Pages.
echo.
start "" "https://github.com/new"
echo.
set /p GHUSER=Wat is je GitHub gebruikersnaam? 
if "%GHUSER%"=="" goto :baduser
set "REPO=fanfare-qr-kassa"
set /p REPO=Repositorynaam [fanfare-qr-kassa]: 
if "%REPO%"=="" set "REPO=fanfare-qr-kassa"
echo.
echo Controleer dat de lege repository %GHUSER%/%REPO% op GitHub bestaat.
pause

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 git init -b main
if errorlevel 1 goto :fail

git config user.name >nul 2>&1
if errorlevel 1 (
  set /p GITNAME=Je naam voor Git commits: 
  if not defined GITNAME set "GITNAME=Fanfare QR Kassa"
  git config user.name "%GITNAME%"
)
git config user.email >nul 2>&1
if errorlevel 1 (
  set /p GITEMAIL=Je e-mailadres voor Git commits: 
  git config user.email "%GITEMAIL%"
)

git add docs README.txt CHANGELOG.txt 01_SETUP_GITHUB.bat 02_UPDATE_PUBLICEREN.bat
if errorlevel 1 goto :fail
git commit -m "Fanfare QR-Kassa v1.0.0"
if errorlevel 1 goto :fail
git remote get-url origin >nul 2>&1
if errorlevel 1 git remote add origin "https://github.com/%GHUSER%/%REPO%.git"
if errorlevel 1 goto :fail

echo.
echo GitHub kan een browser openen om je te laten aanmelden.
git push -u origin main
if errorlevel 1 goto :fail

echo.
echo GELUKT: De bestanden zijn naar GitHub verstuurd.
echo STAP 2: Activeer GitHub Pages in de browser:
echo Settings - Pages - Deploy from a branch - main - /docs - Save.
start "" "https://github.com/%GHUSER%/%REPO%/settings/pages"
echo.
echo De webapp krijgt dit adres:
echo https://%GHUSER%.github.io/%REPO%/
echo.
echo De app is pas online zodra GitHub Pages de publicatie heeft voltooid.
pause
exit /b 0
:baduser
echo FOUT: GitHub gebruikersnaam mag niet leeg zijn.
pause
exit /b 1
:fail
echo.
echo FOUT: Publicatie niet afgerond. Lees de foutmelding hierboven.
echo Controleer de repositorynaam, GitHub-aanmelding en internetverbinding.
pause
exit /b 1
