# Revisão da interface 2D do Paralaxe

Data: 09/11/2026  
Base: `develop`, commit `e3e4ac5130109cda4b151dbdc42d6e2eb74f6ed6`  
Escopo: revisão de HUD, navegação, menus, overlays, criação e Ofícios. Somente documentação; nenhuma alteração de gameplay, assets, saves ou código executável.

## Conclusão

A base já tem identidade própria e componentes úteis. A prioridade é corrigir inconsistências de comportamento e geometria, preservando o RPG idle 2D centrado na interface. Não há recomendação de migrar para 3D, canvas ou outro motor. A regra de reservar 75–80% de uma cena 3D não se aplica automaticamente a este jogo.

Foram identificados sete achados por inspeção de código e um atrito de fluxo. As reproduções abaixo são roteiros para validação, não testes de navegador executados. As observações geométricas são inferências das regras CSS.

## Base e método

- Referência de produto: [UX-GDD](../UX-GDD.md), especialmente seções 7, 11, 24, 25, 28 e 30.
- Leitura da entrada ativa `principal.tsx`, ordem das folhas CSS, shell, componentes compartilhados e telas relacionadas.
- 89 arquivos obtidos para inspeção local: componentes TSX sem testes, CSS, README, UX-GDD e package.json. Leitura complementar do coordenador da partida e de Prestígio.
- Diretrizes aplicadas: Game Studio / Game UI Frontend e Frontend Design Premium.
- Sem AGENTS.md, DESIGN.md ou premium-ui.json encontrados na árvore consultada. O UX-GDD e os tokens existentes continuam sendo as referências; não foi criado um contrato visual concorrente para esta revisão.
- P2 = problema que merece correção em uma próxima etapa; P3 = melhoria de fluidez. Não se atribui gravidade crítica sem evidência.

Os caminhos e linhas se referem ao commit-base. Prefixo dos arquivos abaixo: `aplicativos/jogo/fonte/`.

## Achados

### UI-01 — P2 — Largura ampla não participa do cálculo dos painéis laterais

**Evidência:** `responsivo-refinamento.css:90` aplica os modos de leitura; `styles/tokens.css:102` define 600/760/960 px equivalentes com raiz de 16 px. Porém `interface-do-jogo.css:558` calcula afastamento e largura dos painéis usando sempre 760 px.

**Efeito provável:** no modo amplo, o conteúdo cresce em direção aos painéis fixos. A 1280 px, a caixa central de 960 px começa em x=160; o painel esquerdo pode ir de x=16 a x=246. Há interseção horizontal das caixas, embora o grau de encobrimento de conteúdo dependa do padding e da posição vertical. O mesmo risco existe à direita e no toast.

**Correção recomendada:** uma variável de largura efetiva compartilhada entre conteúdo, recuos e orçamento lateral; quando não houver espaço, transformar os painéis em navegação compacta. Preservar a preferência salva.

**Aceite:** conferir os três modos em 1100, 1280, 1440 e 1920 px, com toast e menu abertos; nenhuma ação ou texto deve ficar coberto. Repetir com zoom de 200%.

### UI-02 — P2 — Créditos ficam inacessíveis dentro da partida

**Evidência:** `EstruturaDoJogo.tsx:551` monta créditos em `.movel-creditos` e `:587` dentro de `.jogo-companheiro`. `interface-do-jogo.css:124` oculta ambos com `display: none !important`. A lista de opções em `EstruturaDoJogo.tsx:275` não oferece créditos.

**Impacto:** é necessário sair da partida para consultar créditos nas telas de entrada/personagens. Eles existem no projeto; este achado não afirma ausência de atribuição nem conclui descumprimento de licença.

**Correção recomendada:** disponibilizar “Créditos e licenças” no menu global, reutilizando o componente existente, sem interromper trabalho automático.

**Aceite:** abrir e fechar créditos durante uma partida com mouse, toque e teclado; retornar o foco ao acionador e preservar o estado da partida.

### UI-03 — P2 — Movimento reduzido não alcança os GIFs de Guerreiro e Mago

**Evidência:** `features/criacao/CartaoDaClasse/CartaoDaClasse.tsx:5` seleciona GIFs para as duas classes; `:33` renderiza um img sem alternativa estática. As regras de redução de movimento em `CartaoDaClasse.module.css:19` e `:41` atingem sprites CSS.

**Impacto:** desativar animações CSS não interrompe um GIF. Essas classes continuam animadas enquanto as outras respeitam a preferência.

**Correção recomendada:** fornecer quadro estático por meio de picture/source, seguindo o padrão já usado em CenaDoOficio. Preservar a arte, origem e créditos.

**Aceite:** em prefers-reduced-motion: reduce, todas as classes ficam imóveis, legíveis e selecionáveis; fora desse modo, mantêm a animação prevista.

### UI-04 — P2 — Cena de Ofício anima também em modo de consulta

**Evidência:** `features/atividades/TelaDeAtividades/TelaDeAtividades.tsx:93` envia somente profissão e legenda a CenaDoOficio. Em `features/atividades/CenaDoOficio/CenaDoOficio.tsx:27`, o GIF é escolhido sempre que o usuário não pediu movimento reduzido. O componente não recebe estado de atividade.

**Impacto:** a tela informa “EM CONSULTA”, mas a cena continua trabalhando. O UX-GDD §28 especifica que a animação acompanha apenas a profissão ativa. Isso enfraquece a distinção entre consultar e executar.

**Correção recomendada:** derivar o estado visual da atividade efetiva e usar a imagem estática durante consulta. Navegar entre profissões não deve iniciar nem parar trabalho.

**Aceite:** iniciar Mineração e consultar Pesca; a atividade e seu progresso continuam em Mineração, enquanto Pesca fica estática e identificada como consulta. Testar também ausência de trabalho e redução de movimento.

### UI-05 — P2 — Erro de abertura do armazenamento termina em uma tela sem ação

**Evidência:** `Aplicativo.tsx:77` apresenta título e mensagem para `tela === "erro"`, mas não oferece tentativa novamente, retorno ou orientação concreta de recuperação.

**Impacto:** uma falha deixa o jogador sem caminho visível. Isso contrasta com `BancadaDeCombate.tsx:78`, que oferece ações explícitas para tentar salvar ou retomar novamente.

**Correção recomendada:** expor uma nova tentativa segura de inicialização e instruções de acordo com a causa conhecida. Nunca sugerir apagar dados como primeira solução e nunca afirmar que salvou sem confirmação.

**Aceite:** simular falha de abertura do repositório, verificar mensagem e ação de recuperação; uma tentativa bem-sucedida deve reabrir a lista sem alterar saves.

### UI-06 — P2 — Prestígio de Ofício tem menos proteção que o de Personagem

**Evidência:** `features/atividades/TelaDeAtividades/TelaDeAtividades.tsx:161` chama diretamente `aoPrestigiarProfissao`. O botão informa “reiniciar ofício”, mas não apresenta uma etapa de revisão das consequências. Já `features/personagem/PainelDePrestigio/PainelDePrestigio.tsx` usa preparação e prévia antes do comando.

**Impacto:** o jogador pode comprometer um reinício com um único acionamento, com menos contexto que no fluxo semelhante de Personagem. O bloqueio do botão também depende de trabalhos de outros slots, sem motivo específico junto à ação.

**Correção recomendada:** mostrar prévia derivada do domínio, com o que reinicia, o que permanece e o benefício, seguida de confirmação explícita. Explicar o bloqueio e como resolvê-lo. Não inventar nem alterar regras de Prestígio.

**Aceite:** cancelar a preparação não modifica a partida; confirmar envia um único comando; falha preserva a prévia e permite nova tentativa. Conferir benefícios e valores com as regras atuais.

### UI-07 — P3 — Busca de Ofícios não oferece limpeza direta

**Evidência:** `features/atividades/TelaDeAtividades/TelaDeAtividades.tsx:179` renderiza TextField controlado, sem botão de limpar. O estado vazio em `:267` manda limpar a busca, mas não oferece a ação.

**Impacto:** para recuperar o catálogo, especialmente no celular, o jogador precisa focar o campo e apagar o texto manualmente.

**Correção recomendada:** botão “Limpar busca” quando houver texto, com nome acessível e retorno de foco ao campo. Como a filtragem é local, a limpeza deve ser imediata.

**Aceite:** busca sem resultados → limpar → opções reaparecem, preservando profissão e filtro de níveis/Prestígios.

### UI-08 — P3 — Toda troca cotidiana de trabalho abre uma folha modal

**Evidência:** `features/atividades/TelaDeAtividades/TelaDeAtividades.tsx:73` pede confirmação sempre que existe trabalho principal; `:273` usa PainelRapido. O UX-GDD §11 prefere comunicar a consequência no contexto da ação, sem janela pesada para troca cotidiana.

**Impacto:** a operação frequente ganha dois passos e uma grande superfície de confirmação. A proteção é útil quando há múltiplos trabalhos afetados; a apresentação atual não diferencia esse caso.

**Correção recomendada:** para a troca simples, comunicar a substituição junto ao botão e usar ação explícita. Para cancelamento de vários trabalhos, manter revisão proporcional com a lista dos afetados. Preservar a regra de consultar sem iniciar.

**Aceite:** trocar um trabalho e trocar três trabalhos apresentam consequências claras antes do comando; nenhuma alteração ocorre só por escolher outro ofício.

## Bases que devem ser preservadas

- Quatro destinos principais e Jornada como consulta contextual.
- Modal compartilhado com dialog nativo, Escape, identificação acessível e restauração de foco; PainelRapido mantém cabeçalho separado do corpo rolável.
- Radix Select em Ofícios com agrupamento, navegação acessível e tratamento de colisão.
- Tokens CSS e fonte de exibição Antiquity Print; não há motivo nesta revisão para substituir a identidade.
- Imagens estáticas alternativas já previstas para os Ofícios.
- Feedback de ações assíncronas, estados vazios e recuperação explícita no combate.
- Inventário compacto e completo usando a mesma partida, com comparação e estado pendente ao equipar.

Esses são pontos positivos encontrados no código, não certificação de acessibilidade ou de funcionamento em todos os navegadores.

## Verificação realizada e limites

A revisão estática levou em conta as folhas carregadas depois da base: por exemplo, o painel companheiro existe no JSX, mas está oculto no CSS ativo. Não foi classificado como painel permanentemente visível.

Foi executado:

```sh
python /home/agent/.codex/plugins/cache/openai-curated-remote/frontend-design-premium/1.4.0/skills/frontend-design-premium/scripts/audit_project.py /workspace/scratch/b5eeadc81d8c/review-source --mode strict
```

Resultado: exit code 2, nove apontamentos automáticos. A pasta contém apenas a seleção de fontes desta revisão, não um checkout completo. O resultado é evidência auxiliar, não aprovação do projeto.

Triagem dos nove apontamentos:

| Quantidade | Detecção | Interpretação |
| --- | --- | --- |
| 1 | Select nativo sem decisão de propriedade documentada | Documentar quando SelectField nativo é intencional e quando usar Radix; nativo não é defeito por si só. |
| 6 | Botões sem ação em KitDeInterface | Exemplos da rota de desenvolvimento /ui-kit; não foram tratados como seis bugs de gameplay. |
| 1 | Formulário sem noValidate | Formulário de acesso online indisponível; não é prova de falha no acesso local. |
| 1 | Scrollbar sem contrato completo de propriedades padrão | Falta scrollbar-color no conjunto de CSS inspecionado; avaliar tokens e modo de alto contraste antes de padronizar. |

O clone por HTTPS falhou por falta de autenticação do Git local; a leitura e publicação usaram a conexão com GitHub. Não foram executados build, testes, typecheck, instalação de dependências nem playtest no navegador. Não houve acesso a GitHub Actions. Contraste calculado, sobreposição renderizada, teclado virtual e toque permanecem sem validação em execução. Não se declara conformidade WCAG nem aprovação visual.

## Ordem sugerida para uma etapa de correções

1. Resolver o orçamento horizontal dos modos de leitura e proteger a revisão de Prestígio.
2. Restaurar acesso global aos créditos e recuperação de falhas.
3. Unificar movimento reduzido e distinguir animação ativa de consulta.
4. Reduzir fricção da busca e das trocas de trabalho.
5. Consolidar seletores/layout e documentar propriedade dos tokens, sem acrescentar novas folhas de sobrescrita para cada ajuste.

Matriz mínima de validação futura: desktop em 1280×720 e 1440×900; celular em 360×800 e 390×844; temas claro/escuro; três larguras de leitura; teclado; zoom de 200%; movimento reduzido; lista vazia e erro de persistência. Incluir seletor de Ofícios aberto, Jornada longa, Inventário, toast e opções. Usar partidas descartáveis para Prestígio, preservando os saves do jogador.
