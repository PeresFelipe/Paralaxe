# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M6 — Build 0.1 validável**.

O **M5.5 — UX Foundation está fechado**. A navegação canônica, o `GameShell`, os estados de risco, a continuidade Idle, o retorno offline, o visual runtime e a estratégia responsiva foram integrados à build real. O M6 é retomado com o balanceamento/validação 23/24 como bloqueio conhecido.

Documento de trabalho do marco:

```text
docs/implementation/M5.5-UX-FOUNDATION.md
```

## Objetivo do M5.5

Transformar os sistemas já implementados em uma experiência navegável e coerente antes de retomar a validação final da Build 0.1.

Prioridades:

1. resolver o caso `Mago × Mineração → Cosantóir` sem mascarar o balanceamento;
2. restaurar a matriz automatizada 6 classes × 4 rotas para 24/24;
3. validar o fluxo real novo save → Dún Liath sobre o `GameShell` integrado;
4. corrigir regressões funcionais encontradas na validação da Build 0.1;
5. manter Banco, Ferreiro e Relicário como destinos da Cidade sem inventar regras de domínio ainda não aprovadas.

## Ladder atual

```text
M0 — Projeto abre                         ✅
M1 — Criar e carregar personagem          ✅
M2 — Idle persiste e funciona offline     ✅
M3 — Crafting e equipamento               ✅
M4 — Primeiro combate completo            ✅
M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      ✅
M6 — Build 0.1 validável                  🟡 EM VALIDAÇÃO
```

## Implementado até aqui

- criação e carregamento de save `OFFLINE`;
- classes, presentes e estado inicial do personagem;
- persistência IndexedDB com schema versionado;
- migração automática de saves antigos;
- sete Skills;
- uma atividade Idle por vez;
- quatro coletas iniciais com progresso offline;
- produção Idle determinística;
- receitas iniciais de Metalurgia, Forja e Culinária;
- equipamentos como instâncias individuais;
- reforço +1;
- progressão geral 1–10 centralizada;
- Mercado NPC básico;
- Combat Engine determinístico/seedable;
- habilidades, cooldown, recursos, telegraph e interrupção;
- dois slots de consumíveis com uso manual/automático e thresholds;
- status/buildup necessários à Build 0.1;
- Serviço — Estrada Baixa;
- recompensa única do Serviço integrada ao primeiro clear do Lobo;
- `DungeonRun` persistível;
- rota irreversível e salas resolvidas idempotentes;
- Dún Liath — Fácil com primeira visita controlada de 16–17 salas;
- Bolsa de Expedição separada do inventário seguro;
- attrition real entre encontros;
- sala de recuperação;
- retirada segura pré-Boss;
- Crúbach, Tromghiallach, Cosantóir e Fairtheoir;
- posturas defensivas e vulnerabilidades dos encontros principais;
- Fairtheoir em duas fases com recursos e consumíveis persistindo corretamente entre elas;
- Matar/Poupar persistente;
- Registro de Suprimentos da Guarnição;
- Fragmento do Tratado;
- contrato de Dún Liath com 2 Preparados de Campo concedidos uma única vez na aceitação;
- primeiro clear desbloqueia Guarda Instintiva;
- técnicas ensináveis pré-Dún Liath implementadas;
- teste de fechar/reabrir `DungeonRun` via IndexedDB;
- CI GitHub Actions com Node 22 + pnpm;
- lint e typecheck estritos;
- testes automatizados de domínio/content/persistence.
- `GameShell` canônico integrado ao runtime;
- navegação principal `Personagem / Atividades / Aventura / Cidade`;
- Jornada e Inventário rápido como camadas globais de continuidade;
- Mercado, Combate e Dungeon controlados pelo save ativo único;
- continuidade Idle integrada a Combate/Dungeon sem parada manual;
- criação de personagem em fluxo guiado;
- retorno offline com reconciliação em estado próprio;
- visual runtime alinhado à Direção Visual 0.1 e estratégia responsiva/mobile.

## Migração de UX — Fase 3 ✅

A Fase 3 do M5.5 está concluída. A raiz antiga com `App`, `MarketWorkbench`, `CombatWorkbench` e `DungeonWorkbench` empilhados foi removida. O runtime agora renderiza apenas `App`, que controla um único save ativo e apresenta o `GameShell`.

Arquitetura aprovada em implementação:

```text
NAVEGAÇÃO PRINCIPAL
Personagem | Atividades | Aventura | Cidade

CONTINUIDADE GLOBAL
Jornada + Inventário rápido + atividade Idle atual

ESTADOS DE RISCO
Preparação → Combate / Dungeon → retorno seguro
```

Mercado, Combate e Dungeon agora recebem o mesmo save ativo do shell. Combate e Dungeon deixam de operar como mini-apps com seleção própria de save. A atividade Idle continua em navegação segura, é congelada ao confirmar risco e é retomada automaticamente ao retornar à segurança.

## Estado técnico de M6 antes da pausa

A matriz automatizada 6 classes × 4 rotas chegou a **23/24** combinações estruturalmente completáveis.

Único caso ainda não fechado:

```text
Mago × Mineração → Cosantóir
```

Esse balanceamento não foi mascarado durante o M5.5 e agora volta a ser o bloqueio principal do **M6**. A validação final do M5.5 confirmou lint e typecheck sem erros, 34/34 testes de domínio passando, persistência passando e build de produção concluída com sucesso; o CI normal permanece vermelho exclusivamente porque a matriz ainda está em 23/24.

## Schema atual

```text
save_schema_version = 6
```

O v6 adiciona configuração persistente dos dois slots de consumíveis de combate e mantém migração automática de versões anteriores.

## Critério de saída do M5.5

O M5.5 termina quando:

- houver uma arquitetura de navegação escolhida;
- `GameShell` estiver definido;
- nenhuma ferramenta principal aparecer empilhada na experiência normal;
- cada sistema da Build 0.1 possuir um lugar claro na navegação;
- atividade Idle permanecer compreensível durante navegação;
- combate e Dungeon tiverem estados focados;
- desktop e mobile tiverem estratégia explícita;
- o fluxo novo save → Dún Liath puder ser percorrido sem abrir workbenches técnicos.

Depois disso, retomamos o **M6 — Build 0.1 validável**.

## Não implementar ainda

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
- novo conteúdo de gameplay só para preencher telas durante o M5.5.
