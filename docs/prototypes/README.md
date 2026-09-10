# Protótipos de UX — Greywake

Esta pasta contém protótipos isolados usados durante o **M5.5 — UX Foundation**.

Eles não fazem parte do runtime do jogo e não devem ser tratados como implementação de produção. O objetivo é validar composição, hierarquia, densidade, responsividade e a Direção Visual 0.1 antes da migração dos workbenches.

## Protótipos atuais

### `mining-hifi-v0.1.html`

Protótipo de alta fidelidade focado na tela:

```text
Atividades → Mineração
```

Ele exercita simultaneamente:

- shell seguro;
- navegação principal `Personagem / Atividades / Aventura / Cidade`;
- identidade do personagem e recursos globais;
- arte contextual 16:9 com placeholder para arte autoral;
- progresso da Skill;
- recursos em thumbnails 1:1;
- estado ativo, desbloqueado e bloqueado;
- detalhe do recurso selecionado;
- informação de decisão, compreensão e otimização;
- continuidade da atividade Idle;
- acessos rápidos a Inventário e Jornada;
- adaptação responsiva para telas menores.

### `greywake-hifi-flow-v0.1.html`

Protótipo navegável derivado da mesma linguagem visual. Inclui as principais superfícies e mudanças de estado do fluxo:

```text
Mineração
↓
Produção
↓
Personagem
↓
Cidade / Taverna
↓
Aventura
↓
Preparação
↓
Combate
↓
Dungeon
↓
Retorno offline
```

O arquivo contém um seletor de tela apenas para revisão do protótipo. Esse controle não pertence à UI de produção.

O fluxo também exercita:

- navegação segura sem interromper a atividade Idle;
- Jornada como painel global;
- transição visual de Safe para estados de risco;
- navegação global reduzida em Preparação e recolhida em Combate/Dungeon;
- informação objetiva de preparação incompleta;
- combate automático explicável;
- telegraph com sinais redundantes;
- Bolsa de Expedição e risco;
- sala atual e rota de Dungeon;
- retorno offline com reconciliação de progresso;
- adaptação responsiva sem transformar mobile em desktop comprimido.

## Baseline visual aplicada

Os protótipos partem da Direção Visual 0.1 registrada no `docs/UX-GDD.md`:

- fundo profundo `#101315`;
- superfície `#171C1F`;
- superfície elevada `#20262A`;
- texto principal `#E5E1D8`;
- texto secundário `#A9AAA5`;
- bronze envelhecido `#A98555` como acento principal;
- função display inspirada em Spectral/serif;
- função operacional inspirada em Inter/sans;
- cantos discretos;
- ornamentação contida;
- informação crítica nunca dependente apenas de cor.

As fontes concretas não são incorporadas aos protótipos; são usados fallbacks locais para manter os arquivos autocontidos. A decisão final de famílias tipográficas continua dependente de avaliação visual.

## O que estes protótipos ainda não validam

- arte final;
- iconografia final;
- animações finais;
- áudio;
- conteúdo/balanceamento definitivo;
- integração com estado real do jogo;
- funcionamento completo de todos os controles;
- persistência real;
- acessibilidade de produção completa.

## Perguntas para revisão visual

Observar principalmente:

1. a atividade atual é reconhecida sem procurar?
2. a arte tem presença suficiente sem dominar a operação?
3. Skill, recursos e detalhe possuem hierarquia clara?
4. estados ativos/bloqueados são reconhecíveis sem depender apenas de cor?
5. Jornada e Inventário parecem acessos globais secundários?
6. a passagem para Preparação, Combate e Dungeon parece uma mudança real de estado?
7. a causa da automação de combate é recuperável sem transformar a tela em log técnico?
8. Bolsa de Expedição e patrimônio seguro parecem conceitualmente diferentes?
9. o shell parece Game UI Dark Fantasy e não dashboard SaaS?
10. a linguagem visual continua coerente em largura reduzida?
11. existe informação demais ou de menos para cada decisão imediata?
12. Cidade e Taverna têm identidade suficiente sem se tornarem navegação world-first?

## Próxima etapa

O fluxo hi-fi v0.1 deve ser revisado como um único sistema. Após a revisão, os ajustes podem ser aplicados aos tokens e componentes do protótipo antes de derivar versões mais completas das telas e executar playtest.

Somente depois dessa validação a Fase 3 deve migrar os workbenches para a experiência de produção.