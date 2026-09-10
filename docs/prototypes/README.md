# Protótipos de UX — Greywake

Esta pasta contém protótipos isolados usados durante o **M5.5 — UX Foundation**.

Eles não fazem parte do runtime do jogo e não devem ser tratados como implementação de produção. O objetivo é validar composição, hierarquia, densidade, responsividade e a Direção Visual 0.1 antes da migração dos workbenches.

## Primeiro protótipo

### `mining-hifi-v0.1.html`

Protótipo de alta fidelidade da tela:

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

## Baseline visual aplicada

O protótipo parte da Direção Visual 0.1 registrada no `docs/UX-GDD.md`:

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

As fontes concretas não são incorporadas ao protótipo; ele usa fallbacks locais para permanecer autocontido. A decisão final de famílias tipográficas continua dependente de avaliação visual.

## O que este protótipo ainda não valida

- arte final;
- iconografia final;
- animações finais;
- áudio;
- conteúdo/balanceamento definitivo;
- integração com estado real do jogo;
- comportamento funcional dos controles;
- acessibilidade de produção completa.

## Perguntas para revisão visual

Ao revisar `mining-hifi-v0.1.html`, observar principalmente:

1. a atividade atual é reconhecida sem procurar?
2. a arte tem presença suficiente sem dominar a operação?
3. Skill, recursos e detalhe possuem hierarquia clara?
4. o recurso ativo é reconhecível sem depender só de cor?
5. bloqueios explicam a causa sem poluir a tela?
6. usos conhecidos ajudam sem escolher estratégia?
7. Inventário e Jornada parecem acessos globais secundários?
8. o shell parece Game UI Dark Fantasy e não dashboard SaaS?
9. a tela continua legível em largura reduzida?
10. existe informação demais ou de menos para a decisão imediata?

## Próxima sequência após validação

Se a linguagem desta tela sobreviver à revisão, os próximos protótipos devem derivar dela nesta ordem:

```text
Atividades → Produção
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

Estados especiais podem divergir visualmente, mas devem reutilizar tokens, hierarquia e gramática de interação já validados.