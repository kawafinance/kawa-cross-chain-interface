@echo off
setlocal enabledelayedexpansion

REM Set paths
set DEPLOYMENTS_DIR=B:\CryptoProjects\kawa\cross-chain\kawa-cross-chain-contracts\deployments\sepolia
set TARGET_FILE=B:\CryptoProjects\kawa\cross-chain\kawa-cross-chain-interface\src\constants\contracts.ts
set TEMP_FILE=%TARGET_FILE%.tmp

REM Check if deployments folder exists
if not exist "%DEPLOYMENTS_DIR%" (
    echo Deployments folder "%DEPLOYMENTS_DIR%" does not exist.
    pause
    exit /b 1
)

REM Load deployment addresses into variables
echo Loading deployment addresses...
for %%F in (%DEPLOYMENTS_DIR%\*.json) do (
    set "BREAK_INNER_LOOP=0"

    for /f "tokens=2 delims=:, " %%A in ('findstr /i /c:"\"address\"" "%%F"') do (
           if "!BREAK_INNER_LOOP!"=="0" (
                set "ADDRESS=%%A"
                set "ADDRESS=!ADDRESS:~1,-1!" REM Remove surrounding quotes
                echo DEBUG: Address set to !ADDRESS!
                set "CONTRACT_NAME=%%~nF"
                echo DEBUG: CONTRACT_NAME set to !CONTRACT_NAME!
                set "!%CONTRACT_NAME%!=!ADDRESS!"
                echo DEBUG: Deployment for !CONTRACT_NAME!: !%CONTRACT_NAME%!
                set "BREAK_INNER_LOOP=1"
            )
    )
)


REM Start processing MARKETS section
echo Updating MARKETS section in %TARGET_FILE%...

REM Create a temporary file for the updated output
if exist "%TEMP_FILE%" del "%TEMP_FILE%"

set IN_MARKETS=0
set SYMBOL=
for /f "usebackq delims=" %%L in ("%TARGET_FILE%") do (
    set "LINE=%%L"

    REM Detect the start of the MARKETS array
    if "!LINE!"=="export const MARKETS: AssetInfo[] = [" (
        set "IN_MARKETS=1"
        echo In MARKETS
    )

    REM Detect the end of the MARKETS array
    if "!LINE!"=="]" (
        set "IN_MARKETS=0"
        echo Off MARKETS
    )

    REM If inside MARKETS array, process symbol and id fields
    if "!IN_MARKETS!"=="1" (
        echo !LINE! | findstr /r /c:"symbol: '" >nul
        if not errorlevel 1 (
            for /f "tokens=2 delims=' " %%S in ("!LINE!") do (
                set "SYMBOL=%%S"
                echo Processing symbol: !SYMBOL!
            )
        )

        echo !LINE! | findstr /r /c:"id: '" >nul
        if not errorlevel 1 (
            if defined SYMBOL (
                set "CONTRACT_ADDR=!%SYMBOL!"
               set "CONTRACT_ADDR=!CONTRACT_ADDR!"
                if defined CONTRACT_ADDR (
                    set "LINE=id: '!CONTRACT_ADDR!',"
                    echo Updated id for !SYMBOL! to address: !CONTRACT_ADDR!
                ) else (
                    echo WARNING: No address found for symbol: !SYMBOL!
                )
            )
        )
    )

    echo !LINE!>> "%TEMP_FILE%"
)

REM Replace the original target file with the updated file
move /y "%TEMP_FILE%" "%TARGET_FILE%"
echo MARKETS section updated successfully.

REM Wait for user input before closing
echo Press any key to close...
pause