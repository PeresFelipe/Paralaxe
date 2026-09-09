# Estado atual da implementação

## Projeto

**Greywake** — título provisório.

## Build

**0.1 — Fase 1: Jogo Local**.

## Marco atual

**M1 — Criar e carregar personagem**.

Implementado neste marco:

- criação exclusiva de save `OFFLINE` na Build 0.1;
- nome do personagem;
- seis classes iniciais com orçamento de 35 atributos;
- sete presentes iniciais;
- equipamento e habilidade inicial registrados no estado do personagem;
- save schema versionado;
- `contentVersion` separado do schema do save;
- contrato `OfflineSaveRepository`;
- implementação IndexedDB;
- listagem e carregamento de saves existentes;
- UI de criação e seleção de personagem;
- testes de domínio para criação de personagem e orçamento de classe.

## Fronteiras preservadas

- React não monta nem altera diretamente o formato persistido do save;
- `@greywake/domain` não depende de React, IndexedDB ou Content Catalog;
- `@greywake/content` fornece Definitions e depende apenas dos tipos do domínio;
- `@greywake/persistence` persiste o State através de contrato próprio;
- nenhuma capacidade Online foi adicionada.

## Próximo marco

**M2 — Idle persiste e funciona offline**.

Objetivo imediato:

1. definir o estado mínimo das sete Skills;
2. implementar uma atividade Idle por vez;
3. registrar `activity_definition_id`, `started_at` e `last_processed_at` no save;
4. processar progresso por tempo decorrido;
5. persistir o estado sem depender da UI aberta;
6. validar fechar/reabrir o jogo e receber o progresso correto.

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
