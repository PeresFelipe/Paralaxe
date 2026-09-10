# Greywake — Especificação Canônica de UX

> Este documento aprofunda a seção **41. UX e interface** do GDD e registra a fundação canônica de experiência aprovada durante o M5.5 — UX Foundation.
>
> Ele descreve arquitetura de informação, comportamento entre estados, fluxos, linguagem de interação, responsividade, acessibilidade e regras de apresentação. Valores de pixel, componentes concretos de framework e decisões de implementação permanecem fora desta especificação.
>
> **Greywake é o nome de trabalho utilizado nesta especificação; o nome definitivo do jogo permanece A definir no GDD.**

---

# 1. Objetivo da UX

Greywake é um Idle RPG Dark Fantasy de longa duração, Web-first, 2D e UI-heavy.

A interface é parte central do gameplay. O jogador administra progressão, build, recursos, preparação, combate automático, Dungeons e decisões principalmente através dela, mas isso não significa adotar uma linguagem de dashboard genérico.

> **A complexidade de Greywake deve vir da profundidade de suas decisões, não da dificuldade de encontrar, lembrar ou compreender as informações necessárias para tomá-las.**

> **A interface esclarece fatos, estados e consequências conhecidas; ela não escolhe a estratégia pelo jogador.**

> **O jogo deve respeitar tanto o jogador presente quanto o jogador que retorna depois de horas ou dias.**

> **O mundo dá contexto e identidade; não deve impor fricção de navegação apenas para parecer diegético.**

---

# 2. Referências de experiência

As referências abaixo definem princípios, não identidade visual, assets ou componentes a copiar.

## Idle games

Greywake absorve:

- progressão persistente;
- baixa exigência contínua de atenção;
- retorno após ausência;
- planejamento e otimização;
- evolução do jogador de execução para decisão estratégica;
- continuidade entre sessões.

Greywake não deve depender da densidade típica de dashboards de idle games como linguagem principal da experiência.

## Apple

Greywake absorve:

- arquitetura de informação;
- hierarquia clara;
- consistência;
- previsibilidade;
- familiaridade;
- progressive disclosure;
- redução de fricção acidental;
- informação apresentada no contexto correto;
- simplicidade como clareza, não como ausência de funções.

## Nintendo

Greywake absorve:

- aprender jogando;
- introdução gradual de complexidade;
- feedback imediato e prazeroso;
- experimentação segura;
- redução de barreiras sem remover profundidade;
- microinterações que reforçam causa e efeito.

## Hideo Kojima — Metal Gear Solid 4 / Death Stranding

Greywake absorve:

- informação contextual e orientada ao estado;
- interface com significado dentro da ficção;
- preparação como gameplay;
- ferramentas que ajudam o jogador a formular planos sem revelar a solução ótima;
- contexto, risco e tensão comunicados através da própria interface;
- transições entre estados tratadas como parte da experiência;
- leitura simultânea do estado atual e da ameaça próxima quando isso altera decisão.

A profundidade de preparação é referência. A alta densidade de algumas telas de Death Stranding não é objetivo por si só.

---

# 3. Princípio de fricção

Jogos precisam de dificuldade, risco e incerteza. Usabilidade não significa remover esses elementos.

## Fricção intencional

Pode incluir:

- inimigos difíceis;
- risco de perder loot de expedição;
- escassez;
- rotas irreversíveis;
- escolhas estratégicas;
- decisões narrativas sem resposta perfeita;
- necessidade de preparação;
- desconhecimento ficcional legítimo.

## Fricção acidental

Deve ser reduzida:

- não saber onde executar uma ação;
- não entender por que algo está indisponível;
- depender de memorização evitável;
- menus excessivamente profundos;
- elementos visualmente iguais com comportamentos diferentes;
- falta de explicação sobre mudança de estado;
- informação crítica escondida da decisão que depende dela;
- obrigar o jogador a reiniciar manualmente uma atividade apenas porque navegou por outra tela.

> **O desafio deve estar no jogo, não em operar a interface.**

---

# 4. Modelo mental fundamental

A experiência deve ajudar o jogador a responder, quando relevante:

```text
Onde estou?
O que está acontecendo?
O que estou fazendo?
O que posso fazer agora?
O que mudou?
Por que mudou?
Para onde estou indo?
O que está em risco?
```

Nenhuma tela precisa exibir todas as respostas simultaneamente. Elas precisam ser recuperáveis sem esforço desproporcional.

A arquitetura distingue quatro conceitos:

```text
DESTINO
onde encontro uma função
ex.: Cidade, Atividades

SISTEMA
regra do jogo
ex.: Skills, Equipment

ATIVIDADE
algo que continua acontecendo
ex.: Mineração

ESTADO
contexto que muda a interface
ex.: Combate, Dungeon, Preparação
```

Um mesmo conteúdo pode pertencer a mais de um conceito sem exigir destinos duplicados. Mineração é uma Skill e uma atividade Idle; Ferreiro é um destino da Cidade ligado ao sistema de equipamento; combate é sistema e estado contextual, não destino permanente.

---

# 5. Arquitetura de informação principal

Greywake adota uma arquitetura **system-first em acesso e navegação**, sem ser dashboard-first em apresentação.

No estado seguro, a navegação principal possui exatamente quatro destinos conceituais:

```text
GREYWAKE

NAVEGAÇÃO PRINCIPAL
├── Personagem
├── Atividades
├── Aventura
└── Cidade

CAMADA GLOBAL DE CONTINUIDADE
└── Jornada
```

**Jornada não é um quinto destino equivalente.** É uma camada global de continuidade para recuperar contexto, objetivo atual e acontecimentos relevantes sem retirar o jogador da tela em que está.

Combate não aparece como destino permanente. Ele é iniciado por conteúdo apropriado e assume um estado próprio.

Dungeons também não substituem Aventura como destino permanente; a expedição assume um estado próprio enquanto estiver ativa.

---

# 6. Três horizontes de informação

Greywake organiza progresso conceitualmente em três horizontes.

## Agora

O que está acontecendo neste instante.

Exemplos:

- atividade Idle atual;
- próxima ação;
- produção em andamento;
- combate atual;
- telegraph;
- sala atual de Dungeon.

## Sessão

O que o jogador está tentando realizar nos próximos minutos.

Exemplos:

- obter material suficiente;
- concluir determinada produção;
- preparar um equipamento;
- concluir um Serviço;
- alcançar uma saída segura da Dungeon.

## Jornada

Para onde a progressão está levando.

Exemplos:

- contrato atual;
- preparar-se para uma Dungeon;
- concluir uma etapa narrativa;
- alcançar determinado marco de progressão.

> **O jogador pode ser livre sem ficar perdido.**

---

# 7. Shell seguro

O shell seguro é a moldura persistente usada quando o personagem não está em Combate nem em Dungeon ativa.

## Informação global

Deve manter recuperável e normalmente visível:

- avatar;
- nome;
- nível geral;
- Vida;
- Mana;
- Stamina;
- moeda principal de forma visualmente secundária;
- acesso a configurações.

Vida, Mana e Stamina permanecem visíveis no shell seguro, mas não precisam competir visualmente com o conteúdo principal.

> **Global não significa permanentemente chamativo.**

## Navegação principal

A navegação do shell usa:

```text
Personagem | Atividades | Aventura | Cidade
```

Os rótulos textuais devem permanecer claros, principalmente durante aprendizado. Ícones podem complementar, mas não substituir necessariamente o significado.

## Continuidade global

O shell também mantém acesso rápido a:

- **Atividade atual**;
- **Jornada**;
- **Inventário rápido**.

Conceitualmente:

```text
Atividade
→ o que estou fazendo

Jornada
→ para onde estou indo

Inventário
→ o que estou carregando
```

A atividade atual aparece como indicador pequeno e expansível. Quando houver uma ação Idle em andamento, esse indicador também comunica de forma compacta o avanço do ciclo atual e o tempo até a próxima conclusão, para que o jogador perceba que a atividade continua viva enquanto navega por áreas seguras. Jornada e Inventário abrem sem destruir o contexto corrente.

Se a atividade estiver pausada ou interrompida, o indicador não deve parecer simplesmente congelado: ele informa o estado e, quando conhecido, o motivo.

---

# 8. Jornada

Jornada existe para responder principalmente:

> **O que estava acontecendo e para onde eu estava indo?**

Ela abre como painel/overlay no desktop e equivalente adaptado no mobile, preservando a tela atual.

Pode conter:

```text
AGORA
atividade atual

EM ANDAMENTO / OBJETIVO ATUAL
contexto e fatos conhecidos

DESCOBERTAS RECENTES

CONCLUÍDO RECENTEMENTE
```

Jornada não deve virar um checklist prescritivo de estratégia.

Evitar:

```text
✓ compre consumível
✓ equipe arma
☐ coloque habilidade
```

quando esses passos forem apenas uma possível estratégia do jogador.

Quando não existe objetivo principal, Jornada continua útil, mostrando atividade atual, descobertas e conclusões recentes sem fingir que há uma missão obrigatória.

---

# 9. Inventário rápido

Inventário pertence conceitualmente a **Personagem**, mas possui acesso rápido global.

O acesso rápido abre painel/overlay para consultas e ações comuns, como:

- visualizar item;
- consultar quantidade;
- comparar rapidamente quando aplicável;
- favoritar/bloquear quando o sistema permitir.

O inventário completo permanece em:

```text
Personagem → Inventário
```

Os dois acessos representam o mesmo estado de Inventory. Nunca existem dois inventários paralelos.

---

# 10. Personagem

A estrutura interna é:

```text
PERSONAGEM
├── Visão Geral
├── Atributos
├── Equipamento
├── Técnicas
└── Inventário
```

Personagem abre inicialmente em **Visão Geral**.

## Visão Geral

Resume:

- identidade;
- retrato;
- recursos principais;
- atributos relevantes;
- equipamento;
- progressão;
- Técnicas configuradas;
- capacidade de Inventário quando pertinente.

Não replica a ficha completa de todas as subseções.

## Atributos

A distribuição deve mostrar causa e efeito conhecido antes da confirmação.

Exemplo conceitual:

```text
Vitalidade
12 → 13

Vida máxima
244 → 256
```

Alterações podem ser experimentadas/revisadas antes do compromisso final quando a regra de gameplay permitir. Não exigir modal para cada ponto individual.

## Equipamento

Equipamento utiliza thumbnails 1:1 e comparação objetiva.

A comparação mostra diferenças conhecidas sem declarar automaticamente um item como “melhor”, porque valor depende da build.

## Técnicas

Os quatro slots aparecem exatamente na ordem de prioridade utilizada pela automação.

Reordenação pode utilizar drag-and-drop onde apropriado, mas nenhuma operação essencial depende exclusivamente disso. Deve existir alternativa acessível e precisa.

Configurações automáticas permanecem simples, com limiares/condições suportadas pelo sistema, sem editor de scripting AND/OR.

## Inventário completo

Usa grid/lista de itens com painel de detalhe conforme o espaço disponível.

Materiais empilháveis mostram quantidade de forma legível. Equipamentos mostram raridade e upgrade sem depender somente de cor.

---

# 11. Atividades

Atividades reúne exatamente as sete Skills, agrupadas por função:

```text
ATIVIDADES

COLETA
├── Mineração
├── Lenhador
├── Pesca
└── Herbologia

PRODUÇÃO
├── Metalurgia
├── Forja
└── Culinária
```

Todas podem estar visíveis na tela agregadora. Cada Skill possui tela dedicada.

A tela agregadora mostra informação suficiente para reconhecer:

- Skill;
- nível/progresso;
- estado relevante;
- qual atividade está ativa.

Detalhes de otimização não precisam competir na tela agregadora.

## Tela de Skill

Cada Skill organiza informação em três níveis:

```text
NÍVEL 1 — decisão imediata
o que posso coletar/produzir?

NÍVEL 2 — compreensão
tempo, XP, quantidade, requisitos, usos

NÍVEL 3 — otimização
ferramentas, bônus, Prestígio, eficiência e detalhes avançados
```

Informação avançada pode ser expandida quando necessária.

## Feedback de ciclo Idle

Toda atividade de Coleta ou Produção ativa possui uma leitura temporal clara do ciclo em andamento.

A gramática conceitual usa três escalas complementares:

```text
AGORA
barra/indicador da ação atual
tempo restante
resultado esperado na próxima conclusão

SESSÃO
recursos/produtos obtidos
XP obtido no recorte atual

LONGO PRAZO
nível da Skill
progresso para o próximo nível
```

A escala **Agora** é a mais importante para comunicar que o jogo não está parado. O indicador avança continuamente durante a ação e reinicia quando um novo ciclo começa.

Ao concluir um ciclo, a interface oferece microfeedback proporcional, por exemplo `+1 Cloch` e `+4 XP`, sem modal ou interrupção desnecessária.

Em Produção, o feedback deve tornar legível a relação entre entrada e saída quando pertinente, por exemplo:

```text
5 Cloch → 1 Cloch Tratada
```

Se a produção parar, a interface substitui a ambiguidade por um estado explícito, como:

```text
PRODUÇÃO INTERROMPIDA
Cloch 3 / 5
Faltam 2
```

Atalhos para a fonte conhecida do material podem ser oferecidos, mantendo a regra de navegar sem iniciar automaticamente outra atividade.

Movimento pode reforçar visualmente que o ciclo está avançando, mas informação necessária nunca depende apenas da animação. Com redução de movimento, tempo, estado e progresso continuam legíveis por meios estáticos/numerais.

## Relações entre materiais e usos

Materiais podem exibir usos conhecidos e permitir navegar diretamente para o sistema relacionado.

Exemplo:

```text
Cloch
→ Cloch Tratada — Metalurgia
→ equipamento básico — Forja
```

Atalhos contextuais **navegam, mas não iniciam automaticamente** a atividade.

Se uma receita precisa de seis Cloch, pode mostrar:

```text
Cloch 3 / 6
[Ir para Mineração]
```

O jogador ainda escolhe recurso e confirma o início.

## Troca de atividade

Como existe uma atividade Idle por vez no estado normal, iniciar outra substitui a atual.

A consequência deve aparecer antes da ação, preferencialmente no próprio contexto do botão, sem modal pesado para troca cotidiana.

---

# 12. Aventura

A estrutura é:

```text
AVENTURA
├── Serviços
└── Dungeons
```

Aventura é o portal para conteúdo ativo/de risco. Combate não é opção permanente da navegação principal.

## Serviços

Um Serviço apresenta antes da preparação, quando conhecidos:

- contexto;
- objetivo;
- ameaça/risco;
- recompensa;
- estado/progresso.

A ação principal é **Preparar**, não iniciar combate instantaneamente quando a preparação for relevante.

## Dungeons

A tela de uma Dungeon apresenta somente conhecimento que o jogador possui, como:

- contexto;
- objetivo;
- dificuldade/risco conhecido;
- estado do contrato;
- progresso descoberto;
- regras de risco da expedição.

Após exploração, a mesma tela pode revelar salas e fatos descobertos sem expor previamente a estrutura completa.

---

# 13. Cidade

Existe uma única Cidade Livre como destino inicial.

A Cidade possui uma tela/hub geral com cinco estabelecimentos:

```text
CIDADE LIVRE
├── Taverna
├── Mercado
├── Ferreiro
├── Banco
└── Relicário
```

A Cidade não é world-first nem requisito de navegação para acessar Skills. Ela fornece contexto narrativo, serviços e identidade do mundo.

A tela geral usa apresentação visual forte e acesso claro aos cinco estabelecimentos. Não exige um mapa diegético complexo para encontrar funções.

## Taverna

Prioriza:

- NPCs presentes;
- conversas;
- contratos;
- rumores/contexto relevante.

NPCs importantes podem usar retratos 4:5.

## Mercado

É operacional. Arte contextual pode ser reduzida para priorizar compra, venda, categorias, quantidades, preço e posse.

## Ferreiro

É serviço/NPC da Cidade e não substitui a Skill **Forja**.

```text
Atividades → Forja
= produção executada pelo jogador

Cidade → Ferreiro
= serviço do mundo/NPC
```

## Banco

Prioriza transferência clara entre Inventário e patrimônio armazenado/seguro.

## Relicário

Pode receber maior peso visual e contemplativo por tratar Relíquias como itens excepcionais, mantendo informações de origem, efeito e histórico quando aplicável.

---

# 14. Progressive disclosure

Complexidade aparece quando produz valor.

Fluxo preferido:

```text
necessidade percebida
↓
mecânica introduzida
↓
uso contextual
↓
feedback
↓
detalhe avançado disponível
```

Exemplos:

- produção ganha destaque após o primeiro recurso relevante;
- buildup de status ganha importância quando existe uma fonte relevante;
- consumíveis automáticos são aprofundados depois que o primeiro combate já criou contexto;
- risco de expedição recebe destaque na preparação da Dungeon;
- informação avançada de otimização fica disponível sem ocupar permanentemente o primeiro nível de leitura.

---

# 15. Recognition over recall e informação contextual

Greywake deve reduzir memorização desnecessária.

Quando apropriado:

- materiais mostram usos relevantes;
- receitas mostram requisitos e quantidade possuída;
- Técnicas mostram custos, requisitos, cooldowns e condições;
- equipamentos mostram impacto compreensível;
- objetivos atuais podem ser recuperados;
- fontes conhecidas de materiais podem ser consultadas;
- estados de risco mostram explicitamente a consequência.

> **Informação e interação devem existir, sempre que possível, no contexto em que possuem significado.**

> **Nem toda informação importante precisa ser permanentemente visível. Ela precisa estar disponível no momento em que pode alterar uma decisão.**

---

# 16. Estados globais e continuidade Idle

A atividade Idle é um estado contínuo do personagem e não exige permanência na tela da Skill.

## Regra de navegação segura

Ao navegar entre **Personagem, Atividades, Aventura e Cidade**, a atividade Idle continua normalmente.

Abrir Inventário rápido, Jornada ou outros painéis seguros também não interrompe a atividade.

## Máquina de estados conceitual

```text
SAFE
↓ abrir preparação
PREPARAÇÃO
↓ confirmar conteúdo de risco
RISK ACTIVE — COMBATE / DUNGEON
↓ concluir / retirar / morrer
SAFE
```

Comportamento Idle:

```text
SAFE                ativa
PREPARAÇÃO          ativa
COMBATE             pausada
DUNGEON              pausada
RETORNO AO SAFE      retomada automaticamente
```

Abrir Preparação não pausa Idle. O compromisso final de entrar no conteúdo de risco é a fronteira.

Combates de Serviço também pausam a atividade Idle.

Ao concluir Serviço, retirar-se de Dungeon, concluir Dungeon ou morrer, a atividade anterior retoma automaticamente quando o personagem retorna a um contexto seguro.

O jogo deve comunicar essa retomada sem exigir confirmação manual. A leitura compacta do ciclo pode mudar explicitamente entre `ativa`, `pausada durante risco` e `retomada`, preservando a atividade escolhida e eliminando a impressão de travamento.

> **O jogador não precisa administrar manualmente a continuidade do Idle ao entrar e sair de conteúdo de risco.**

---

# 17. Preparação como gameplay

Preparação é um estado dedicado para conteúdo em que build e recursos alteram significativamente o resultado.

Durante Preparação, a navegação global permanece disponível de forma visualmente reduzida. Cancelar Preparação retorna exatamente ao contexto de origem.

A tela deve responder:

- qual desafio está por vir;
- qual é o estado atual do personagem;
- qual equipamento está configurado;
- quais Técnicas e prioridade estão configuradas;
- quais consumíveis estão preparados;
- qual Estilo está selecionado;
- o que está em risco;
- quais fatos indicam configuração incompleta;
- qual decisão inicia o compromisso.

## Alertas

Preparação mostra fatos objetivos, por exemplo:

```text
2 slots de Técnica vazios
1 slot de Consumível vazio
Vida atual: 72%
```

Não deve avaliar subjetivamente a build:

```text
“sua build está ruim”
“esta é a melhor arma”
```

## Ajustes sem perda de contexto

Revisões de Equipamento, Técnicas e Consumíveis devem ocorrer dentro da Preparação quando possível, através de painel/sheet ou equivalente, sem obrigar o jogador a abandonar o contexto de risco e navegar por várias áreas.

## Níveis de preparação

A mesma gramática pode variar em profundidade:

```text
PREPARAÇÃO LEVE
primeiro combate / Serviço simples

PREPARAÇÃO PADRÃO
Serviços relevantes / combates difíceis

PREPARAÇÃO DE EXPEDIÇÃO
Dungeon
```

Não são sistemas separados.

## Compromisso

Riscos conhecidos devem aparecer perto da ação final. A ação de entrar é o momento de compromisso.

Para Dungeon, antes de confirmar deve ficar claro que:

- Idle será pausado;
- loot encontrado entra na Bolsa de Expedição;
- esse loot permanece em risco até uma saída segura.

---

# 18. Combate explicável

Combate assume estado dedicado e reduz/recolhe quase totalmente a navegação global.

A origem do combate continua identificável de forma discreta, como Dungeon e sala ou Serviço que o iniciou.

Durante combate, o jogador não acessa o Inventário completo. Somente recursos preparados e operações permitidas pelas regras de combate ficam disponíveis. Isso não altera as restrições de troca de equipamento definidas no GDD.

## Hierarquia principal

A interface deve permitir observar simultaneamente, quando relevante:

- personagem e inimigo;
- Vida, Mana e Stamina;
- ação atual do personagem;
- ação/telegraph relevante do inimigo;
- Técnicas configuradas em prioridade real;
- cooldowns;
- condições inválidas;
- falta de recurso;
- consumíveis preparados;
- status/buildup;
- alvo;
- resultado das ações;
- log recolhível.

> **A interface de combate deve permitir que o jogador entenda o estado presente, o próximo evento relevante e a razão pela qual a automação tomou — ou não tomou — determinada ação.**

## Telegraphs

Telegraph importante usa sinais redundantes como:

- nome;
- tempo restante;
- sinal visual;
- ícone/forma quando pertinente;
- efeito conhecido quando o personagem já possui essa informação.

Nunca depende somente de cor ou áudio.

## Técnicas

Os quatro slots aparecem na ordem real de prioridade.

Estados curtos podem indicar:

```text
pronto
cooldown 2,1 s
condição não atendida
recurso insuficiente
```

Detalhes explicam a causa quando consultados.

## Consumíveis

A interface mostra item, quantidade, condição automática e estado.

Quando um consumível dispara, deve ser possível compreender que o uso ocupou a ação atual.

## Status

Status usam combinação de ícone, nome e duração/estado quando aplicável.

## Log

O log fica recolhido por padrão e serve para análise, não para competir com o combate principal.

## Resultado

Vitória e derrota apresentam um resumo proporcional, capaz de explicar fatos relevantes sem decidir a interpretação estratégica pelo jogador.

Após derrota importante, os últimos eventos devem permitir formar nova hipótese sobre o que ocorreu.

Bosses usam a mesma gramática de combate, com maior peso de apresentação, telegraphs e presença visual.

---

# 19. Dungeon em execução

A Dungeon é um estado próprio e mantém o Idle pausado enquanto a run estiver ativa.

Entre combates, a interface da Dungeon prioriza cinco perguntas:

```text
Onde estou?
Como estou?
O que há aqui?
O que está em risco?
Para onde posso ir?
```

## Sala como unidade principal

Cada sala organiza:

```text
nome
↓
arte/contexto
↓
descrição curta
↓
elementos encontrados
↓
ações contextuais
↓
rotas
```

Ações aparecem porque fazem sentido naquele contexto, evitando uma barra genérica permanente de verbos.

## Mapa

O mapa usa estrutura legível de nós/conexões com ambientação contextual.

Mostra somente conhecimento adquirido:

- sala atual;
- salas visitadas;
- conexões conhecidas;
- caminhos ainda parcialmente desconhecidos;
- rota percorrida.

Não revela automaticamente tesouro, Elite, melhor rota ou estrutura completa antes da descoberta.

## Bolsa de Expedição

A Bolsa permanece rapidamente acessível e comunica quantidade/itens em risco.

A diferença entre patrimônio seguro e loot da run deve ser impossível de confundir.

Ao obter loot, o feedback informa imediatamente que foi adicionado à Bolsa e permanece em risco.

## Bifurcações

Escolhas reversíveis permanecem leves.

Escolhas irreversíveis recebem cerimônia proporcional e mostram a consequência antes da confirmação, preferencialmente no próprio contexto da rota em vez de um modal genérico de “Tem certeza?”.

## Combate dentro da Dungeon

Combate nasce da sala e retorna à mesma estrutura após resolução. A interface preserva o contexto espacial para não parecer que o jogador foi transportado para um sistema desconectado.

## Sala de recuperação

Comunica claramente quando regras temporariamente permitem:

- recuperação;
- reorganização de Equipamento;
- reorganização de Técnicas;
- ajuste de Consumíveis;
- ajuste de Estilo.

Fora dos pontos permitidos, a interface não deve sugerir que essas alterações são possíveis.

## Eventos narrativos

Momentos importantes podem reduzir mapa, Bolsa e outros elementos para dar foco à cena e à decisão.

Escolhas como Matar/Poupar não recebem classificação moral por cor, ícone ou recompensa prevista.

## Retirada

Quando permitida, retirada fica recuperável sem competir visualmente com toda ação de sala.

Antes da confirmação, o jogador deve saber o que será assegurado, o que será encerrado e quais consequências são conhecidas.

## Pré-Boss

O pré-Boss é uma decisão explícita entre assegurar loot e continuar assumindo risco.

A própria tela de decisão deve funcionar como confirmação suficiente quando apresenta claramente:

- estado do personagem;
- quantidade de itens em risco;
- consequência de retornar;
- consequência de continuar.

Não é necessário adicionar um segundo “Tem certeza?” se a consequência já foi comunicada com clareza.

## Fairtheoir e encontros importantes

O primeiro encontro com Boss importante pode receber uma apresentação narrativa/visual dedicada antes de entrar na gramática normal de combate.

A apresentação deve sugerir através de comportamento, cena e ficção sem explicar antecipadamente interpretações narrativas que o jogador deveria descobrir.

---

# 20. Persistência de contexto e retorno

## Fechar o jogo durante Dungeon

Uma Dungeon ativa permanece ativa. O Idle permanece pausado.

Ao reabrir com Dungeon ativa, a experiência prioriza a retomada da expedição e reconstrói o contexto relevante antes de devolver controle.

A estratégia técnica para um fechamento exatamente no meio de uma ação de combate continua definida separadamente no GDD/arquitetura; esta regra de UX não determina se o combate será retomado por snapshot ou outra solução válida.

## Retorno após ausência em estado seguro

Quando o jogador retorna depois de horas ou dias, o jogo deve reconciliar estado anterior e atual.

O resumo pode comunicar proporcionalmente:

- duração da ausência;
- atividade realizada;
- recursos obtidos;
- XP;
- níveis ganhos;
- desbloqueios;
- causa de eventual interrupção;
- fatos relevantes aguardando decisão.

O objetivo principal é responder:

> **O que aconteceu desde a última vez que estive aqui?**

Ausências triviais não precisam da mesma cerimônia que longos períodos com mudanças importantes.

O retorno não deve virar uma sequência de modais para recompensas repetitivas.

---

# 21. Onboarding e aprendizado

> **O jogador aprende jogando.**

O fluxo inicial aprovado é:

```text
Novo Jogo
↓
Escolha do modo de Save
↓
Nome
↓
Classe
↓
Presente
↓
Confirmar
↓
introdução narrativa curta
↓
Cidade Livre
↓
indicação clara da Taverna, mantendo controle
↓
primeira necessidade contextual
↓
Atividades
↓
primeira coleta escolhida
↓
primeiro recurso
↓
primeira produção relacionada
↓
primeiro Serviço
↓
Preparação simplificada
↓
primeiro combate
↓
Técnicas / Estilo
↓
Consumíveis
↓
contrato de Dún Liath
↓
Preparação completa
↓
Dún Liath
```

## Criação

A criação funciona como fluxo em etapas dentro de uma mesma experiência, não como formulário burocrático único.

Classe usa apresentação por cards/conteúdo com:

- identidade;
- atributos destacados;
- equipamento inicial;
- Técnica/habilidade inicial.

Deve ficar claro que a classe define o começo e não o destino.

Presentes comunicam a utilidade conhecida sem revelar segredos futuros.

## Primeira entrada

A introdução narrativa é curta e devolve controle rapidamente.

A Taverna recebe indicação clara, mas o jogador mantém controle para aprender navegação.

## Primeira coleta

A necessidade inicial apresenta as possibilidades de coleta sem selecionar automaticamente uma Skill.

Ao abrir Atividades, as sete Skills existem na arquitetura; Coleta recebe foco contextual inicial e Produção permanece visível sem competir.

Dentro da Skill, o jogador escolhe o recurso e confirma o início.

O primeiro feedback ensina de forma breve que a atividade continua enquanto ele navega por contextos seguros.

## Primeira produção

Depois do primeiro recurso, a produção relacionada ganha destaque. Outras produções continuam visíveis.

Receitas mostram quantidades possuídas e materiais faltantes. Atalhos podem levar à fonte conhecida sem iniciar automaticamente a coleta.

Iniciar produção substitui a atividade Idle anterior e comunica isso antes da ação.

O primeiro produto explica brevemente sua utilidade conhecida.

## Primeiro combate

A Taverna/Jornada apresenta um Serviço que cria contexto para Aventura.

A primeira Preparação é simplificada e mostra apenas sistemas já relevantes.

Durante o combate, instruções aparecem contextualmente. O jogo pode interromper/desacelerar somente quando um evento realmente novo e importante exigir compreensão, como o primeiro telegraph perigoso.

O resultado apresenta fatos suficientes para iniciar leitura de causa e efeito.

## Técnicas, Estilo e Consumíveis

Depois do primeiro combate, Jornada pode indicar novas opções e levar a Personagem → Técnicas.

Somente Técnicas aprendidas precisam competir visualmente; conteúdo futuro não exige uma parede de bloqueios.

Ao equipar a primeira Técnica, a relação entre slot e prioridade é mostrada claramente.

Estilo é introduzido junto dessa camada de configuração de forma simples.

Consumíveis automáticos são aprofundados antes da Dungeon, não precisam sobrecarregar o primeiro combate.

## Contrato de Dún Liath

A Taverna apresenta o contrato narrativamente. Depois de aceito, ele permanece recuperável por Aventura/Jornada.

Aceitar o contrato devolve controle normal e atualiza Jornada; não inicia Preparação automaticamente.

A tela de Dún Liath comunica contexto, objetivo, dificuldade/risco e informações conhecidas, sem revelar inimigos e recompensas integrais.

A Preparação aponta fatos objetivos de configuração e o botão final de entrada recebe peso proporcional ao compromisso.

## Regra de ensino

> **A explicação aparece perto da primeira decisão que exige aquele conhecimento.**

Fluxo preferido:

```text
ver
↓
fazer
↓
receber feedback
↓
entender
```

---

# 22. Dún Liath como tutorial avançado

A primeira Dungeon ensina progressivamente por sua própria estrutura:

```text
entrada
→ Bolsa de Expedição

primeiras salas
→ exploração e mapa

primeiro combate
→ risco acumulado

bifurcação
→ irreversibilidade

recuperação
→ reorganização

evento narrativo
→ decisão sem classificação moral

pré-Boss
→ risco vs retirada

Fairtheoir
→ domínio do sistema
```

Não é necessário explicar todos esses conceitos por texto antes da entrada.

---

# 23. Feedback e progressão

Feedback deve confirmar:

1. que a ação foi recebida;
2. o que aconteceu;
3. quando necessário, por que aconteceu;
4. como isso altera o estado ou progresso.

## Escalas

### Micro

- botão;
- compra;
- equipar;
- seleção;
- recurso recebido;
- cooldown concluído;
- item movido.

### Contextual

- receita concluída;
- Skill ganhou nível;
- recurso desbloqueado;
- item reforçado;
- Serviço concluído.

### Momento

- nível geral;
- contrato importante;
- Dungeon iniciada/concluída;
- Boss;
- derrota significativa;
- descoberta narrativa relevante;
- Relíquia.

> **A intensidade do feedback deve acompanhar a importância do evento.**

Progresso importante é celebrado sem sequestrar controle. Level up comum pode ser breve; desbloqueio que altera possibilidades recebe destaque maior.

Recompensas repetitivas de Idle devem ser agregadas quando necessário para evitar chuva de notificações.

---

# 24. Movimento e áudio

Animação deve ser curta, física e informativa.

Pode reforçar causa e efeito, por exemplo:

- loot movendo-se visualmente para a Bolsa;
- atividade anterior cedendo espaço à nova;
- shell seguro recuando quando a Dungeon assume foco;
- telegraph preparando visualmente o impacto.

Movimento constante apenas decorativo deve ser evitado quando compete com leitura.

Transições frequentes não devem atrasar decisões.

Áudio segue a mesma hierarquia de importância:

- ação pequena → resposta pequena;
- level up → assinatura reconhecível;
- telegraph perigoso → sinal distinto;
- Boss/Dungeon → peso maior.

Nenhuma informação necessária depende exclusivamente do som.

---

# 25. Prevenção, erro, loading e confiança

## Prevenção de erro

A quantidade de cerimônia acompanha o custo do erro.

Ações comuns, reversíveis e de baixo risco devem ser rápidas.

Ações irreversíveis, destrutivas ou de alto risco informam a consequência antes da confirmação.

Exemplos:

- bifurcação irreversível;
- retirada/continuação de expedição;
- decisão narrativa permanente;
- exclusão de progresso/dados;
- outra ação realmente destrutiva.

## Erro de operação

Quando uma operação falha, a interface deve informar:

- o que não ocorreu;
- se nada foi consumido/alterado;
- causa conhecida quando disponível;
- próxima ação possível.

Erros normais de gameplay não devem ser apresentados apenas como códigos técnicos.

## Loading

Loading real pode ser comunicado de forma contextual. Não adicionar espera artificial para parecer jogo.

Quando usar skeleton/loading, evitar reflow ou conteúdo falso que mude abruptamente de posição.

## Salvamento

Persistência deve transmitir confiança sem exigir administração manual constante.

Estados como `Salvando...` e `Salvo` podem ser discretos. O jogo não deve afirmar que salvou antes de possuir confirmação correspondente ao modelo de persistência em uso.

Falhas reais de salvamento precisam ser comunicadas claramente.

---

# 26. Estados vazios

Estados vazios devem explicar o estado e, quando útil, a origem futura do conteúdo.

Exemplos:

```text
Inventário
Ainda não há itens aqui.
Itens coletados, produzidos ou encontrados aparecerão neste espaço.
```

```text
Técnicas
Nenhuma Técnica adicional aprendida.
```

```text
Relicário
Nenhuma Relíquia descoberta.
```

Não inventar tarefas ou recompensas apenas para preencher visualmente um estado vazio.

---

# 27. Linguagem de overlays e superfícies

Greywake utiliza uma gramática consistente:

```text
PÁGINA
→ destino principal

PAINEL / SHEET
→ consulta ou ajuste sem perder contexto

EXPANSÃO INLINE
→ detalhe local

TOAST / FEEDBACK TRANSITÓRIO
→ confirmação breve

ESTADO DEDICADO
→ Preparação, Combate, Dungeon e decisão crítica

MODAL
→ exceção; interrupção realmente necessária ou consequência destrutiva
```

O objetivo é preservar contexto e evitar multiplicação de padrões de interação concorrentes.

---

# 28. Sistema visual e mídia

A linguagem visual combina:

```text
ESTRUTURA
limpa, previsível e legível

SUPERFÍCIE
Dark Fantasy

ARTE
forte e autoral

TIPOGRAFIA
personalidade nos títulos, legibilidade nos dados

ORNAMENTO
pontual

MOVIMENTO
contido e informativo
```

A interface deve parecer um jogo, não um painel SaaS genérico, sem transformar cada controle em ornamento medieval pesado.

## Intensidade visual por função

> **Quanto mais narrativa a tela, mais espaço para arte; quanto mais operacional, mais espaço para informação; quanto mais crítico o estado, mais a interface assume um modo próprio.**

Exemplos:

```text
Cidade / Taverna / Dungeon
→ identidade visual forte

Mercado / Banco / Inventário
→ eficiência maior

Preparação / Combate
→ foco e estado

NPC / Boss
→ retrato ou apresentação dedicada
```

Em áreas visitadas frequentemente, uma arte contextual pode reduzir sua presença depois que o jogador já reconhece o local, sem desaparecer necessariamente.

## Padrões de imagem

As artes criadas para o jogo devem considerar slots padronizados desde o wireframe:

- **16:9** — ambientes, estabelecimentos, Skills, Dungeons e imagens contextuais principais;
- **4:5** — personagem, NPCs e retratos importantes;
- **1:1** — itens, equipamentos, recursos, Técnicas e Relíquias;
- **ícones pequenos** — estados, recursos e informação operacional.

Para artes contextuais 16:9, **1920×1080** é o arquivo mestre recomendado de produção, não uma dimensão fixa de renderização da interface. A UI preserva a proporção e adapta tamanho ao viewport.

As artes devem possuir **safe area** para permitir pequenos crops responsivos sem cortar o assunto principal.

Informação essencial, valores, requisitos e textos de sistema nunca dependem de texto incorporado dentro do arquivo da arte.

> **A intensidade visual da arte deve acompanhar a frequência de uso da tela.**

---

# 29. Responsividade

Greywake usa uma arquitetura responsiva, não três experiências conceitualmente diferentes.

## Desktop

Permite maior largura, painéis laterais e conteúdo em múltiplas colunas quando isso melhora leitura.

## Mobile

Mobile recebe adaptação real, não compressão do desktop.

A arquitetura mental continua:

```text
Personagem | Atividades | Aventura | Cidade
```

Os quatro destinos podem migrar para navegação inferior no mobile por ergonomia, sem alterar seu significado.

Painéis laterais podem virar sheets ou superfícies de maior altura.

Nenhuma ação essencial depende de hover.

## Combate mobile

Prioridade de leitura:

- inimigo e ameaça/telegraph;
- personagem e recursos;
- cena;
- ação atual;
- Técnicas;
- consumíveis;
- log expansível.

Não tentar comprimir literalmente o layout desktop em duas colunas estreitas.

## Dungeon mobile

Sala e arte aparecem com estado, Bolsa e ações. O mapa completo pode assumir uma tela/surface própria para preservar legibilidade.

---

# 30. Acessibilidade

Acessibilidade é requisito da arquitetura de experiência.

Informação crítica não deve depender exclusivamente de:

- cor;
- áudio;
- movimento;
- hover;
- drag-and-drop.

Quando necessário, combinar:

- texto;
- ícone;
- forma;
- posição;
- contraste;
- animação;
- áudio.

A fundação deve considerar:

- legibilidade;
- escala de texto/interface;
- contraste;
- navegação por teclado e foco visível quando aplicável;
- sinais redundantes;
- ritmo de leitura controlável;
- redução de movimento;
- alvos de toque adequados;
- tooltips acessíveis por foco, clique ou toque.

Raridade, risco, disponibilidade e estados similares não dependem apenas de cor.

Telegraphs permanecem compreensíveis sem áudio e sem depender apenas de animação.

---

# 31. Configurações e ajuda

Configurações devem ser proporcionais às funções reais do jogo.

Categorias conceituais incluem:

- áudio;
- interface;
- acessibilidade;
- jogo, quando houver opções relevantes;
- dados/salvamento.

Ações destrutivas relacionadas a progresso recebem confirmação proporcional.

Ajuda avançada deve preferir progressive disclosure.

Termos podem apresentar explicação curta e opção de detalhe adicional, permitindo ao jogador que quer apenas decidir ler o essencial e ao jogador que quer otimizar acessar a profundidade.

---

# 32. Decisões narrativas

A interface apresenta fatos conhecidos sem rotular moralidade.

No caso de escolhas como Matar/Poupar:

- sem cor de “bom/mau”;
- sem coração/caveira que classifique intenção moral;
- sem preview de recompensa que transforme a decisão em otimização econômica;
- sem linguagem que declare qual opção é correta.

Momentos narrativos importantes podem reduzir elementos operacionais da tela para concentrar atenção na cena e na decisão.

---

# 33. Fim de Dún Liath e conclusão de conteúdo

A conclusão de Dún Liath recebe apresentação mais forte que uma vitória comum, incluindo quando pertinente:

- Boss derrotado;
- resumo da expedição;
- salas/decisões relevantes;
- descobertas;
- itens assegurados;
- consequência narrativa.

Depois, o jogador retorna ao estado seguro e a atividade Idle anterior retoma automaticamente.

A ficção não deve usar linguagem de desenvolvimento como “fim da Build 0.1”. Caso uma versão de teste precise informar que o conteúdo disponível terminou, isso deve existir como camada de produto/teste separada da narrativa.

---

# 34. Método de avaliação de UX

Fluxos importantes devem ser avaliados com a sequência:

```text
INTENT
Que experiência queremos provocar?
↓
CONTEXT
O jogador entende onde está e o estado atual?
↓
GOAL
Entende o que pode tentar alcançar?
↓
DECISION
Possui informação suficiente para escolher?
↓
ACTION
Consegue executar sem fricção acidental?
↓
FEEDBACK
Entende imediatamente o resultado?
↓
LEARNING
Entende por que aconteceu?
↓
PROGRESS
Entende como isso afeta sua jornada?
↓
RETURN
Consegue retomar depois sem depender da memória?
```

---

# 35. Teste com jogadores

Não validar apenas por opinião.

Perguntas de teste investigam modelo mental e comportamento:

- Onde você acha que está?
- O que faria agora?
- O que acha que este elemento fará?
- O que espera que aconteça se confirmar?
- Por que está executando esta atividade?
- Onde procuraria determinado recurso ou função?
- O que acha que causou esta derrota?
- Como retomaria se fechasse o jogo agora?

Cenários mínimos de validação incluem:

1. criar personagem e iniciar uma atividade sem instrução externa;
2. encontrar para que serve um recurso;
3. trocar de atividade entendendo o que será interrompido;
4. configurar uma Técnica e compreender prioridade;
5. preparar um Serviço;
6. entender por que uma habilidade não foi usada;
7. entrar em Dún Liath entendendo o risco da Bolsa;
8. navegar por salas e bifurcações;
9. identificar quando equipamento pode ser alterado;
10. decidir retirar-se ou enfrentar o Boss;
11. explicar aproximadamente por que morreu;
12. retornar depois de horas e entender o que aconteceu.

Regra:

```text
problema observado
≠
solução sugerida pelo jogador
```

Comportamento, hesitação e confusão observados são evidência. A solução sugerida por um playtester é uma hipótese a avaliar.

---

# 36. Direção Visual 0.1

A Direção Visual 0.1 é a baseline aprovada para prototipagem de alta fidelidade. Ela concretiza os princípios de UX sem transformar valores de protótipo em regras imutáveis.

> **A estrutura permanece limpa e previsível; a atmosfera Dark Fantasy vem de arte, superfícies, tipografia de destaque, som e microinterações sem sacrificar legibilidade.**

## Paleta-base de protótipo

Papéis semânticos iniciais:

| Papel | Referência 0.1 | Uso principal |
|---|---|---|
| Fundo profundo | `#101315` | fundo geral |
| Superfície | `#171C1F` | painéis e cards |
| Superfície elevada | `#20262A` | seleção e overlays |
| Borda | `#343B3F` | separação |
| Texto principal | `#E5E1D8` | leitura principal |
| Texto secundário | `#A9AAA5` | informação auxiliar |
| Ferro claro | `#C4C7C5` | detalhe neutro |
| Bronze envelhecido | `#A98555` | ação importante e destaque |
| Azul frio | `#718C95` | Mana/contextos frios |
| Verde dessaturado | `#788A72` | estado positivo |
| Âmbar | `#B99255` | atenção |
| Carmesim | `#9E5550` | perigo e dano |

Esses valores são baseline de protótipo. Contraste, acessibilidade e playtest podem exigir ajuste sem reabrir a arquitetura visual.

Bronze envelhecido funciona como acento principal de interface para evitar aparência tecnológica genérica. Raridade, perigo, sucesso e outros estados continuam usando texto, forma e/ou ícone além de cor.

## Tipografia

A interface separa duas funções:

```text
DISPLAY / MUNDO
→ personalidade em nomes de lugares, Bosses e títulos especiais

INTERFACE / DADOS
→ máxima legibilidade em números, menus, requisitos e estados
```

Referências iniciais para protótipo:

- **Spectral** para display/mundo;
- **Inter** para interface/dados.

Essas famílias são candidatas 0.1 e podem ser substituídas após avaliação visual, desde que a separação funcional permaneça.

Fontes ornamentais ou góticas não devem comprometer leitura de dados operacionais.

## Formas e superfícies

A linguagem evita cards excessivamente arredondados de aplicativo moderno e também evita molduras medievais pesadas em todos os controles.

Referência inicial:

- cantos discretos, aproximadamente 4–8 px no protótipo;
- superfícies escuras, frias e pouco saturadas;
- bordas legíveis;
- ornamentação concentrada em títulos, divisores, estados especiais e momentos narrativos;
- textura sutil quando não interfere em texto ou affordance.

Botões principais podem usar bronze escuro/envelhecido com contraste claro. Botões secundários usam superfície neutra e borda. Ações terciárias podem usar texto/ícone.

A tela não deve virar uma coleção de botões preenchidos de igual peso.

## Hierarquia tipográfica e de informação

Quatro níveis devem ser reconhecíveis rapidamente:

```text
TÍTULO DO CONTEXTO
DÚN LIATH

SEÇÃO
TÉCNICAS

ELEMENTO
Golpe Calculado

METADADO
Cooldown 4,0 s
```

A diferença pode combinar família tipográfica, tamanho, peso, espaçamento e posição, sem depender apenas de cor.

## Espaçamento

Escala inicial de protótipo:

```text
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64
```

É uma régua de consistência, não contrato rígido de pixel.

> **Denso quando necessário, nunca apertado.**

Telas operacionais podem ter maior densidade interna, preservando separação clara entre grupos funcionais.

## Ícones

Ícones operacionais usam:

- silhueta clara;
- desenho simples;
- peso visual consistente;
- poucos detalhes internos;
- significado reconhecível em tamanhos pequenos.

Vida, Mana, Stamina e status devem possuir sinais próprios. Itens, recursos e Técnicas usam suas artes/thumbnails 1:1 e não dependem de ícones operacionais minúsculos para identidade.

## Uso da arte na interface

A arte é a principal fonte de atmosfera, mas dados importantes permanecem em superfícies legíveis da interface.

Gradientes ou overlays podem melhorar contraste quando texto realmente precisar coexistir com a imagem, sem cobrir toda a arte com escurecimento pesado.

A intensidade visual acompanha a frequência de uso:

```text
primeiro contato / momento narrativo
→ arte pode dominar mais espaço

uso recorrente / tela operacional
→ arte pode reduzir presença
```

Essa redução preserva a identidade visual do contexto.

## Assinatura visual por estado

Estados principais devem ser perceptivelmente diferentes sem exigir uma nova linguagem a cada tela:

```text
SAFE
→ estrutura estável e neutra

PREPARAÇÃO
→ foco crescente, contraste e acento de compromisso

DUNGEON
→ localização, estado e risco persistentes

COMBATE
→ molduras administrativas recuam; ação e ameaça dominam

BOSS / MOMENTO NARRATIVO
→ ruptura visual breve antes de retornar à gramática funcional
```

O jogador deve sentir visualmente a diferença entre navegar, preparar-se e assumir risco.

## Telegraphs

Telegraphs são uma assinatura visual importante de Greywake.

Um telegraph perigoso combina, quando aplicável:

- nome da ação;
- tempo restante;
- progresso temporal;
- efeito/tipo conhecido;
- forma/ícone relevante;
- movimento ou pulso complementar.

Reduzir movimento não pode reduzir a informação disponível.

## Escala de feedback

A apresentação acompanha a importância:

```text
loot/recurso comum
→ feedback mínimo

Skill / desbloqueio
→ feedback contextual

Relíquia / Boss / Dungeon concluída
→ momento dedicado
```

Eventos repetitivos não competem com eventos raros.

## Tela de referência para alta fidelidade

A primeira tela recomendada para protótipo visual é **Atividades → Mineração**, porque combina:

- shell seguro;
- navegação principal;
- arte contextual 16:9;
- recurso/item 1:1;
- nível e XP;
- atividade Idle ativa;
- seleção de recurso;
- informação decisional e detalhes avançados;
- acesso rápido a Inventário e Jornada.

Validar essa tela primeiro permite derivar grande parte da linguagem visual de Atividades e dos estados seguros antes de avançar para telas especiais.

---

# 37. Decisões ainda em aberto

A arquitetura de informação, os estados principais, a relação safe/risk, a organização de Personagem/Atividades/Aventura/Cidade/Jornada, a continuidade Idle, a gramática de Preparação/Combate/Dungeon, a base responsiva, o sistema de mídia e a Direção Visual 0.1 estão aprovados como fundação.

Permanecem deliberadamente abertos para protótipo de alta fidelidade e playtest:

- ajuste final da paleta a partir de contraste e leitura real;
- confirmação ou substituição das famílias tipográficas de referência;
- dimensões finais de componentes e espaçamentos específicos por viewport;
- estilo final do set de ícones;
- intensidade concreta de texturas, bordas e ornamentação;
- comportamento exato das artes reduzidas após familiaridade;
- animações concretas e suas durações finais;
- paisagem sonora e efeitos concretos;
- refinamentos de posição, densidade e hierarquia revelados pelo protótipo/playtest;
- detalhes de acessibilidade dependentes dos componentes e tecnologia escolhidos.

Esses refinamentos podem alterar a aparência concreta sem reabrir os princípios e a arquitetura aprovados, salvo evidência de problema estrutural.
