#!/usr/bin/env python3
"""Importa o ZIP de artes da Vigília produzido no ChatGPT.

Uso: python3 ferramentas/importarArtesDaCidade.py /caminho/paralaxe-cidade-artes-vigilia.zip

Este script não faz commit/push, nem altera branches; valida antes de escrever.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parent.parent
BRANCH = "codex/vigilia-cidade-evolutiva-2026-11-03"
PUBLICO = ROOT / "aplicativos/jogo/publico"
CATALOGO = ROOT / "pacotes/conteudo/fonte/cidadeEvolutiva.ts"
CREDITOS = ROOT / "aplicativos/jogo/fonte/catalogoDeCreditos.json"

if len(sys.argv) != 2:
    raise SystemExit("Uso: python3 ferramentas/importarArtesDaCidade.py /caminho/paralaxe-cidade-artes-vigilia.zip")
zip_path = Path(sys.argv[1]).resolve()
if not zip_path.is_file():
    raise SystemExit(f"ZIP não encontrado: {zip_path}")

def git(*args: str) -> str:
    return subprocess.check_output(["git", "-C", str(ROOT), *args], text=True).strip()

if git("branch", "--show-current") != BRANCH:
    raise SystemExit(f"Selecione a branch {BRANCH} antes de importar.")
if git("status", "--porcelain"):
    raise SystemExit("A árvore de trabalho deve estar limpa para importar as imagens.")

originais = [
    f"aplicativos/jogo/publico/arte/cidade/cidade-estagio-{i}.webp"
    for i in range(5)
]
originais += [
    f"versoes-mobile/cidade-estagio-{i}-mobile.webp" for i in range(5)
]

with ZipFile(zip_path) as z:
    imagens_ui = sorted(
        n for n in z.namelist()
        if n.startswith("aplicativos/jogo/publico/arte/cidade/interface/")
        and n.lower().endswith((".png", ".webp"))
    )
    arquivos = originais + imagens_ui
    faltando = [n for n in arquivos if n not in z.namelist()]
    if faltando:
        raise SystemExit(f"ZIP incompleto: {', '.join(faltando)}")
    if z.testzip():
        raise SystemExit("O ZIP contém um arquivo corrompido.")

    texto_catalogo = CATALOGO.read_text(encoding="utf-8")
    esperado = "  disponivel: false,\n  camadas: DISTRITOS_DA_CIDADE.map("
    if texto_catalogo.count(esperado) != 1:
        raise SystemExit("Catálogo mudou; revise antes de habilitar as cenas.")

    dados_creditos = json.loads(CREDITOS.read_text(encoding="utf-8"))
    ambientacao = next((r for r in dados_creditos["recursos"] if r["id"] == "ambientacao"), None)
    if ambientacao is None:
        raise SystemExit("Registro de créditos de ambientação não encontrado.")
    if "/arte/cidade/" in ambientacao["arquivos"]:
        raise SystemExit("A pasta de artes já está registrada no catálogo.")

    # Só escreve depois de verificar a integridade e os requisitos do ZIP.
    for origem in arquivos:
        if origem.startswith("versoes-mobile/"):
            destino = PUBLICO / "arte/cidade/mobile" / Path(origem).name
        else:
            destino = ROOT / origem
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_bytes(z.read(origem))

    CATALOGO.write_text(
        texto_catalogo.replace(esperado, "  disponivel: true,\n  camadas: DISTRITOS_DA_CIDADE.map("),
        encoding="utf-8",
    )
    ambientacao["arquivos"].append("/arte/cidade/")
    CREDITOS.write_text(json.dumps(dados_creditos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"Artes importadas: {len(arquivos)} arquivos.")
print("Revise o resultado visual, execute pnpm verificar e pnpm compilar.")
print("Depois faça commit e push explicitamente na branch de desenvolvimento.")
