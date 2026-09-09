# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M5 — Dún Liath completa**.

Implementado até este marco:

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
- recursos de combate persistidos entre encontros como attrition da expedição;
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
- testes de `DungeonRun`, irreversibilidade, idempotência, retirada, perda de loot e recompensa de primeiro clear.

## Fronteiras preservadas

- UI envia intenções e não implementa regras da Dungeon;
- `@greywake/domain` concentra `DungeonRun`, resolução, loot, risco e consequências;
- `@greywake/content` fornece Definitions de salas, inimigos e equipamentos;
- `@greywake/persistence` continua atrás de contrato local;
- Definitions não são duplicadas no save;
- a run salva somente IDs, seed e estado mutável necessário;
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

## Próximo marco

**M6 — Build 0.1 validável**.

Objetivo imediato:

1. executar `pnpm check` em checkout real com Node/pnpm;
2. corrigir qualquer erro de lint/typecheck/teste encontrado;
3. validar o fluxo completo do novo save até o primeiro clear;
4. validar as 6 classes × 4 rotas iniciais;
5. fechar diferenças entre o Combat Engine atual e a matriz completa do plano;
6. validar consumíveis e thresholds no fluxo integrado;
7. validar status/buildup que forem necessários para a fidelidade dos encontros da 0.1;
8. revisar regras defensivas dos inimigos que ainda estejam simplificadas na implementação estrutural;
9. validar persistência fechando/reabrindo durante uma DungeonRun;
10. registrar resultados e bugs da Build 0.1.

## Limitações conhecidas antes do M6

- nesta sessão não há runner local conectado ao checkout, então `pnpm check` ainda não foi executado;
- a fundação de status existe no GDD/Build, mas Veneno/Sangramento/Atordoamento/Queimadura/Congelamento ainda não estão todos conectados ao motor;
- posturas defensivas específicas de Tromghiallach/Cosantóir/Fairtheoir ainda estão simplificadas;
- consumíveis em combate e seus thresholds ainda precisam de validação integrada;
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
