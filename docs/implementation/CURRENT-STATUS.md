# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M6 — Build 0.1 validável**.

A fundação estrutural M0–M5 está implementada. O trabalho atual é fechar diferenças de fidelidade, validar o fluxo integrado e registrar o resultado da Build 0.1.

## Implementado até aqui

- criação e carregamento de save `OFFLINE`;
- classes, presentes e estado inicial do personagem;
- persistência IndexedDB com schema versionado;
- migração automática de saves antigos para o schema atual;
- sete Skills com estado inicial;
- uma atividade Idle por vez;
- quatro coletas iniciais com progresso offline;
- limite offline inicial de 4 h;
- XP de Skill e +5 XP Geral por nível de Skill;
- produção Idle determinística;
- receitas mínimas de Metalurgia, Forja e Culinária;
- equipamentos como instâncias individuais;
- reforço +1 aplicado a uma instância concreta;
- Combat Engine determinístico/seedable;
- ataque básico, habilidade ativa, cooldown, recursos e telegraph;
- Lobo de Estrada e primeiro combate persistível;
- `DungeonRun` persistível no save;
- seed da expedição;
- rota irreversível e salas resolvidas idempotentes;
- primeira visita controlada com 16–17 salas conforme bifurcação;
- Bolsa de Expedição separada do inventário seguro;
- loot da run perdido em derrota;
- loot transferido somente em retirada segura/clear;
- Vida/Mana/Stamina realmente persistem entre encontros e cada combate inicia com os recursos restantes da run;
- Fase 2 de Fairtheoir inicia com os recursos restantes da Fase 1;
- sala de recuperação pré-Boss restaura Vida/Mana/Stamina;
- retirada segura disponível antes de Fairtheoir;
- Crúbach;
- Tromghiallach;
- Cosantóir;
- pools mínimos de equipamento de Dún Liath;
- raridade Comum/Incomum/Raro e quantidade correspondente de afixos;
- Arsenal Abandonado com Capacete da Guarnição garantido;
- Viga de Dún Liath garantida por Cosantóir;
- evento Matar/Poupar sem recompensa moral imediata;
- primeira decisão Matar/Poupar permanece como estado narrativo persistente;
- Registro de Suprimentos da Guarnição;
- Fragmento do Tratado;
- Fairtheoir encadeado em duas fases mecânicas:
  - Fase 1 — O Vigia: 206 HP efetivos até o limiar de 45%;
  - Fase 2 — Desespero: 169 HP restantes;
- Última Investida disponível na segunda fase;
- Fragmento de Fairtheoir no clear;
- contrato concluível por 150 moedas + 150 XP;
- primeiro clear desbloqueia Guarda Instintiva;
- UI funcional para iniciar run, resolver salas, escolher rota, decidir Matar/Poupar, acompanhar Bolsa/recursos, retirar ou enfrentar o Boss;
- CI no GitHub Actions com Node 22 + pnpm;
- `pnpm check` validado em runner real;
- lint validado em runner real;
- typecheck estrito validado em runner real;
- 21 testes automatizados do domínio passando;
- build de produção Vite validado em runner real.

## Validação automatizada atual

Workflow:

```text
.github/workflows/validate.yml
```

Pipeline:

```text
pnpm install --no-frozen-lockfile
↓
pnpm check
  ├── lint
  ├── typecheck
  └── tests
↓
pnpm build
```

Última execução verificada neste marco: **sucesso completo**.

## Fronteiras preservadas

- UI envia intenções e não implementa regras da Dungeon;
- `@greywake/domain` concentra regras de progressão, crafting, combate e `DungeonRun`;
- `@greywake/content` fornece Definitions de classes, atividades, receitas, salas, inimigos e equipamentos;
- `@greywake/persistence` continua atrás de contrato local;
- Definitions não são duplicadas no save;
- a run salva somente IDs, seed e estado mutável necessário;
- `exactOptionalPropertyTypes` e demais regras estritas de TypeScript permanecem ativas;
- nenhuma capacidade Online foi adicionada.

## Schema atual

```text
save_schema_version = 5
```

Principais adições do v5:

```text
dungeon.activeRun
dungeon.dunLiathEasyCleared
dungeon.dunLiathProtector
dungeon.contractCompleted
dungeon.instinctiveGuardUnlocked

DungeonRun:
  dungeonDefinitionId
  difficulty
  seed
  currentRoomId
  visitedRoomIds
  resolvedRoomIds
  chosenBranches
  expeditionBag
  expeditionEquipment
  resources
  protectorDecision
  supplyRegisterRecovered
  treatyFragmentRecovered
  safeExtractionAvailable
  completed
```

Saves v1–v4 são migrados automaticamente ao serem carregados.

## M6 — trabalho restante

1. validar o fluxo completo do novo save até o primeiro clear em execução integrada;
2. validar a matriz 6 classes × 4 rotas iniciais;
3. integrar/validar consumíveis de combate e seus thresholds;
4. integrar os status/buildup necessários para a fidelidade dos encontros da 0.1;
5. revisar posturas defensivas de Tromghiallach/Cosantóir/Fairtheoir que ainda estão simplificadas;
6. validar persistência fechando/reabrindo durante uma `DungeonRun` real no navegador;
7. corrigir concessão dos 2 Preparados de Campo para ocorrer ao aceitar o contrato, não a cada nova run;
8. registrar resultados, balanceamento observado e bugs da Build 0.1.

## Limitações conhecidas no M6

- a fundação de status existe no GDD/Build, mas Veneno/Sangramento/Atordoamento/Queimadura/Congelamento ainda não estão todos conectados ao motor;
- posturas defensivas específicas de Tromghiallach/Cosantóir/Fairtheoir ainda estão simplificadas;
- consumíveis em combate e seus thresholds ainda precisam de validação integrada;
- os 2 Preparados de Campo do contrato ainda são concedidos no início de cada run em vez de uma única vez na aceitação;
- a primeira estrutura de Dún Liath é controlada e seedable; proceduralidade estrutural mais ampla deve ser validada/expandida depois que o vertical slice estiver estável.

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
- Tauri obrigatório.
