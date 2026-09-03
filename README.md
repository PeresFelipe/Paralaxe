# Projeto Game

Idle RPG em desenvolvimento, com foco em progressão de longo prazo, crafting, combate automático, Dungeons procedurais e narrativa Dark Fantasy.

## Status atual

O projeto está na fase de **Build de Validação 0.1**.

O objetivo desta etapa é provar que os sistemas principais funcionam juntos em uma experiência jogável curta e incremental, encerrando naturalmente no primeiro clear de **Dún Liath — Fácil**.

## Documentação

| Documento | Função |
|---|---|
| [`docs/GDD.md`](docs/GDD.md) | Fonte de verdade do Game Design e das regras de negócio |
| [`docs/builds/0.1-validation-plan.md`](docs/builds/0.1-validation-plan.md) | Escopo, cenários, métricas e critérios de validação da Build 0.1 |

### Regra de manutenção

O `GDD.md` é o documento canônico do projeto.

- decisões de design aprovadas devem ser consolidadas nele;
- documentos de build não devem duplicar desnecessariamente regras de negócio;
- valores provisórios podem existir para validação sem representar balanceamento final;
- cada build deve incrementar a anterior, evitando sistemas descartáveis.

## Estrutura atual

```text
.
├── README.md
└── docs/
    ├── GDD.md
    └── builds/
        └── 0.1-validation-plan.md
```

A estrutura será expandida somente quando houver necessidade real de novos tipos de documentação ou implementação.

## Princípio da Build 0.1

> **Pouco conteúdo, estrutura real.**

A primeira build deve validar a fundação do jogo sem exigir a implementação antecipada de todo o conteúdo planejado para o projeto.
