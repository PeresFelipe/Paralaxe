@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Greywake - Servidor de desenvolvimento local

REM Coloque este .bat na raiz do repositorio, ao lado de package.json.
cd /d "%~dp0"

if not exist "package.json" (
  echo [ERRO] Coloque este arquivo .bat na pasta principal do Greywake,
  echo        na mesma pasta do package.json.
  goto :falha
)
if not exist "aplicativos\jogo\vite.config.ts" (
  echo [ERRO] Nao encontrei aplicativos\jogo\vite.config.ts.
  echo        Confirme que esta usando a raiz do repositorio Greywake.
  goto :falha
)

where node >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Node.js nao foi encontrado.
  echo        Instale o Node.js compativel com o projeto e abra o .bat novamente.
  echo        Versoes previstas no projeto: Node 20.19+ ou Node 22.12+.
  goto :falha
)

echo ==========================================
echo           GREYWAKE - MODO LOCAL
echo ==========================================
echo.
echo Node encontrado:
node --version
echo.

set "VITE_ENTRY=aplicativos\jogo\node_modules\vite\bin\vite.js"

if not exist "%VITE_ENTRY%" (
  echo Dependencias nao encontradas. Tentando instalar com pnpm...
  echo.
  where pnpm >nul 2>&1
  if not errorlevel 1 (
    call pnpm install --no-frozen-lockfile
    if errorlevel 1 goto :falha
  ) else (
    where corepack >nul 2>&1
    if errorlevel 1 (
      echo [ERRO] pnpm e Corepack nao foram encontrados.
      echo        Instale o pnpm conforme o README do projeto e execute novamente.
      goto :falha
    )
    call corepack pnpm install --no-frozen-lockfile
    if errorlevel 1 goto :falha
  )
)

if not exist "%VITE_ENTRY%" (
  echo [ERRO] Vite nao foi instalado no local esperado:
  echo        %VITE_ENTRY%
  goto :falha
)

echo Iniciando o Greywake somente nesta maquina...
echo Acesse: http://127.0.0.1:5173/
echo Para encerrar o servidor, pressione CTRL+C nesta janela.
echo.
REM --strictPort evita trocar silenciosamente para uma porta diferente.
node "%VITE_ENTRY%" "aplicativos/jogo" --config "aplicativos/jogo/vite.config.ts" --host 127.0.0.1 --port 5173 --strictPort
if errorlevel 1 (
  echo.
  echo [ERRO] O servidor terminou com erro. Veja a mensagem acima.
  goto :falha
)

echo.
echo O servidor foi encerrado.
pause
exit /b 0

:falha
echo.
pause
exit /b 1