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

- [Guia do código](documentacao/implementacao/GUIA-DO-CODIGO.md): leitura por arquivo, fluxos, comentários e configurações JSON.
- [GDD](documentacao/GDD.md): regras canônicas do jogo.
- [GDD de experiência do usuário](documentacao/UX-GDD.md): navegação e interação.
- [Plano de validação da versão 0.1](documentacao/versoes/0.1-plano-de-validacao.md).
- [Estado atual](documentacao/implementacao/ESTADO-ATUAL.md).
- [Tradução para PT-BR](documentacao/implementacao/TRADUCAO-PTBR.md): caminhos, comandos e compatibilidade.

## Partidas existentes

As partidas anteriores continuam no mesmo banco IndexedDB e no esquema 10. O adaptador de persistência converte nomes de campos e identificadores entre o formato antigo e o domínio em português. Nomes escolhidos pelo jogador e identificadores de instâncias são preservados.

A interface envia intenções ao domínio, que concentra as regras. O conteúdo permanece separado do estado do jogador. Recursos conectados, conta, armazenamento na nuvem e mercado entre jogadores dependem de um novo marco de desenvolvimento.

## Créditos e licenças

Os créditos do jogo estão organizados por personagens, interface, tipografia, produção visual e tecnologia. Incluem Mattz Art, LuizMelo, Hypnobius, Matt Firth (shikashipx), game-icons.net e SciGho, com fontes, licenças e adaptações registradas.

Consulte [CREDITOS.md](CREDITOS.md) para ver as atribuições completas, os avisos preservados e a pendência de autoria individual dos desenhos-base do game-icons.net. O botão **Créditos e licenças** abre os mesmos registros dentro do jogo.

Para acrescentar recursos, edite `aplicativos/jogo/fonte/catalogoDeCreditos.json`. Execute `pnpm verificar:creditos` para conferir a cobertura das imagens e fontes e a existência dos avisos. Essa verificação também faz parte de `pnpm verificar` e da automação do GitHub.
