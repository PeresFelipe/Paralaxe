# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M4 — Primeiro combate completo**.

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
- pools derivados de Vida, Mana e Stamina;
- regeneração provisória de Mana e Stamina;
- Defesa, Precisão, crítico e velocidade provisórios;
- armas iniciais com tipo de dano, intervalo e scaling;
- quatro slots de habilidade já respeitados pelo motor;
- habilidade ativa substitui o ataque básico da ação;
- cooldown separado do relógio de ação;
- custo de Mana/Stamina;
- estilos Agressivo, Defensivo e Misto no estado persistido;
- condição defensiva simples por percentual de Vida;
- telegraph genérico com suporte a interrupção explícita;
- ordem determinística com prioridade do personagem quando timestamps coincidem;
- Lobo de Estrada com Bote telegráfico de 1,2 s e atraso inicial;
- vitória/derrota/timeout;
- recompensa de 35 XP do Lobo somente em vitória;
- estado persistente `wolfDefeated` e resumo da última luta;
- UI de validação do primeiro combate com replay temporal, log e repetição da mesma seed;
- testes de recursos derivados, determinismo, telegraph e persistência da vitória.

## Fronteiras preservadas

- UI envia intenções e não implementa fórmulas de combate;
- `@greywake/domain` concentra regras temporais, RNG e resolução;
- `@greywake/content` fornece armas, habilidades e inimigos como Definitions;
- `@greywake/persistence` continua atrás de contrato local;
- RNG usa seed explícita e é reproduzível;
- nenhuma capacidade Online foi adicionada.

## Schema atual

```text
save_schema_version = 4
```

Principais adições do v4:

```text
combat.preferences.style
combat.preferences.defensiveHealthThresholdPercent
combat.lastRun
combat.wolfDefeated
```

Saves v1–v3 são migrados automaticamente ao serem carregados.

## Próximo marco

**M5 — Dún Liath completa**.

Objetivo imediato:

1. modelar `DungeonRun` persistente e seed da expedição;
2. implementar Bolsa de Expedição separada;
3. gerar a primeira estrutura de Dún Liath — Fácil;
4. implementar salas de combate, recuperação, evento e loot;
5. adicionar Crúbach, Tromghiallach e Cosantóir;
6. implementar bifurcação irreversível e retirada pré-Boss;
7. implementar evento Matar/Poupar;
8. persistir Registro de Suprimentos e Fragmento do Tratado;
9. implementar Fairtheoir com duas fases;
10. concluir a Dungeon e retornar à Cidade Livre.

## Observação de validação

A implementação foi revisada estruturalmente pelo repositório. Nesta sessão não há runner local conectado ao checkout do projeto, então `pnpm check` ainda deve ser executado em ambiente com Node/pnpm antes de considerar o marco validado por execução.

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
