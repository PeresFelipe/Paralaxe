# Paralaxe — Interface de jogo medieval fantasia sombria

Pesquisa e implementação: 14–15/09/2026. Base: `b86cec314c6331396f3cf52af46f700735870266`, Versão 0.1. Pedido: reforçar a experiência de jogo Ocioso e usar animações em quadros gratuitos do itch.io com licença compatível.

## Referências de mercado

Pesquisa qualitativa em fontes dos próprios criadores. As aplicações ao Paralaxe abaixo são decisões de design, não resultados de um estudo com jogadores ou evidência de aumento de retenção.

| Referência primária | O que a fonte apresenta | Aplicação ao Paralaxe |
| --- | --- | --- |
| [Idle Iktah — Grounded Games](https://grounded.games/idle_iktah.html) | Coleta, produção e combate interligados, progresso sem conexão e desbloqueio gradual | A profissão consultada tem identidade própria; a tarefa em execução continua identificável em qualquer área segura |
| [Melvor Idle — página oficial na Steam](https://store.steampowered.com/app/1267910/Melvor_Idle/) | Profissões conectadas, gestão de inventário/banco e atividades operadas com poucos comandos | Ciclo, rendimento, materiais e ação principal ficam próximos; bolsa usa espaços, capacidade real e inspeção |
| [Darkest Dungeon — mídia oficial](https://www.darkestdungeon.com/darkest-dungeon/media/) | Repertório oficial de fantasia sombria | Referência de atmosfera: contraste, materiais escuros e acentos contidos. Não foram copiadas artes ou interfaces; a página de mídia não constitui avaliação de usabilidade |

Os requisitos atualizados e o UX-GDD continuam definindo os sistemas e a navegação. Os princípios de consistência e clareza associados à referência Apple permanecem; a apresentação usa materiais e objetos do universo do jogo.

## Direção aplicada

- Estrutura persistente com quatro destinos, emblema e ícones de ofícios; navegação inferior no celular.
- Superfícies de ferro e musgo, molduras de ouro envelhecido e controles retangulares. Os ornamentos marcam a hierarquia dos painéis.
- Tipografia de marca com Antiquity Print; títulos e navegação operacional em Georgia, dados em fonte de interface. Assim os textos em português não misturam glifos acentuados de famílias diferentes nos títulos.
- Atividades com lista de profissões, cena individual, receita/recurso e estado textual. O GIF toca somente na profissão em execução e quando a preferência de movimento permite.
- Consulta de outra profissão mostra que a tarefa original continua, explica a substituição ao iniciar outra e oferece retorno à atividade em curso.
- Barra de trabalho persistente, inclusive com estado pausado em risco. Navegação e atalhos ficam desabilitados durante Combate/Dungeon; o fluxo focado mantém os controles de retorno existentes.
- Inventário em grade de 24 espaços, filtros, quantidade e inspeção. Equipamentos em uso ficam fora dos espaços da bolsa, conforme a regra de capacidade existente. O atalho de equipar usa a mesma ação de domínio.
- Jornada e bolsa resumidas na lateral de telas largas. No celular, as mesmas consultas continuam acessíveis pela barra inferior.
- Retrato e equipamento em uso no Personagem; estabelecimentos da Cidade identificados por animações em quadros.

Não houve alteração de conteúdo, balanceamento, regras de risco/retorno, capacidade ou esquema de partida. Os sete GIFs preservam seus pixels e tempos de 400 ms por quadro. Cenas mantêm os limites anteriores de 224/192/160/128 px; em telas estreitas o painel de controles fica abaixo da cena.

## Recursos Visuais gratuitos efetivamente usados

| Asset e autor | Licença verificada | Uso |
| --- | --- | --- |
| [Dark Ages UI — Hypnobius](https://hypnobius.itch.io/dark-ages-ui) | Licença própria: projetos pessoais e comerciais, gratuitos ou pagos; modificações permitidas; crédito opcional | Quatro recortes do tilesheet: duas molduras, espaço e ornamento. Download gratuito; licença lida na página e no pacote |
| [Shikashi's Fantasy Icons Pack — Matt Firth](https://shikashipx.itch.io/shikashis-fantasy-icons-pack) | CC BY 4.0; atribuição obrigatória, com proveniência de designs derivados de game-icons.net | Recortes 32×32 já presentes no repositório, agora também no menu, estabelecimentos, espaços e equipamento |
| [Antiquity Print — SciGho](https://ninjikin.itch.io/font-antiquity-script) | CC BY 4.0; atribuição obrigatória | Fonte já integrada, preservada sem alterar o arquivo |

“Gratuito para baixar” não foi tratado como licença. Dark Ages UI proíbe revender/redistribuir o pacote de recursos visuais, incluí-lo em outros pacotes para download, NFTs, blockchain e datasets de treinamento de IA. O autor permite jogos/projetos que implementam os recursos visuais sob licença própria. Os recortes estão integrados ao jogo; o pacote original não é um entregável. [Licença e coordenadas dos recortes](../../aplicativos/jogo/publico/arte/interface/dark-ages/README.md).

Créditos acessíveis no jogo e no README. A licença original Dark Ages UI entra no cache de produção. As cenas e retratos anteriores são preservados e não são apresentados como novos recursos visuais do itch.io.

## Verificação

- `pnpm verificar`: análise estática, TypeScript e **78 testes existentes** passaram (50 domínio, 25 conteúdo, 3 persistência).
- `pnpm compilar`: compilação de produção passou, incluindo geração do service worker.
- `git diff --check`: sem erros de whitespace.
- PNGs novos decodificados e comparados pixel a pixel aos respectivos retângulos do tilesheet original: quatro de quatro iguais. Proveniência e SHA-256 da origem documentados.
- Simulação local em Happy DOM com fake-indexeddb: criação completa, quatro destinos, iniciar coleta, continuidade em Personagem/Cidade/Banco, consultar outra Profissão sem alterar a tarefa, retornar à atividade, geração de recurso, inventário de 24 espaços, filtros, inspeção e parar atividade. Nenhum erro de console. Foi exercitado o caminho sem Web Animations API; isso não testa animação nativa.

Contraste calculado pela luminância relativa para amostras sólidas do novo tema:

| Uso | Texto | Fundo | Razão |
| --- | --- | --- | --- |
| Texto principal | #e6e0ce | #1b2118 | 12,46:1 |
| Texto secundário | #b1b4a3 | #252b23 | 6,85:1 |
| Destaque dourado | #d0b477 | #252b23 | 7,23:1 |
| Botão principal, ponto mais claro do gradiente | #fff2cf | #625332 | 6,73:1 |

Essas amostras não certificam acessibilidade de todas as telas, estados ou texturas. O código mantém foco visível, controles principais com alvo mínimo de 44 px, alternativa estática para movimento reduzido e alternativa de bordas em cores forçadas.

**Limite da validação:** a política do navegador deste ambiente bloqueou a prévia local. Não houve inspeção de layout/pintura em navegador real; a simulação DOM não a substitui. Revisão visual de computador e celular, zoom, foco em diálogos e instalação PWA em HTTPS continuam pendentes antes de promover esta proposta a versão final.

## Arquivos de implementação

- `aplicativos/jogo/fonte/tema-do-jogo.css`: tema aplicado após os estilos existentes, permitindo reversão isolada.
- `EstruturaDoJogo.tsx`, `TelaDeAtividades.tsx` e `GradeDoInventario.tsx`: apresentação e interações.
- `CreditosDosRecursos.tsx`, `publico/arte/interface/dark-ages/`, `README.md`: licenças e proveniência.
- `principal.tsx`, `index.html` e `vite.config.ts`: ativação do tema, cor do navegador e cache da licença.

A prévia HTML entregue para revisão usa esses componentes e regras com sessão demonstrativa em memória, sem instalação PWA. Recarregar a prévia reinicia a demonstração. Essa adaptação de exportação não altera a persistência IndexedDB do jogo no repositório.

## Ajustes de tamanho e quebra — revisão do usuário

- Marca dimensionada pelas métricas do TTF: a palavra ocupava aproximadamente 239 px em uma área de 163 px; agora ocupa 153 px. O emblema e o ornamento cabem integralmente em suas molduras.
- Menu com rolagem em janelas baixas e apresentação compacta quando falta altura.
- Slots com padding explícito, tamanho máximo e espaço mínimo de 44 px; grade de equipamento se adapta ao espaço disponível.
- Cabeçalho móvel com identidade e recursos em linhas próprias; o botão de personagem ocupa sua própria célula, sem sobrepor o nome. Números e rótulos aceitam quebra quando necessário.
- Painel de Atividades passa a uma coluna quando sua área útil fica abaixo de 420 px, inclusive em larguras intermediárias de desktop/tablet. Textos operacionais pequenos receberam ajuste de legibilidade.
- Títulos, botões, ingredientes e estados de risco aceitam quebra; o indicador compacto mantém nome e tempo na mesma linha.

A revisão altera CSS e o rótulo de entrada da prévia; não altera mecânicas. Versão de produção, métricas de encaixe e teste básico da prévia em DOM simulado verificados. A restrição de validação visual em navegador real descrita acima continua aplicável.
