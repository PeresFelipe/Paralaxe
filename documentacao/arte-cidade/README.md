# Greywake — Pacote visual da Cidade Livre

## Conteúdo

- `aplicativos/jogo/publico/arte/cidade/cidade-estagio-0.webp` até `cidade-estagio-4.webp`: **cinco imagens completas 1600×900**, otimizadas para o navegador, produzidas a partir das cinco ilustrações de progressão. A composição e as posições das construções são aproximadamente consistentes, mas a geração de imagens não garante correspondência geométrica pixel a pixel.
- `aplicativos/jogo/publico/arte/cidade/mobile/`: cinco alternativas 960×540.
- `aplicativos/jogo/publico/arte/cidade/interface/`: ícones individuais em PNG RGBA extraídos da prancha conceitual, com transparência aproximada. **Inspecionar recortes e bordas antes de uso definitivo.**
- `referencias-artes/distritos/`: recortes **conceituais** de construções, com fundo escuro; **não são camadas transparentes alinhadas** às cenas e não devem ser ativadas em `CENAS_DA_CIDADE`.
- `referencias-artes/prancha-conceitual.webp`: prancha de identidade visual para artistas.
- `comparativo-cidade.jpg`: visão geral dos cinco estágios.
- `manifesto-assets.json`: relação de arquivos e tamanhos.

## Publicação das artes no GitHub

O código funcional está publicado na branch `codex/vigilia-cidade-evolutiva-2026-11-03`, mas as imagens WebP/PNG **ainda não estão presentes no repositório remoto**. Por isso, `CENAS_DA_CIDADE` mantém `disponivel: false` e a interface usa SVG como alternativa operacional.

Para importar o ZIP `greywake-cidade-artes-vigilia.zip` (arquivo fornecido separadamente no ChatGPT), execute em um clone limpo desta branch:

```sh
git switch codex/vigilia-cidade-evolutiva-2026-11-03
python3 ferramentas/importarArtesDaCidade.py /caminho/greywake-cidade-artes-vigilia.zip
pnpm verificar
pnpm compilar
git add aplicativos/jogo/publico/arte/cidade pacotes/conteudo/fonte/cidadeEvolutiva.ts aplicativos/jogo/fonte/catalogoDeCreditos.json
git commit -m "feat(arte): integra cenarios e icones da Cidade Livre"
git push origin codex/vigilia-cidade-evolutiva-2026-11-03
```

O importador adiciona as cinco cenas 1600×900, as cinco versões mobile 960×540 e os ícones, habilita as cenas principais e registra a pasta de arte no catálogo de créditos. Ele **não** publica arte automaticamente: o commit e o push acima devem ser feitos no clone autorizado. As camadas individuais continuam desabilitadas porque não estão alinhadas.

Confira hotspots, visibilidade e proporção em desktop e celular antes de aprovar a interface. Não altere a `main`.

## Limites técnicos e artísticos

As cinco cenas são imagens independentes geradas com assistência de IA e derivadas da direção de arte fornecida. Não estão rigorosamente registradas pixel a pixel: ao trocar o estágio, pequenas variações de telhados, iluminação ou contornos podem aparecer. Para overlays perfeitos por distrito, será necessária uma etapa de alinhamento/edição manual por camadas (ou pintura sobre a mesma composição-mestre). As imagens 1600×900 são versões otimizadas de fontes 1672×941; não são masters nativos de 1920×1080. Ícones RGBA foram extraídos de prancha gerada e merecem inspeção de qualidade.
