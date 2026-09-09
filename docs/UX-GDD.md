# Greywake — Especificação Canônica de UX

> Este documento aprofunda a seção **41. UX e interface** do GDD enquanto o M5.5 — UX Foundation estiver em definição.
>
> Ele registra princípios permanentes de experiência e usabilidade. Soluções concretas como sidebar, tabs, cards, mapa da Cidade, posição de controles e wireframes pertencem ao M5.5 até serem aprovadas.

---

# 1. Objetivo da UX

Greywake é um Idle RPG Dark Fantasy de longa duração, Web-first, 2D e UI-heavy.

A interface deve permitir profundidade estratégica sem transformar o jogo em uma ferramenta administrativa difícil de compreender.

> **A complexidade de Greywake deve vir da profundidade de suas decisões, não da dificuldade de encontrar, lembrar ou compreender as informações necessárias para tomá-las.**

> **A interface esclarece fatos, estados e consequências conhecidas; ela não escolhe a estratégia pelo jogador.**

> **O jogo deve respeitar tanto o jogador presente quanto o jogador que retorna depois de horas ou dias.**

---

# 2. Referências de experiência

As referências abaixo definem princípios, não identidade visual a copiar.

## Idle games

Greywake absorve:

- progressão persistente;
- baixa exigência contínua de atenção;
- retorno após ausência;
- planejamento e otimização;
- evolução do jogador de execução para decisão estratégica.

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
- transições entre estados do jogo tratadas como parte da experiência.

A profundidade de preparação é referência. A alta densidade de algumas telas de Death Stranding não é objetivo por si só.

---

# 3. Princípio de fricção

Jogos precisam de dificuldade, risco e incerteza. Usabilidade não significa remover esses elementos.

Greywake distingue:

## Fricção intencional

Pode incluir:

- inimigos difíceis;
- risco de perder loot de expedição;
- escassez;
- rotas irreversíveis;
- escolhas estratégicas;
- decisões narrativas sem resposta perfeita;
- necessidade de preparação.

## Fricção acidental

Deve ser reduzida:

- não saber onde executar uma ação;
- não entender por que algo está indisponível;
- depender de memorização evitável;
- menus excessivamente profundos;
- elementos visualmente iguais com comportamentos diferentes;
- falta de explicação sobre mudança de estado;
- informação crítica escondida da decisão que depende dela.

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
```

Nenhuma tela precisa exibir todas as respostas simultaneamente. Elas precisam ser recuperáveis sem esforço desproporcional.

---

# 5. Três horizontes de informação

Greywake organiza progresso conceitualmente em três horizontes.

## Agora

O que está acontecendo neste instante.

Exemplos:

- atividade Idle atual;
- próxima ação;
- combate atual;
- telegraph;
- produção em andamento.

## Sessão

O que o jogador está tentando realizar nos próximos minutos.

Exemplos:

- obter material suficiente;
- concluir determinada produção;
- preparar um equipamento;
- concluir um serviço.

## Jornada

Para onde a progressão está levando.

Exemplos:

- contrato atual;
- preparar-se para uma Dungeon;
- concluir uma etapa narrativa;
- alcançar determinado marco de progressão.

> **O jogador pode ser livre sem ficar perdido.**

---

# 6. Progressive disclosure

Complexidade aparece quando produz valor.

O jogo não deve apresentar todos os sistemas avançados apenas porque eles já existem tecnicamente.

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

- buildup de status ganha importância quando o jogador encontra uma fonte de status;
- configuração defensiva é apresentada quando combate já possui contexto suficiente para ela;
- risco de expedição recebe destaque no momento da preparação da Dungeon.

---

# 7. Recognition over recall

Greywake deve reduzir memorização desnecessária.

Quando apropriado:

- materiais mostram usos relevantes;
- receitas mostram requisitos e quantidade possuída;
- habilidades mostram custos, requisitos, cooldowns e condições;
- equipamentos mostram impacto compreensível;
- objetivos atuais podem ser recuperados;
- fontes conhecidas de materiais podem ser consultadas;
- estados de risco mostram explicitamente sua consequência.

A interface deve conectar conhecimento que o jogo já forneceu ao jogador.

---

# 8. Informação contextual

Informações devem aparecer principalmente onde possuem significado.

Exemplos:

- buildup surge quando existe buildup relevante;
- falta de Stamina aparece junto da habilidade afetada;
- o risco da Bolsa de Expedição aparece em contexto de Dungeon;
- materiais faltantes aparecem junto da receita;
- uma ação contextual aparece quando está disponível naquele estado.

> **Nem toda informação importante precisa ser permanentemente visível. Ela precisa estar disponível no momento em que pode alterar uma decisão.**

---

# 9. Preparação como gameplay

Equipamento, habilidades, consumíveis, estilo, Party e escolhas de rota podem alterar fortemente resultados.

Quando isso ocorre, preparação deve possuir significado de gameplay e não parecer simplesmente configuração administrativa.

A preparação deve responder:

- qual desafio está por vir;
- qual é o estado atual do personagem;
- o que está sendo levado;
- o que está em risco;
- quais escolhas ainda podem ser modificadas;
- qual decisão inicia o compromisso.

A interface fornece ferramentas para planejar. Ela não deve apresentar automaticamente a estratégia ótima.

---

# 10. Atividades Idle e continuidade

Atividade Idle representa um estado contínuo do personagem, não necessariamente uma obrigação de permanecer em uma tela.

A arquitetura final deve permitir compreender facilmente:

- qual atividade está ativa;
- progresso atual;
- resultado esperado;
- como interromper ou alterar a atividade;
- o que acontece ao navegar para outro contexto seguro.

O comportamento exato de navegação durante atividade ainda será fechado no M5.5.

---

# 11. Experiência de retorno

Ao retornar depois de ausência, Greywake deve reconciliar o estado anterior com o atual.

Não basta apresentar números novos sem contexto.

O retorno pode comunicar, proporcionalmente à importância:

- duração processada;
- atividade realizada;
- recursos obtidos;
- XP;
- níveis ganhos;
- desbloqueios;
- eventos importantes interrompidos ou aguardando decisão.

O retorno não deve virar uma sequência longa de modais obrigatórios para progresso trivial.

---

# 12. Feedback

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
- recurso recebido.

### Meso

- receita concluída;
- Skill ganhou nível;
- item reforçado;
- serviço concluído.

### Macro

- nível geral;
- contrato importante;
- primeiro clear;
- descoberta narrativa relevante;
- Relíquia.

> **A intensidade do feedback deve acompanhar a importância do evento.**

Eventos triviais não devem bloquear controle. Eventos importantes não devem parecer descartáveis.

---

# 13. Consistência e affordance

Elementos interativos devem parecer interativos.

A linguagem visual deve diferenciar de maneira consistente:

- navegação;
- ação;
- seleção;
- estado;
- informação;
- confirmação de risco.

> **Mesma aparência implica expectativa de comportamento equivalente.**

A mesma ação deve produzir resposta visual consistente em toda a interface.

---

# 14. Prevenção e recuperação de erro

A quantidade de cerimônia acompanha o custo do erro.

Ações comuns, reversíveis e de baixo risco devem ser rápidas.

Ações irreversíveis, destrutivas ou de alto risco devem informar a consequência antes da confirmação.

Exemplos de alto risco:

- bifurcação irreversível;
- retirada/continuação que altera risco da expedição;
- destruição/venda relevante de item;
- decisão narrativa permanente.

O jogo deve oferecer recuperação quando isso não destruir o significado da mecânica.

---

# 15. Onboarding e aprendizado

> **O jogador aprende jogando.**

O ensino prefere:

```text
contexto
↓
necessidade
↓
mecânica
↓
ação
↓
feedback
↓
compreensão
```

Antes de ensinar como executar uma mecânica, sempre que possível o jogo estabelece por que ela importa.

Tutoriais obrigatórios devem devolver controle rapidamente.

Instruções contextuais são preferíveis a exposições extensas antecipadas.

Aprendizado pode ser reforçado por desafios que exijam naturalmente o uso da mecânica ensinada.

---

# 16. Combate explicável

Combate automático deve ser visualmente compreensível.

A interface deve permitir observar quando relevante:

- Vida, Mana e Stamina;
- ação atual;
- habilidade escolhida;
- cooldown;
- condição inválida;
- falta de recurso;
- telegraph;
- buildup/status;
- alvo;
- resultado da ação;
- log recolhível.

O jogador deve conseguir responder:

> **Por que o personagem fez isso?**

E, após uma derrota importante, deve existir informação suficiente para formar uma nova hipótese estratégica.

Isso não exige relatório técnico permanente ou exposição integral de fórmulas.

---

# 17. Habilidades e consumíveis

Os quatro slots ativos aparecem em ordem de prioridade real.

A interface comunica:

- categoria;
- perfil;
- custo;
- cooldown;
- requisito;
- condição defensiva;
- estado de disponibilidade.

Consumíveis mostram:

- item equipado;
- quantidade quando pertinente;
- condição automática;
- estado de uso/cooldown quando existir.

A interface informa explicitamente que consumir ocupa a ação atual.

---

# 18. Dungeon

A Dungeon é uma mudança clara de contexto e risco.

A interface deve comunicar:

- sala atual;
- conexões disponíveis;
- rota percorrida;
- bifurcações irreversíveis;
- recursos atuais;
- Bolsa de Expedição;
- diferença entre propriedade segura e loot em risco;
- possibilidade de retirada quando existir;
- consequência conhecida de continuar.

Uma decisão irreversível deve ser comunicada antes da confirmação.

A interface não deve revelar automaticamente qual rota possui a melhor recompensa.

---

# 19. Decisões narrativas

A interface apresenta fatos conhecidos sem rotular moralidade.

No caso de escolhas como Matar/Poupar:

- sem cor de “bom/mau”;
- sem coração/caveira que classifique intenção moral;
- sem preview de recompensa que transforme a decisão em otimização econômica;
- sem linguagem que declare qual opção é correta.

---

# 20. Acessibilidade

Acessibilidade é requisito da arquitetura de experiência.

Informação crítica não deve depender exclusivamente de:

- cor;
- áudio;
- movimento.

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
- escala de texto;
- contraste;
- navegação por teclado/foco quando aplicável;
- sinais redundantes;
- ritmo de leitura controlável;
- redução de movimento quando apropriado.

Mobile deve receber adaptação de interface, não apenas compressão da interface desktop.

---

# 21. Método de avaliação de UX

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

# 22. Teste com jogadores

Não validar apenas por opinião.

Perguntas de teste devem investigar modelo mental e comportamento:

- Onde você acha que está?
- O que faria agora?
- O que acha que este elemento fará?
- O que espera que aconteça se confirmar?
- Por que está executando esta atividade?
- Onde procuraria determinado recurso ou função?
- O que acha que causou esta derrota?
- Como retomaria se fechasse o jogo agora?

Regra:

```text
problema observado
≠
solução sugerida pelo jogador
```

Comportamento e confusão observados são evidência. A solução sugerida por um playtester é uma hipótese a avaliar.

---

# 23. Decisões ainda em aberto

Esta especificação deliberadamente não decide ainda:

- sidebar, tabs, barra inferior ou outra navegação;
- Cidade como mapa visual ou menu;
- posição exata de Personagem;
- quantidade final de informação persistente no shell;
- representação visual de Dún Liath;
- padrão concreto de desktop;
- padrão concreto de mobile;
- densidade final entre interface funcional e diegética;
- estética final dos componentes;
- animações e áudio concretos.

Essas decisões serão fechadas no M5.5 através de arquitetura de informação, fluxos, wireframes e playtest antes de implementação definitiva.
