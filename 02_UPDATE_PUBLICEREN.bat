@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title QR Kassa - update met versienummer

echo ========================================================
echo  QR KASSA FANFARE - UPDATE EN VERSIECONTROLE
echo ========================================================
echo.
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 goto :norepo
git remote get-url origin >nul 2>&1
if errorlevel 1 goto :norepo
for /f "usebackq delims=" %%V in ("docs\version.txt") do set "NEWVER=%%V"
for /f "delims=" %%V in ('git show HEAD:docs/version.txt 2^>nul') do set "LASTVER=%%V"
echo Gepubliceerde codeversie in laatste commit: !LASTVER!
echo Lokale codeversie: !NEWVER!
if "!NEWVER!"=="!LASTVER!" (
  echo.
  echo GEWEIGERD: wijzig eerst het versienummer in:
  echo docs\version.txt, docs\sw.js, docs\js\app.js,
  echo docs\index.html en CHANGELOG.txt.
  echo Iedere wijziging vereist een nieuw versienummer.
  pause
  exit /b 1
)
if "!NEWVER!"=="" (
  echo FOUT: docs\version.txt is leeg.
  pause
  exit /b 1
)
findstr /c:"!NEWVER!" docs\sw.js >nul
if errorlevel 1 goto :versionbad
findstr /c:"!NEWVER!" docs\js\app.js >nul
if errorlevel 1 goto :versionbad
findstr /c:"!NEWVER!" docs\index.html >nul
if errorlevel 1 goto :versionbad
findstr /c:"!NEWVER!" CHANGELOG.txt >nul
if errorlevel 1 goto :versionbad

git add docs CHANGELOG.txt README.txt
if errorlevel 1 goto :fail
git diff --cached --quiet
if not errorlevel 1 (
  echo Geen bestandswijzigingen gevonden.
  pause
  exit /b 1
)
git commit -m "QR Kassa update v!NEWVER!"
if errorlevel 1 goto :fail
git push origin main
if errorlevel 1 goto :fail
echo.
echo GELUKT: versie !NEWVER! is naar GitHub verstuurd.
echo Bij internet op de smartphone wordt de nieuwe versie opgehaald.
pause
exit /b 0
:versionbad
echo FOUT: Versienummer !NEWVER! ontbreekt in een verplicht bestand.
pause
exit /b 1
:norepo
echo FOUT: voer eerst 01_SETUP_GITHUB.bat uit.
pause
exit /b 1
:fail
echo FOUT: update niet gepubliceerd. Controleer de foutmelding hierboven.
pause
exit /b 1
