# Greywake

RPG ocioso de fantasia sombria, com coleta, fabricação, combate automático e expedições. O título é provisório.

## Estado atual

A versão 0.1 funciona localmente e integra criação de personagem, sete profissões, inventário, banco, equipamentos, mercado, combate e Dún Liath. A Jornada permite acompanhar uma receita e registrar a primeira fabricação.

O código próprio, os caminhos, os comandos e a documentação estão em português brasileiro. Os identificadores de código usam português sem acentos; os textos exibidos usam acentuação normal.

## Executar

Requisitos: Node.js compatível com Vite 8 (`20.19+` ou `22.12+`) e pnpm.

```bash
pnpm install
pnpm desenvolver
```

```bash
pnpm verificar
pnpm compilar
```

`pnpm verificar` executa análise estática, verificação de tipos e testes. A compilação gera a aplicação em `aplicativos/jogo/dist`. A automação do GitHub executa os mesmos comandos.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `aplicativos/jogo/fonte` | Telas, componentes React e estilos |
| `aplicativos/jogo/publico` | Imagens, animações, fontes e avisos de licença |
| `pacotes/dominio/fonte` | Regras e estado do jogo |
| `pacotes/conteudo/fonte` | Catálogos de classes, itens, receitas e masmorras |
| `pacotes/persistencia/fonte` | IndexedDB, migrações e compatibilidade das partidas |
| `pacotes/interface/fonte` | Contratos compartilhados de interface |
| `documentacao` | GDD, experiência do usuário, pesquisas e validação |

Os nomes dos pacotes são `@greywake/jogo`, `@greywake/dominio`, `@greywake/conteudo`, `@greywake/persistencia` e `@greywake/interface`.

## Documentação

- [GDD](documentacao/GDD.md): regras canônicas do jogo.
- [GDD de experiência do usuário](documentacao/UX-GDD.md): navegação e interação.
- [Plano de validação da versão 0.1](documentacao/versoes/0.1-plano-de-validacao.md).
- [Estado atual](documentacao/implementacao/ESTADO-ATUAL.md).
- [Tradução para PT-BR](documentacao/implementacao/TRADUCAO-PTBR.md): caminhos, comandos e compatibilidade.

## Partidas existentes

As partidas anteriores continuam no mesmo banco IndexedDB e no esquema 10. O adaptador de persistência converte nomes de campos e identificadores entre o formato antigo e o domínio em português. Nomes escolhidos pelo jogador e identificadores de instâncias são preservados.

A interface envia intenções ao domínio, que concentra as regras. O conteúdo permanece separado do estado do jogador. Recursos conectados, conta, armazenamento na nuvem e mercado entre jogadores dependem de um novo marco de desenvolvimento.

## Créditos de recursos visuais

- **[Antiquity Print](https://ninjikin.itch.io/font-antiquity-script)** por **[SciGho](https://ninjikin.itch.io/)** — Copyright SciGho 2021, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). O TTF original é distribuído sem alterações. [Atribuição e proveniência da licença](aplicativos/jogo/publico/fontes/antiquity-print-LICENSE.txt).

A fonte é usada na marca Greywake. No tema de jogo, os títulos e a navegação operacional usam Georgia para manter os acentos do português na mesma família. O arquivo original não inclui letras acentuadas; o navegador usa fontes de apoio quando necessário. Os créditos também podem ser consultados no próprio jogo. A fonte e seu aviso de atribuição são incluídos no cache sem conexão.

- **[Shikashi&apos;s Fantasy Icons Pack (FREE)](https://shikashipx.itch.io/shikashis-fantasy-icons-pack)** por **[Matt Firth (shikashipx)](https://shikashipx.itch.io/)** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), com designs derivados de **[game-icons.net](https://game-icons.net/)**. [Aviso de atribuição](aplicativos/jogo/publico/arte/icones/shikashi/LICENSE.txt).

O Greywake usa recortes 32×32 da folha transparente v2 em Profissões, indicadores globais, materiais, Inventário, Banco e Equipamento. Os recortes não foram recoloridos ou redesenhados; a licença e a proveniência ficam junto dos arquivos públicos e os créditos aparecem no jogo.

- **[Dark Ages UI](https://hypnobius.itch.io/dark-ages-ui)** por **Hypnobius** — uso pessoal e comercial gratuito, conforme [licença original](aplicativos/jogo/publico/arte/interface/dark-ages/LICENSE.txt). Crédito opcional, incluído no jogo. Quatro recortes sem recoloração implementam molduras, espaços e ornamento. Não redistribuir esses recursos visuais como pacote separado. [Proveniência](aplicativos/jogo/publico/arte/interface/dark-ages/README.md).

Pesquisa, decisões do tema e limites da validação: [Interface de jogo medieval fantasia sombria](documentacao/pesquisa/INTERFACE-DE-JOGO-2026-09-15.md).
