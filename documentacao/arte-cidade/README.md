# Greywake — Pacote visual da Cidade Livre

## Conteúdo

- `aplicativos/jogo/publico/arte/cidade/cidade-estagio-0.webp` até `cidade-estagio-4.webp`: **cinco imagens completas 1600×900**, otimizadas para o navegador, produzidas a partir das cinco ilustrações de progressão. A composição e as posições das construções são aproximadamente consistentes, mas a geração de imagens não garante correspondência geométrica pixel a pixel.
- `aplicativos/jogo/publico/arte/cidade/mobile/`: cinco alternativas 960×540.
- `aplicativos/jogo/publico/arte/cidade/interface/`: ícones individuais em PNG RGBA extraídos da prancha conceitual, com transparência aproximada. **Inspecionar recortes e bordas antes de uso definitivo.**
- `referencias-artes/distritos/`: recortes **conceituais** de construções, com fundo escuro; **não são camadas transparentes alinhadas** às cenas e não devem ser ativadas em `CENAS_DA_CIDADE`.
- `referencias-artes/prancha-conceitual.webp`: prancha de identidade visual para artistas.
- `comparativo-cidade.jpg`: visão geral dos cinco estágios.
- `manifesto-assets.json`: relação de arquivos e tamanhos.

## Integração com o código do Prompt 1

O componente `CenaDaCidade` já espera exatamente as URLs `/arte/cidade/cidade-estagio-0.webp` a `/arte/cidade/cidade-estagio-4.webp` e proporção 16:9.

1. Copie a pasta `aplicativos/jogo/publico/arte/cidade/` para o clone da branch `codex/codice-desafios-prestigio` que já recebeu a implementação da Vigília.
2. Em `pacotes/conteudo/fonte/cidadeEvolutiva.ts`, mude **somente** o `disponivel` das cinco cenas principais para `true` após inspecionar os arquivos.
3. Mantenha o campo `disponivel` de **todas as camadas** como `false`: as construções fornecidas são apenas referências e não estão perfeitamente posicionadas nem recortadas.
4. Confira hotspots e corte/escala em desktop e celular. Não faça overdraw de GIF nem carregue todas as cenas ao mesmo tempo.
5. Cadastre a atribuição de recursos gerados no catálogo de créditos, conforme as regras do projeto.
6. Rode `pnpm verificar` e `pnpm compilar` após integrar.

**Material disponibilizado na branch de desenvolvimento; nenhuma alteração na main.**

## Limites técnicos e artísticos

As cinco cenas são imagens independentes geradas com assistência de IA e derivadas da direção de arte fornecida. Não estão rigorosamente registradas pixel a pixel: ao trocar o estágio, pequenas variações de telhados, iluminação ou contornos podem aparecer. Para overlays perfeitos por distrito, será necessária uma etapa de alinhamento/edição manual por camadas (ou pintura sobre a mesma composição-mestre). As imagens 1600×900 são versões otimizadas de fontes 1672×941; não são masters nativos de 1920×1080. Ícones RGBA foram extraídos de prancha gerada e merecem inspeção de qualidade.
