# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M6 — Build 0.1 validável: ✅ FECHADO**

O M5.5 — UX Foundation e o M6 — Build 0.1 validável estão concluídos. A Build 0.1 local possui fluxo integrado de criação de personagem, Idle/offline, crafting, equipamento, Mercado, Banco, combate, Serviço e Dún Liath — Fácil, usando o `GameShell` canônico.

O próximo marco de produto ainda deve ser definido explicitamente antes de iniciar novo escopo. Não adicionar sistemas Online ou novo conteúdo apenas para prolongar a Build 0.1.

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
save_schema_version = 8
```

- v7: Banco persistente;
- v8: normalização/migração do Anel do Viajante como equipamento real.

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
