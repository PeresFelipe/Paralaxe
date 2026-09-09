# Greywake

> **Título provisório do projeto.** O nome final do jogo permanece em aberto no GDD.

Idle RPG Dark Fantasy Web-first, 2D e UI-heavy, com progressão de longo prazo, crafting, combate automático, Dungeons procedurais e narrativa centrada em descoberta e conflito.

## Status atual

O projeto está na **Build de Validação 0.1 — Fase 1: Jogo Local**.

O objetivo desta etapa é provar que os sistemas principais funcionam juntos em uma experiência jogável curta e incremental, encerrando naturalmente no primeiro clear de **Dún Liath — Fácil**.

A Build 0.1 não possui backend, conta Online, Cloud Save ou Mercado entre jogadores. A fundação é local e deve operar sem custo recorrente de infraestrutura.

### Marco técnico atual

```text
M0 — Projeto abre
```

O workspace inicial conecta a aplicação Web às camadas de domínio, conteúdo, persistência e UI. O próximo marco é **M1 — criar e carregar personagem**.

## Stack da Build 0.1

- **TypeScript** — linguagem principal;
- **React** — interface;
- **Vite** — desenvolvimento e build;
- **HTML + CSS** — layout, design system e responsividade;
- **IndexedDB** — alvo da persistência local do save;
- **pnpm workspaces** — organização do monorepo;
- **Oxlint** — lint da base TypeScript/React;
- **Vitest** — testes automatizados do domínio.

O domínio do jogo deve permanecer independente da UI e da implementação concreta de persistência.

## Executar localmente

Pré-requisitos:

- Node.js compatível com Vite 8 (`20.19+` ou `22.12+`);
- pnpm.

```bash
pnpm install
pnpm dev
```

O Vite exibirá o endereço local da aplicação no terminal.

Validação da fundação:

```bash
pnpm check
```

Esse comando executa lint, typecheck e os testes existentes.

## Documentação

| Documento | Função |
|---|---|
| [`docs/GDD.md`](docs/GDD.md) | Especificação canônica do jogo e requisitos arquiteturais permanentes |
| [`docs/builds/0.1-validation-plan.md`](docs/builds/0.1-validation-plan.md) | Escopo, stack, valores provisórios, implementação e validação da Build 0.1 |

## Estrutura inicial

```text
.
├── apps/
│   └── game/                 # aplicação React/Vite
├── packages/
│   ├── domain/               # regras do jogo
│   ├── content/              # Content Catalog
│   ├── persistence/          # contratos e persistência local
│   └── ui/                   # design system e componentes compartilhados
└── docs/
    ├── GDD.md
    └── builds/
        └── 0.1-validation-plan.md
```

Dentro de `packages/domain/`, os sistemas continuam separados por responsabilidade (`character`, `skills`, `inventory`, `equipment`, `combat`, `dungeon` etc.). O mesmo princípio vale para as subdivisões já preparadas nos demais packages.

## Princípios técnicos da Fase 1

> **Pouco conteúdo, estrutura real.**

- UI envia intenções; não altera save diretamente.
- Use Cases coordenam operações entre módulos.
- Content Catalog permanece separado do estado do jogador.
- IDs de conteúdo são estáveis.
- RNG é centralizado, seedable e reproduzível.
- Save é versionado.
- A persistência local fica atrás de contratos para permitir uma implementação Online futura sem reconstruir o domínio.

## Futuro Online

O GDD já prevê saves **Offline** e **Online** separados e imutáveis. As fases futuras poderão adicionar Cloud Save, Risk/Trust, Certified Dungeons, Relic Registry e Mercado server-side. Essas capacidades não fazem parte da Build 0.1.
