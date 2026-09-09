# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M3 — Crafting e equipamento**.

Implementado até este marco:

- criação e carregamento de save `OFFLINE`;
- classes, presentes e estado inicial do personagem;
- persistência IndexedDB com schema versionado;
- migração de saves v1 e v2 para o schema v3;
- sete Skills com estado inicial;
- uma atividade Idle por vez;
- quatro coletas iniciais com progresso offline;
- limite offline inicial de 4 h;
- XP de Skill e +5 XP Geral por nível de Skill;
- produção Idle determinística;
- produção continua enquanto houver materiais;
- produção para automaticamente quando os materiais acabam;
- receitas mínimas de Metalurgia, Forja e Culinária;
- Cloch Tratada;
- Braçadeiras de Giúis;
- Scadán Assado;
- Preparado de Neantóg;
- Reforço Simples +1;
- equipamentos como instâncias individuais;
- slots equipados apontam para `instanceId`, não para Definition;
- primeiro equipamento craftável pode ser equipado;
- reforço +1 aplicado a uma instância concreta;
- +1 aumenta o atributo-base principal em 15%, arredondando para cima;
- testes de crafting, consumo de materiais, parada por falta de insumos e reforço.

## Fronteiras preservadas

- UI envia intenções e não escreve diretamente no formato do save;
- `@greywake/domain` concentra regras de crafting, equipamento e progressão;
- `@greywake/content` fornece Definitions de receitas e equipamentos;
- `@greywake/persistence` continua atrás de contrato local;
- equipamento normal já possui identidade de instância separada da Definition;
- coleta e produção respeitam a regra de uma atividade Idle por vez;
- nenhuma capacidade Online foi adicionada.

## Schema atual

```text
save_schema_version = 3
```

Principais adições do v3:

```text
character.equipment          → slot -> equipment_instance_id
character.equipmentItems     → instâncias individuais
character.nextEquipmentSequence
crafting.activeRecipe
```

Saves v1/v2 são migrados automaticamente ao serem carregados.

## Próximo marco

**M4 — Primeiro combate completo**.

Objetivo imediato:

1. modelar recursos de combate derivados de atributos;
2. criar o primeiro Combat Engine determinístico/seedable;
3. implementar ataque básico e relógio de ação;
4. implementar quatro slots de habilidade;
5. implementar cooldown, Mana e Stamina;
6. implementar telegraph e interrupção;
7. criar o Lobo de Estrada;
8. executar o primeiro combate completo até vitória ou morte;
9. persistir resultado e XP.

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
