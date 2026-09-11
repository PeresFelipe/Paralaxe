# Greywake: pesquisa de mercado e usabilidade para jogos web

Data: 11 de setembro de 2026. Escopo: evolução da Build 0.1 local, respeitando o GDD e o UX-GDD do repositório.

## Decisão

Greywake deve funcionar como um RPG de atividades e preparação: escolher, agir, perceber o resultado e decidir o próximo passo. Para esta build, a base indicada é React 19 + TypeScript 6 + Vite 8, DOM semântico, animações nativas do navegador e IndexedDB. A entrega acrescenta PWA com Workbox, controles acessíveis e uma área de Atividades reorganizada. A escolha se apoia no tipo de interação existente, na compatibilidade e no custo de manutenção; não existe uma tecnologia universalmente superior para todos os jogos.

A referência de Idle Iktah serve para proximidade entre cena, ação e resultado. A identidade de Greywake continua seguindo sua paleta, atmosfera, regras de risco e quatro destinos canônicos.

## Método e limites

Pesquisa documental qualitativa de páginas oficiais de jogos, documentação de plataformas web e documentação técnica primária. O código e os documentos de Greywake foram confrontados com essas referências. Não houve teste comparativo com jogadores, medição de retenção dos concorrentes ou estimativa de participação de mercado. Os efeitos esperados abaixo são hipóteses de design a validar, não resultados de experimentos com usuários.

Idle Iktah e Idle Clans entram como referências do gênero. Suas páginas consultadas promovem versões nativas; elas não foram tratadas como prova de uma versão jogável no navegador. A análise de requisitos específicos da web usa Farm RPG e as diretrizes de plataformas web.

## Referências de mercado

| Referência | Evidência publicada | Aplicação proposta em Greywake |
| --- | --- | --- |
| [Idle Iktah — Grounded Games](https://grounded.games/idle_iktah.html) | Progressão por habilidades, coleta, produção, combate, missões e ganhos offline; a página apresenta cenas de jogo e plataformas suportadas. | Manter o vínculo entre atividade, resultado e progressão. Conter a arte operacional, preservando a ambientação. A densidade visual é uma referência, não um modelo a copiar integralmente. |
| [Melvor Idle — descrição do desenvolvedor](https://play.google.com/store/apps/details?hl=en_US&id=com.malcs.melvoridle) | Habilidades interdependentes, combate, inventário e continuidade entre plataformas. | Tornar a cadeia de materiais compreensível: informar o que falta, quanto falta e onde obter. Cloud Save é uma característica do concorrente, não uma implementação desta build. |
| [Farm RPG — página oficial](https://farmrpg.com/) | Jogo baseado em menus com coleta, pesca e produção; oferece entrada para jogar sem registro antes das opções de conta. | Reduzir barreiras de acesso e apresentar ações concretas. Greywake mantém personagens locais e escolhas iniciais com significado, sem exigir conta para esta fase. |
| [Idle Clans — página oficial](https://www.idleclans.com/) | Proposta de MMORPG acessível em sessões curtas, seleção de objetivo e execução automática, inclusive durante ausência. | Diferenciar claramente “estou consultando uma habilidade” de “esta atividade está rodando”. Os sistemas sociais e econômicos online não entram por consequência dessa referência. |

A oportunidade para Greywake está na combinação de continuidade Idle com preparação e risco legíveis. Somente reduzir componentes não demonstra esse diferencial. O jogador precisa entender o efeito do recurso obtido sobre sua próxima escolha.

## Boas práticas e diagnóstico

| Critério | Base e diagnóstico | Decisão aplicada |
| --- | --- | --- |
| Leitura em janelas pequenas | As [diretrizes de gameplay da CrazyGames](https://docs.crazygames.com/requirements/gameplay/) exigem legibilidade em janelas pequenas, responsividade e controles intuitivos. O CSS anterior usava alguns textos abaixo de 10 px. | Textos operacionais de 14–15 px e rótulos secundários de 12–13 px, com menos molduras e espaçamento desperdiçado. Não foi feita certificação global de acessibilidade. |
| Densidade sem reduzir o alvo | [WCAG 2.2, tamanho mínimo de alvo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) define 24 × 24 CSS px ou condições de espaçamento/exceções. | Botões principais com alvo de 44 px como critério de produto. Compactação vem da organização, não de tornar o clique minúsculo. |
| Previsibilidade de ação | O UX-GDD exige que selecionar uma Skill não inicie trabalho e que a substituição de atividade seja antecipada. | Navegação separada de início/parada. Texto junto à ação informa qual trabalho será substituído. A atividade em curso também aparece na seleção de habilidades. |
| Feedback sem deslocamento | O banner global recebia resultados recorrentes acima da página. Isso alterava a posição do conteúdo. | Resultados de coleta/produção ficam na área da atividade. Mensagens de comando usam aviso dispensável fora do fluxo do layout. Não há anúncio por leitor de tela a cada quadro da barra. |
| Material insuficiente | Uma ação apenas desabilitada não explica como avançar. | Exibir possuído/necessário, quantidade faltante e botão para consultar a habilidade de origem. O atalho não inicia a coleta nem interrompe o trabalho atual. |
| Progresso compreensível | O código já conhece duração, resultado e curva de XP. O layout anterior expunha números com pouco contexto. | Ciclo e próximo resultado ao lado da cena; barra de nível usando a mesma tabela de XP do domínio; detalhes de prestígio recolhidos. |
| Teclado e foco | Consulta rápida precisa ter entrada e saída previsíveis. | Inventário e Jornada em `dialog` nativo, fechamento por Escape e retorno de foco ao controle de origem. Navegação principal com estado semântico e atalho para o conteúdo. |
| Continuidade web | Ganhos calculados durante ausência não tornam o aplicativo carregável sem conexão por si só. | Manifest, ícones e cache dos arquivos da aplicação e das artes. Atualizações oferecidas fora da partida. A primeira visita e a instalação do cache exigem conexão e contexto seguro. |

As regras específicas de distribuição de cada portal não foram transformadas em regras universais: esta entrega não integra anúncios, autenticação ou SDK de CrazyGames/Poki.

## Escolha tecnológica

| Opção | Avaliação para esta build | Decisão |
| --- | --- | --- |
| React 19, TypeScript 6 e Vite 8 já instalados | A interação é majoritariamente texto, recursos, inventários, formulários e escolhas. O DOM favorece teclado, foco, adaptação de layout e leitura assistiva. | Preservar a stack e a separação entre domínio, conteúdo, persistência e interface. Não migrar a aplicação sem um problema concreto a resolver. |
| Web Animations API e `transform` | A orientação de [animação eficiente do web.dev](https://web.dev/articles/animations-guide) favorece propriedades que evitam trabalho de layout por quadro. | A barra usa `scaleX`; a interpolação visual sai do timer React de 100 ms. O texto é amostrado uma vez por segundo. O indicador suspende animação/timer quando a aba fica oculta e respeita movimento reduzido. A simulação continua baseada nos dados e horários do domínio. |
| Vite PWA + Workbox | [Documentação do Vite PWA](https://vite-pwa-org.netlify.app/guide/) e sua [integração React](https://vite-pwa-org.netlify.app/frameworks/react.html) fornecem geração de manifest, precache e atualização controlada. | Implementado. Atualização mediante botão na seleção/criação de personagem. Instalação oferecida quando o navegador fornece essa capacidade. Nenhum reload automático é disparado pelo jogo durante a partida. |
| PixiJS 8 / renderização em canvas | A [documentação de renderers do PixiJS](https://pixijs.com/8.x/guides/components/renderers) recomenda WebGL para produção e descreve o renderer WebGPU como experimental. Canvas pode beneficiar cenas com muitos sprites, mas não resolve sozinho a navegação e a leitura dos painéis. | Candidato para uma futura camada de cenas, se houver demanda gráfica e medição que justifique. Não é dependência desta entrega. |
| React Compiler | O [lançamento oficial do Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) descreve memoização automática e adoção incremental. | Avaliado, ainda não habilitado. Primeiro corrigir a atualização visual frequente identificada no código; avaliar o compilador com perfil real de interações. Não atribuir ganhos de terceiros a Greywake. |

A aplicação não depende de WebGPU, servidor de contas ou conexão contínua para a simulação local. PWA não significa execução em segundo plano ilimitada: ao retornar, os resultados continuam sendo calculados pelo sistema de progresso offline já existente.

## Critérios de qualidade e verificação

Os [Core Web Vitals](https://web.dev/articles/vitals) são uma referência para carregamento, resposta e estabilidade. Eles não substituem medidas específicas de jogo, como clareza de recompensa, tempo até a primeira ação e compreensão de risco. Não foram coletadas métricas de campo nesta entrega.

Para um próximo playtest humano, registrar:

1. Tempo e erros até iniciar a primeira coleta.
2. Se o jogador identifica a atividade que continua rodando ao trocar de tela.
3. Se consegue partir de uma receita sem materiais até encontrar a fonte necessária.
4. Se entende a consequência de iniciar outra atividade e de entrar em risco.
5. Quantidade de rolagem e erros de toque em desktop curto e telefone.

O resultado deve orientar novas mudanças de layout e tecnologia. Não há meta de retenção inventada nem alegação de aumento de FPS nesta pesquisa.

### Verificação desta entrega

- `pnpm check` (lint, typecheck e testes) e `pnpm build` concluídos sem erros. A suíte validou também os 32 nós, custos, pré-requisitos e migração da Árvore de Prestígio.
- Bundle principal de produção: 351,96 kB, ou 99,22 kB com gzip; CSS: 47,48 kB, ou 9,95 kB com gzip. São tamanhos de build, não medições de velocidade no aparelho do jogador.
- Service worker gerado com 27 entradas de precache, aproximadamente 5,7 MiB (5.805,21 KiB). O cache inclui as cenas, retratos, Pesca, Mineração, Lenhador, Herbologia, Metalurgia, Forja e Culinária animados/estáticos e ícones; os parâmetros legados `?v=` das artes são considerados no casamento com o precache.
- A aba `Personagem → Prestígio` apresenta os quatro ramos puros e quatro caminhos híbridos em cartões compactos; os nós permanecem bloqueados até as sete Skills alcançarem Prestígio I, conforme o GDD.
- Conferência no navegador: criação de personagem, coleta de Cloch, continuidade ao consultar Culinária, identificação de materiais faltantes, atalho para Pesca, substituição de trabalho, produção de Scadán Assado e resultado no Inventário.
- Escape fechou o Inventário rápido e devolveu o foco ao botão Inventário. A janela desktop inspecionada não apresentou overflow horizontal.
- O layout mobile foi implementado por CSS e seletor nativo; esta conferência não simula um aparelho físico. Instalação PWA e reabertura sem rede não foram executadas neste preview HTTP de desenvolvimento.

### Limites conhecidos

- O progresso é local ao navegador: não há sincronização de contas nem proteção nova contra edição simultânea do mesmo save em várias abas.
- Limpar os dados do navegador pode remover o save e o cache. PWA não substitui backup/exportação de saves.
- Cache offline completo e instalação precisam ser conferidos em um deploy HTTPS; o preview de desenvolvimento não equivale a essa validação.
- O registro mostra a última conclusão; resumo acumulado por sessão e onboarding contextual mais amplo permanecem evoluções de UX.
- A Build 0.1 ainda não oferece o ritual de Prestígio das Skills até nível 99; por isso a árvore começa visível, porém bloqueada, até o requisito de progressão ser alcançado.
- Leitor de tela, aparelhos reais e avaliação humana de ritmo não foram validados por uma suíte técnica.

## Reversão

O estado imediatamente anterior à pesquisa e às mudanças está preservado em `backup/web-usability-453dbba`, no commit `453dbba1d67c095edf28d8640e5ff77b78749d5b`. A restauração integral deve usar esse commit/branch, incluindo componentes e estilos. Remover apenas o import de CSS não restaura a estrutura anterior.
