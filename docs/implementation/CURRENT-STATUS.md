# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M6 — Build 0.1 validável: ✅ FECHADO**

O M5.5 — UX Foundation e o M6 — Build 0.1 validável estão concluídos. A Build 0.1 local possui fluxo integrado de criação de personagem, Idle/offline, crafting, equipamento, Mercado, Banco, combate, Serviço e Dún Liath — Fácil, usando o `GameShell` canônico.

O próximo marco de produto ainda deve ser definido explicitamente antes de iniciar novo escopo. Não adicionar sistemas Online ou novo conteúdo apenas para prolongar a Build 0.1.

O layout compacto da Build 0.1 está registrado como experimento visual reversível em `docs/implementation/LAYOUT-0.1-COMPACT.md`. O layout anterior foi preservado em `backup/layout-0.1-740e1c5` antes da aplicação do passe.

A proposta de UI de jogo de 15/09/2026 aplica navegação persistente com sprites, molduras Dark Ages UI licenciadas, inventário de 24 slots e distinção entre profissão consultada e tarefa em execução. Pesquisa, licenças e verificação estão em [GAME-UI-2026-09-15.md](../research/GAME-UI-2026-09-15.md). Os 78 testes e o build passaram; a revisão visual em navegador real permanece pendente por bloqueio de prévia neste ambiente. A proposta preserva conteúdo, schema e regras da Build 0.1.

A evolução de usabilidade web foi aplicada sobre a Build 0.1, com pesquisa documentada em [WEB-GAME-USABILITY-2026-09.md](../research/WEB-GAME-USABILITY-2026-09.md). Ela adiciona PWA com cache de aplicação/artes, controles operacionais legíveis, Atividades com atalhos de materiais, progresso animado pelo navegador e painéis acessíveis por teclado. O estado anterior está preservado em `backup/web-usability-453dbba`. A instalação e o carregamento offline completo ainda precisam ser conferidos em um deploy HTTPS.

Documento de fechamento do M6:

```text
docs/implementation/M6-VALIDATION.md
```

## Ladder concluída da Build 0.1

```text
M0 — Projeto abre                         ✅
M1 — Criar e carregar personagem          ✅
M2 — Idle persiste e funciona offline     ✅
M3 — Crafting e equipamento               ✅
M4 — Primeiro combate completo            ✅
M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      ✅
M6 — Build 0.1 validável                  ✅
```

## Estado técnico validado

- matriz estrutural `6 classes × 4 rotas`: **24/24**;
- lint sem erros;
- typecheck completo;
- testes automatizados de domínio/content/persistência passando;
- build de produção passando;
- CI normal do repositório usado como fonte final de verdade após o fechamento documental.

## Implementado na Build 0.1

- criação e carregamento de save `OFFLINE`;
- seis classes e sete presentes iniciais;
- persistência IndexedDB com schema versionado e migração automática;
- sete Skills;
- Antiquity Print, de SciGho, integrada à marca sob CC BY 4.0; no tema de jogo, títulos e navegação operacional em Georgia para consistência de acentos; créditos acessíveis na criação/seleção de personagem e no jogo; TTF original preservado com cache offline;
- Ícones Shikashi v2, de Matt Firth (shikashipx), integrados por definitionId/SkillId em Atividades, indicadores globais, Inventário, Banco e Equipamento; créditos CC BY 4.0 e proveniência game-icons.net registrados junto aos recortes;
- arte individual de Pesca em pixel art dark fantasy: GIF 480 × 270 com quatro quadros, selecionado apenas sem preferência de redução de movimento; fallback PNG estático via `<picture>`;
- arte individual de Mineração em pixel art dark fantasy: GIF 480 × 270 com seis quadros (golpe, impacto e retorno), selecionado apenas sem preferência de redução de movimento; fallback PNG estático via `<picture>`;
- arte individual de Lenhador em pixel art dark fantasy: GIF 480 × 270 com seis quadros (machado acima, corte e retorno), selecionado apenas sem preferência de redução de movimento; fallback PNG estático via `<picture>`;
- arte individual de Herbologia em pixel art dark fantasy: GIF 480 × 270 com seis quadros (coleta, colocação no cesto e retorno), selecionado apenas sem preferência de redução de movimento; fallback PNG estático via `<picture>`;
- arte individual de Metalurgia em pixel art dark fantasy: GIF 480 × 270 com seis quadros (crisol, vazamento e retorno), selecionado apenas sem preferência de redução de movimento; fallback PNG estático via `<picture>`;
- arte individual de Forja em pixel art dark fantasy: GIF 480 × 270 com quatro quadros (billet aquecido, martelo, impacto e lâmina concluída), selecionado apenas sem preferência de redução de movimento; fallback PNG estático via `<picture>`;
- arte individual de Culinária em pixel art dark fantasy: GIF 480 × 270 com quatro quadros (ingredientes, mistura, tempero e panela pronta), selecionado apenas sem preferência de redução de movimento; fallback PNG estático via `<picture>`;
- revisão visual de 12/09/2026: sete GIFs com 400 ms por quadro (antes 600 ms), loops de 1,6 s ou 2,4 s; somente os atrasos dos quadros foram alterados, preservando os pixels e os PNGs estáticos. Cenas 16:9 limitadas a 224 px no desktop, 192 px até 980 px, 160 px até 720 px e 128 px até 420 px de viewport, com `object-fit: contain` e URLs dos GIFs em `v=3`;
- Árvore de Prestígio do personagem com 32 nós (quatro ramos puros e quatro caminhos híbridos), estado persistido, custos/pré-requisitos e desbloqueio condicionado às sete Skills em Prestígio I;
- ritual de Prestígio do personagem integrado à aba Personagem, com confirmação antes do reinício de nível/atributos e bloqueio enquanto houver atividade Idle ou produção;
- uma atividade Idle por vez;
- quatro coletas iniciais com progresso offline;
- produção Idle determinística;
- receitas iniciais de Metalurgia, Forja e Culinária;
- comunicação visual de progresso Idle com ciclo atual, tempo restante, próxima conclusão e progresso de Skill;
- equipamentos como instâncias individuais;
- reforço +1;
- Anel do Viajante funcional;
- afixos procedurais aplicados às estatísticas correspondentes;
- progressão geral 1–10 e distribuição confirmável de atributos;
- Inventário com 24 slots, materiais até 9.999 e consumíveis/comida até 99 por pilha;
- Banco funcional com 80 slots, depósito e retirada sem custo;
- capacidade de armazenamento respeitada em Coleta, Produção, Mercado, contrato e extração de Dungeon;
- crafting atômico quando o resultado não cabe no Inventário;
- Mercado NPC básico;
- Combat Engine determinístico/seedable;
- habilidades, cooldown, recursos, telegraph e interrupção;
- dois slots de consumíveis com uso manual/automático e thresholds;
- Serviço — Estrada Baixa com recompensa extra idempotente no primeiro clear;
- penalidade monetária de derrota fora de Dungeon;
- `DungeonRun` persistível;
- rota irreversível e salas idempotentes;
- Dún Liath — Fácil com Bolsa de Expedição, attrition, recuperação e retirada segura;
- Crúbach, Tromghiallach, Cosantóir e Fairtheoir em duas fases;
- decisão Matar/Poupar persistente;
- Registro de Suprimentos, Fragmento do Tratado e recompensas de primeiro clear;
- `GameShell` canônico com `Personagem / Atividades / Aventura / Cidade`;
- Jornada e Inventário rápido como camadas globais de continuidade;
- continuidade Idle em navegação segura, Preparação e retorno de risco;
- Combate e Dungeon como estados focados;
- retorno offline dedicado;
- visual runtime alinhado à Direção Visual 0.1 e estratégia responsiva/mobile.

## Schema atual

```text
save_schema_version = 9
```

- v7: Banco persistente;
- v8: normalização/migração do Anel do Viajante como equipamento real;
- v9: estado persistente da Árvore de Prestígio do personagem.

## Observação de validação qualitativa

Um playtest humano independente continua recomendado para avaliar ritmo, clareza, feedback e sensação de jogo. Ele não foi registrado como executado automaticamente e não deve ser confundido com a suíte técnica que fechou o M6.

## Não implementar sem novo marco aprovado

- servidor;
- conta Online;
- Cloud Save;
- Mercado P2P;
- Risk/Trust operacional;
- Certified Dungeon;
- Relic Registry Online;
- PostgreSQL remoto;
- Supabase;
- Tauri obrigatório;
- expansão de conteúdo sem novo escopo definido.
