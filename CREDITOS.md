# Créditos e atribuições do Greywake

Revisão: 16/09/2026. Os créditos aparecem no jogo em **Créditos e licenças**, tanto na criação/seleção de personagens quanto durante a partida.

## Arte e identidade visual

| Contribuição | Recurso e autoria | Licença / registro | Adaptação |
| --- | --- | --- | --- |
| Animação do Guerreiro. | [FREE - Knight 2D Pixel Art](https://xzany.itch.io/free-knight-2d-pixel-art), por [Mattz Art](https://xzany.itch.io/) | [Licença do autor](aplicativos/jogo/publico/arte/classes/guerreiro/MattzArt/License.txt) | Animação montada em GIF a partir dos quadros originais. |
| Animação do Mago. | [Wizard Pack](https://luizmelo.itch.io/wizard-pack), por [LuizMelo](https://luizmelo.itch.io/) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Animação montada em GIF a partir dos quadros originais. |
| Molduras, ornamentos e espaços da interface. | [Dark Ages UI](https://hypnobius.itch.io/dark-ages-ui), por [Hypnobius](https://hypnobius.itch.io/) | [Licença do autor](aplicativos/jogo/publico/arte/interface/dark-ages/LICENSE.txt) | Quatro recortes do material original, sem recoloração. |
| Ícones de profissões, recursos, inventário e equipamentos. | [Shikashi’s Fantasy Icons Pack](https://shikashipx.itch.io/shikashis-fantasy-icons-pack), por [Matt Firth (shikashipx)](https://shikashipx.itch.io/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Recortes de 32 × 32 da folha v2, sem recoloração ou redesenho. |
| Tipografia da marca Greywake. | [Antiquity Print](https://ninjikin.itch.io/font-antiquity-script), por [SciGho](https://ninjikin.itch.io/) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | © 2021 SciGho. Arquivo da fonte preservado, sem alterações. |
| Cenas, retratos, animações das profissões e símbolos do jogo. | Ambientação e identidade visual, por Projeto Greywake | Produção do projeto | Artes de ambientação geradas com assistência de IA, com recortes, montagem e ajustes para o jogo. |

## Proveniência e avisos locais

O [índice de atribuições distribuído com o jogo](aplicativos/jogo/publico/creditos/LEIA-ME.txt) reúne os avisos. As licenças originais de Mattz Art e Hypnobius e o aviso da fonte são preservados. Os registros produzidos pelo Greywake são identificados como registros, sem se apresentarem como documentos originais dos autores.

- [Guerreiro — Mattz Art](aplicativos/jogo/publico/creditos/guerreiro.txt).
- [Mago — LuizMelo](aplicativos/jogo/publico/creditos/mago.txt).
- [Interface — Hypnobius](aplicativos/jogo/publico/creditos/interface.txt).
- [Ícones — Matt Firth (shikashipx)](aplicativos/jogo/publico/arte/icones/shikashi/LICENSE.txt).
- [Aviso original do Shikashi v2](aplicativos/jogo/publico/creditos/shikashi-aviso-original.txt), extraído sem alterar seus bytes do ZIP fornecido.
- [Fonte — SciGho](aplicativos/jogo/publico/fontes/antiquity-print-LICENSE.txt).
- [Produção visual do projeto](aplicativos/jogo/publico/creditos/producao-do-projeto.txt).

### Desenhos-base do game-icons.net

A página atual do [Shikashi](https://shikashipx.itch.io/shikashis-fantasy-icons-pack) declara CC BY 4.0 e pede crédito a Matt Firth (shikashipx) e game-icons.net. O aviso incluído no ZIP v2 menciona desenhos-base de game-icons.net sob CC BY 3.0. As [orientações do game-icons.net](https://game-icons.net/about.html) pedem os autores originais; a revisão conserva a referência à licença subjacente e não a substitui por CC BY 4.0.

**Pendência de proveniência:** o ZIP não fornece uma relação entre cada recorte e o desenho-base/autor individual. Esse vínculo não foi confirmado nesta revisão. Para completá-lo, é necessário obter essa relação do autor do pacote ou verificar documentalmente cada desenho utilizado. Não foram adicionados nomes por suposição; o crédito coletivo não é apresentado como verificação completa dessa autoria.

### Fonte Antiquity Print

A atribuição inclui © 2021 SciGho, fonte e licença. O registro preserva a diferença entre os metadados antigos do TTF e a concessão CC BY 4.0 na página atual do autor. O arquivo da fonte continua sem alterações.

## Software distribuído

| Componente | Atribuição | Licença |
| --- | --- | --- |
| React, React DOM e Scheduler | Meta Platforms, Inc. e colaboradores | MIT |
| Workbox | Google LLC | MIT |
| idb | Jake Archibald | ISC |

Os [textos completos de licença](aplicativos/jogo/publico/creditos/software.txt) acompanham a distribuição e são acessíveis pelo jogo. O inventário abrange o código entregue ao navegador; ferramentas usadas somente na compilação não são apresentadas como recursos visuais ou bibliotecas da partida.

## Adicionar ou atualizar uma arte

1. Guarde os arquivos na pasta do recurso/autor e preserve os avisos originais.
2. Edite [catalogoDeCreditos.json](aplicativos/jogo/fonte/catalogoDeCreditos.json): contribuição, título, autor, página de origem, licença, alterações e caminhos dos arquivos.
3. Inclua o aviso local em `aplicativos/jogo/publico/creditos/` quando necessário.
4. Atualize este documento e o índice de avisos, depois execute `pnpm verificar:creditos` e `pnpm compilar`.

A interface lê esse catálogo. A verificação exige atribuição para cada recurso visual público, impede registros duplicados e verifica caminhos de avisos. Ela verifica consistência do inventário; não certifica a licença nem identifica automaticamente o autor de uma imagem nova.

Os avisos locais são incluídos no cache de produção após o preparo do modo sem conexão. Links externos de autores e licenças continuam exigindo acesso à internet. Cada contribuição conserva seus próprios termos; este documento não concede licença única ao jogo nem aos recursos de terceiros.
