# Guia do código de Greywake

Este guia acompanha os comentários em português brasileiro acrescentados ao código. Explica a implementação existente; o [GDD](../GDD.md) e o [UX-GDD](../UX-GDD.md) continuam sendo as referências de requisitos. Um comentário sobre o funcionamento atual não significa que todo requisito planejado já esteja implementado.

## Por onde começar

1. Leia `pacotes/dominio/fonte/personagem.ts` para conhecer a estrutura da partida.
2. Abra `aplicativos/jogo/fonte/principal.tsx` e `Aplicativo.tsx` para acompanhar a montagem, o carregamento e a gravação.
3. Veja `EstruturaDoJogo.tsx` para entender navegação, abas e painéis.
4. Siga a funcionalidade desejada até sua regra em `pacotes/dominio/fonte` e suas definições em `pacotes/conteudo/fonte`.
5. Consulte o teste correspondente para encontrar exemplos de entrada, resultado e situações recusadas.

Os cabeçalhos `@file` apresentam a responsabilidade de cada módulo. Os comentários de funções explicam entradas, resultados e dependências relevantes. Dentro dos fluxos, os comentários destacam decisões como preservação de tempo parcial, validação de espaço e ordenação de gravações. No CSS, os comentários organizam grupos de regras e explicam a cascata e as adaptações de tamanho.

## Como as camadas se conectam

| Camada | Responsabilidade | Onde procurar |
| --- | --- | --- |
| Interface | Exibir o estado, guardar escolhas temporárias e encaminhar ações | `aplicativos/jogo/fonte` |
| Domínio | Validar ações e calcular a próxima partida | `pacotes/dominio/fonte` |
| Conteúdo | Fornecer classes, itens, inimigos, receitas e textos contextuais | `pacotes/conteudo/fonte` |
| Persistência | Ler, converter, migrar e gravar partidas locais | `pacotes/persistencia/fonte` |
| Interface compartilhada | Reservar uma direção comum de interface; hoje contém uma constante | `pacotes/interface/fonte` |

Uma ação normalmente parte de um botão, chega a um callback do `Aplicativo`, passa pela regra do domínio e resulta em uma gravação no repositório. A interface só deve apresentar como persistido o estado que esse fluxo confirmou. Os catálogos descrevem modelos; as instâncias e quantidades pertencem à partida.

## Fluxos que merecem atenção

### Trabalho e progresso ausente

`Aplicativo.tsx` coordena o processamento periódico e o retorno à partida. `ocioso.ts` e `fabricacao.ts` convertem o intervalo informado em ciclos completos, respeitando materiais e capacidade. O campo `segundosRestantes` guarda a parte **já acumulada** de um ciclo incompleto, apesar do nome.

`IndicadorDeProgressoOcioso.tsx` interpola a apresentação da barra. A animação não entrega itens nem experiência. O resumo de retorno apresenta o resultado de um processamento já realizado; ele não deve conceder a mesma produção outra vez.

`continuidade.ts` preserva o trabalho selecionado e ajusta a referência de tempo durante situações de risco. A coordenação da aplicação precisa usar essas operações de acordo com os pré-requisitos dos demais sistemas; guardar uma seleção não equivale a permitir produção simultânea durante combate.

### Combate e expedição

`combate.ts` simula a sequência usando um relógio próprio e uma semente. A mesma semente precisa do mesmo estado inicial e do mesmo catálogo para produzir o mesmo resultado. O temporizador da bancada apenas apresenta os eventos calculados; simular e aplicar o resultado são operações distintas.

`masmorra.ts` controla salas, ramificações, recursos e saque temporário. O conteúdo de uma bolsa de expedição ainda não é estoque seguro. A extração verifica espaço antes de transferir os resultados; a derrota descarta o saque da viagem, preservando a memória narrativa prevista nas regras.

### Progressão e metas

`progressao.ts` contém a operação que converte XP geral em níveis e pontos. Alguns fluxos atuais somam XP diretamente; não se deve concluir, apenas pelo aumento desse campo, que todos recalculam o nível. Os comentários nos pontos de concessão explicitam essa diferença.

Uma meta da Jornada observa a fabricação, sem executá-la. Possuir um produto no inventário não comprova que aquela receita foi fabricada. Por isso a migração de partidas antigas começa com o histórico vazio, sem inferir conquistas a partir do estoque.

As descrições de nós de prestígio não aplicam efeitos automaticamente. O desbloqueio é controlado em `prestigio.ts`; o sistema afetado precisa interpretar o efeito para ele ter resultado no jogo.

### Partidas e compatibilidade

O repositório usa IndexedDB. A versão do banco e a versão do esquema da partida são conceitos diferentes. A leitura converte o vocabulário antigo e migra a estrutura em memória; somente uma operação de salvar regrava os dados.

As tabelas de `formatoLegado.ts` e a amostra `amostras/partidaLegadaV10.ts` mantêm palavras em inglês por compatibilidade. Não traduzir esses dados como se fossem rótulos. Nomes escolhidos pelo jogador e IDs individuais de equipamento devem sobreviver à conversão sem alterações.

### Estilos e recursos visuais

`principal.tsx` importa primeiro os tokens de `styles/tokens.css`, depois as folhas globais na ordem necessária: `estilos.css`, `arte-gerada.css`, `disposicao-compacta.css`, `tipografia.css`, `tema-do-jogo.css`, `jornada.css` e `interface-do-jogo.css`. Essas folhas cuidam do reset, do shell, do tema transversal e da responsividade compartilhada; estilos locais de componentes ficam em CSS Modules. Créditos, indicador de progresso e as demais áreas extraídas mantêm seus módulos junto dos componentes.

As bancadas de combate e masmorra mantêm seus estilos específicos em CSS Modules junto dos componentes; apenas regras transversais de tema e estrutura permanecem globais. Os protótipos HTML são independentes da aplicação e não participam da compilação.

Os caminhos públicos começam na raiz da URL: um arquivo em `aplicativos/jogo/publico/arte/...` é referenciado como `/arte/...`. O catálogo de créditos associa arquivos a suas contribuições; os mapas de ícones e classes associam esses recursos à apresentação do jogo.

## Configurações JSON, arquivo por arquivo

JSON não aceita comentários. Os arquivos abaixo continuam com sua sintaxe e seus dados originais; suas responsabilidades estão documentadas aqui.

| Arquivo | Funcionamento |
| --- | --- |
| `package.json` | Define o projeto como privado e ES modules, informa Node/pnpm e reúne os comandos executados na raiz. `desenvolver` inicia o Vite para `aplicativos/jogo`; `compilar` seleciona `@greywake/jogo`; os demais comandos percorrem os pacotes. |
| `tsconfig.base.json` | Configuração TypeScript herdada: ES2023, módulos ESNext, resolução Bundler, verificação estrita e sem emissão de JavaScript. A compilação dos arquivos distribuídos fica com o Vite. |
| `aplicativos/jogo/package.json` | Dependências React, integração do aplicativo web instalável e referências `workspace:*` aos pacotes internos. `compilar` primeiro verifica os projetos TypeScript e depois executa o Vite. |
| `aplicativos/jogo/tsconfig.json` | Agrega dois projetos: código do navegador e configuração executada pelo Node. `files: []` evita tratar esse arquivo agregador como uma lista independente de fontes. |
| `aplicativos/jogo/tsconfig.app.json` | Inclui `fonte`, tipos DOM e Vite/PWA, JSX do React e importação de JSON. Rejeita variáveis/parâmetros não usados e guarda informações incrementais em `node_modules/.tmp`. |
| `aplicativos/jogo/tsconfig.node.json` | Verifica `vite.config.ts` com tipos Node e resolução NodeNext, separando esse ambiente das APIs do navegador. |
| `pacotes/dominio/package.json` | Exporta `fonte/indice.ts` como entrada de código e tipos. Oferece análise, verificação de tipos e testes; não depende da interface React. |
| `pacotes/dominio/tsconfig.json` | Herda a base, inclui `fonte` e acrescenta os tipos de teste do Vitest. |
| `pacotes/conteudo/package.json` | Exporta os catálogos por `fonte/indice.ts`, depende do domínio local e oferece análise, tipos e testes. |
| `pacotes/conteudo/tsconfig.json` | Herda as verificações estritas da base e inclui o código e os testes em `fonte`. |
| `pacotes/persistencia/package.json` | Exporta o repositório, depende do domínio e inclui `fake-indexeddb` como ferramenta de teste. |
| `pacotes/persistencia/tsconfig.json` | Acrescenta DOM à base para reconhecer os tipos de IndexedDB usados pelo repositório. |
| `pacotes/interface/package.json` | Define a entrada do pacote reservado à interface compartilhada. Por enquanto oferece somente análise e tipos, sem comando de testes. |
| `pacotes/interface/tsconfig.json` | Inclui `fonte` e tipos DOM sobre a configuração base, preparando o pacote para contratos de interface. |
| `aplicativos/jogo/fonte/catalogoDeCreditos.json` | Fonte única dos registros exibidos na janela de créditos e conferidos por `verificarCreditos.mjs`. Os campos são explicados na tabela seguinte. |
| `documentacao/pesquisa/shikashi-greywake-candidatos.json` | Inventário de pesquisa dos ícones: proveniência, hashes, coordenadas e avaliação dos candidatos. Não é carregado pelo jogo como catálogo de execução. |

Em todos os `package.json`, `name`, `scripts`, `dependencies`, `devDependencies`, `exports` e `types` são chaves reconhecidas pelas ferramentas e mantêm seus nomes padronizados. Os comandos próprios do projeto estão em português. `workspace:*` liga os pacotes locais identificados por seus nomes `@greywake/...`.

Na configuração TypeScript, `strict` ativa verificações de tipos rigorosas; `noUncheckedIndexedAccess` obriga a considerar índices ausentes; `exactOptionalPropertyTypes` distingue uma propriedade omitida de uma explicitamente preenchida com `undefined`; `noFallthroughCasesInSwitch` ajuda a evitar quedas acidentais entre casos. `skipLibCheck` pula a verificação interna das declarações de dependências, não a do código próprio.

### Campos do catálogo de créditos

| Campo | Como é usado |
| --- | --- |
| `revisadoEm` | Data registrada da revisão do catálogo; não é atualizada automaticamente. |
| `grupos` | IDs e títulos dos grupos apresentados na janela. |
| `recursos[].id` | Identificador único da contribuição. |
| `grupo` | ID de um dos grupos cadastrados. |
| `titulo` | Nome do pacote, recurso ou tecnologia. |
| `autores` | Lista de nomes e URLs; a URL pode ser `null` quando não há endereço registrado. |
| `contribuicao` | Explica onde o trabalho aparece no jogo. |
| `licenca` | Nome dos termos e URL do documento correspondente, quando disponível. |
| `origem` | Página original do recurso, quando registrada. |
| `modificacoes` | Descrição das adaptações feitas ou da preservação do arquivo. |
| `avisos` | Links rotulados para avisos adicionais, inclusive arquivos locais. |
| `arquivos` | URLs públicas exatas ou prefixos de pasta terminados em `/`. Cada imagem/fonte deve pertencer a exatamente um registro. Contribuições do grupo `tecnologia` podem ter esta lista vazia. |
| `creditosComplementares` | Autoria/origem derivada, com `nome`, `url`, `licenca`, `urlLicenca` e `observacao`. |

O verificador confere presença, consistência e cobertura. Não visita os sites nem substitui a leitura dos termos do autor. Veja [CREDITOS.md](../../CREDITOS.md) para as atribuições e suas observações.

No inventário de pesquisa de Shikashi, `origem` registra arquivos, hashes, dimensões, autoria e referência; `significadoDosEstados` explica a avaliação; `candidatos` associa objetos do jogo a uma célula da folha e a uma observação. As coordenadas partem do canto superior esquerdo e usam índices de coluna/linha iniciados em zero. Esse documento não executa o recorte nem troca um ícone sozinho.

## Arquivos gerados e materiais de terceiros

`pnpm-lock.yaml` registra a resolução das dependências e é gerenciado pelo pnpm. `node_modules`, `dist` e informações incrementais do TypeScript são resultados de instalação ou compilação. Não recebem comentários manuais, pois podem ser regenerados.

Imagens, GIFs, fontes e avisos originais de licença permanecem intactos. Sua finalidade e autoria são explicadas no catálogo e na documentação, sem modificar arquivos binários nem os termos dos criadores.

## Comandos de verificação

Execute na raiz do repositório:

```bash
pnpm desenvolver
pnpm verificar
pnpm compilar
```

`desenvolver` inicia o ambiente local e permanece em execução. `verificar` executa análise estática, tipos, testes e créditos. `compilar` verifica os projetos TypeScript do aplicativo e gera a versão de produção em `aplicativos/jogo/dist`. O fluxo de validação no GitHub executa verificação e compilação; ele não publica automaticamente um site.

Para investigar uma área específica, use, por exemplo, `pnpm --filter @greywake/dominio testar` ou `pnpm verificar:creditos`. O script da raiz se chama `desenvolver`; não há um script chamado `dev` nesta versão.

## Índice dos arquivos comentados

Os caminhos abaixo são links para os arquivos reais do repositório. Cada descrição resume o cabeçalho correspondente; os detalhes das funções e decisões estão próximos do código.

### Aplicação

| Arquivo | Responsabilidade |
| --- | --- |
| [aplicativos/jogo/fonte/Aplicativo.tsx](../../aplicativos/jogo/fonte/Aplicativo.tsx) | Composição das telas de entrada e da partida. |
| [aplicativos/jogo/fonte/hooks/useAplicativoDaPartida.ts](../../aplicativos/jogo/fonte/hooks/useAplicativoDaPartida.ts) | Estado de aplicação e fluxos de carregar, criar, selecionar e salvar partidas. |
| [aplicativos/jogo/fonte/features/aventura/BancadaDaMasmorra](../../aplicativos/jogo/fonte/features/aventura/BancadaDaMasmorra) | Fluxo de Dún Liath: contrato, preparação segura, expedição por salas e retorno. |
| [aplicativos/jogo/fonte/features/aventura/BancadaDeCombate](../../aplicativos/jogo/fonte/features/aventura/BancadaDeCombate) | Preparação, apresentação e confirmação do serviço contra o lobo da estrada. |
| [aplicativos/jogo/fonte/features/cidade/BancadaDoMercado](../../aplicativos/jogo/fonte/features/cidade/BancadaDoMercado) | Interface das compras no mercado PNJ. |
| [aplicativos/jogo/fonte/components/jogo/ComparacaoDeEquipamento](../../aplicativos/jogo/fonte/components/jogo/ComparacaoDeEquipamento) | Apresenta a previsão de uma peça fabricada em relação ao equipamento em uso. |
| [aplicativos/jogo/fonte/components/jogo/CreditosDosRecursos](../../aplicativos/jogo/fonte/components/jogo/CreditosDosRecursos) | Créditos apresentados a partir do catálogo único de recursos. |
| [aplicativos/jogo/fonte/features/aplicativo-web/EstadoDoJogoWeb](../../aplicativos/jogo/fonte/features/aplicativo-web/EstadoDoJogoWeb) | Avisos de disponibilidade sem conexão, atualização e instalação do aplicativo web. |
| [aplicativos/jogo/fonte/EstruturaDoJogo.tsx](../../aplicativos/jogo/fonte/EstruturaDoJogo.tsx) | Estrutura visual da partida e navegação entre Personagem, Atividades, Aventura e Cidade. |
| [aplicativos/jogo/fonte/features/inventario/GradeDoInventario](../../aplicativos/jogo/fonte/features/inventario/GradeDoInventario) | Grade reutilizada pela bolsa completa e pelos resumos compactos. |
| [aplicativos/jogo/fonte/components/jogo/IconeDoJogo](../../aplicativos/jogo/fonte/components/jogo/IconeDoJogo) | Imagem padronizada do catálogo de ícones: endereço, tamanho e acessibilidade. |
| [aplicativos/jogo/fonte/features/atividades/IndicadorDeProgressoOcioso](../../aplicativos/jogo/fonte/features/atividades/IndicadorDeProgressoOcioso) | Indicador visual do ciclo atual de coleta ou fabricação. |
| [aplicativos/jogo/fonte/features/jornada/MetaDaJornada](../../aplicativos/jogo/fonte/features/jornada/MetaDaJornada) | Escolha, acompanhamento e histórico de metas de fabricação. |
| [aplicativos/jogo/fonte/features/personagem/PainelDeAtributos](../../aplicativos/jogo/fonte/features/personagem/PainelDeAtributos) | Distribuição de pontos com rascunho e prévia das consequências. |
| [aplicativos/jogo/fonte/features/personagem/PainelDePrestigio](../../aplicativos/jogo/fonte/features/personagem/PainelDePrestigio) | Apresentação da árvore de prestígio e confirmação de reinício do personagem. |
| [aplicativos/jogo/fonte/features/cidade/PainelDoBanco](../../aplicativos/jogo/fonte/features/cidade/PainelDoBanco) | Consulta e transferência entre mochila e banco da Cidade Livre. |
| [aplicativos/jogo/fonte/features/navegacao/PainelRapido](../../aplicativos/jogo/fonte/features/navegacao/PainelRapido) | Contêiner modal reutilizado pelos painéis laterais da partida. |
| [aplicativos/jogo/fonte/features/atividades/TelaDeAtividades](../../aplicativos/jogo/fonte/features/atividades/TelaDeAtividades) | Consulta de profissões e comandos de coleta, produção e acompanhamento de receitas. |
| [aplicativos/jogo/fonte/arte-gerada.css](../../aplicativos/jogo/fonte/arte-gerada.css) | Recortes das folhas de cenas e retratos e suporte à arte individual das atividades. |
| [aplicativos/jogo/fonte/disposicao-compacta.css](../../aplicativos/jogo/fonte/disposicao-compacta.css) | Ajustes de densidade, alvos de toque e comportamento responsivo sobre estilos.css. |
| [aplicativos/jogo/fonte/estilos.css](../../aplicativos/jogo/fonte/estilos.css) | Base global e estrutura inicial de todas as telas. |
| [aplicativos/jogo/fonte/iconesDosRecursos.ts](../../aplicativos/jogo/fonte/iconesDosRecursos.ts) | Mapeamento entre identificadores do jogo e os ícones de Shikashi. |
| [aplicativos/jogo/fonte/jornada.css](../../aplicativos/jogo/fonte/jornada.css) | Estilos globais compartilhados para avisos e memórias da Jornada. |
| [aplicativos/jogo/fonte/principal.tsx](../../aplicativos/jogo/fonte/principal.tsx) | Entrada do navegador: carrega estilos e monta a aplicação React no HTML. |
| [aplicativos/jogo/fonte/rotulosDoJogo.ts](../../aplicativos/jogo/fonte/rotulosDoJogo.ts) | Rótulos e agrupamentos usados na apresentação de profissões e itens. |
| [aplicativos/jogo/fonte/tema-do-jogo.css](../../aplicativos/jogo/fonte/tema-do-jogo.css) | Tema medieval atual, aplicado sobre a base e os ajustes compactos. |
| [aplicativos/jogo/fonte/tipografia.css](../../aplicativos/jogo/fonte/tipografia.css) | Carregamento da fonte licenciada Antiquity Print e estilos tipográficos básicos. |

### Regras do jogo

| Arquivo | Responsabilidade |
| --- | --- |
| [pacotes/dominio/fonte/armazenamento.test.ts](../../pacotes/dominio/fonte/armazenamento.test.ts) | Testes de movimentação entre mochila e banco. |
| [pacotes/dominio/fonte/armazenamento.ts](../../pacotes/dominio/fonte/armazenamento.ts) | Capacidade e transferências entre inventário e banco. |
| [pacotes/dominio/fonte/capacidadeDoInventario.test.ts](../../pacotes/dominio/fonte/capacidadeDoInventario.test.ts) | Testes de capacidade que atravessam coleta, fabricação, mercado e masmorra. |
| [pacotes/dominio/fonte/combate.test.ts](../../pacotes/dominio/fonte/combate.test.ts) | Testes do simulador com um catálogo pequeno e controlado. |
| [pacotes/dominio/fonte/combate.ts](../../pacotes/dominio/fonte/combate.ts) | Simulação determinística de combate automático e aplicação de seus resultados. |
| [pacotes/dominio/fonte/continuidade.test.ts](../../pacotes/dominio/fonte/continuidade.test.ts) | Testes da conservação do trabalho selecionado durante situações de risco. |
| [pacotes/dominio/fonte/continuidade.ts](../../pacotes/dominio/fonte/continuidade.ts) | Coordena a continuidade do trabalho seguro ao entrar e sair de situações de risco. |
| [pacotes/dominio/fonte/economia.test.ts](../../pacotes/dominio/fonte/economia.test.ts) | Testes da compra de equipamentos no mercado PNJ. |
| [pacotes/dominio/fonte/economia.ts](../../pacotes/dominio/fonte/economia.ts) | Compras no mercado de personagens não jogáveis. |
| [pacotes/dominio/fonte/equipamento.ts](../../pacotes/dominio/fonte/equipamento.ts) | Definições e instâncias de equipamento. |
| [pacotes/dominio/fonte/fabricacao.test.ts](../../pacotes/dominio/fonte/fabricacao.test.ts) | Testes de transformação de ingredientes, parada por falta de material e reforço. |
| [pacotes/dominio/fonte/fabricacao.ts](../../pacotes/dominio/fonte/fabricacao.ts) | Motor de fabricação e reforço de equipamentos. |
| [pacotes/dominio/fonte/fundacao.test.ts](../../pacotes/dominio/fonte/fundacao.test.ts) | Teste do contrato público que identifica esta fase como jogo com partidas locais. |
| [pacotes/dominio/fonte/indice.ts](../../pacotes/dominio/fonte/indice.ts) | Entrada pública do pacote de domínio. |
| [pacotes/dominio/fonte/introducao.test.ts](../../pacotes/dominio/fonte/introducao.test.ts) | Teste da recompensa exclusiva do serviço da Estrada Baixa. |
| [pacotes/dominio/fonte/introducao.ts](../../pacotes/dominio/fonte/introducao.ts) | Aplica a recompensa do combate introdutório contra o lobo da estrada. |
| [pacotes/dominio/fonte/jornada.ts](../../pacotes/dominio/fonte/jornada.ts) | Metas voluntárias e memória das primeiras fabricações. |
| [pacotes/dominio/fonte/masmorra.test.ts](../../pacotes/dominio/fonte/masmorra.test.ts) | Testes de transições da expedição usando um mapa mínimo com uma bifurcação. |
| [pacotes/dominio/fonte/masmorra.ts](../../pacotes/dominio/fonte/masmorra.ts) | Regras da expedição de Dún Liath: rota, salas, decisões, combate e extração. |
| [pacotes/dominio/fonte/ocioso.test.ts](../../pacotes/dominio/fonte/ocioso.test.ts) | Testes da conversão de tempo em coleta e experiência de profissão. |
| [pacotes/dominio/fonte/ocioso.ts](../../pacotes/dominio/fonte/ocioso.ts) | Motor de coleta e experiência das profissões. |
| [pacotes/dominio/fonte/personagem.test.ts](../../pacotes/dominio/fonte/personagem.test.ts) | Testes do estado inicial da partida e das validações de criação. |
| [pacotes/dominio/fonte/personagem.ts](../../pacotes/dominio/fonte/personagem.ts) | Modelo da partida local e criação do personagem. |
| [pacotes/dominio/fonte/prestigio.test.ts](../../pacotes/dominio/fonte/prestigio.test.ts) | Testes de elegibilidade, custo e dependências da árvore de prestígio. |
| [pacotes/dominio/fonte/prestigio.ts](../../pacotes/dominio/fonte/prestigio.ts) | Catálogo da árvore de prestígio e regras de desbloqueio do personagem. |
| [pacotes/dominio/fonte/progressao.test.ts](../../pacotes/dominio/fonte/progressao.test.ts) | Testes de experiência geral acumulada e distribuição de atributos. |
| [pacotes/dominio/fonte/progressao.ts](../../pacotes/dominio/fonte/progressao.ts) | Progressão geral e distribuição confirmada de atributos. |

### Conteúdo

| Arquivo | Responsabilidade |
| --- | --- |
| [pacotes/conteudo/fonte/atividadesOciosas.ts](../../pacotes/conteudo/fonte/atividadesOciosas.ts) | Catálogo das quatro coletas iniciais: Mineração, Lenhador, Pesca e Herbologia. |
| [pacotes/conteudo/fonte/combate.ts](../../pacotes/conteudo/fonte/combate.ts) | Dados de habilidades, consumíveis, conjuntos de preparação e inimigos. |
| [pacotes/conteudo/fonte/criacaoDePersonagem.test.ts](../../pacotes/conteudo/fonte/criacaoDePersonagem.test.ts) | Teste de integração do Anel do Viajante com os catálogos reais. |
| [pacotes/conteudo/fonte/criacaoDePersonagem.ts](../../pacotes/conteudo/fonte/criacaoDePersonagem.ts) | Opções iniciais de classes e presentes, separadas do estado de cada partida. |
| [pacotes/conteudo/fonte/equipamento.ts](../../pacotes/conteudo/fonte/equipamento.ts) | Definições dos equipamentos iniciais, fabricáveis, compráveis e obtidos na masmorra. |
| [pacotes/conteudo/fonte/indice.ts](../../pacotes/conteudo/fonte/indice.ts) | Entrada pública dos catálogos de Greywake. |
| [pacotes/conteudo/fonte/jornada.test.ts](../../pacotes/conteudo/fonte/jornada.test.ts) | Testes de metas com receitas reais, coleta, banco e fabricação. |
| [pacotes/conteudo/fonte/jornada.ts](../../pacotes/conteudo/fonte/jornada.ts) | Apresentação contextual das metas e da história a partir do estado da partida. |
| [pacotes/conteudo/fonte/masmorra.ts](../../pacotes/conteudo/fonte/masmorra.ts) | Mapa declarativo de Dún Liath na dificuldade fácil. |
| [pacotes/conteudo/fonte/matrizDaVersao01.test.ts](../../pacotes/conteudo/fonte/matrizDaVersao01.test.ts) | Matriz de viabilidade de combate: seis classes combinadas com quatro preparações. |
| [pacotes/conteudo/fonte/mercado.ts](../../pacotes/conteudo/fonte/mercado.ts) | Ofertas fixas do mercado PNJ da versão inicial. |
| [pacotes/conteudo/fonte/receitasDeFabricacao.ts](../../pacotes/conteudo/fonte/receitasDeFabricacao.ts) | Receitas iniciais de Metalurgia, Forja e Culinária. |

### Persistência

| Arquivo | Responsabilidade |
| --- | --- |
| [pacotes/persistencia/fonte/amostras/partidaLegadaV10.ts](../../pacotes/persistencia/fonte/amostras/partidaLegadaV10.ts) | Amostra fixa do formato publicado antes da tradução do código. |
| [pacotes/persistencia/fonte/compatibilidadeDoFormato.test.ts](../../pacotes/persistencia/fonte/compatibilidadeDoFormato.test.ts) | Testes de ida e volta entre o formato anterior em inglês e o modelo atual em PT-BR. |
| [pacotes/persistencia/fonte/formatoLegado.ts](../../pacotes/persistencia/fonte/formatoLegado.ts) | Conversão entre o vocabulário PT-BR em memória e o formato publicado das partidas. |
| [pacotes/persistencia/fonte/indice.ts](../../pacotes/persistencia/fonte/indice.ts) | Entrada pública da persistência local. |
| [pacotes/persistencia/fonte/repositorioDePartidas.ts](../../pacotes/persistencia/fonte/repositorioDePartidas.ts) | Contrato assíncrono de armazenamento de partidas. |
| [pacotes/persistencia/fonte/repositorioDePartidasIndexedDb.test.ts](../../pacotes/persistencia/fonte/repositorioDePartidasIndexedDb.test.ts) | Testes de gravação, reabertura e migração usando IndexedDB em memória. |
| [pacotes/persistencia/fonte/repositorioDePartidasIndexedDb.ts](../../pacotes/persistencia/fonte/repositorioDePartidasIndexedDb.ts) | Persistência IndexedDB, leitura do formato legado e migração de esquemas de partida. |

### Interface compartilhada

| Arquivo | Responsabilidade |
| --- | --- |
| [pacotes/interface/fonte/indice.ts](../../pacotes/interface/fonte/indice.ts) | Ponto de extensão do pacote de interface compartilhada. |

### Ferramentas e entradas

| Arquivo | Responsabilidade |
| --- | --- |
| [.github/workflows/validar.yml](../../.github/workflows/validar.yml) | Verificação automatizada da main e das propostas de integração: instalação, análise, tipos, testes, créditos e compilação. |
| [aplicativos/jogo/index.html](../../aplicativos/jogo/index.html) | Página de entrada: metadados, ícones, fonte e ponto de montagem do React. |
| [aplicativos/jogo/vite.config.ts](../../aplicativos/jogo/vite.config.ts) | Configuração de desenvolvimento, compilação e aplicativo web instalável. |
| [documentacao/prototipos/greywake-fluxo-alta-fidelidade-v0.1.html](../../documentacao/prototipos/greywake-fluxo-alta-fidelidade-v0.1.html) | Protótipo navegável v0.1 com telas ilustrativas; sua lógica de DOM não participa da compilação do jogo. |
| [documentacao/prototipos/greywake-fluxo-alta-fidelidade-v0.2.html](../../documentacao/prototipos/greywake-fluxo-alta-fidelidade-v0.2.html) | Protótipo navegável v0.2 com telas ilustrativas; sua lógica de DOM não participa da compilação do jogo. |
| [documentacao/prototipos/mineracao-alta-fidelidade-v0.1.html](../../documentacao/prototipos/mineracao-alta-fidelidade-v0.1.html) | Protótipo estático e independente da tela de Mineração; usa dados ilustrativos e não executa regras do jogo. |
| [ferramentas/verificarCreditos.mjs](../../ferramentas/verificarCreditos.mjs) | Verificação automatizada da cobertura do catálogo de créditos. |
| [pnpm-workspace.yaml](../../pnpm-workspace.yaml) | Define as pastas dos aplicativos e pacotes locais que participam do espaço de trabalho pnpm. |
