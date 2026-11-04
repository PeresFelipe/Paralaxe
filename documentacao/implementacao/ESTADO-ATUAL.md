# Estado atual da implementação

## Projeto

**Paralaxe** — título provisório.

## Versão

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M6 — Versão 0.1 validável: ✅ FECHADO**

Pacote seguinte em implementação nesta branch: Códice, Desafios e expansão funcional do Prestígio, descritos em [GAMIFICACAO-0.2.md](GAMIFICACAO-0.2.md).

O M5.5 — Fundamentos de UX e o M6 — Versão 0.1 validável estão concluídos. A Versão 0.1 local possui fluxo integrado de criação de personagem, progresso automático durante a ausência, fabricação, equipamento, Mercado, Banco, combate, Serviço e Dún Liath — Fácil, usando o `EstruturaDoJogo` canônico.

O primeiro pacote de gamificação foi autorizado e aplicado à Versão 0.1 em 15/09/2026: meta opcional de fabricação na Jornada, comparação de equipamento, primeira fabricação registrada, contexto de meta no retorno sem conexão e encerramento narrativo de Dún Liath. Detalhes em [GAMIFICACAO-0.1.md](GAMIFICACAO-0.1.md). O partida passa ao esquema 10 com migração das versões anteriores. Receitas, custos, tempos, recompensas e regras de risco permanecem os mesmos.

O pacote 0.2 entrega Códice, desafios e efeitos funcionais de Prestígio. Não adicionar sistemas Conectado ou conteúdo fora deste escopo.

O disposição compacto da Versão 0.1 está registrado como experimento visual reversível em `documentacao/implementacao/DISPOSICAO-COMPACTA-0.1.md`. O disposição anterior foi preservado em `backup/layout-0.1-740e1c5` antes da aplicação do passe.

A proposta de Interface de jogo de 15/09/2026 aplica navegação persistente com animações em quadros, molduras Dark Ages UI licenciadas, inventário de 24 espaços e distinção entre profissão consultada e tarefa em execução. Pesquisa, licenças e verificação estão em [INTERFACE-DE-JOGO-2026-09-15.md](../pesquisa/INTERFACE-DE-JOGO-2026-09-15.md). Os 78 testes e o configuração passaram; a revisão visual em navegador real permanece pendente por bloqueio de prévia neste ambiente. A proposta preserva conteúdo, esquema e regras da Versão 0.1.

A evolução de usabilidade web foi aplicada sobre a Versão 0.1, com pesquisa documentada em [USABILIDADE-DE-JOGO-WEB-2026-09.md](../pesquisa/USABILIDADE-DE-JOGO-WEB-2026-09.md). Ela adiciona PWA com cache de aplicação/artes, controles operacionais legíveis, Atividades com atalhos de materiais, progresso animado pelo navegador e painéis acessíveis por teclado. O estado anterior está preservado em `backup/web-usability-453dbba`. A instalação e o carregamento sem conexão completo ainda precisam ser conferidos em um publicação HTTPS.

Documento de fechamento do M6:

```text
documentacao/implementacao/M6-VALIDACAO.md
```

## Sequência de marcos concluída da Versão 0.1

```text
M0 — Projeto abre                         ✅
M1 — Criar e carregar personagem          ✅
M2 — Ocioso persiste e funciona sem conexão     ✅
M3 — Fabricação e equipamento               ✅
M4 — Primeiro combate completo            ✅
M5 — Dún Liath completa                   ✅
M5.5 — Fundamentos de UX                      ✅
M6 — Versão 0.1 validável                  ✅
```

## Estado técnico validado

- matriz estrutural `6 classes × 4 rotas`: **24/24**;
- análise estática sem erros;
- verificação de tipos completo;
- testes automatizados de domínio/content/persistência passando;
- compilação de produção passando;
- CI normal do repositório usado como fonte final de verdade após o fechamento documental.

## Implementado na Versão 0.1

- criação e carregamento de partida `OFFLINE`;
- seis classes e sete presentes iniciais;
- persistência IndexedDB com esquema versionado e migração automática;
- sete Profissões;
- Antiquity Print, de SciGho, integrada à marca sob CC BY 4.0; no tema de jogo, títulos e navegação operacional em Georgia para consistência de acentos; créditos acessíveis na criação/seleção de personagem e no jogo; TTF original preservado com cache sem conexão;
- Ícones Shikashi v2, de Matt Firth (shikashipx), integrados por definitionId/SkillId em Atividades, indicadores globais, Inventário, Banco e Equipamento; créditos CC BY 4.0 e proveniência game-icons.net registrados junto aos recortes;
- arte individual de Pesca em arte em pixels fantasia sombria: GIF 480 × 270 com quatro quadros, selecionado apenas sem preferência de redução de movimento; alternativa PNG estático via `<picture>`;
- arte individual de Mineração em arte em pixels fantasia sombria: GIF 480 × 270 com seis quadros (golpe, impacto e retorno), selecionado apenas sem preferência de redução de movimento; alternativa PNG estático via `<picture>`;
- arte individual de Lenhador em arte em pixels fantasia sombria: GIF 480 × 270 com seis quadros (machado acima, corte e retorno), selecionado apenas sem preferência de redução de movimento; alternativa PNG estático via `<picture>`;
- arte individual de Herbologia em arte em pixels fantasia sombria: GIF 480 × 270 com seis quadros (coleta, colocação no cesto e retorno), selecionado apenas sem preferência de redução de movimento; alternativa PNG estático via `<picture>`;
- arte individual de Metalurgia em arte em pixels fantasia sombria: GIF 480 × 270 com seis quadros (crisol, vazamento e retorno), selecionado apenas sem preferência de redução de movimento; alternativa PNG estático via `<picture>`;
- arte individual de Forja em arte em pixels fantasia sombria: GIF 480 × 270 com quatro quadros (billet aquecido, martelo, impacto e lâmina concluída), selecionado apenas sem preferência de redução de movimento; alternativa PNG estático via `<picture>`;
- arte individual de Culinária em arte em pixels fantasia sombria: GIF 480 × 270 com quatro quadros (ingredientes, mistura, tempero e panela pronta), selecionado apenas sem preferência de redução de movimento; alternativa PNG estático via `<picture>`;
- revisão visual de 12/09/2026: sete GIFs com 400 ms por quadro (antes 600 ms), ciclos de 1,6 s ou 2,4 s; somente os atrasos dos quadros foram alterados, preservando os pixels e os PNGs estáticos. Cenas 16:9 limitadas a 224 px no computador, 192 px até 980 px, 160 px até 720 px e 128 px até 420 px de área visível, com `object-fit: contain` e URLs dos GIFs em `v=3`;
- Árvore de Prestígio do personagem com 32 nós (quatro ramos puros e quatro caminhos híbridos), estado persistido, custos/pré-requisitos e desbloqueio condicionado às sete Profissões em Prestígio I;
- ritual de Prestígio do personagem integrado à aba Personagem, com confirmação antes do reinício de nível/atributos e bloqueio enquanto houver atividade automática ou produção;
- uma atividade automática por vez;
- quatro coletas iniciais com progresso sem conexão;
- produção Ocioso determinística;
- receitas iniciais de Metalurgia, Forja e Culinária;
- comunicação visual de progresso Ocioso com ciclo atual, tempo restante, próxima conclusão e progresso de Profissão;
- equipamentos como instâncias individuais;
- reforço +1;
- Anel do Viajante funcional;
- afixos procedurais aplicados às estatísticas correspondentes;
- progressão geral 1–10 e distribuição confirmável de atributos;
- Inventário com 24 espaços, materiais até 9.999 e consumíveis/comida até 99 por pilha;
- Banco funcional com 80 espaços, depósito e retirada sem custo;
- capacidade de armazenamento respeitada em Coleta, Produção, Mercado, contrato e extração de Masmorra;
- fabricação atômico quando o resultado não cabe no Inventário;
- Mercado PNJ básico;
- Motor de Combate determinístico/seedable;
- habilidades, recarga, recursos, aviso de ataque e interrupção;
- dois espaços de consumíveis com uso manual/automático e limiares;
- Serviço — Estrada Baixa com recompensa extra idempotente no primeiro conclusão;
- penalidade monetária de derrota fora de Masmorra;
- `ExpedicaoNaMasmorra` persistível;
- rota irreversível e salas idempotentes;
- Dún Liath — Fácil com Bolsa de Expedição, desgaste, recuperação e retirada segura;
- Crúbach, Tromghiallach, Cosantóir e Fairtheoir em duas fases;
- decisão Matar/Poupar persistente;
- Registro de Suprimentos, Fragmento do Tratado e recompensas de primeiro conclusão;
- `EstruturaDoJogo` canônico com `Personagem / Atividades / Aventura / Cidade`;
- Jornada e Inventário rápido como camadas globais de continuidade;
- continuidade Ocioso em navegação segura, Preparação e retorno de risco;
- Combate e Masmorra como estados focados;
- retorno sem conexão dedicado;
- visual execução alinhado à Direção Visual 0.1 e estratégia responsiva/mobile.

## Esquema atual

```text
versaoDoEsquemaDaPartida = 11
```

- v7: Banco persistente;
- v8: normalização/migração do Anel do Viajante como equipamento real;
- v9: estado persistente da Árvore de Prestígio do personagem.
- v10: meta e histórico de fabricação da Jornada;
- v11: descobertas do Códice e desafios concluídos; migrações preservam Jornada e restante da partida.

## Observação de validação qualitativa

Um teste com jogadores humano independente continua recomendado para avaliar ritmo, clareza, resposta e sensação de jogo. Ele não foi registrado como executado automaticamente e não deve ser confundido com a suíte técnica que fechou o M6.

## Não implementar sem novo marco aprovado

- servidor;
- conta Conectado;
- Partida na Nuvem;
- Mercado P2P;
- Risco/Confiança operacional;
- Masmorra Certificada;
- Registro de Relíquias Conectado;
- PostgreSQL remoto;
- Supabase;
- Tauri obrigatório;
- expansão de conteúdo sem novo escopo definido.
