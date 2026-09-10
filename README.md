# Greywake

> **Título provisório do projeto.** O nome final do jogo permanece em aberto no GDD.

Idle RPG Dark Fantasy Web-first, 2D e UI-heavy, com progressão de longo prazo, crafting, combate automático, Dungeons procedurais e narrativa centrada em descoberta e conflito.

## Status atual

O projeto está na **Build de Validação 0.1 — Fase 1: Jogo Local**.

O objetivo desta etapa é provar que os sistemas principais funcionam juntos em uma experiência jogável curta e incremental, encerrando naturalmente no primeiro clear de **Dún Liath — Fácil**.

A Build 0.1 não possui backend, conta Online, Cloud Save ou Mercado entre jogadores. A fundação é local e deve operar sem custo recorrente de infraestrutura.

### Marco atual

```text
M6 — Build 0.1 validável
```

O **M5.5 — UX Foundation foi concluído**. A build real agora usa o `GameShell` canônico, uma única view principal por vez, continuidade Idle, estados focados de risco e a arquitetura `Personagem / Atividades / Aventura / Cidade`.

O M5.5 permanece formalmente entre M5 e M6:

```text
M0 — Projeto abre                         ✅
M1 — Criar e carregar personagem          ✅
M2 — Idle persiste e funciona offline     ✅
M3 — Crafting e equipamento               ✅
M4 — Primeiro combate completo            ✅
M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      ✅
M6 — Build 0.1 validável                  🟡
```

O M5.5 consolidou os sistemas existentes em uma experiência navegável: `GameShell`, navegação canônica, continuidade Idle durante áreas seguras/Preparação, estados focados de Combate/Dungeon e estratégia explícita para desktop/mobile. O M6 retoma a validação da Build 0.1 com o caso conhecido `Mago × Mineração → Cosantóir` ainda em 23/24.

Documento de trabalho:

[`docs/implementation/M5.5-UX-FOUNDATION.md`](docs/implementation/M5.5-UX-FOUNDATION.md)

## Stack da Build 0.1

- **TypeScript** — linguagem principal;
- **React** — interface;
- **Vite** — desenvolvimento e build;
- **HTML + CSS** — layout, design system e responsividade;
- **IndexedDB** — persistência local do save;
- **pnpm workspaces** — organização do monorepo;
- **Oxlint** — lint da base TypeScript/React;
- **Vitest** — testes automatizados;
- **GitHub Actions** — CI de lint, typecheck, testes e build.

O domínio do jogo permanece independente da UI e da implementação concreta de persistência.

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
pnpm build
```

O mesmo fluxo é executado automaticamente em `.github/workflows/validate.yml`.

## Documentação

| Documento | Função |
|---|---|
| [`docs/GDD.md`](docs/GDD.md) | Especificação canônica do jogo e requisitos arquiteturais permanentes |
| [`docs/builds/0.1-validation-plan.md`](docs/builds/0.1-validation-plan.md) | Escopo, stack, valores provisórios, implementação e validação da Build 0.1 |
| [`docs/implementation/M5.5-UX-FOUNDATION.md`](docs/implementation/M5.5-UX-FOUNDATION.md) | Arquitetura de experiência, navegação e critérios do marco M5.5 |
| [`docs/implementation/CURRENT-STATUS.md`](docs/implementation/CURRENT-STATUS.md) | Ponto curto de retomada da implementação |

## Estrutura inicial

```text
.
├── apps/
│   └── game/                 # aplicação React/Vite
├── packages/
│   ├── domain/               # regras do jogo
│   ├── content/              # Content Catalog
│   ├── persistence/          # contratos e IndexedDB
│   └── ui/                   # design system e componentes compartilhados
├── .github/
│   └── workflows/
│       └── validate.yml       # CI da Build 0.1
└── docs/
    ├── GDD.md
    ├── builds/
    │   └── 0.1-validation-plan.md
    └── implementation/
        ├── M5.5-UX-FOUNDATION.md
        └── CURRENT-STATUS.md
```

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
