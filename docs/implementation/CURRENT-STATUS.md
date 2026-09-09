# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M2 — Idle persiste e funciona offline**.

Implementado até este marco:

- criação exclusiva de save `OFFLINE` na Build 0.1;
- nome, classe e presente do personagem;
- save schema versionado, agora em `v2`;
- migração transparente de saves `v1` criados no M1;
- estado das sete Skills;
- uma atividade Idle por vez;
- quatro coletas iniciais da Build 0.1: Cloch, Giúis, Scadán e Neantóg;
- timestamps de início e último processamento;
- resto parcial de ciclo preservado entre processamentos;
- progresso por tempo decorrido com 100% de eficiência;
- limite offline inicial de 4 h e regra de +2 h a cada 10 níveis gerais;
- descarte correto do tempo que excede o limite offline;
- recompensa determinística: apenas o recurso escolhido + XP da Skill;
- progressão de Skill 1–10 conforme valores provisórios da Build 0.1;
- +5 XP Geral por novo nível de Skill;
- recursos coletados adicionados ao inventário do personagem;
- atividade continua conceitualmente com a aplicação fechada e é processada ao carregar o save;
- atualização periódica enquanto a aplicação está aberta;
- IndexedDB continua atrás do contrato `OfflineSaveRepository`;
- UI para iniciar, trocar e interromper uma coleta;
- feedback de progresso offline ao reabrir;
- testes de domínio para tempo, ciclos parciais, XP e limite offline.

## Fronteiras preservadas

- React envia intenções e não contém as regras de cálculo Idle;
- `@greywake/domain` calcula tempo, XP, níveis e recompensas;
- `@greywake/content` define quais atividades existem e seus valores;
- `@greywake/persistence` migra e persiste o State local;
- nenhuma capacidade Online foi adicionada.

## Próximo marco

**M3 — Crafting e equipamento**.

Objetivo imediato:

1. transformar parte dos recursos coletados em produtos por receitas determinísticas;
2. implementar consumo de materiais por lote;
3. criar o primeiro fluxo de Metalurgia, Forja e Culinária da Build 0.1;
4. representar equipamentos obtidos/produzidos como estado persistente;
5. implementar o reforço +1 provisório;
6. conectar inventário, crafting e equipamentos sem colocar regra de negócio na UI.

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
