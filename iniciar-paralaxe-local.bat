@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Paralaxe - Servidor de desenvolvimento local

REM Coloque este .bat na raiz do repositorio, ao lado de package.json.
cd /d "%~dp0"

if not exist "package.json" (
  echo [ERRO] Coloque este arquivo .bat na pasta principal do Paralaxe,
  echo        na mesma pasta do package.json.
  goto :falha
)
if not exist "aplicativos\jogo\vite.config.ts" (
  echo [ERRO] Nao encontrei aplicativos\jogo\vite.config.ts.
  echo        Confirme que esta usando a raiz do repositorio Paralaxe.
  goto :falha
)

REM O jogo depende dos pacotes locais do monorepositorio.
if not exist "pnpm-workspace.yaml" (
  echo [ERRO] Nao encontrei pnpm-workspace.yaml na raiz do Paralaxe.
  goto :servidor_existente
echo.
pause
exit /b 0

:copia_incompleta
)
for %%P in (conteudo dominio interface persistencia) do (
  if not exist "pacotes\%%P\package.json" (
    echo [ERRO] Arquivo ausente: pacotes\%%P\package.json
    goto :copia_incompleta
  )
)

where node >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Node.js nao foi encontrado.
  echo        Instale o Node.js compativel com o projeto e abra o .bat novamente.
  echo        Versoes previstas no projeto: Node 20.19+ ou Node 22.12+.
  goto :falha
)

echo ==========================================
echo           PARALAXE - MODO LOCAL
echo ==========================================
echo.
echo Node encontrado:
node --version
echo.

REM Escolhe o gerenciador uma vez para instalar e iniciar o jogo.
set "PNPM_CMD=pnpm"
where pnpm >nul 2>&1
if errorlevel 1 (
  where corepack >nul 2>&1
  if not errorlevel 1 (
    set "PNPM_CMD=corepack pnpm"
  ) else (
    where npx >nul 2>&1
    if errorlevel 1 (
      echo [ERRO] pnpm, Corepack e npx nao foram encontrados.
      goto :falha
    )
    set "PNPM_CMD=npx --yes pnpm@12.3.4"
  )
)

REM Inclui dependencias de desenvolvimento mesmo com NODE_ENV herdado.
set "NODE_ENV=development"

echo Verificando dependencias do workspace...
call %PNPM_CMD% install --frozen-lockfile
if errorlevel 1 goto :falha

REM O pnpm resolve o executavel no contexto do pacote, mesmo com hoisting.
call %PNPM_CMD% --filter @paralaxe/jogo exec vite --version >nul 2>&1
if errorlevel 1 (
  echo Vite indisponivel. Tentando reparar a instalacao...
  call %PNPM_CMD% install --frozen-lockfile --force
  if errorlevel 1 goto :falha
  call %PNPM_CMD% --filter @paralaxe/jogo exec vite --version
  if errorlevel 1 (
    echo [ERRO] O pnpm nao conseguiu executar o Vite no pacote do jogo.
    goto :falha
  )
)

REM Um segundo servidor na mesma porta falharia com --strictPort.
REM Nao alternar a porta automaticamente: os saves locais usam a origem do navegador.
REM O teste so verifica conexao; nunca encerra processos de outras aplicacoes.
where powershell >nul 2>&1
if not errorlevel 1 (
  powershell -NoProfile -NonInteractive -Command "$c = New-Object System.Net.Sockets.TcpClient; try { $c.Connect('127.0.0.1', 5173); exit 0 } catch { exit 1 } finally { $c.Dispose() }" >nul 2>&1
  if not errorlevel 1 (
    echo.
    echo [AVISO] A porta 5173 ja esta sendo utilizada.
    echo Se o Paralaxe ja estiver em execucao, use http://127.0.0.1:5173/
    echo Se nao for o jogo, feche o processo que ocupa a porta antes de tentar novamente.
    echo.
    echo Processos conectados a porta 5173:
    netstat -ano -p TCP | findstr ":5173"
    echo.
    echo Nenhum novo servidor foi iniciado para evitar conflito.
    goto :servidor_existente
  )
)

echo Iniciando o Paralaxe somente nesta maquina...
echo Acesse: http://127.0.0.1:5173/
echo Para encerrar o servidor, pressione CTRL+C nesta janela.
echo.
REM --strictPort evita trocar silenciosamente para uma porta diferente.
call %PNPM_CMD% --filter @paralaxe/jogo run desenvolver --port 5173 --strictPort
if errorlevel 1 (
  echo.
  echo [ERRO] O servidor terminou com erro. Veja a mensagem acima.
  goto :falha
)

echo.
echo O servidor foi encerrado.
pause
exit /b 0

:copia_incompleta
echo        Use uma copia completa da branch develop do repositorio Paralaxe.
echo        Mantenha as pastas aplicativos e pacotes juntas na mesma raiz.
echo        Em um clone, confira git status e se o sparse-checkout esta ativo.
goto :falha

:falha
echo.
pause
exit /b 1
