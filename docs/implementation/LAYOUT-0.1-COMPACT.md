# Experimento de layout compacto — Build 0.1

## Objetivo

Este passe testa uma leitura mais enxuta para as superfícies operacionais da Build 0.1. A referência de interação é a densidade de jogos Idle como Idle Iktah: navegação persistente, ambiente reconhecível em uma área contida e dados próximos da decisão.

O experimento preserva a arquitetura do UX-GDD: os quatro destinos continuam sendo `Personagem`, `Atividades`, `Aventura` e `Cidade`; `Jornada` e `Inventário` continuam como camadas rápidas; Combate e Dungeon continuam estados próprios.

## O que mudou

- títulos, cabeçalho, navegação e rodapé de continuidade ocupam menos altura;
- painéis operacionais usam padding e sombras menores, com leitura por grupos;
- o progresso Idle fica em uma única superfície contínua, sem o cartão externo duplicar a moldura;
- as sete Skills continuam agrupadas em Coleta e Produção, agora numa rail vertical que libera altura para o trabalho atual;
- a arte de Skill mantém 16:9, com largura de até 300 px na composição desktop, ao lado do trabalho atual;
- opções de coleta e receitas aparecem em linhas verticais; o mobile usa um seletor nativo para consultar as sete habilidades;
- arte de Cidade e Aventura mantém 16:9, mas deixa de funcionar como banner dominante;
- Cidade e Aventura passam a colocar a cena ao lado das opções, reduzindo a altura total dos hubs;
- retratos e cartões de equipamento reduzem escala sem retirar contexto, valores ou ações;
- o modo mobile reorganiza as colunas e mantém alvos de toque e navegação inferior;
- a criação de save usa um identificador alternativo quando o navegador não expõe `crypto.randomUUID`, permitindo validar a build em ambientes web mais antigos.

A compactação é seletiva: superfícies frequentes e operacionais ficam densas, enquanto Taverna, cenas de risco e estados narrativos continuam com espaço suficiente para leitura e atmosfera.

## Reversão

O layout anterior foi preservado antes deste experimento na branch:

```text
backup/layout-0.1-740e1c5
```

O estilo compacto fica em `apps/game/src/compact-layout.css`, importado por último em `main.tsx`, mas a estrutura dos componentes também evoluiu. Para restaurar uma versão inteira, use a branch/commit correspondente; remover apenas o import não restaura o layout anterior. A versão imediatamente anterior ao passe de usabilidade web está em `backup/web-usability-453dbba` (`453dbba1d67c095edf28d8640e5ff77b78749d5b`).

## Verificação qualitativa

No preview da Build 0.1 foram conferidos:

- criação e carregamento de personagem;
- Personagem com retrato, fatos e progressão;
- Atividades com as sete Skills, seleção de Pesca e arte GIF/fallback;
- início de Pesca, progresso de ciclo e continuidade no rodapé;
- navegação segura até Aventura e Cidade;
- camada rápida de Inventário;
- ausência de overflow horizontal no viewport desktop de 1363 px.

Na composição vertical da tela de Atividades, o viewport desktop de 1363 × 936 px apresentou 18 px de rolagem total para Pesca, com a arte 16:9, progresso de Skill e ação do recurso no mesmo fluxo visível.

Também foram executados o build de produção e o lint do workspace.

## Revisão de usabilidade web

A pesquisa e os critérios técnicos estão em [WEB-GAME-USABILITY-2026-09.md](../research/WEB-GAME-USABILITY-2026-09.md). A revisão aumenta a leitura dos textos pequenos, mantém alvos de 44 px nas ações principais, separa mensagens de comando de resultados recorrentes e expõe a origem de materiais faltantes. A compactação passa a depender principalmente da estrutura, mantendo a identidade visual.
