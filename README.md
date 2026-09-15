# Greywake

> **Título provisório do projeto.** O nome final do jogo permanece em aberto no GDD.

Idle RPG Dark Fantasy Web-first, 2D e UI-heavy, com progressão de longo prazo, crafting, combate automático, Dungeons procedurais e narrativa centrada em descoberta e conflito.

## Status atual

A **Build de Validação 0.1 — Fase 1: Jogo Local** concluiu sua ladder técnica até o **M6 — Build 0.1 validável**.

A Build 0.1 prova que os sistemas principais funcionam juntos em uma experiência local curta e incremental, encerrando naturalmente no primeiro clear de **Dún Liath — Fácil**.

Ela não possui backend, conta Online, Cloud Save ou Mercado entre jogadores. A fundação continua local e sem custo recorrente de infraestrutura.

### Marcos concluídos

```text
M0 — Projeto abre                         ✅
M1 — Criar e carregar personagem          ✅
M2 — Idle persiste e funciona offline     ✅
M3 — Crafting e equipamento               ✅
M4 — Primeiro combate completo            ✅
M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      ✅
M6 — Build 0.1 validável                  ✅
```

A matriz automatizada `6 classes × 4 rotas` está em **24/24**. A build possui `GameShell` canônico, continuidade Idle, estados focados de risco, Banco funcional, proteção de capacidade do Inventário nos fluxos implementados e build de produção validada.

O próximo marco de produto deve ser definido explicitamente antes de iniciar novo escopo.

Documentos de fechamento:

- [`docs/implementation/M5.5-UX-FOUNDATION.md`](docs/implementation/M5.5-UX-FOUNDATION.md)
- [`docs/implementation/M6-VALIDATION.md`](docs/implementation/M6-VALIDATION.md)
- [`docs/implementation/CURRENT-STATUS.md`](docs/implementation/CURRENT-STATUS.md)

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
| [`docs/UX-GDD.md`](docs/UX-GDD.md) | Arquitetura e regras canônicas de experiência/UX |
| [`docs/builds/0.1-validation-plan.md`](docs/builds/0.1-validation-plan.md) | Escopo, stack, valores provisórios, implementação e validação da Build 0.1 |
| [`docs/implementation/M5.5-UX-FOUNDATION.md`](docs/implementation/M5.5-UX-FOUNDATION.md) | Fechamento da fundação de UX |
| [`docs/implementation/M6-VALIDATION.md`](docs/implementation/M6-VALIDATION.md) | Fechamento técnico da Build 0.1 validável |
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
    ├── UX-GDD.md
    ├── builds/
    │   └── 0.1-validation-plan.md
    └── implementation/
        ├── M5.5-UX-FOUNDATION.md
        ├── M6-VALIDATION.md
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

O GDD já prevê saves **Offline** e **Online** separados e imutáveis. Fases futuras poderão adicionar Cloud Save, Risk/Trust, Certified Dungeons, Relic Registry e Mercado server-side. Essas capacidades não fazem parte da Build 0.1 e só devem entrar após um novo marco ser definido.

## Créditos de assets

- **[Antiquity Print](https://ninjikin.itch.io/font-antiquity-script)** por **[SciGho](https://ninjikin.itch.io/)** — Copyright SciGho 2021, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). O TTF original é distribuído sem alterações. [Atribuição e proveniência da licença](apps/game/public/fonts/antiquity-print-LICENSE.txt).

A fonte é usada na marca Greywake. No tema de jogo, os títulos e a navegação operacional usam Georgia para manter os acentos do português na mesma família. O arquivo original não inclui letras acentuadas; o navegador usa fontes de apoio quando necessário. Os créditos também podem ser consultados no próprio jogo. A fonte e seu aviso de atribuição são incluídos no cache offline.

- **[Shikashi&apos;s Fantasy Icons Pack (FREE)](https://shikashipx.itch.io/shikashis-fantasy-icons-pack)** por **[Matt Firth (shikashipx)](https://shikashipx.itch.io/)** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), com designs derivados de **[game-icons.net](https://game-icons.net/)**. [Aviso de atribuição](apps/game/public/art/icons/shikashi/LICENSE.txt).

O Greywake usa recortes 32×32 da folha transparente v2 em Skills, indicadores globais, materiais, Inventário, Banco e Equipamento. Os recortes não foram recoloridos ou redesenhados; a licença e a proveniência ficam junto dos arquivos públicos e os créditos aparecem no jogo.

- **[Dark Ages UI](https://hypnobius.itch.io/dark-ages-ui)** por **Hypnobius** — uso pessoal e comercial gratuito, conforme [licença original](apps/game/public/art/ui/dark-ages/LICENSE.txt). Crédito opcional, incluído no jogo. Quatro recortes sem recoloração implementam molduras, slots e ornamento. Não redistribuir esses assets como pacote separado. [Proveniência](apps/game/public/art/ui/dark-ages/README.md).

Pesquisa, decisões do tema e limites da validação: [UI de jogo medieval dark fantasy](docs/research/GAME-UI-2026-09-15.md).
