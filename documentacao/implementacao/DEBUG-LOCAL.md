# Debug local — tudo no máximo

No menu **Opções do jogo**, junto às preferências de tema e largura, selecione **Debug: tudo no máximo**.

A ação grava e abre uma cópia do personagem selecionado, identificada por `[DEBUG]`. A partida original mantém seu próprio ID e progresso. O save de teste aparece na seleção de personagens e continua disponível após fechar/reabrir o jogo. Para voltar, use **Escolher personagem**. Dentro do debug, a mesma opção passa a **Repor tudo no máximo**, reutilizando o ID do teste em vez de criar outra cópia.

## Preset

- Personagem no nível 99; sete atributos em 99, referência explícita do preset, pois não há teto canônico de atributo.
- Sete ofícios no nível 99 e Prestígio III; personagem em Prestígio III, árvore toda desbloqueada e 15 pontos disponíveis.
- 9.999.999 moedas e recursos de coleta, receitas, projetos e consumíveis nas quantidades máximas normais por pilha.
- Um exemplar de cada modelo de equipamento do catálogo, raro, reforço +2 e dois afixos. Uma seleção por espaço é equipada automaticamente por valor-base/bonificações; os demais ficam no banco. Não promete otimização de build ou sinergia por classe.
- Todas as habilidades conhecidas; quatro técnicas iniciais preparadas conforme a classe.
- Dificuldades de Dún Liath liberadas, contrato concluído e incursão automática disponível.
- Cidade com 32 projetos concluídos, Códice e Desafios liberados e receitas registradas na Jornada.
- Mira recrutada com vínculo Leal exclusivamente no save de teste; isso não implementa a segunda masmorra nem sua campanha.
- Trabalhos e expedições ficam inativos ao criar/repor o preset, permitindo escolher livremente o que testar.

O armazenamento de debug possui 1.000 espaços em cada bolsa/banco e margem de até 1.000.000 por pilha para receber saques e produzir sem travar em estoques já preenchidos. Partidas normais continuam com 24/80 espaços e limites de pilha 9.999/99.

Não há invulnerabilidade nem sucesso forçado: os motores normais de combate, simulação, coleta e fabricação continuam executando suas regras. O debug libera conteúdo implementado, não serviços ainda ausentes como Ferreiro/Relicário ou uma segunda masmorra.

## Contratos

`services/partidaDeDebug.ts` constrói o preset sobre cópia profunda, sem alterar o save/catálogos de origem. `useAplicativoDaPartida` aguarda a fila anterior, revalida personagem e risco, bloqueia duplo envio e só troca de personagem após salvar. A reposição do debug existente passa pela fila transacional. Falha de gravação mantém o personagem atual e permite tentar novamente. Combate, expedição e incursão ativa bloqueiam essa opção.

O marcador opcional `PartidaLocal.depuracao.idDaPartidaOriginal` identifica o save de teste e ativa somente nele o armazenamento ampliado. É preservado pelo formato histórico e validado na persistência. Partidas antigas continuam no esquema 18 sem exigir novo campo ou migração.

## Validação

Testes cobrem preset nas seis classes, recursos/instâncias sem duplicação, capacidade normal preservada, recarga da marca de debug e aborto de gravação sem perda do save anterior. O tratamento de transações IndexedDB observa a requisição e a conclusão em conjunto, evitando rejeição órfã quando o navegador aborta a escrita.

O navegador verifica acesso pelo menu, falha de escrita e nova tentativa, integridade real do preset, preservação do original, reposição sem duplicatas, recarga e retorno ao personagem normal, dificuldades liberadas e bloqueio durante incursão.

Resultado da entrega: `pnpm verificar` aprovado com 396 testes; `pnpm compilar` aprovado; cenários funcionais de navegador acima aprovados em Chromium desktop. Não equivale a balanceamento de campanha ou validação visual completa em todas as resoluções.
