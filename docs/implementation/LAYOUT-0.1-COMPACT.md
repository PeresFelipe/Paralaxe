# Experimento de layout compacto — Build 0.1

## Objetivo

Este passe testa uma leitura mais enxuta para as superfícies operacionais da Build 0.1. A referência de interação é a densidade de jogos Idle como Idle Iktah: navegação persistente, ambiente reconhecível em uma área contida e dados próximos da decisão.

O experimento preserva a arquitetura do UX-GDD: os quatro destinos continuam sendo `Personagem`, `Atividades`, `Aventura` e `Cidade`; `Jornada` e `Inventário` continuam como camadas rápidas; Combate e Dungeon continuam estados próprios.

## O que mudou

- títulos, cabeçalho, navegação e rodapé de continuidade ocupam menos altura;
- painéis operacionais usam padding e sombras menores, com leitura por grupos;
- o progresso Idle fica em uma única superfície contínua, sem o cartão externo duplicar a moldura;
- as sete Skills continuam agrupadas em Coleta e Produção, agora numa rail vertical que libera altura para o trabalho atual;
- a arte de Skill mantém 16:9, com largura limitada a 440 px para deixar a progressão e as ações próximas;
- opções de coleta e receitas aparecem em duas colunas no desktop e uma no mobile;
- arte de Cidade e Aventura mantém 16:9, mas deixa de funcionar como banner dominante;
- retratos e cartões de equipamento reduzem escala sem retirar contexto, valores ou ações;
- o modo mobile reorganiza as colunas e mantém alvos de toque e navegação inferior;
- a criação de save usa um identificador alternativo quando o navegador não expõe `crypto.randomUUID`, permitindo validar a build em ambientes web mais antigos.

## Reversão

O layout anterior foi preservado antes deste experimento na branch:

```text
backup/layout-0.1-740e1c5
```

O passe novo está isolado em `apps/game/src/compact-layout.css`, importado por último em `main.tsx`. Remover esse import restaura as regras visuais anteriores sem alterar o estado de jogo.

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
