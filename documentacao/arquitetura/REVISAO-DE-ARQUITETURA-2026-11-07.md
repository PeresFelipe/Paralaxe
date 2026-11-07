# Revisão de arquitetura — correções implementadas

Data: 07/11/2026. Branch: `develop`. Base: `410ba7fe88028c52fd5b49c97157b60165938672`.

## Mudanças

| Problema | Correção | Arquivos principais |
| --- | --- | --- |
| Telas enviavam snapshots que podiam sobrescrever alterações recentes | Transformações calculadas na fila sobre a última partida confirmada | `services/alteracoesDaPartida.ts`, `hooks/useAplicativoDaPartida.ts`, `PainelDeGrupo.tsx` |
| Combate encerrava visualmente antes de confirmar o save | Fases explícitas de reprodução/gravação/falha; botão de nova tentativa; confirmação única por reprodução | `hooks/useCombateDaEstrada.ts`, `services/combateDaEstrada.ts`, `BancadaDeCombate.tsx` |
| Falha entre pausa do trabalho e entrada em risco podia deixar relógios sem retomada confirmada | Recuperação da retomada, mantendo bloqueio quando a recuperação também falha | `hooks/useCombateDaEstrada.ts`, `hooks/useMasmorra.ts` |
| Componente de masmorra misturava comandos, relógios e apresentação | Comandos recebem partida/horário/semente; hook coordena apresentação e gravação | `services/acoesDaMasmorra.ts`, `hooks/useMasmorra.ts` |
| Hook principal acumulava detalhes de transferências | Adaptadores de comandos do banco; erro propagado à tela e à mensagem global | `services/acoesDoBanco.ts` |
| Shell continha três telas completas e carregava tudo no início | Telas extraídas por funcionalidade e carregadas com `React.lazy`/`Suspense` | `features/{personagem,aventura,cidade}/Tela*.tsx`, `EstruturaDoJogo.tsx` |
| Dados migrados recebiam casts sem uma verificação geral de integridade | Validação após migração e antes de substituir saves atuais; não grava nem apaga entradas inválidas durante leitura | `pacotes/persistencia/fonte/validarIntegridadeDaPartida.ts`, `repositorioDePartidasIndexedDb.ts` |
| Estilos de classes estavam em folhas globais e no botão genérico | Cartão da classe possui arte, texto e CSS Module | `features/criacao/CartaoDaClasse/` |
| Pré-cache incluía artes sem consumidor e entradas do gerador | Excluídos apenas originais de geração e animações não usadas; versões exibidas e licenças permanecem offline | `vite.config.ts` |
| Testes do HUD dependiam da grafia exata do JSX | Duas verificações passaram a inspecionar HTML realmente renderizado | `ContratosDeLayout.test.ts` |

Nenhuma dependência adicionada. Nenhuma regra de classe, progressão ou formato de save alterada. O esquema continua na versão 18 e o armazenamento histórico mantém seus nomes. Nenhuma imagem foi incorporada, substituída ou removida; os créditos existentes continuam aplicáveis. O mapa de imagens registra os novos consumidores.

## Verificações executadas

- `pnpm verificar`: aprovado. Inclui lockfile, arquitetura, CSS Modules, lint, TypeScript, testes e créditos.
- **371 testes em 58 arquivos aprovados**: domínio 122, conteúdo 134, persistência 34 e aplicação 81. São 27 casos adicionais em relação à base.
- Novos cenários: concorrência/ordem de gravação, falha sem avançar memória, troca de personagem, notificação que falha depois da transação, tentativa repetida de salvar o combate sem duplicar recompensa, falha de transferência, corrupção de dados, preservação do último save válido e renderização semântica dos cartões/HUD.
- Os 22 testes anteriores de persistência/migração continuam passando; a suíte de persistência agora possui 34 casos.
- Créditos: **148 recursos visuais, 22 contribuições e 25 avisos locais** verificados.
- `pnpm compilar`: aprovado, distribuição e service worker gerados.
- `git diff --check`: aprovado.
- Conferência do `dist/sw.js`: todas as 110 imagens com uso na interface/geradas para exibição, os 25 arquivos de avisos e os 16 módulos JS/CSS gerados estão no pré-cache; todos os caminhos conferidos existem na distribuição. A classificação das imagens usa o inventário de arte da base e as URLs preservadas nesta revisão.

## Tamanho e responsabilidades

Valores do build local, antes/depois; kB são decimais e KiB são binários.

| Medida | Base | Revisão |
| --- | ---: | ---: |
| JavaScript inicial, incluindo os módulos pré-carregados pelo HTML | 689,48 kB | 504,95 kB |
| JavaScript total dos módulos em `dist/assets`, incluindo Workbox | 695,13 kB | 709,58 kB |
| Pré-cache reportado pelo gerador | 18.841,08 KiB | 15.128,55 KiB |
| Linhas de `EstruturaDoJogo.tsx` | 1.320 | 687 |
| Linhas de `useAplicativoDaPartida.ts` | 823 | 734 |
| Linhas de `BancadaDeCombate.tsx` | 571 | 379 |
| Linhas de `BancadaDaMasmorra.tsx` | 1.090 | 686 |

A divisão reduz o carregamento inicial; não promete reduzir o JavaScript total. Módulos separados e validações acrescentam código. Na instalação da PWA, todos esses módulos continuam sendo pré-armazenados para permitir abrir telas offline. O tamanho de pré-cache reportado inclui três entradas repetidas de ícones/favicon produzidas pela configuração já existente; são 154 URLs distintas nas 157 entradas.

## Limitações e próximos cuidados

- O Chromium local não inicia neste ambiente (`socket() failed: Operation not permitted`). Não houve validação visual, interação real nos cinco breakpoints/temas nem teste real de instalação/navegação offline. Renderização de HTML e conferência do manifesto não substituem esses testes.
- O resultado de um combate de estrada permanece transitório até a gravação; a nova tentativa funciona enquanto a tela permanece aberta. Fechar/recarregar o navegador durante uma falha não cria um diário persistente do resultado. Não foi introduzido um novo formato de save para isso.
- A validação reforça a integridade estrutural e referências internas; não comprova autenticidade do save nem consulta catálogos para validar toda regra de gameplay. A migração de um registro estruturalmente corrompido pode falhar; o adaptador preserva o original.
- O hook principal e as folhas globais ainda possuem responsabilidades de composição. Foram extraídas responsabilidades concretas, sem uma reformulação geral das telas. Testes estáticos de CSS restantes continuam necessários para a cascata legada e não medem a qualidade visual.
- Se uma das artes excluídas do pré-cache ganhar um consumidor, atualizar também `globIgnores`. Nenhuma arte ativa ou aviso de licença foi excluído do offline nesta revisão.
