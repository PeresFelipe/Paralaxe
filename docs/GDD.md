# Game Design Document — Especificação do Jogo

> **Este documento é a fonte canônica das regras de negócio, sistemas, conteúdo, princípios de design e requisitos arquiteturais agnósticos de tecnologia do jogo.**
>
> Ele não descreve escopo de builds, valores provisórios de balanceamento, cenários de teste, critérios de aceite de uma versão específica nem escolhas concretas de stack. Esses itens pertencem aos documentos apropriados de build ou implementação.

---

# 1. Nome do jogo

**Nome:** A definir.

**Slogan:** A definir.

---

# 2. Definições gerais

## Tags

`Idle` `RPG` `Dark Fantasy` `Online` `Economia` `Crafting` `Dungeons` `Marketplace`

## Ambição

Criar um Idle RPG de longa duração, com progressão profunda, liberdade de build, exploração de um mundo em decadência, Dungeons com identidade própria, itens raros e uma interface elegante, simples e padronizada.

O jogo deve ser modular, fácil de manter e preparado para receber novos conteúdos sem exigir reconstrução dos sistemas centrais.

## Resumo

O jogador controla um único personagem principal que chega a um mundo em crise.

Enquanto tenta sobreviver e evoluir, desenvolve todas as Skills disponíveis, distribui atributos, fabrica equipamentos, enfrenta inimigos, explora Dungeons, toma decisões narrativas e descobre gradualmente as camadas históricas e políticas do mundo.

O personagem pode realizar Prestígios, formar Party com parceiros encontrados durante a jornada e conquistar Relíquias extremamente raras.

## Referências

- **Melvor Idle:** progressão por Skills e atividades Idle.
- **Dark Souls 1:** atmosfera, início por classe e presente, liberdade de build e mundo decadente.
- **Tolkien:** construção de mundo, povos, eras, conflitos e história antiga.
- **World of Warcraft:** identidade própria de cada Dungeon e Boss.
- **Apple:** arquitetura de informação, clareza, hierarquia, consistência, previsibilidade e progressive disclosure.
- **Nintendo:** aprender jogando, feedback imediato, experimentação segura e qualidade de microinterações.
- **Hideo Kojima — Metal Gear Solid 4 / Death Stranding:** informação contextual orientada ao estado, preparação como gameplay, planejamento, risco e transições de contexto.

As referências de UX representam princípios de experiência; não implicam copiar identidade visual, componentes, assets ou linguagem de marca.

## Plataformas e apresentação

Plataformas previstas:

- **Web**, como experiência primária;
- **Desktop**, preservando a mesma experiência de jogo quando empacotada como aplicação;
- **Mobile**, como plataforma futura com adaptação de interface quando necessário.

Direção de apresentação aprovada:

> **Web-first, 2D e UI-heavy.**

O jogo deve priorizar interface rica, legível e responsiva, animações suaves, microinterações e feedback claro. Ambiente 3D não é requisito estrutural da experiência.

---

# 3. Princípios centrais

> **A classe define o começo, não o destino do personagem.**

> **O jogador aprende jogando; nenhum sistema avançado é explicado antes de se tornar relevante.**

> **Poucas Skills, cada uma ampla e profunda.**

> **Atividade Idle entrega aquilo que o jogador escolheu produzir, não uma loteria de subprodutos desconectados.**

> **Prestígio deve mudar a forma de executar um sistema, não apenas aumentar números.**

> **O jogador não precisa executar cada ataque, mas preparação, build e decisões devem determinar o resultado.**

> **Jogar ativamente concede controle, não ações extras.**

> **Quanto mais perigosa uma habilidade, mais legível ela deve ser.**

> **A geração procedural muda o caminho, mas nunca contradiz a história do local.**

> **Escolhas narrativas mudam estados e caminhos; não escolhem entre “recompensa” e “castigo moral”.**

> **A primeira Dungeon não revela a verdade; ela apenas cria a primeira rachadura na versão que o jogador recebeu.**

---

# 4. Nível geral e atributos

## Nível geral

O personagem possui nível geral de **1 a 99**.

Experiência geral pode vir de:

- atividades;
- combate;
- quests;
- conquistas;
- progressão das Skills.

A cada nível geral ganho:

> **+1 ponto de atributo.**

A curva numérica de XP é um dado de balanceamento e deve ser mantida fora desta especificação até ser promovida a valor definitivo.

## Atributos

Existem exatamente sete atributos:

- **Vitalidade:** Vida e sobrevivência;
- **Mente:** Mana e sustentação mágica;
- **Vigor:** Stamina e sustentação física;
- **Força:** requisitos e scaling físico apropriado;
- **Destreza:** requisitos e scaling apropriado, Precisão, crítico e velocidade;
- **Inteligência:** Magias e dano Arcano;
- **Fé:** Milagres, cura e dano Sagrado.

## Recursos principais

O personagem utiliza somente:

- **Vida**;
- **Mana**;
- **Stamina**.

Relação principal:

```text
Vitalidade → Vida
Mente      → Mana
Vigor      → Stamina
```

Mana não é exclusiva de Magos.

Mente e Vigor não precisam aumentar dano diretamente. Sua identidade principal é sustentação de recursos.

## Liberdade de build

Classes, equipamentos e habilidades podem possuir afinidades e requisitos, mas nenhum caminho é permanentemente bloqueado pela classe inicial.

Um Guerreiro pode investir em Inteligência ou Fé; um Mago pode investir em Força; qualquer personagem pode se tornar híbrido quando cumprir os requisitos necessários.

## Requisitos e scaling

Armas, equipamentos e habilidades podem possuir requisitos de atributos e scaling.

Exemplo conceitual:

```text
Lâmina Arcana
Força         C
Destreza      D
Inteligência  A
```

A eficiência final depende da build construída pelo jogador.

Os multiplicadores exatos de scaling, fórmulas de recursos, Defesa, Precisão, crítico e velocidade são parâmetros de balanceamento e não regras estruturais do GDD.

---

# 5. Classes iniciais

## Regra principal

Cada classe altera somente:

1. distribuição inicial de atributos;
2. equipamento inicial;
3. habilidade inicial.

Nenhuma classe bloqueia permanentemente atributos, armas, equipamentos, Skills, categorias de habilidade ou caminhos de build.

Todas usam o mesmo orçamento inicial de **35 pontos distribuídos entre os sete atributos**.

## Distribuições de referência

| Classe | VIT | MEN | VIG | STR | DEX | INT | FAI |
|---|---:|---:|---:|---:|---:|---:|---:|
| Guerreiro | 7 | 2 | 7 | 8 | 4 | 2 | 5 |
| Mago | 4 | 8 | 3 | 2 | 3 | 10 | 5 |
| Caçador | 5 | 3 | 6 | 4 | 10 | 2 | 5 |
| Acólito | 5 | 8 | 4 | 3 | 2 | 3 | 10 |
| Ladino | 4 | 3 | 7 | 3 | 11 | 4 | 3 |
| Errante | 5 | 5 | 5 | 5 | 5 | 5 | 5 |

As distribuições podem ser alteradas por balanceamento sem mudar o princípio das classes.

## Identidade inicial

### Guerreiro

- corpo a corpo;
- sobrevivência;
- Força e Vigor;
- começa com arma física, escudo e proteção física;
- habilidade inicial Física Agressiva.

### Mago

- Mana;
- Inteligência;
- acesso imediato a dano mágico;
- começa com Cajado e vestes;
- habilidade inicial Magia Agressiva.

### Caçador

- Destreza;
- Precisão;
- combate à distância;
- começa com Arco e proteção leve;
- habilidade inicial Física Agressiva à distância.

### Acólito

- Fé;
- cura, defesa e suporte;
- começa com arma simples, Catalisador e vestes;
- habilidade inicial Milagre Defensivo.

### Ladino

- Destreza;
- crítico e velocidade;
- começa com Adaga e proteção leve;
- habilidade inicial Física Agressiva.

### Errante

- equilíbrio;
- nenhum atributo inicialmente atrasado;
- começa com arma versátil e proteção básica;
- habilidade inicial Universal.

## Habilidades iniciais

Habilidades recebidas na criação **não são exclusivas permanentemente da classe**. Outros personagens podem aprendê-las posteriormente se cumprirem os requisitos.

O equipamento recebido na criação pode ser fixo, sem RNG procedural, para preservar uma largada previsível.

---

# 6. Presentes iniciais

## Regra principal

> **A classe define como o personagem começa a lutar; o presente define uma pequena vantagem, conveniência ou curiosidade com a qual ele começa a jornada.**

Existem sete opções:

| Presente | Função |
|---|---|
| Chave Enferrujada | exploração e segredo |
| Bolsa de Moedas | vantagem econômica inicial |
| Frasco Carmesim | emergência de sobrevivência |
| Anel do Viajante | pequeno bônus versátil enquanto equipado |
| Pedra Sem Nome | lore e conteúdo secreto |
| Kit de Sobrevivência | consumíveis normais |
| Nenhum Presente | nenhuma vantagem |

## Regras por presente

### Chave Enferrujada

Pode abrir antecipadamente sala, cofre, caminho ou evento opcional. A recompensa nunca pode ser essencial para progressão.

Em Dún Liath, pode permitir acesso antecipado aos **Aposentos do Oficial**. Outra forma de acesso deve existir posteriormente.

### Bolsa de Moedas

Concede dinheiro inicial. Sua vantagem perde importância naturalmente conforme a economia cresce.

### Frasco Carmesim

Consumível raro de emergência. Não concede progressão permanente e pode ser obtido novamente no mundo.

### Anel do Viajante

Ocupa slot normal de Anel e aumenta Vida, Mana e Stamina máximas enquanto equipado. Não é Relíquia e deve ser naturalmente substituído pela progressão.

### Pedra Sem Nome

Objeto ligado a lore, diálogo, evento, civilização antiga ou conteúdo secreto. Não concede vantagem obrigatória de progressão.

### Kit de Sobrevivência

Contém somente consumíveis normais que podem ser obtidos por outros meios.

### Nenhum Presente

Não concede compensação escondida.

## Limites dos presentes

Nenhum presente pode conceder:

- Relíquia;
- material obrigatório de upgrade +2;
- habilidade permanentemente exclusiva;
- ponto permanente de atributo;
- Ponto de Prestígio;
- bônus permanente de XP;
- item globalmente limitado;
- equipamento destinado a dominar grande parte da progressão.

---

# 7. Skills

## Filosofia

O jogo possui exatamente sete Skills:

1. **Mineração**;
2. **Lenhador**;
3. **Pesca**;
4. **Herbologia**;
5. **Metalurgia**;
6. **Forja**;
7. **Culinária**.

Técnicas internas não criam novas Skills. Forja, por exemplo, pode incluir Ferraria, Couraria, Tecelagem, Arquearia e Ourivesaria.

## Regra global das atividades Idle

> **Atividades Idle não geram drops secundários aleatórios. Cada atividade entrega apenas seu recurso ou produto definido, além de XP e possíveis unidades adicionais desse mesmo resultado.**

## Comunicação de progresso Idle

> **Toda atividade Idle ativa deve comunicar progresso temporal de forma contínua e inequívoca. A interface mostra o avanço da ação atual, o resultado esperado da próxima conclusão e feedback quando o ciclo termina. Uma atividade que não avança deve explicar objetivamente o motivo.**

O jogador deve conseguir perceber três escalas de progresso quando pertinentes:

```text
AGORA
progresso da ação atual e tempo até a próxima conclusão

SESSÃO
resultado acumulado desde o início da atividade ou recorte atual

LONGO PRAZO
nível e progresso da Skill
```

Em Coleta, a conclusão de um ciclo comunica o recurso e XP recebidos. Em Produção, a conclusão comunica de forma compreensível a transformação de materiais em produto e XP.

Quando uma Produção não puder continuar por falta de materiais, requisito ou outra causa conhecida, o estado deve ser explicitamente comunicado; uma barra parada nunca deve ser a única indicação.

> **O progresso da atividade atual permanece perceptível enquanto o jogador navega por outras áreas seguras.**

Coleta:

```text
Escolher recurso
↓
aguardar ação
↓
receber recurso escolhido + XP
↓
repetir automaticamente
```

A quantidade-base normal é 1 unidade garantida por ciclo. Ferramentas, Prestígios e outros efeitos podem conceder unidades adicionais **do mesmo resultado**.

Materiais especiais devem possuir fontes explícitas, como:

- atividades próprias;
- receitas;
- Dungeons;
- Bosses;
- eventos;
- exploração;
- quests;
- conteúdo de Prestígio.

O jogador deve conseguir descobrir onde buscar um material.

## Produção

Metalurgia, Forja e Culinária utilizam receitas determinísticas:

```text
Selecionar receita
↓
consumir materiais definidos
↓
aguardar produção
↓
receber produto definido + XP
↓
repetir enquanto houver materiais
```

Produção normal não falha.

Produtos intermediários são receitas ou atividades explícitas, nunca subprodutos aleatórios.

## Uma atividade Idle por vez

No estado normal, o personagem executa uma atividade Idle por vez. Prestígios podem ampliar essa capacidade de maneira explícita.

## Ferramentas de coleta

Separadas dos equipamentos de combate e sem durabilidade:

- Mineração → Picareta;
- Lenhador → Machado de Corte;
- Pesca → Equipamento de Pesca;
- Herbologia → Kit de Herbologia.

Metalurgia e Culinária não possuem ferramenta equipável própria. Forja é uma Skill de produção.

Ferramentas podem afetar:

- velocidade;
- quantidade;
- chance de unidade adicional do mesmo resultado;
- XP da Skill.

Fontes regulares de ferramentas:

1. Forja;
2. Dungeons.

Ferramentas normais utilizam o mesmo princípio procedural dos equipamentos normais.

## Minigames

Cada Skill pode possuir um minigame temático periódico e opcional.

> **O Idle gera a oportunidade; a interação ativa permite aproveitá-la melhor.**

Bom desempenho pode melhorar temporariamente eficiência, velocidade, quantidade, unidade adicional do mesmo resultado ou XP.

Desempenho ruim nunca faz a produção Idle normal falhar.

Direções:

- Mineração → pontos de fraqueza da rocha;
- Lenhador → direção/timing de cortes;
- Pesca → fisgada e tensão da linha;
- Herbologia → Identificação e Extração;
- Metalurgia → Controle de Fundição;
- Forja → Martelamento;
- Culinária → Sequência e Timing.

---

# 8. Convergência da progressão inicial

O início apresenta escolha livre entre Mineração, Lenhador, Pesca e Herbologia.

> **Não pode existir uma coleta inicial secretamente correta.**

Todas devem produzir preparação útil para o primeiro arco de combate:

```text
Mineração → material → Metalurgia/Forja → reforço/equipamento → combate
Lenhador → material → Forja → equipamento/ferramenta → combate
Pesca → alimento → Culinária → preparação → combate
Herbologia → preparado → Culinária → recuperação/preparação → combate
```

Equivalência entre rotas significa **valor de preparação**, não bônus idênticos.

Uma rota pode gerar equipamento permanente; outra pode gerar sustain, recuperação ou preparação temporária.

Nenhuma rota deve exigir grind desproporcional ou troca obrigatória para outra Skill para continuar o onboarding.

---

# 9. Progressão das Skills

Cada Skill possui nível 1–99 e Prestígio I–III.

## Prestígio de Skill

Ao prestigiar:

- a Skill retorna ao nível 1;
- o antigo endgame torna-se o novo ponto de entrada;
- a progressão aumenta em profundidade e possibilidades.

> **O antigo endgame se torna o novo início.**

## Evolução mecânica por Prestígio

```text
Normal        → 1 atividade ou linha
Prestígio I   → 2 simultâneas
Prestígio II  → 2 simultâneas + prioridade avançada
Prestígio III → 3 simultâneas
```

Prestígio I possui uma atividade principal e uma secundária em eficiência reduzida.

Prestígio II permite configurações como:

- Equilibrado;
- Prioridade Principal;
- Prioridade Secundária.

Prestígio III permite três atividades individualmente desbloqueadas.

Percentuais exatos são dados de balanceamento.

Nomes temáticos do P1:

- Mineração — Extração Dupla;
- Lenhador — Corte Duplo;
- Pesca — Linha Dupla;
- Herbologia — Coleta Dupla;
- Metalurgia — Fundição Paralela;
- Forja — Produção Paralela;
- Culinária — Preparo Paralelo.

---

# 10. Convenção de nomenclatura

O mundo possui identidade atlântica sombria, inspirada culturalmente na transição entre tradições célticas e nórdicas, sem representar literalmente Irlanda, Islândia ou outro país real.

Recursos e nomes culturalmente importantes podem usar idiomas coerentes com a camada histórica do conteúdo, principalmente irlandês na vertente céltica e islandês/nórdico quando outra camada justificar.

Regras:

> **Nome diferente, visual familiar.**

> **A mesma coisa sempre recebe o mesmo nome.**

> **Nunca usar uma palavra estrangeira quando ela só torna uma informação de sistema mais difícil de entender.**

> **A origem linguística de um nome pode funcionar como pista cultural ou histórica.**

Termos funcionais permanecem em português: Mineração, Forja, Prestígio, Vida, Ameaça, Fácil, Normal etc.

Descrições e efeitos permanecem em português.

Nomes sobrenaturais, históricos, divinos ou míticos representam associações culturais e não comprovam a origem objetiva do recurso ou a existência literal de determinada tradição.

Regra prática:

> **O nome pode ser estranho; a função precisa ser compreensível.**

Exemplos:

- Dún Liath — A Fortaleza Cinzenta;
- Fairtheoir — O Último Vigia;
- Cosantóir — Protetor da Passagem.

---

# 11. Recursos das Skills de coleta

## Mineração

Progressão temática:

```text
Normal        → Natureza
Prestígio I   → Sobrenatural
Prestígio II  → Guerra
Prestígio III → Divindades
```

### Normal

| Nível | Recurso | Equivalente |
|---:|---|---|
| 1 | Cloch | Pedra |
| 10 | Stán | Estanho |
| 20 | Copar | Cobre |
| 30 | Iarann | Ferro |
| 45 | Luaidhe | Chumbo |
| 60 | Airgead | Prata |
| 75 | Ór | Ouro |
| 90 | Grianchloch | Quartzo |

### Prestígio I

`Grianchloch → Scáth → Gealach → Fuil → Cuimhne → Anam → Réalta`

Níveis: `1, 15, 30, 45, 60, 75, 90`.

### Prestígio II

`Réalta → Cath → Luaith → Mionn → Créacht → Fothrach → Cogadh`

Leitura: **Batalha → Cinzas → Juramentos → Feridas → Ruínas → Guerra**.

### Prestígio III

`Cogadh → Brigid → Nuada → Goibniu → Lugh → Mórrigan → Dagda`

Nomes divinos são associações culturais, não confirmação objetiva de divindades.

> **Um material possui função econômica e de crafting própria; nível de desbloqueio não representa uma escala absoluta de superioridade.**

## Lenhador

```text
Normal        → Floresta Natural
Prestígio I   → Floresta Sobrenatural
Prestígio II  → Eras Antigas
Prestígio III → Árvores Sagradas
```

### Normal

`Giúis → Beith → Fearn → Saileach → Coll → Fuinseog → Dair → Iúr`

Níveis: `1, 10, 20, 30, 45, 60, 75, 90`.

### Prestígio I

`Iúr → Ceo → Oíche → Draíocht → Aisling → Spiorad → Síoraí`

### Prestígio II

`Síoraí → Treibh → Dún → Ríocht → Ríshliocht → Oidhreacht → Seanchas`

### Prestígio III

`Seanchas → Bile → Eó Mugna → Bile Tortan → Eó Rossa → Craeb Dáithí → Craeb Uisnig`

Recursos antigos continuam relevantes em receitas de endgame.

## Pesca

```text
Normal        → Águas Naturais
Prestígio I   → Águas Sobrenaturais
Prestígio II  → Mar de Guerra
Prestígio III → Lendas das Águas
```

### Normal

`Scadán → Breac → Sairdín → Ronnach → Trosc → Bradán → Tuinnín → Doingean`

Níveis: `1, 10, 20, 30, 45, 60, 75, 90`.

### Prestígio I

`Doingean → Tonn → Solas → Taibhse → Lasair → Stoirm → Doimhneacht`

### Prestígio II

`Doimhneacht → Ancaire → Cabhlach → Ruathar → Raic → Báite → Uaigh`

### Prestígio III

`Uaigh → Each Uisce → Dobhar-chú → Murúch → Tarbh Uisce → Ollphéist → Muirdris`

> **A cultura dá nome ao desconhecido; o nome não prova que a lenda seja verdadeira.**

> **O peixe determina a função da receita, não apenas sua potência.**

## Herbologia

```text
Normal        → Flora Natural
Prestígio I   → Flora Sobrenatural
Prestígio II  → Flora do Norte: Fogo e Gelo
Prestígio III → Oráculos e Destino
```

### Normal

`Neantóg → Seamair → Caisearbhán → Fraoch → Aiteann → Raithneach → Sáiste → Marós`

### Prestígio I

`Marós → Drúcht → Suan → Cogar → Rún → Beatha → Bás`

### Prestígio II

`Bás → Mosi → Þoka → Ís → Aska → Hraun → Eldur`

### Prestígio III

`Eldur → Seiður → Völva → Urðr → Verðandi → Skuld → Örlög`

---

# 12. Metalurgia

> **Mineração descobre os materiais. Metalurgia descobre o que é possível fazer com eles.**

A mesma matéria mantém sua identidade quando apenas processada: `Iarann → Lingote de Iarann`.

Um novo nome aparece quando o processo cria um material realmente novo, como uma liga.

Sem subprodutos aleatórios e sem ferramenta equipável própria.

## Normal

1. Cloch Tratada;
2. Lingote de Stán;
3. Lingote de Copar;
4. Cré-Umha;
5. Fundição Pesada;
6. Cruach;
7. Metais Nobres;
8. Grianchloch Refinado.

Marcos: `1, 10, 20, 30, 45, 60, 75, 90`.

## Prestígio I

`Grianchloch Refinado → Liga de Scáth → Liga de Gealach → Liga de Fuil → Cuimhne Estabilizado → Liga de Anam → Liga de Réalta`

## Prestígio II

`Liga de Réalta → Liga de Cath → Vidro de Luaith → Liga de Mionn → Liga de Créacht → Fothrach Reforçado → Liga de Cogadh`

## Prestígio III

`Liga de Cogadh → Liga de Brigid → Liga de Nuada → Liga de Goibniu → Liga de Lugh → Liga de Mórrigan → Liga de Dagda`

---

# 13. Forja

> **Metalurgia cria os materiais. Forja transforma esses materiais em possibilidades de build.**

Forja inclui técnicas internas como Ferraria, Couraria, Tecelagem, Arquearia e Ourivesaria.

## Normal

`Trabalho Básico → Reforços e Couraria → Tecelagem → Arquearia → Ferraria Avançada → Ourivesaria → Construção Híbrida → Obra-Prima`

## Prestígio I

`Reforço Sobrenatural → Vinculação → Condução → Têmpera Reativa → Estrutura Híbrida → Forja Espiritual → Obra-Prima Sobrenatural`

## Prestígio II

`Forja de Campanha → Reforço Militar → Têmpera de Cinzas → Construção de Juramento → Lâmina de Ferida → Reconstrução Antiga → Obra-Prima de Guerra`

## Prestígio III

`Forja Ancestral → Obra Sagrada → Precisão Absoluta → Forja Magistral → Obra Híbrida Superior → Forja de Lenda → Obra-Prima Absoluta`

> **Mesmo o melhor item fabricado no Prestígio III continua sendo equipamento normal e nunca uma Relíquia.**

Receitas podem vir de progressão, Dungeons, Bosses, NPCs, quests, exploração, segredos e eventos.

Chegar ao nível máximo não significa conhecer todas as receitas.

Equipamentos fabricados usam a estrutura:

```text
RECEITA + MATERIAL + RARIDADE PROCEDURAL = EQUIPAMENTO FINAL
```

Forja é fonte regular de ferramentas de coleta; Dungeons são a outra fonte regular definida.

---

# 14. Culinária

> **Culinária transforma os recursos acumulados pelo jogador em preparação para aquilo que ele pretende enfrentar.**

Tipos:

- Refeição;
- Bebida;
- Poção;
- Elixir;
- Antídoto;
- Preparado especial.

Buffs da mesma família não acumulam; prevalece o efeito válido mais forte. Famílias diferentes podem combinar.

Consumíveis não utilizam raridade procedural: a mesma receita gera o mesmo item e efeito.

Consumíveis não concedem aumento permanente de atributo.

Culinária não possui ferramenta equipável própria.

## Normal

`Preparo Básico → Conservação → Infusão → Cozimento Composto → Extração → Refeição Completa → Elixires → Grande Preparo`

## Prestígio I

`Preparo Sobrenatural → Infusão Superior → Concentração Arcana → Neutralização → Preparo Híbrido → Elixir Espiritual → Grande Preparo Sobrenatural`

## Prestígio II

`Ração de Campanha → Conservação Extrema → Tônico de Marcha → Medicina de Campo → Refeição de Companhia → Preparo de Cerco → Banquete de Guerra`

## Prestígio III

`Preparo Ancestral → Mesa dos Povos → Essência Perfeita → Preparo Condicional → Grande Banquete → Receita Perdida → Banquete de Lenda`

---

# 15. Crafting e upgrades

Metalurgia, Forja e Culinária fazem parte da progressão Idle.

Receitas avançadas podem exigir múltiplas Skills, materiais de várias camadas e componentes de Dungeon/Boss quando explicitamente definido.

Relíquias nunca podem ser fabricadas.

Equipamentos e ferramentas normais utilizam:

```text
+0 → +1 → +2
```

Regras:

- sem falha;
- upgrade melhora somente propriedades-base definidas para o item;
- não rerrola atributos procedurais;
- não rerrola efeitos únicos;
- crafting e upgrades não exigem dinheiro;
- +1 pode utilizar materiais normais;
- +2 exige pelo menos um componente especial de Dungeon, Boss ou evento.

Desmontar equipamento concede somente dinheiro e não é fonte de materiais.

---

# 16. Prestígio do personagem

## Requisito

Só é liberado quando **todas as Skills possuem pelo menos Prestígio I**.

## Funcionamento

Prestígio I–III.

Ao prestigiar:

- nível geral volta a 1;
- pontos normais de atributo são reconstruídos ao longo da nova jornada;
- progresso permanente permanece;
- Árvore de Prestígio permanece.

Cada Prestígio concede **5 Pontos de Prestígio**, máximo **15**.

## Árvore

32 nós:

- Corpo: 6;
- Arcano: 6;
- Espírito: 6;
- Técnica: 6;
- híbridos: 8.

Custo por ramo puro:

`1 → 1 → 2 → 2 → 2 → 2`

Um ramo completo custa 10.

Um especialista completo gasta 10 e mantém 5 para suporte.

## Híbridos

Combinações iniciais:

1. Corpo + Arcano;
2. Corpo + Espírito;
3. Técnica + Arcano;
4. Técnica + Espírito.

Híbrido I custa 1 e exige 3 nós de cada ramo.

Híbrido II custa 2 e exige Híbrido I + 4 nós de cada ramo.

Um híbrido completo usa os 15 pontos e abre mão dos capstones puros correspondentes.

Regras:

> **Capstones puros representam a melhor expressão daquela especialização.**

> **Híbridos completos são competitivos quando utilizam corretamente os dois lados da combinação.**

> **Um híbrido que ignora metade de sua mecânica deve ser inferior ao especialista correspondente.**

> **Nenhuma combinação é obrigatória para alcançar o melhor desempenho geral do jogo.**

## Corpo

1. Constituição — Vida máxima;
2. Fôlego de Guerra — Stamina máxima e recuperação;
3. Ímpeto — Física Agressiva concede eficiência física temporária;
4. Inabalável — golpe relevante concede redução temporária de dano;
5. Segundo Fôlego — uma vez por combate, condição crítica recupera Vida e Stamina; não é ressurreição;
6. Último Bastião — capstone; Vida baixa concede resistência e recuperação de Stamina progressivas e limitadas.

## Arcano

1. Reserva Mental — Mana máxima;
2. Fluxo Arcano — regeneração de Mana;
3. Canalização — diferentes Magias em sequência fortalecem eficiência da próxima;
4. Ressonância — sequência diversa acumula Ressonância;
5. Reserva Arcana — uma vez por combate em Mana crítica, oferece recuperação/janela excepcional;
6. Sobrecarga — capstone; Ressonância máxima permite Magia Sobrecarregada.

Loop:

`rotacionar → Ressonância → Sobrecarga → reconstruir`

## Espírito

1. Convicção — Fé;
2. Graça Restauradora — cura realizada;
3. Resistência Espiritual — resistência ao buildup dos cinco status;
4. Intercessão — overheal parcialmente convertido em proteção temporária limitada;
5. Vínculo de Companhia — suporte pode beneficiar parcialmente outros membros da Party;
6. Comunhão — capstone; cura/proteção excedente parcialmente redirecionada, com equivalente Solo.

## Técnica

1. Mão Firme — Precisão;
2. Golpe Preciso — crítico;
3. Ritmo de Combate — ativos diferentes geram Ritmo;
4. Oportunismo — críticos aceleram/preservam Ritmo dentro de limites;
5. Execução — crítico contra inimigos em Vida baixa recebe efeito adicional;
6. Mestre do Ritmo — capstone; Ritmo máximo fortalece próximo ativo e é consumido.

## Caminhos híbridos

### Corpo + Arcano

- **Arma Encantada:** Física Agressiva fortalece próxima Magia;
- **Guerreiro Arcano:** interação bidirecional Física ↔ Magia.

### Corpo + Espírito

- **Zelo:** habilidade Defensiva ligada a Fé fortalece próxima ação Física apropriada;
- **Bastião Sagrado:** ações físicas geram Guarda; Milagre/defesa consome Guarda para fortalecer proteção ou cura.

### Técnica + Arcano

- **Lâmina Arcana:** crítico físico fortalece próxima Magia;
- **Conjuração Rápida:** Magia fortalecida abre janela para ação física precisa.

### Técnica + Espírito

- **Golpe de Convicção:** crítico fortalece próximo Milagre;
- **Inquisidor:** Milagre apropriado fortalece próxima ação física precisa.

Corpo + Técnica e Arcano + Espírito não possuem caminho exclusivo inicialmente por falta de identidade mecânica suficientemente distinta.

---

# 17. Progressão offline

O limite de atividade offline aumenta em **2 horas a cada 10 níveis gerais**.

A base inicial, caps e regras específicas por tipo de atividade são parâmetros de progressão e podem ser ajustados separadamente.

O progresso de oportunidades de minigame pode acumular offline quando o sistema correspondente permitir.

---

# 18. Combate

## Conceito

Combate automático em tempo real.

Ataques básicos são automáticos. Cada arma possui intervalo próprio.

> **O jogador não precisa executar cada ataque, mas sua preparação e suas escolhas devem determinar o resultado.**

## Relógio de ação

Cada combatente possui seu próprio intervalo de ação.

Quando o combatente fica pronto:

1. verifica prioridades e condições;
2. escolhe uma única ação válida;
3. resolve ou inicia a preparação dessa ação;
4. reinicia seu intervalo após a resolução conforme a regra da ação.

Cooldown de habilidade e intervalo de ação são relógios separados. Cooldowns continuam transcorrendo durante outras ações.

## Regra central de habilidades

> **Uma habilidade ativa substitui o ataque básico que seria realizado naquela ação.**

Habilidades não acontecem gratuitamente em paralelo ao ataque básico.

Uma habilidade só entra em cooldown quando realmente é utilizada.

Se uma ação não puder ser usada por falta de recurso, requisito, condição ou cooldown, a automação segue para a próxima opção válida.

## Habilidades ativas

Até **4 slots ativos**.

Categorias:

1. Físicas;
2. Magias;
3. Milagres;
4. Híbridas;
5. Universais.

A classe inicial nunca restringe categorias.

Cada habilidade ativa possui perfil:

- **Agressiva**; ou
- **Defensiva**.

Não existe perfil Misto individual.

## Ordem dos slots

A ordem visual participa da prioridade real:

```text
Slot 1 → Slot 2 → Slot 3 → Slot 4 → Ataque básico
```

## Estilos de combate

### Agressivo

Prioriza habilidades Agressivas. Habilidades Defensivas entram quando suas condições apropriadas forem atingidas.

### Defensivo

Prioriza habilidades Defensivas válidas; depois considera Agressivas.

### Misto

Agressivas e Defensivas competem de maneira mais direta conforme ordem dos slots e condições.

> **O jogador escolhe a build; o estilo determina como a automação prioriza seu uso.**

## Condições defensivas

Habilidades Defensivas podem utilizar condições simples configuráveis pelo jogador, como:

- Vida ≤ X%;
- Mana ≤ X%;
- Stamina ≤ X%;
- aliado com Vida ≤ X% quando aplicável.

A condição é avaliada quando chega o momento da ação.

O sistema não exige editor de scripting ou lógica AND/OR para funcionar.

## Consumíveis em combate

O jogador pode equipar consumíveis em slots dedicados, com uso manual ou automático.

Condições automáticas podem utilizar limiares simples de Vida, Mana ou Stamina.

Regras permanentes:

- usar consumível ocupa a ação atual;
- uso manual e automático seguem a mesma economia de ações;
- consumível não concede ataque gratuito no mesmo ciclo;
- o sistema respeita os limiares configurados pelo jogador;
- não existe IA oculta que ignore a configuração por considerar outro uso “mais inteligente”.

> **Jogar ativamente concede controle, não ações extras.**

A quantidade de slots e cooldowns globais são parâmetros de balanceamento/interface.

## Prioridade geral do personagem

Estrutura:

```text
1. Consumível automático válido
2. Habilidade válida conforme estilo, condição e ordem dos slots
3. Ataque básico
```

## Telegraphs e preparação

Ataques normais resolvem na ação. Habilidades perigosas podem possuir tempo de preparação.

Durante um telegraph:

- o usuário fica comprometido com a ação;
- não realiza ataque básico nem outra habilidade;
- outros combatentes continuam agindo;
- o intervalo normal reinicia após a resolução.

A UI comunica pelo menos:

- nome;
- ícone;
- barra regressiva;
- alvo quando aplicável;
- destaque visual;
- registro curto no log.

Não existe botão universal de interrupção.

Interrupções surgem de Atordoamento ou efeitos explicitamente capazes de interromper.

Uma ação telegráfica pode ser:

- **Interrompível**;
- **Resistente**;
- **Ininterruptível**.

Se uma habilidade for interrompida:

- seu efeito não ocorre;
- ela entra em cooldown normalmente.

Morte durante preparação cancela a ação, salvo exceção explícita.

Uma habilidade pode possuir **Atraso Inicial**, separado de seu cooldown normal, para controlar a primeira oportunidade de uso em um combate.

## Ordem determinística

Uma ação já iniciada resolve antes de uma nova ação que fique disponível exatamente no mesmo instante, salvo interrupção válida.

Se duas novas ações ficam disponíveis no mesmo timestamp:

1. personagem principal;
2. parceiros pela posição;
3. inimigos.

## Fases de Boss

Quando a Vida cruza um limiar de fase, uma ação já iniciada termina normalmente. A mudança de fase ocorre depois da resolução da ação atual.

Fases devem alterar comportamento, habilidades, prioridades ou dinâmica e não apenas multiplicadores numéricos.

## Comportamento de inimigos

Inimigos usam a mesma fundação temporal e de resolução do combate, mas não precisam copiar os quatro slots configuráveis do jogador.

Cada inimigo pode possuir:

- lista própria de comportamentos;
- condições;
- cooldowns;
- fases;
- Atrasos Iniciais;
- prioridades.

> **O motor de combate fornece regras universais; a identidade do inimigo surge da combinação dessas regras.**

---

# 19. Tipos de dano, resistências e status

## Tipos de dano

Exatamente:

- Corte;
- Perfuração;
- Impacto;
- Fogo;
- Gelo;
- Arcano;
- Sagrado.

## Resistências

Leitura padrão:

- Fraco;
- Normal;
- Resistente;
- Muito Resistente;
- Imune.

A UI avançada pode mostrar percentuais reais.

Os multiplicadores exatos são dados de balanceamento.

## Status

Exatamente:

- Veneno;
- Sangramento;
- Atordoamento;
- Queimadura;
- Congelamento.

Todos utilizam buildup em barra.

Ao atingir o limite:

1. o efeito ativa;
2. a barra reseta;
3. o alvo recebe resistência temporária ao mesmo status;
4. novo buildup passa a ser mais difícil durante essa janela.

Buildup pode decair após um período sem nova aplicação.

Bosses usam o mesmo sistema e **não são automaticamente imunes** apenas por serem Bosses.

## Identidade funcional dos status

### Veneno

Dano sustentado ao longo do tempo.

### Sangramento

Dano explosivo periódico após buildup físico repetido.

### Atordoamento

Controle, interrupção e perda temporária de ação.

Atordoamento pode cancelar telegraph quando a habilidade permitir interrupção.

### Queimadura

Pressão de dano com abertura ofensiva, incluindo redução defensiva quando definido pelo efeito.

### Congelamento

Controle de ritmo: reduz frequência de ação e pode ampliar janelas de telegraph, sem duplicar a função de Atordoamento.

Status não devem surgir de maneira arbitrária em todo ataque básico. Buildup relevante deve ter fonte identificável em habilidade, arma, afixo ou efeito.

---

# 20. Inimigos e Bosses

## Categorias

Exatamente:

1. Comum;
2. Elite;
3. Boss.

Não existe categoria separada de mini-Boss inicialmente.

## Ficha-base

- Nome;
- categoria;
- Vida;
- Ataque/Poder;
- Defesa;
- intervalo/velocidade;
- Precisão/Evasão quando aplicável;
- fraquezas e resistências;
- habilidades;
- status;
- drops;
- comportamento.

## Dificuldade

Dificuldades maiores podem alterar:

- ataques;
- resistências;
- Elites;
- fases;
- comportamento;
- recuperação;
- status;
- composições;
- loot;
- eventos e camadas da Dungeon.

> **Dificuldades maiores introduzem novas exigências mecânicas e estratégicas, não apenas mais Vida e dano.**

## Loot

Comuns sustentam progressão normal.

Elites aumentam qualidade/chance e podem possuir receitas ou materiais específicos quando houver função real.

Bosses podem conceder:

- equipamentos temáticos;
- materiais exclusivos;
- receitas;
- habilidades;
- lore;
- componentes +2;
- condições de Relíquia.

Todo Boss concede pelo menos **um recurso exclusivo garantido por vitória**.

A primeira conclusão de cada dificuldade garante pelo menos **uma recompensa especial**.

---

# 21. Party, Ameaça e parceiros

## Party

Dungeons em Party utilizam:

- personagem principal;
- até 3 parceiros.

Parceiros são substituíveis/removíveis.

## Ameaça / Aggro

Em Party, dano, cura, suporte e habilidades podem gerar Ameaça.

Regra padrão:

> inimigo tende a atacar o personagem com maior Ameaça.

Habilidades podem:

- aumentar Ameaça;
- reduzir Ameaça;
- Provocar;
- ignorar Ameaça explicitamente.

Bosses podem ganhar resistência temporária a Provocações repetidas.

A interface padrão mostra alvo atual e mudanças de foco; modo avançado pode mostrar percentuais.

## Parceiros

Parceiros são NPCs fixos e únicos, com identidade narrativa e mecânica própria.

Não possuem sistema completo de nível/Skills igual ao personagem principal.

Progressão principal ocorre por relacionamento:

```text
Desconhecido
↓
Conhecido
↓
Aliado
↓
Companheiro
↓
Leal
```

Relação pode liberar:

- passivas;
- habilidades;
- diálogos;
- quests;
- lore;
- utilidade.

Não há romance.

Alguns parceiros futuros podem abandonar a Party conforme suas próprias regras narrativas. Isso não significa desaparecer permanentemente do mundo.

> **O primeiro encontro de um parceiro deve demonstrar quem ele é antes de explicar sua ficha.**

---

# 22. Mira

## Identidade

Mira é a primeira parceira recrutável.

- mulher humana;
- ex-soldada da Ordem de Ferro;
- arqueira;
- deixou oficialmente a Ordem;
- sofreu preconceito e sexismo no exército;
- provou sua capacidade por mérito próprio;
- depois de sair, passou a explorar Dungeons por loot e sobrevivência;
- não possui arco de vingança contra antigos soldados.

Mira inicia com preconceitos contra monstros derivados da cultura humana, de sua formação militar e de experiências reais da guerra.

Sua visão muda gradualmente, sem a narrativa afirmar que tudo que ela viu anteriormente era falso.

Mira **não abandona a Party por discordância**, mas pode questionar, desaprovar e mudar de postura.

## Passiva exclusiva

> **Olho de Caçadora — aumenta a chance de crítico de todos os membros da Party.**

## Introdução

Mira entra depois de Dún Liath, durante a segunda Dungeon, que também introduz a primeira experiência real em Party.

Fluxo:

```text
jogador entra sozinho
↓
encontra sinais de outro explorador
↓
encontra Mira combatendo sozinha
↓
cooperação pragmática
↓
Mira entra como Parceira Temporária
↓
tutorial contextual de Party e Ameaça
↓
primeira divergência sobre monstros
↓
Boss em dupla
↓
retorno à Cidade Livre
↓
reencontro na Taverna
↓
Mira torna-se recrutável
```

Mira não é resgatada; está sobrevivendo por conta própria.

A cooperação inicial ocorre por conveniência e sobrevivência, não amizade imediata.

Sua quest pessoal trata de identidade, propósito e vida depois de servir uma guerra que começa a questionar — não de vingança.

---

# 23. Dungeons — regras gerais

## Conceito

Expedições com combate automático, caminhos, eventos, escolhas, armadilhas, segredos e Boss.

O jogador controla principalmente:

- preparação;
- Party;
- build;
- decisões de exploração;
- risco e retirada.

## Identidade fixa e execução procedural

Cada Dungeon representa um local fixo do mundo com:

- temática;
- inimigos;
- eventos;
- segredos;
- recompensas;
- Boss único.

Sua estrutura interna pode variar por run.

> **A geração procedural muda o caminho, mas nunca contradiz a história do local.**

## Tamanho de referência

- Solo inicial: 15–20 salas;
- Party inicial: 30–40 salas.

Dungeons posteriores podem crescer aproximadamente 2–4 salas por etapa.

O jogador não sabe o número exato antes de concluir a run.

## Caminhos

Bifurcações possuem descrições ambientais e são irreversíveis por run.

Não existe backtracking normal.

Nova tentativa regenera a estrutura.

Descrições comunicam risco/contexto, não revelam diretamente “Tesouro”, “Elite” ou “melhor caminho”.

## Tipos de sala

- combate;
- Elite;
- evento;
- recuperação;
- tesouro;
- armadilha;
- secreta;
- Boss.

## Recuperação

Não é checkpoint seguro.

Pode restaurar Vida, Mana, Stamina e outros recursos de combate.

Não protege loot automaticamente.

Troca de equipamento dentro de Dungeon só é permitida em salas de recuperação.

A sala de recuperação também pode permitir reconfiguração de habilidades, estilo e consumíveis quando apropriado.

## Armadilhas

Podem:

- causar dano;
- aplicar status/debuff;
- consumir recursos;
- iniciar combate;
- bloquear caminhos;
- ativar eventos.

Detecção/contorno pode depender de:

- parceiro;
- atributo;
- Skill;
- equipamento;
- item.

Não deve existir armadilha aleatória de morte instantânea sem informação adequada.

## Requisitos especiais

Podem abrir:

- vantagens;
- atalhos;
- conteúdo opcional;
- segredos.

> **Nenhuma geração pode exigir uma condição que o jogador não possui para chegar ao Boss.**

A rota de conclusão sempre existe.

## Bolsa de Expedição

Loot obtido durante a run permanece separado do patrimônio seguro do personagem.

Morte perde o loot obtido naquela tentativa e preserva o que o jogador já possuía antes de entrar.

A UI deve distinguir claramente:

- itens levados para a Dungeon;
- itens encontrados durante a expedição.

## Retirada

Não é permitida livremente a qualquer momento com loot assegurado.

Antes do Boss existe decisão explícita:

```text
Retornar à Cidade Livre
→ assegura loot da expedição

Enfrentar Boss
→ mantém loot em risco
→ acessa recompensas finais
```

Retirada segura não equivale necessariamente a concluir o objetivo narrativo/contrato da Dungeon.

## Dificuldades

Exatamente:

1. Fácil;
2. Normal;
3. Difícil;
4. Impossível.

Desbloqueio sequencial.

## Incursão Automática

Modo separado, não quinta dificuldade.

Liberado após conclusão/requisito apropriado.

Possui preset, duração, chance de sucesso e recompensas úteis.

Melhores segredos, exploração especial, recompensas exclusivas de Boss e Relíquias podem permanecer exclusivos da atividade manual quando definido.

---

# 24. Dún Liath — A Fortaleza Cinzenta

## Papel

Primeira Dungeon oficial do jogo e primeiro grande ponto de integração de combate, exploração, risco/recompensa e narrativa.

É uma Dungeon Solo.

> **A primeira Dungeon ensina mecânica através de exploração e narrativa através de contradição.**

> **A primeira Dungeon não revela a verdade; ela apenas cria a primeira rachadura na versão que o jogador recebeu.**

## Identidade

Antiga fortificação militar humana próxima à Cidade Livre, em posição costeira exposta a chuva, neblina, vento, sal e mar frio.

Identidade visual:

> **pedra molhada + mar frio + ferrugem + neblina**

Camadas históricas:

```text
estrutura original
↓
expansões militares
↓
reparos da guerra
↓
abandono
↓
ocupação atual pela comunidade monstruosa
```

> **Construções antigas devem parecer ter história, não terem sido erguidas apenas para funcionar como fase.**

## Situação atual

Humanos afirmam que monstros tomaram a fortificação.

Na realidade, uma pequena comunidade monstruosa usa as ruínas para sobreviver e se proteger.

As barricadas recentes estão orientadas contra a entrada.

Leitura da Dungeon:

> **Fortaleza tomada → posição defensiva → assentamento improvisado → refúgio sitiado.**

## Primeiro contrato

Um NPC humano ligado à Ordem de Ferro envia o jogador para:

```text
entrar
↓
eliminar a presença hostil
↓
recuperar um registro da antiga guarnição
↓
derrotar a criatura que controla/protege o bastião
```

O NPC não precisa mentir. Ele pode acreditar sinceramente na leitura militar dominante.

O objetivo físico é o **Registro de Suprimentos da Guarnição**, documento logístico antigo e aparentemente banal.

A busca por esse registro conduz o jogador também ao primeiro fragmento de evidência contraditória sobre a guerra.

## Primeira visita

É parcialmente controlada para garantir beats narrativos e tutoriais.

Depois do primeiro clear, a Dungeon utiliza geração procedural com maior liberdade.

Primeira visita: aproximadamente 16–18 salas, sem revelar o total exato ao jogador.

Sequência conceitual:

```text
Entrada
↓
combates simples
↓
primeira bifurcação
↓
evento ambiental
↓
combates / Elite
↓
monstro ferido
↓
continuação
↓
fragmento do tratado
↓
recuperação
↓
encontros finais
↓
decisão de retirada
↓
Fairtheoir
```

## Setores

### Muralha Externa

Patrulhas, antigas barricadas, postos de vigia e depósitos.

### Quartel

Camas humanas antigas, depósitos, arsenal abandonado e reparos recentes.

### Interior Ocupado

Camas improvisadas, alimentos, recipientes, ferramentas, curativos e espaços adaptados para viver.

Aqui ocorre o evento do monstro ferido.

### Bastião Interno

Área mais defensável. Cosantóir protege uma passagem importante; existe recuperação; o Portão do Bastião leva a Fairtheoir.

---

# 25. Inimigos de Dún Liath

## Crúbach — Batedor das Muralhas

**Categoria:** Comum.

Papel: rápido e frágil.

Dano principal: Corte.

Visual: corpo relativamente magro, braços longos, garras, pouca proteção e sinais de roupas, bolsas, ferramentas e peças reaproveitadas.

Habilidades-base:

- **Talho** — Corte com pressão de Sangramento;
- **Salto Curto** — acelera/pressiona a próxima ação.

Resistências-base:

- Corte: Normal;
- Perfuração: Fraco;
- Impacto: Normal;
- Fogo: Normal;
- Gelo: Normal;
- Arcano: Normal;
- Sagrado: Normal.

Corpo leve favorece vulnerabilidade a Atordoamento.

Função didática:

> **velocidade também é uma ameaça.**

## Tromghiallach — Guarda Pesado

**Categoria:** Comum.

Papel: lento e resistente.

Dano principal: Impacto.

Visual: corpo pesado, pescoço curto, mandíbula larga, pele espessa, placas reaproveitadas e arma improvisada feita de partes da fortificação.

Habilidades-base:

- **Golpe Pesado** — telegraph de Impacto e buildup de Atordoamento;
- **Firmar Posição** — defesa temporária.

Resistências-base:

- Corte: Resistente;
- Perfuração: Normal;
- Impacto: Normal;
- demais tipos: Normal.

Status:

- Sangramento: Resistente;
- Atordoamento: Resistente;
- demais: Normal.

Leitura:

```text
Crúbach → rápido / vulnerável
Tromghiallach → lento / resistente
```

## Cosantóir — Protetor da Passagem

**Categoria:** Elite.

É um indivíduo da comunidade com função de defesa, não espécie ou tier biológico diferente.

Visual: escudo improvisado, lança curta, armadura de peças humanas reaproveitadas e marcas de reparo.

Habilidades-base:

- **Estocada** — Perfuração moderada;
- **Golpe de Escudo** — Impacto + Atordoamento;
- **Postura de Defesa** — redução temporária de dano;
- **Avanço do Guardião** — grande telegraph, ataque forte, alto buildup de Atordoamento e janela posterior de vulnerabilidade.

### Defesa de Outro

Quando acompanhado de um Comum em condição crítica, Cosantóir pode priorizar proteção do aliado ou assumir pressão.

Isso introduz a ideia de que os monstros se defendem como grupo antes do tutorial completo de Party.

Cosantóir não deve ser apenas um Comum com mais Vida.

---

# 26. Evento Matar/Poupar

Na primeira visita, um monstro adulto ferido protege outro indivíduo mais fraco.

O protegido não precisa ser criança, evitando tornar a decisão moralmente óbvia.

O ferido demonstra linguagem, compreensão, medo e proteção, mas não ataca imediatamente.

Escolha apresentada somente como:

```text
Matar
Poupar
```

Sem:

- cores de moralidade;
- coração;
- alinhamento;
- preview de recompensa;
- aviso de “boa” ou “má” consequência.

## Matar

O jogador luta. O indivíduo protegido pode fugir.

Não existe bônus moral ou recompensa especial por escolher esse caminho.

## Poupar

O ferido permanece desconfiado, não agradece calorosamente e recua/permite passagem junto do protegido.

Não concede recompensa imediata de item.

## Persistência

A decisão gera estado persistente e altera leitura/acontecimentos posteriores.

Se poupado, visitas posteriores podem mostrar sinais de evacuação organizada ou sobreviventes.

Se morto, a área pode apresentar abandono mais caótico, novas barricadas, outros personagens ou registros.

Nenhum lado recebe simplesmente “mais loot”.

> **Escolhas narrativas mudam o caminho; não escolhem entre conteúdo e castigo.**

---

# 27. Fragmento do Tratado

Obrigatório na segunda metade da primeira visita, em uma antiga área de comando humana próxima ao objetivo do contrato.

O documento é parcialmente destruído e comprova apenas que humanos e monstros já negociaram formalmente no passado.

Pode mencionar:

- cessar hostilidades;
- representantes;
- limites territoriais;
- passagem segura.

Não revela:

- quem rompeu o acordo;
- por quê;
- qual lado estava certo;
- a verdade completa sobre a guerra.

O fato de estar em arquivo humano reduz a leitura de que foi fabricado pela comunidade atual.

---

# 28. Fairtheoir — O Último Vigia

## Papel narrativo

Boss fixo de Dún Liath.

Monstro adulto e principal defensor da comunidade.

Não é rei, chefe tribal, general, criatura invocada ou besta irracional.

> **Ele foi o indivíduo que permaneceu na passagem enquanto os outros recuavam.**

A Ordem o descreve apenas como uma criatura maior ocupando o interior.

## Aparência

- alto;
- torso largo;
- braços longos;
- postura levemente curvada;
- pele espessa e marcada;
- mandíbula larga e dentes expostos;
- grotesco segundo padrões humanos, mas não demoníaco.

## Equipamento

Armadura defensiva remendada com peças da fortificação, placas militares humanas, couro, correntes, madeira e reparos sucessivos.

Arma: **Viga de Guarda**.

Escudo: **Escudo da Muralha**.

## Ficha conceitual

**Categoria:** Boss.

Papel: defensor físico.

Dano principal: Impacto.

Resistências-base:

- Corte: Resistente;
- Perfuração: Normal;
- Impacto: Normal;
- Fogo: Normal;
- Gelo: Normal;
- Arcano: Normal;
- Sagrado: Normal.

Status-base:

- Veneno: Normal;
- Sangramento: Resistente;
- Atordoamento: Muito Resistente;
- Queimadura: Normal;
- Congelamento: Normal.

Não possui imunidade automática por ser Boss.

## Fase 1 — O Vigia

Mantém posição entre o jogador e o setor protegido.

Habilidades:

- Pancada;
- Golpe Pesado;
- Varredura;
- Postura de Guarda.

## Fase 2 — Desespero

Ao atingir o limiar definido pelo balanceamento, Fairtheoir conclui a ação que já estiver em andamento e só então realiza a transição.

Abandona parte da defesa e passa a agir com:

- menor defesa;
- maior frequência/agressividade;
- maior vulnerabilidade;
- maior risco ofensivo.

Habilidade marcante:

**Última Investida** — telegraph longo, alto Impacto, alto buildup de Atordoamento e janela posterior de vulnerabilidade.

Fairtheoir nunca foge e preserva seu posicionamento de proteção.

## Morte

Sem fala, flashback ou texto moral.

Fairtheoir cai de joelhos, tenta uma última vez colocar o corpo entre o jogador e a passagem e então desaba.

## Depois do Boss

Atrás do Portão do Bastião existem:

- suprimentos;
- camas;
- objetos pessoais;
- bandagens e ferramentas;
- sinais de evacuação;
- saída secundária recentemente usada.

Leitura possível:

```text
Fairtheoir segurou a passagem
↓
a comunidade evacuou
↓
o jogador o derrotou
↓
chegou tarde demais para alcançar os demais
```

A Dungeon não explica isso diretamente.

---

# 29. Loot de Dún Liath

## Filosofia

> **Poucos itens exclusivos, mas cada um com função clara.**

## Sucata de Dún Liath

Material geral compartilhado da Dungeon, representando placas militares, rebites, ferragens e componentes recuperados.

Fontes possíveis:

- Crúbach;
- Tromghiallach;
- Cosantóir;
- salas de tesouro;
- eventos apropriados.

Usos:

- Forja;
- reparos;
- equipamentos temáticos;
- receitas defensivas;
- upgrades normais.

> **Identidade de inimigo não exige um material de crafting exclusivo para cada criatura.**

## Fragmento de Fairtheoir

Recurso exclusivo garantido em toda vitória contra Fairtheoir.

Pode ser usado em:

- equipamentos do Boss;
- receitas especiais;
- upgrade +2;
- crafting defensivo de Dún Liath.

## Equipamentos temáticos

### Escudo da Passagem

Associado a Cosantóir. Identidade:

- Defesa;
- Vitalidade;
- Vigor;
- resistência a Atordoamento;
- atributos procedurais normais conforme raridade.

### Escudo do Último Vigia

Modelo de Boss, mais pesado e defensivo.

Identidade:

- alta Defesa física;
- resistência a Impacto;
- sobrevivência/estabilidade;
- possível interação com Ameaça quando apropriado.

Continua equipamento normal procedural.

### Viga do Vigia

Arma pesada adaptada da arma de Fairtheoir:

- Impacto alto;
- ataque lento;
- bom buildup de Atordoamento;
- alto consumo de Stamina;
- favorece Força.

## Reforço do Vigia

Receita de Forja que usa conceitualmente:

`Sucata de Dún Liath + material normal + Fragmento de Fairtheoir`

Representa técnica defensiva da fortificação e não cria nova categoria de item.

## Primeiro clear por dificuldade

| Dificuldade | Recompensa especial garantida |
|---|---|
| Fácil | Guarda Instintiva |
| Normal | Receita: Reforço do Vigia |
| Difícil | Escudo do Último Vigia |
| Impossível | Lacre do Comandante |

### Guarda Instintiva

Categoria: Universal.

Perfil: Defensiva.

Reduz temporariamente o próximo dano significativo recebido.

### Reforço do Vigia

Primeiro clear Normal desbloqueia permanentemente a receita.

### Escudo do Último Vigia

Primeiro clear Difícil garante o modelo, não necessariamente um roll procedural perfeito.

### Lacre do Comandante

Item permanente de exploração/lore, não equipamento nem material consumível.

Permite acessar o Arquivo Selado.

---

# 30. Segredos de Dún Liath

## Segredo simples

Sala pequena com Sucata, equipamento, documento ou consumíveis.

## Aposentos do Oficial

Ligado à Chave Enferrujada para acesso antecipado.

Pode conter:

- loot interessante;
- registro militar;
- pista sobre o Arquivo Selado.

Nenhuma recompensa essencial.

## Arquivo Selado

Segredo de alto nível ligado ao Lacre do Comandante.

Contém:

- registros militares;
- documentos;
- informações sobre antigos habitantes;
- outra camada sobre o tratado;
- condição relacionada à Relíquia da Dungeon.

Incursão Automática não acessa essa sala.

## Porta sem Insígnia

Evento raro que pode aparecer antes de o jogador saber resolvê-lo.

Conhecimento/item posterior revela sua relação com camadas profundas do Arquivo.

Objetivo: criar reconhecimento persistente — “eu já vi isso antes”.

---

# 31. Relíquia — Selo de Dún Liath

**Tipo:** Relíquia — Amuleto.

Não é drop normal de Fairtheoir, não é craftável e não aparece na Incursão Automática.

Caminho conceitual:

```text
concluir Impossível
↓
obter Lacre do Comandante
↓
realizar Dún Liath ativamente
↓
acessar Arquivo Selado
↓
descobrir compartimento/condição secreta
↓
possibilidade de obter Selo de Dún Liath
```

Efeito único conceitual: **Trégua Instável**.

Alternar corretamente entre perfis diferentes cria sinergia:

```text
Agressiva
↓
próxima Defensiva recebe benefício

Defensiva
↓
próxima Agressiva recebe benefício
```

Valores, janela, chance final e limites são dados de balanceamento/conteúdo ainda A definir.

Como Relíquia:

- é negociável quando existir como instância certificada em save Online;
- possui histórico de donos quando certificada;
- utiliza o Relicário;
- pode registrar primeiro descobridor e vendas.

Relíquias obtidas em contexto Offline nunca entram no registro econômico Online e não podem ser convertidas em instâncias negociáveis.

---

# 32. Eventos e geração procedural de Dún Liath

Depois do primeiro clear, runs combinam combate, Elite, evento, tesouro, armadilha, recuperação, segredo e Boss.

## Bifurcações

Usam pistas ambientais, nunca informação explícita da recompensa.

Exemplos:

- marcas recentes atravessando poeira;
- cheiro de sal/ferrugem;
- ruído de metal;
- sinais de uso recente.

> **A descrição informa risco e contexto, não o resultado exato.**

## Eventos-base

### Barricada Abandonada

Pode permitir Forçar Passagem ou procurar outro acesso.

### Depósito Esquecido

Antigo depósito humano com Sucata, consumíveis ou equipamento normal.

### Ferido Ausente

Curativos usados, água e sinais de alguém que estava sendo tratado.

### Vozes Atrás da Parede

Moradores em área inacessível demonstram vida além das salas de combate.

### Soldado Antigo

Cadáver humano de período anterior à ocupação atual, separando eras históricas.

### Suprimentos da Comunidade

Escolha como **Levar** ou **Deixar**, sem barra moral. Nenhuma opção é declarada correta.

## Armadilhas

### Queda de Pedras

Dano e possível Atordoamento.

### Piso Instável

Pode causar dano, consumir Vida antes de encontro ou levar a sala alternativa.

### Dispositivo Militar Antigo

Mecanismo humano de lança, peso, portão ou defesa.

### Barricada Improvisada

Defesa recente da comunidade, visualmente distinta das estruturas humanas antigas.

A Dungeon diferencia:

> **defesas humanas antigas** vs **defesas recentes da comunidade**.

## Regras de geração

- pelo menos uma bifurcação significativa por run;
- eventos narrativos raros não aparecem sempre;
- segredo nunca é obrigatório para concluir;
- rota até Fairtheoir sempre existe;
- requisitos especiais não podem tornar a run impossível;
- requisitos servem a vantagens, atalhos, conteúdo opcional ou segredo.

## Conhecimento persistente

A descrição de Dún Liath pode evoluir conforme descobertas:

1. antiga fortificação ocupada por monstros;
2. evidências de adaptação para habitação;
3. registros mostrando relevância histórica anterior;
4. novas informações após Arquivo Selado.

---

# 33. Dificuldades de Dún Liath

> **Fácil ensina cada peça. Normal ensina como as peças trabalham juntas. Difícil exige resposta aos sistemas. Impossível exige domínio completo da Dungeon.**

## Fácil

### Crúbach

- Talho;
- Salto Curto.

### Tromghiallach

- Golpe Pesado;
- Firmar Posição.

### Cosantóir

- Estocada;
- Golpe de Escudo;
- Postura de Defesa;
- Avanço do Guardião;
- proteção simples de aliado.

### Fairtheoir

Fase 1: Pancada, Golpe Pesado, Varredura, Postura de Guarda.

Fase 2: maior agressividade, menor defesa e Última Investida.

## Normal

Inimigos começam a interagir entre si.

- Crúbach — Cerco;
- Tromghiallach — Cobertura Pesada;
- Cosantóir — Interposição;
- Fairtheoir — Contra-Impacto.

Última Investida pode gerar Destroços ou consequência temporária de arena.

## Difícil

Status e formações tornam-se centrais.

- Crúbach — Ferida Aberta;
- Tromghiallach — Golpe Concussivo;
- Cosantóir — Formação Defensiva;
- Fairtheoir — Ruptura.

## Impossível

A defesa da fortificação funciona de forma coordenada.

- Crúbach — Caçada Coordenada;
- Tromghiallach — Muralha Viva;
- Cosantóir — Última Linha;
- Fairtheoir usa kit definitivo em duas fases.

Fairtheoir pode possuir **Linha Intransponível**, em que a forma de ataque/rotação do jogador influencia a eficiência da defesa do Boss.

Fase 2: **Desespero Absoluto**.

Final em Vida muito baixa: **Até o Último**, sequência agressiva sem cura, nova barra ou ressurreição.

---

# 34. Equipamentos

## Slots

- Cabeça;
- Peitoral;
- Luvas;
- Pernas;
- Botas;
- Arma principal;
- Mão secundária/Escudo;
- Amuleto;
- Anel 1;
- Anel 2.

Sem peso e sem durabilidade.

## Tipos iniciais

- Espada;
- Espadão;
- Machado;
- Lança;
- Adaga;
- Arco;
- Cajado;
- Catalisador mágico;
- Escudo.

## Procedural

Equipamento normal = parte fixa + atributos procedurais.

Atributos procedurais podem sair do papel tradicional do item e favorecer builds híbridas.

Raridades:

```text
Comum      → 1 atributo
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Sem atributos negativos e sem nomes procedurais.

Um mesmo atributo procedural não precisa ser permitido repetidamente no mesmo item; regras exatas do pool são dados de geração.

## Smart loot

O jogo não depende de smart loot por classe como regra geral.

Um Guerreiro pode encontrar um Cajado e um Mago pode encontrar uma Lança.

Proteções contra RNG ruim devem vir de recompensas garantidas, crafting, comércio, Banco e progressão — não de transformar a classe inicial em filtro permanente de loot.

---

# 35. Inventário e armazenamento

Inventário é limitado e permanentemente expansível.

Materiais e consumíveis empilham.

Equipamentos são individuais.

Banco é separado do inventário carregado.

Bolsa de Expedição separa loot de Dungeon em risco.

Relíquias ficam no **Relicário**, com:

- origem;
- identificador;
- primeiro dono;
- dono atual;
- histórico.

Para Relíquias certificadas Online, esses dados são derivados do registro oficial e não de declarações do save local.

Filtros, favoritos e bloqueio de itens devem evitar venda/desmontagem acidental.

Capacidades numéricas e limites de stack são dados de economia/UX, não regras estruturais.

---

# 36. Relíquias e mercado

## Relíquias

São exceções ao equipamento normal:

- extremamente raras;
- poderosas;
- identidade/efeito próprios;
- provenance/histórico quando certificadas Online;
- negociáveis somente quando certificadas Online;
- nunca craftáveis.

Somente Relíquias podem ser negociadas entre jogadores.

Algumas podem possuir quantidade global limitada, definida individualmente.

Uma Relíquia negociável precisa existir como instância oficial no Relic Registry. Um identificador presente somente em save local não cria propriedade econômica.

## Mercado

O Mercado entre jogadores é exclusivo de saves Online e é um sistema autoritativo de servidor.

Preço fixo definido pelo vendedor.

Sem leilão ou ofertas inicialmente.

Anúncio permanece até venda ou cancelamento.

Venda possui taxa removida da economia.

Mercado acompanha:

- última venda;
- média;
- maior venda;
- quantidade de negociações;
- histórico/provenance.

O Mercado valida existência, propriedade e estado da Relíquia no registro oficial; nunca utiliza o save local como prova de propriedade.

---

# 37. Economia

Uma única moeda principal.

NPCs compram itens/equipamentos por valores do sistema.

Desmontagem concede somente dinheiro.

Sinks principais:

- expansão de inventário;
- expansão de Banco;
- taxas de mercado;
- morte fora de Dungeon;
- serviços de NPC quando aplicável.

Crafting e upgrades não custam dinheiro.

Dungeons não possuem taxa monetária normal de entrada.

Prestígio não custa dinheiro.

NPCs podem exercer papéis de ferreiro, cozinheiro, mercador, curandeiro e vendedor básico dentro das estruturas já existentes, sem exigir novos edifícios iniciais.

Equipamento avançado vem principalmente de:

- crafting;
- exploração;
- Dungeons;
- Bosses;
- eventos.

## Morte fora de Dungeon

Retorna o personagem à Cidade Livre e destrói uma parcela de dinheiro como sink.

A fórmula exata é dado de balanceamento econômico.

Dentro de Dungeon, a perda da Bolsa de Expedição já funciona como risco próprio e não precisa ser acompanhada automaticamente de segunda penalidade monetária.

O mecanismo exato pelo qual a moeda obtida em gameplay local se torna elegível para uso no Mercado Online permanece A definir. O Mercado nunca pode aceitar saldo não certificado apenas porque o cliente ou save local o declarou.

---

# 38. Cidade e estrutura do mundo

## Cidade Livre

Uma única cidade principal inicialmente.

Centro de:

- NPCs;
- serviços;
- comércio;
- gerenciamento;
- narrativa;
- preparação.

Território neutro de trégua:

- ataques entre humanos/monstros proibidos;
- comércio permitido;
- origem/aparência não definem direitos;
- estabilidade e contratos têm prioridade.

Coexistência não significa amizade.

## Estruturas iniciais

Somente cinco estruturas principais:

1. Taverna;
2. Banco;
3. Relicário;
4. Mercado;
5. Ferreiro.

Outros papéis de NPC podem existir dentro dessas estruturas.

## Mundo

Não existe estrutura de progressão por regiões nem sistema de viagem entre regiões.

Atividades e Dungeons são acessadas diretamente pelos sistemas do jogo respeitando requisitos.

A Cidade Livre não possui nível/evolução própria por enquanto.

NPCs e estados da cidade podem mudar por Dungeon, quest, evento, decisão e progressão narrativa.

Eventos globais temporários podem alterar NPCs, diálogos, serviços, aparência e acontecimentos.

---

# 39. Quests, NPCs e narrativa

Tipos:

- Principal;
- Secundária;
- Parceiro;
- Evento;
- Secreta.

Quest principal não bloqueia progressão Idle básica.

Escolhas podem alterar:

- relações;
- NPCs;
- quests futuras;
- recompensas;
- eventos;
- estados narrativos.

Falha permanente de quest pode existir com moderação.

NPCs não morrem nem desaparecem definitivamente do mundo devido às escolhas do jogador; presença, comportamento e disponibilidade podem mudar.

Quests secretas podem nascer de:

- itens;
- Dungeons;
- parceiros;
- diálogos;
- eventos;
- combinações de condições.

Diálogos são curtos e objetivos. Lore profundo é opcional.

NPCs lembram decisões relevantes.

Requisitos podem usar:

- atributo;
- Skill/Prestígio;
- item;
- parceiro;
- quest;
- estado anterior.

---

# 40. Prólogo e onboarding

## Origem

Personagem de terra distante, passado propositalmente aberto.

Chega à Cidade Livre buscando sobrevivência, trabalho ou recomeço.

Não conhece profecia nem manifesta poder especial.

## Fluxo

```text
Novo Jogo
↓
Escolha do modo de Save — Offline ou Online
↓
Nome
↓
Classe
↓
Presente
↓
Confirmar criação
↓
introdução narrativa curta
↓
Cidade Livre
↓
Taverna
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
Técnicas e Estilo
↓
Consumíveis
↓
contrato de Dún Liath
↓
Preparação completa
↓
Dún Liath
```

A escolha Offline/Online ocorre **antes** de nome, classe e presente e é imutável para aquele save.

## Criação

A criação é apresentada como fluxo em etapas dentro de uma mesma experiência, evitando a sensação de formulário burocrático único.

Depois da escolha do modo de Save, a criação mostra principalmente:

- identidade;
- atributos destacados;
- equipamento inicial;
- habilidade/Técnica inicial.

Mensagem explícita:

> **A classe define apenas o início. Todas as formas de combate poderão ser aprendidas posteriormente.**

Presentes comunicam sua utilidade conhecida sem revelar antecipadamente segredos, destinos específicos ou consequências narrativas futuras.

## Cidade Livre

A entrada possui introdução narrativa curta e visual. Pode mostrar humanos e monstros sob trégua, comércio e tensão.

Sem lore dump.

A Taverna recebe indicação clara como primeiro destino, mas o jogador mantém controle para aprender a navegação.

## Taverna

Primeira conversa obrigatória curta.

Respostas podem envolver trabalho, dinheiro, fugir do passado ou sobreviver, caracterizando o personagem sem fixar origem canônica.

A primeira necessidade é apresentada de forma contextual e conduz o jogador a compreender Atividades sem escolher automaticamente uma Skill por ele.

## Primeira atividade Idle

Escolha livre entre:

1. Mineração;
2. Lenhador;
3. Pesca;
4. Herbologia.

As sete Skills podem estar visíveis em Atividades, com Coleta recebendo foco contextual inicial e Produção permanecendo reconhecível sem competir pela atenção.

O jogador escolhe a Skill, escolhe o recurso e confirma o início.

Ensina:

`escolher → iniciar → aguardar → recurso + XP → automático`

O primeiro feedback deixa claro que a atividade continua enquanto o jogador navega por contextos seguros.

## Primeira produção

Após obter o primeiro recurso, a produção relacionada recebe destaque contextual sem esconder as outras possibilidades.

Receitas mostram requisitos e quantidades possuídas. Quando faltar material e sua fonte já for conhecida, a interface pode oferecer atalho para a Skill correspondente sem iniciar automaticamente a atividade.

Iniciar uma nova atividade de Produção substitui a atividade Idle anterior e essa consequência é comunicada antes da ação.

O primeiro produto concluído explica brevemente sua utilidade conhecida.

Metalurgia, Forja e Culinária são ensinadas no primeiro uso relevante.

## Primeiro Serviço e combate

A Taverna/Jornada apresenta um Serviço que cria contexto para a entrada em Aventura.

Antes do primeiro combate, o jogador passa por uma versão simplificada da Preparação, mostrando somente sistemas que já possuem significado naquele momento.

O primeiro combate deve ser um encontro simples que ensina progressivamente:

- ataque automático;
- Vida/Mana/Stamina;
- habilidade ativa;
- leitura de ação atual;
- primeiro telegraph simples;
- causa e efeito do resultado.

Consumíveis automáticos e configuração completa não precisam competir com esse primeiro encontro; são aprofundados antes da primeira Dungeon.

Instruções surgem contextualmente. O jogo pode interromper ou desacelerar brevemente apenas quando um evento realmente novo e importante exigir compreensão, como o primeiro telegraph perigoso.

O primeiro inimigo deve preferencialmente ser uma ameaça selvagem ou neutra ao conflito político, para não antecipar a revelação narrativa sobre a inteligência dos monstros.

## Técnicas básicas e Estilo

Habilidades gerais podem ser aprendidas por contexto e uso dos sistemas, não por uma árvore de habilidades precoce obrigatória.

Após o primeiro combate, o jogador é apresentado à configuração de Técnicas e à relação entre os quatro slots e sua prioridade real.

Estilo de combate é introduzido nessa mesma etapa de forma simples.

Antes do primeiro contrato de Dungeon, o personagem deve ter opções suficientes para que os quatro slots ativos sejam um sistema real, ainda que não seja obrigatório preenchê-los todos.

Consumíveis automáticos são aprofundados depois que o combate já forneceu contexto e antes da primeira Dungeon.

## Contrato de Dún Liath

A Taverna apresenta o contrato narrativamente. Depois de aceito, ele permanece recuperável por Aventura/Jornada.

Aceitar o contrato não inicia a expedição automaticamente; o jogador retorna ao controle normal com Jornada atualizada e decide quando se preparar.

Antes de entrar, o jogador deve ter oportunidade clara de:

- revisar equipamento;
- revisar Técnicas e sua prioridade;
- selecionar Estilo;
- configurar consumíveis;
- observar seu estado atual;
- entender o risco da Bolsa de Expedição;
- compreender que a atividade Idle será pausada ao assumir o risco da expedição.

## Regra de diálogo obrigatório

Conversas obrigatórias do onboarding devem devolver controle ao jogador rapidamente; referência de 3–5 falas antes de nova ação do jogador.

> **A explicação deve aparecer perto da primeira decisão que exige aquele conhecimento.**

> **O jogador aprende jogando.**

---

# 41. UX e interface

## Direção

- Web-first;
- 2D;
- UI-heavy;
- system-first em acesso e navegação, sem ser dashboard-first em apresentação;
- estrutura limpa, previsível e legível;
- superfícies e identidade Dark Fantasy;
- elegante e padronizada;
- informação hierarquizada;
- inspiração Apple em arquitetura de informação, clareza, consistência e progressive disclosure;
- inspiração Nintendo em aprender fazendo, feedback imediato e experimentação segura;
- inspiração em Metal Gear Solid 4 e Death Stranding para informação contextual, preparação como gameplay, comunicação de estado, planejamento e risco;
- claramente Game UI, não aplicativo genérico.

As referências representam princípios de experiência e não implicam copiar identidade visual, componentes, assets ou linguagem de marca.

> **A complexidade deve vir da profundidade das decisões, não da dificuldade de encontrar, lembrar ou compreender as informações necessárias para tomá-las.**

> **A interface esclarece fatos, estados e consequências conhecidas; ela não escolhe a estratégia pelo jogador.**

> **O jogo deve respeitar tanto o jogador presente quanto o jogador que retorna depois de horas ou dias.**

> **Clareza primeiro; prazer de interação em cada resposta da interface.**

## Fricção e contexto

Dificuldade, risco, escassez, rotas irreversíveis e decisões ambíguas podem gerar fricção intencional.

A interface deve reduzir fricção acidental como:

- não saber onde executar uma ação;
- não entender por que algo está indisponível;
- depender de memorização evitável;
- perder contexto por navegação desnecessária;
- descobrir uma consequência importante apenas depois de confirmar.

> **O desafio deve estar no jogo, não em operar a interface.**

> **Informação e interação devem existir, sempre que possível, no contexto em que possuem significado.**

## Modelo mental e arquitetura de informação

No estado seguro, existem quatro destinos principais:

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

Jornada não é um quinto destino equivalente. É uma camada global para recuperar atividade, objetivo/contexto, descobertas e acontecimentos recentes sem destruir a tela atual.

Combate não é destino permanente. É um estado contextual iniciado por Serviço, Dungeon ou outro conteúdo apropriado.

### Personagem

```text
PERSONAGEM
├── Visão Geral
├── Atributos
├── Equipamento
├── Técnicas
└── Inventário
```

Visão Geral abre primeiro e resume identidade, recursos, atributos, equipamento e progressão sem substituir as telas detalhadas.

Inventário pertence conceitualmente a Personagem, mas possui acesso rápido global para consultas e ações comuns. Ambos acessam o mesmo estado de Inventory.

### Atividades

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

As sete Skills permanecem reconhecíveis e cada uma possui tela dedicada.

Atalhos contextuais podem levar a uma Skill ou receita relacionada, mas não iniciam automaticamente a atividade.

### Aventura

```text
AVENTURA
├── Serviços
└── Dungeons
```

Aventura é a porta de entrada para conteúdo ativo e de risco.

### Cidade

A Cidade Livre possui hub geral e cinco estabelecimentos:

```text
Taverna
Mercado
Ferreiro
Banco
Relicário
```

A Cidade fornece contexto narrativo e serviços, mas não funciona como navegação world-first obrigatória para acessar Skills.

**Forja** é Skill do jogador em Atividades; **Ferreiro** é serviço/NPC da Cidade.

## Shell seguro

O shell seguro mantém disponíveis:

- avatar, nome e nível;
- Vida, Mana e Stamina;
- moeda principal de forma secundária;
- navegação principal;
- indicador pequeno e expansível da atividade Idle atual;
- acesso rápido a Inventário;
- Jornada com objetivo/contexto atual;
- configurações.

> **Global não significa permanentemente chamativo.**

Vida, Mana e Stamina permanecem visíveis no shell seguro, mas sem disputar atenção desnecessariamente com o conteúdo principal.

Ao navegar entre contextos seguros, a atividade Idle continua normalmente.

## Progressive disclosure e recognition over recall

A informação deve ser organizada em três níveis quando apropriado:

```text
DECISÃO
informação necessária para agir agora

COMPREENSÃO
requisitos, custos, tempo, XP, quantidade, usos e causas

OTIMIZAÇÃO
bônus, Prestígio, eficiência e detalhes avançados
```

Materiais podem mostrar usos conhecidos; receitas mostram quantidade possuída; Técnicas mostram custos/condições; estados de risco mostram consequências; fontes conhecidas podem ser recuperadas.

A interface encurta caminhos sem escolher pelo jogador.

## Continuidade Idle e estados de risco

A fronteira canônica é:

```text
SAFE
↓ abrir Preparação
PREPARAÇÃO
↓ confirmar entrada
RISK ACTIVE — COMBATE / DUNGEON
↓ concluir / retirar / morrer
SAFE
```

Comportamento da atividade Idle:

```text
SAFE                continua
PREPARAÇÃO          continua
COMBATE             pausa
DUNGEON              pausa
RETORNO AO SAFE      retoma automaticamente
```

Combates de Serviço também pausam Idle.

Concluir Serviço, retirar-se de Dungeon, concluir Dungeon ou morrer faz a atividade anterior retomar automaticamente ao voltar à segurança.

O jogador recebe feedback dessa mudança, mas não precisa reiniciar manualmente a atividade.

Fechar o jogo durante uma Dungeon ativa não cancela a run. A Dungeon permanece ativa e o Idle permanece pausado. Ao reabrir, a experiência prioriza reconstruir e retomar o contexto da expedição.

A estratégia técnica para fechar exatamente no meio de uma ação de combate permanece definida separadamente nas regras de persistência e pode continuar A definir sem alterar esta regra de experiência.

## Preparação

Preparação é gameplay quando build e recursos alteram significativamente o resultado.

Ela assume estado próprio, mantendo a navegação global disponível de forma visualmente reduzida. Cancelar retorna ao contexto de origem.

A preparação deve permitir compreender:

- desafio e objetivo conhecidos;
- estado do personagem;
- equipamento;
- Técnicas e prioridade;
- consumíveis;
- Estilo;
- risco conhecido;
- fatos objetivos de configuração incompleta;
- consequência da decisão de entrar.

Alertas informam fatos como slots vazios ou Vida atual; não classificam a build como boa/ruim e não recomendam automaticamente a estratégia ótima.

Ajustes de Equipamento, Técnicas e Consumíveis devem preservar o contexto de Preparação sempre que possível.

A mesma gramática possui profundidade proporcional ao conteúdo: preparação leve, padrão e de expedição.

Riscos conhecidos ficam próximos da ação final. O botão de entrada representa o compromisso; a atividade Idle só pausa depois dessa confirmação.

## Combate

Combate assume estado dedicado e recolhe quase totalmente a navegação global, preservando de forma discreta o contexto de origem.

A interface deve permitir observar, quando relevante:

- personagem e inimigo;
- Vida, Mana e Stamina;
- ação atual;
- habilidade escolhida;
- cooldown;
- condição inválida;
- falta de recurso;
- telegraph do próximo evento relevante;
- buildup/status;
- consumíveis preparados;
- alvo;
- resultado da ação;
- log recolhível.

Os quatro slots de Técnicas aparecem em ordem de prioridade real.

A interface deve permitir entender não apenas qual ação foi usada, mas também por que uma Técnica configurada não foi usada quando isso for relevante.

Telegraphs usam sinais redundantes como nome, tempo e indicação visual; informação crítica não depende apenas de cor ou áudio.

Durante combate, o jogador acessa apenas recursos preparados e operações permitidas pelo sistema. Isso não cria permissão para trocar equipamento fora das condições definidas para Dungeons.

Resultados de vitória e derrota apresentam causa e efeito suficientes para que o jogador possa formar nova hipótese estratégica sem a interface declarar qual seria a melhor solução.

## Dungeon

Dungeon é estado próprio. Entre combates, a **sala atual** é a unidade principal da experiência.

A interface deve responder, quando relevante:

```text
Onde estou?
Como estou?
O que há aqui?
O que está em risco?
Para onde posso ir?
```

A navegação mostra:

- sala atual;
- conexões disponíveis;
- rota percorrida;
- conhecimento descoberto;
- bifurcações irreversíveis;
- Bolsa de Expedição;
- diferença entre propriedade segura e loot em risco.

O mapa usa nós/conexões legíveis com ambientação, revelando apenas o conhecimento adquirido. Não mostra automaticamente tesouro, Elite, melhor rota ou estrutura completa.

Ações de sala são contextuais.

Loot comunica imediatamente sua entrada na Bolsa de Expedição e condição de risco.

Combate acontece dentro do contexto da sala e retorna a ele depois da resolução.

Sala de recuperação comunica claramente quando Equipamento, Técnicas, Consumíveis e Estilo podem ser reorganizados.

Bifurcações irreversíveis recebem confirmação contextual proporcional à consequência. Não é necessário um modal genérico adicional quando a própria tela já comunica claramente a irreversibilidade.

Eventos narrativos importantes podem reduzir elementos operacionais para dar foco à cena e à decisão.

Antes do Boss, a decisão entre retornar à Cidade e assegurar loot ou continuar mantendo o loot em risco deve ser explicitamente apresentada.

Bosses importantes podem receber apresentação narrativa/visual dedicada antes de entrar na mesma gramática funcional de combate.

## Matar/Poupar

A interface não usa cores, ícones, linguagem moral, alinhamento ou preview de recompensa para classificar uma opção como correta.

## Experiência de retorno

Ao retornar depois de ausência em contexto seguro, Greywake reconcilia o estado anterior com o atual.

O resumo pode comunicar, proporcionalmente:

- duração processada;
- atividade realizada;
- recursos obtidos;
- XP;
- níveis ganhos;
- desbloqueios;
- causa de eventual interrupção;
- fatos importantes aguardando decisão.

Ausências triviais não recebem a mesma cerimônia que mudanças importantes.

Quando existe Dungeon ativa, a prioridade é reconstruir a expedição e o risco atual; o Idle continua pausado.

## Feedback, erro e confirmação

Feedback confirma ação, resultado, causa quando necessária e mudança de estado.

Sua intensidade acompanha a importância:

```text
micro
recurso, botão, seleção, item movido

contextual
receita, Skill, reforço, Serviço

momento
Dungeon, Boss, derrota significativa, Relíquia, marco narrativo
```

Ações triviais não devem interromper o jogador. Ações irreversíveis ou destrutivas comunicam consequência antes da confirmação.

Erros informam o que não ocorreu, causa conhecida e se recursos/estado foram preservados. Códigos técnicos não substituem mensagens de gameplay compreensíveis.

Salvamento e loading devem transmitir estado real sem espera artificial ou falsa confirmação.

## Gramática de superfícies

```text
PÁGINA
→ destino principal

PAINEL / SHEET
→ consulta ou ajuste sem perder contexto

EXPANSÃO INLINE
→ detalhe local

FEEDBACK TRANSITÓRIO
→ confirmação breve

ESTADO DEDICADO
→ Preparação, Combate, Dungeon, decisão crítica

MODAL
→ exceção para interrupção realmente necessária ou consequência destrutiva
```

## Responsividade e acessibilidade

A arquitetura mental é preservada em desktop e mobile; posicionamento pode mudar por ergonomia.

No mobile, os quatro destinos principais podem migrar para navegação inferior. Painéis laterais podem virar sheets/superfícies adaptadas. Combate e mapa de Dungeon devem reorganizar hierarquia em vez de apenas comprimir layouts desktop.

Nenhuma ação essencial depende exclusivamente de hover, drag-and-drop, cor, áudio ou movimento.

A fundação deve considerar:

- escala de texto/interface;
- contraste;
- foco visível e navegação por teclado quando aplicável;
- sinais redundantes;
- redução de movimento;
- alvos de toque adequados;
- tooltips acessíveis por foco, clique ou toque.

## Sistema visual e mídia

A linguagem visual combina estrutura limpa com superfícies Dark Fantasy, arte autoral forte, tipografia de personalidade nos títulos e alta legibilidade em dados.

> **Quanto mais narrativa a tela, mais espaço para arte; quanto mais operacional, mais espaço para informação; quanto mais crítico o estado, mais a interface assume um modo próprio.**

Em áreas muito frequentes, artes contextuais podem reduzir presença depois que o jogador já reconhece o local, preservando identidade sem prejudicar eficiência.

Padrões de mídia aprovados:

- **16:9** — ambientes, estabelecimentos, Skills, Dungeons e imagens contextuais principais;
- **4:5** — personagem, NPCs e retratos importantes;
- **1:1** — itens, equipamentos, recursos, Técnicas e Relíquias;
- **ícones pequenos** — estados e informação operacional.

Para artes 16:9, **1920×1080** é arquivo mestre recomendado de produção, não dimensão fixa da interface.

Artes devem prever safe area para adaptação/crop responsivo. Informações essenciais não podem depender de texto incorporado diretamente à imagem.

Animações são suaves, curtas, consistentes e informativas. Movimento não deve atrasar decisão nem esconder estado relevante.

Áudio pode reforçar importância e risco, mas nenhuma informação necessária depende exclusivamente dele.

## Documento detalhado de UX

A arquitetura operacional, os fluxos aprovados, padrões de mídia, comportamento responsivo, estados vazios, playtests e demais detalhes de experiência são aprofundados em `docs/UX-GDD.md`, subordinado às regras deste GDD e sem substituir suas regras de negócio.

---

# 42. História e lore

## Identidade cultural/geográfica

> **O mundo possui uma identidade atlântica sombria, inspirada culturalmente na transição entre tradições célticas e nórdicas, sem representar literalmente Irlanda ou Islândia.**

Referências:

- florestas antigas e úmidas;
- penhascos;
- costas severas;
- mares frios;
- ilhas;
- montanhas;
- paisagens vulcânicas;
- ruínas;
- fortificações costeiras.

Culturas tiveram contato por comércio, migração, conflito e civilizações antigas.

Humanos e monstros não representam diretamente povos históricos reais.

## Conflito

Dark Fantasy centrado em guerra extremamente antiga entre humanos e monstros.

A origem foi perdida.

Ambos cometeram atrocidades e produzem propaganda.

> **A guerra continua funcionando mesmo depois de todos terem esquecido por que ela começou.**

## Monstros

Possuem inteligência, sentimentos, linguagem, memória, cultura e capacidade moral/política equivalentes às humanas.

Diferença principal percebida é aparência grotesca segundo padrões humanos.

Entre monstros, aparência não possui valor social.

> **Monstros não são inimigos por natureza. São um povo tratado como inimigo.**

O termo “monstro” é principalmente classificação humana; o próprio povo pode usar outra autodesignação futuramente.

Monstros também podem ser cruéis, corruptos ou violentos. A narrativa não os idealiza.

## Sociedade humana

Aproximação política inicial:

- 90% apoiam/seguem/participam da guerra;
- 5% Dissidentes;
- 5% Conciliadores.

Facções:

- **Ordem de Ferro** — principal força militar, pró-guerra;
- **Dissidentes** — desertores/rebeldes/recusam guerra;
- **Conciliadores** — defendem diálogo e fim do conflito reconhecendo atrocidades de ambos os lados.

Doutrina dominante: não negociar e não deixar monstros vivos fora das exceções impostas pela Cidade Livre.

## Liderança humana

Poder militar hereditário, formando dinastia de fato.

O líder atual lucra com a economia da guerra.

> **A guerra deixou de ser apenas um conflito e se tornou uma indústria.**

O jogador nunca encontra pessoalmente o líder máximo; percebe sua influência por ordens, documentos, soldados, propaganda e economia.

## Política monstruosa

Estrutura democrática com partidos, debate, instituições e presidente eleito.

O presidente quer paz, mas sofre pressão conforme ataques humanos fortalecem grupos retaliadores.

O jogador nunca o encontra pessoalmente.

Facções:

- **Retaliadores** — resposta violenta;
- **Sobreviventes** — continuidade/proteção do povo;
- **Pactários** — coexistência e negociação.

## Cidade Livre

Território neutro onde humanos e monstros coexistem publicamente sob regras de trégua e comércio.

NPCs podem demonstrar preconceito, medo, respeito, curiosidade ou pragmatismo.

## Profecia

A versão original foi perdida. Restam histórias, tradições e interpretações distorcidas.

Ideia preservada:

> **Em determinado momento da crise surgirá alguém capaz de alterar o destino dos povos.**

Não identifica claramente nome, aparência, origem, família, momento ou resultado.

O personagem pode cumpri-la, mas a profecia não garante sucesso.

> **A profecia prevê que alguém surgirá, mas não garante que essa pessoa chegará ao fim de sua jornada.**

Não existe poder profético explícito no início do jogo.

## Civilização antiga

Existiu civilização/reino extremamente importante antes do presente.

Sua queda permanece ambígua.

Vestígios aparecem em:

- ruínas;
- equipamentos;
- Relíquias;
- Dungeons;
- inscrições;
- NPCs;
- relatos contraditórios.

## Religião e Fé

Diferentes crenças e interpretações coexistem.

Fé como atributo não confirma objetivamente qual religião é verdadeira.

## Antagonismo

A história não depende de um único grande vilão.

O jogador conhece primeiro consequências, depois interesses políticos, lideranças, grupos e manipulações.

## Facções e escolhas

O jogador não escolhe permanentemente “Humanos” ou “Monstros” em uma tela de facção.

Relações são construídas por decisões.

## Dungeons como arqueologia narrativa

Dungeons contam história por:

- arquitetura;
- inimigos;
- Bosses;
- itens;
- Relíquias;
- NPCs;
- eventos;
- segredos.

Um local pode mudar de significado quando novas informações são descobertas.

---

# 43. Finais

Dois finais principais para o primeiro grande arco:

1. **Continuar o ciclo da guerra**;
2. **Romper o ciclo da guerra**.

Sem classificação oficial de bom ou ruim.

## Continuar o ciclo

A estrutura política/econômica/cultural da guerra permanece, ainda que lados ou lideranças mudem.

A profecia pode ser considerada cumprida porque o personagem alterou destinos sem encerrar o conflito.

## Romper o ciclo

A guerra deixa de ser inevitável, mas não surge paz perfeita.

Continuam:

- ódio;
- preconceito;
- extremismo;
- famílias marcadas;
- desconfiança;
- ataques isolados;
- interesses econômicos ameaçados.

> **A guerra deixa de ser inevitável.**

A paz apenas se torna possível.

O jogo pode continuar após qualquer final com progressão, eventos e expansões narrativas.

---

# 44. Arte

## Temática

Dark Fantasy: decadência, mistério, antiguidade, perigo, grandeza perdida e conflito atual.

## Identidade visual atlântica

- florestas antigas/úmidas;
- penhascos;
- costas rochosas;
- mares frios/violentos;
- ilhas;
- montanhas;
- vulcanismo;
- fortalezas/ruínas costeiras;
- camadas culturais em arquitetura e objetos.

Não reproduzir literalmente países reais.

## Interface e movimento

- Web-first;
- 2D e UI-heavy;
- estrutura limpa, previsível e legível;
- superfícies Dark Fantasy;
- elegante e padronizada;
- informação hierarquizada;
- inspiração Apple em experiência de uso e progressive disclosure;
- feedback e aprendizado contextual inspirados na qualidade de interação de bons jogos Nintendo;
- informação contextual, preparação e comunicação de risco inspiradas em princípios observados em Metal Gear Solid 4 e Death Stranding;
- Game UI reconhecível, não aplicativo genérico.

A interface pode utilizar camadas 2D, sprites, ilustrações, partículas e superfícies gráficas quando agregarem legibilidade ou atmosfera, sem transformar um motor 3D em requisito da experiência.

> **Quanto mais narrativa a tela, mais espaço para arte; quanto mais operacional, mais espaço para informação; quanto mais crítico o estado, mais a interface assume um modo próprio.**

## Padrões de mídia

Slots de mídia devem ser considerados desde a arquitetura das telas:

- **16:9** para ambientes, estabelecimentos, Skills, Dungeons e imagens contextuais principais;
- **4:5** para personagem, NPCs e retratos importantes;
- **1:1** para itens, equipamentos, recursos, Técnicas e Relíquias;
- ícones pequenos para estados e informação operacional.

Para artes contextuais 16:9, **1920×1080** é o arquivo mestre recomendado de produção, não uma dimensão fixa de renderização.

As artes devem prever área segura para adaptação responsiva e pequenos crops sem cortar o assunto principal.

Informações essenciais, valores e requisitos não dependem de texto incorporado ao arquivo da arte.

Em telas de uso frequente, a presença da arte pode reduzir conforme a familiaridade do jogador com o contexto, sem abandonar a identidade visual do local ou sistema.

Animações devem ser suaves, curtas, consistentes e informativas. Movimento não deve atrasar decisões nem esconder estado relevante.

---

# 45. Regras documentais

Este GDD contém a especificação canônica do jogo e requisitos arquiteturais que independem da tecnologia escolhida.

Devem ficar fora deste arquivo:

- escopo de uma build específica;
- números provisórios exclusivos de playtest;
- cronogramas;
- critérios de entrada/saída de versão;
- matriz de testes;
- resultados de simulações de balanceamento;
- ferramentas temporárias de desenvolvimento;
- linguagem de programação concreta;
- framework concreto;
- produto de banco de dados específico;
- ORM específico;
- framework de UI específico;
- provedor de infraestrutura;
- estratégia concreta de deploy.

Esses itens pertencem aos documentos de build ou implementação.

Quando uma decisão de build revelar uma nova **regra permanente de negócio**, a regra deve ser promovida para este GDD e reescrita sem referência à build que a originou.

Quando uma decisão técnica estabelecer um requisito arquitetural permanente, ela pode ser registrada neste GDD de maneira agnóstica à stack.

Quando um número continuar sendo apenas baseline de balanceamento de uma versão, ele permanece no documento da build.

---

# 46. Pontos ainda A definir

Continuam deliberadamente em aberto quando não houver decisão canônica:

- nome e slogan do jogo;
- público-alvo formal;
- modelo de monetização;
- custo de desenvolvimento;
- fórmulas e números finais de balanceamento;
- limites definitivos de inventário/stack;
- preços finais da economia;
- valores finais de habilidades, consumíveis, inimigos e status;
- limites finais dos buffs de Culinária;
- eficiências exatas dos Prestígios;
- detalhes numéricos de Relíquias e dificuldades avançadas;
- conteúdo da segunda Dungeon e expansões posteriores ainda não desenhadas;
- estratégia de retomada de combate interrompido no meio da execução;
- comportamento exato de um save Online quando perde conexão durante gameplay local;
- modelo exato de certificação da moeda aceita pelo Mercado Online;
- pesos, thresholds e decay concretos do Risk Score/Trust Level;
- frequência exata e payload final dos checkpoints Online;
- estratégia concreta de execução/validação de Certified Dungeon, desde que preserve autoridade do servidor sobre o resultado econômico;
- stack tecnológica concreta.

Esses pontos podem ser fechados incrementalmente sem misturar planejamento de versão, balanceamento e implementação com a especificação permanente do jogo.

---

# 47. Arquitetura conceitual

## Princípio geral

A aplicação deve nascer como um **monólito modular** quando a camada de servidor for introduzida: os sistemas permanecem fisicamente próximos no início, mas são logicamente independentes e possuem fronteiras claras.

> **Separar módulos fisicamente cedo demais adiciona complexidade sem benefício; separar responsabilidades logicamente desde o início reduz acoplamento e retrabalho.**

A arquitetura não deve depender de microserviços para obter modularidade.

Um módulo pode conhecer o **contrato público** de outro módulo, mas não seus detalhes internos.

Nenhum módulo deve manipular diretamente o armazenamento interno de outro.

A implementação local do jogo deve respeitar as mesmas fronteiras de domínio, de forma que a introdução futura de persistência remota ou autoridade server-side não exija reconstruir os sistemas centrais.

## Módulos de domínio

Estrutura conceitual:

```text
Player
├── Character
├── Progression
├── Skills
├── Inventory
├── Equipment
└── Abilities

Gameplay
├── Idle
├── Crafting
├── Combat
├── Dungeon
├── Quests
└── Narrative

World
├── Economy
├── City
├── NPCs
└── Content Catalog

Infrastructure
├── Persistence
├── Clock
├── RNG
├── Telemetry
└── Save/Data Versioning
```

Essa divisão expressa responsabilidade de domínio, não necessariamente diretórios ou processos físicos finais.

## Ownership de estado

Cada estado possui um único módulo responsável por sua integridade.

Exemplos:

- Inventory é dono da posse e localização dos itens;
- Equipment é dono do loadout equipado, mas referencia itens pertencentes ao sistema de itens;
- Skills é dono da progressão das Skills;
- Dungeon é dono do estado de uma run;
- Combat é dono do estado temporário da luta;
- Narrative é dono dos estados narrativos persistentes;
- Economy é dono das operações econômicas e regras correspondentes.

> **Uma entidade pertence a um único módulo, mesmo quando outros módulos podem referenciá-la.**

---

# 48. Content Catalog e conteúdo orientado a dados

Itens, habilidades, inimigos, receitas, recursos, Dungeons, status, quests, NPCs e tabelas de loot devem ser descritos como conteúdo interpretado pelos sistemas sempre que possível.

O motor implementa regras universais; o Content Catalog descreve combinações concretas dessas regras.

Exemplo:

```text
Combat Engine
↓ interpreta
EnemyDefinition
↓
Crúbach
```

O motor não deve possuir lógica especial baseada no nome de um inimigo quando a mesma mecânica pode ser representada por dados.

## Conteúdo × motor

O motor sabe que:

- habilidades ocupam ações;
- cooldowns existem;
- telegraphs possuem preparação;
- status usam buildup;
- equipamentos possuem propriedades e afixos;
- Dungeons possuem salas, eventos e encontros.

O conteúdo define:

- quais habilidades um inimigo possui;
- duração/custo/poder de uma habilidade;
- resistências específicas;
- modelo de um equipamento;
- ingredientes de uma receita;
- composição de uma Dungeon;
- loot possível.

Exceções programáticas só devem existir quando representarem uma regra realmente exclusiva e formalizada.

---

# 49. Definition × State / Instance

A arquitetura separa explicitamente **definição de conteúdo** de **estado de execução**.

## Definition

Representa algo que existe nas regras/conteúdo do jogo.

Exemplos:

- ItemDefinition;
- AbilityDefinition;
- EnemyDefinition;
- SkillDefinition;
- RecipeDefinition;
- DungeonDefinition;
- QuestDefinition.

## State / Instance

Representa algo que pertence a um jogador ou aconteceu em uma execução.

Exemplos:

- ItemInstance;
- SkillProgress;
- CharacterAbility;
- DungeonRun;
- QuestState;
- NarrativeState;
- CombatState.

> **Definitions dizem o que uma coisa pode ser. State diz o que aconteceu com aquela coisa.**

## Identificadores

Definições de conteúdo utilizam IDs estáveis e independentes do texto exibido.

Exemplos conceituais:

```text
item.dun_liath.garrison_sword
enemy.dun_liath.crubach
ability.combat.calculated_strike
skill.mining
dungeon.dun_liath
```

Mudar o nome exibido não muda o ID.

Um ID de conteúdo publicado em estado persistente não deve ser reutilizado posteriormente com outro significado.

Instâncias e estados de jogador usam identificadores próprios e opacos, separados dos IDs de definição.

---

# 50. Estado fundamental e estado derivado

> **Dados fundamentais são persistidos; dados derivados são calculados.**

Exemplos de estado fundamental:

- atributos distribuídos;
- XP;
- nível;
- item e seus afixos;
- upgrade de um item;
- equipamento selecionado;
- habilidade aprendida;
- decisão narrativa;
- modo do save.

Exemplos de estado derivado:

- Vida máxima;
- Mana máxima;
- Stamina máxima;
- Defesa total;
- Precisão total;
- crítico final;
- outros valores calculáveis a partir do estado fundamental e das definições.

Valores derivados não devem ser duplicados como fonte concorrente de verdade quando podem ser recalculados de maneira determinística.

---

# 51. Player, Character e progressão

A conta do usuário e o personagem do jogo são conceitos separados quando existe identidade Online.

Conceitualmente:

```text
SaveProfile
↓
Character

Online:
PlayerAccount
↓
SaveProfile
↓
Character
```

O jogo continua possuindo um único personagem principal por save como regra de design atual; a separação existe para impedir que responsabilidades de conta, save e personagem sejam misturadas.

## SaveProfile

O save mantém identidade própria, incluindo pelo menos:

- identificador;
- modo `Offline` ou `Online`;
- versão de schema;
- versão de conteúdo;
- datas relevantes de criação/atualização.

O modo do save é escolhido antes da criação do personagem e não pode ser alterado posteriormente.

## Character

O Character mantém identidade e estado fundamental como:

- nome;
- classe inicial escolhida;
- presente inicial;
- nível geral;
- XP geral;
- pontos de atributo não distribuídos.

Os sete atributos são estado próprio do personagem.

## Classe inicial

A classe inicial funciona como definição de criação:

```text
StartingClassDefinition
├── atributos iniciais
├── equipamentos iniciais
└── habilidade inicial
```

Na criação, a definição é aplicada ao personagem.

Depois disso, as regras permanentes do personagem vêm de seus atributos, equipamentos, habilidades e progressão, não de uma restrição contínua da classe inicial.

Isso traduz arquiteturalmente:

> **A classe define o começo, não o destino.**

---

# 52. Skills, Idle e receitas

## SkillProgress

A definição da Skill é separada da progressão do personagem.

Estado conceitual:

```text
SkillProgress
- character
- skill
- level
- xp
- prestige
```

Não existe uma cópia da definição de Mineração por personagem.

## IdleActivityState

Uma atividade Idle ativa mantém estado suficiente para calcular progresso a partir do tempo transcorrido.

O sistema não deve depender de executar uma operação física por ciclo para cada jogador conectado ou offline.

Conceitualmente:

```text
started_at
last_processed_at
activity_definition_id
status
```

Ao processar:

```text
tempo transcorrido
↓
quantidade de ciclos válidos
↓
recompensas + XP
↓
atualização de last_processed_at
```

Quando a mesma atividade for reconciliada em uma fronteira Online confiável, o processamento aceito e a atualização do marcador temporal precisam ser tratados de forma atômica para impedir recompensa duplicada por múltiplas sessões/dispositivos.

## RecipeDefinition

Receitas descrevem:

- Skill relacionada;
- requisitos;
- duração;
- entradas;
- saídas.

Crafting interpreta a receita em vez de codificar uma função exclusiva para cada produto.

---

# 53. Itens, stacks, instâncias e equipamento

## ItemDefinition

Materiais, consumíveis, equipamentos, itens de quest e Relíquias compartilham uma identidade de item no Content Catalog, com categoria e regras próprias.

## Stack

Itens fungíveis e empilháveis usam quantidade associada à definição.

Exemplos:

- materiais;
- alimentos;
- consumíveis normais;
- Sucata.

## ItemInstance

Itens com identidade individual usam instância própria.

Equipamentos procedurais devem possuir pelo menos:

- identificador da instância;
- definição do modelo;
- raridade;
- nível de upgrade;
- afixos gerados.

Duas instâncias da mesma definição podem possuir propriedades procedurais diferentes.

## Ownership

Inventory é a fonte de verdade da posse dos itens carregados pelo personagem dentro do estado daquele save.

Equipment não duplica a instância equipada; mantém referência para a mesma instância pertencente ao sistema de itens.

> **Um item existe em um único local lógico por vez.**

Mover item entre Inventory, Banco, Bolsa de Expedição ou outros containers deve representar transferência de ownership/localização, não clonagem.

Para Relíquias negociáveis Online, o Relic Registry adiciona uma autoridade externa de existência, propriedade econômica e provenance que prevalece sobre qualquer referência local conflitante.

## Consumable Loadout

Equipar um consumível em slot de combate referencia sua definição/tipo disponível; a quantidade consumível continua pertencendo ao estoque real do personagem.

Equipar um consumível nunca implica estoque infinito.

---

# 54. Habilidades e automação

## AbilityDefinition

Uma habilidade deve ser descrita por propriedades estruturadas, incluindo quando aplicável:

- categoria;
- perfil;
- requisitos;
- custo de recurso;
- cooldown;
- targeting;
- efeitos.

Efeitos devem ser compostos por comportamentos reutilizáveis sempre que possível, como:

- dano;
- cura;
- aplicação de status;
- modificação temporária de atributo/defesa;
- recuperação de recurso.

## Habilidades aprendidas

O personagem mantém estado separado para quais AbilityDefinitions já aprendeu.

Aprender uma habilidade e equipá-la no loadout são operações diferentes.

## Loadout

O loadout mantém:

- estilo de combate;
- ordem dos quatro slots;
- habilidade referenciada por slot;
- condição automática quando aplicável.

## AutomationCondition

Condições devem ser persistidas de forma estruturada, não como texto interpretado.

Exemplo conceitual:

```text
type: health_percent_below
value: 40
```

Essa estrutura permite validação, evolução e interpretação determinística pelo motor.

---

# 55. DungeonRun como estado persistente

DungeonDefinition descreve a Dungeon.

DungeonRun representa uma execução específica.

A run deve possuir identidade e estado próprios, incluindo quando aplicável:

- personagem;
- Dungeon;
- dificuldade;
- seed;
- estado da run;
- sala atual;
- estrutura gerada;
- salas visitadas;
- decisões de bifurcação;
- decisões narrativas da run;
- recursos atuais do personagem na run;
- Expedition Bag.

## Aggregate da run

Alterações relevantes da Dungeon passam pelo módulo Dungeon.

Operações conceituais incluem:

```text
enterRoom()
resolveEncounter()
chooseBranch()
retreat()
die()
complete()
```

Outros módulos não devem alterar diretamente o status interno de uma run.

## Expedition Bag

A Bolsa de Expedição pertence à DungeonRun, não ao Inventory normal.

Ao sair em segurança:

```text
Expedition Bag
↓ transferência atômica
Inventory / Banco
```

Ao morrer:

```text
Expedition Bag
↓
conteúdo em risco é descartado
```

## Persistência da geração procedural

A seed da run deve ser armazenada para reprodução/auditoria.

A seed, porém, não é a única fonte de verdade de uma run já iniciada.

Ao gerar a estrutura:

```text
DungeonDefinition
+ seed
+ algoritmo de geração
↓
DungeonRunGraph
↓
persistido
```

Isso evita que uma alteração futura no algoritmo regenere uma run ativa de maneira diferente.

---

# 56. Combat Engine e estado de combate

O Combat Engine deve funcionar sem precisar conhecer a Dungeon, quest ou contexto narrativo que originou o encontro.

Recebe definições/snapshots necessários e cria um estado de combate temporário.

Conceitualmente:

```text
CharacterCombatSnapshot
+ EnemyDefinition / encounter
+ CombatConfiguration
↓
CombatState
```

CombatState controla apenas o necessário à luta, como:

- Vida atual;
- Mana/Stamina atuais;
- intervalos;
- cooldowns;
- buildup;
- status ativos;
- telegraphs;
- ações em execução;
- timeline;
- estado do RNG.

Ao terminar:

```text
CombatResult
```

é devolvido ao sistema superior.

O Combat Engine não concede diretamente recompensa econômica ou narrativa de uma Dungeon. O módulo que iniciou o encontro interpreta o resultado e aplica as consequências apropriadas.

## Timeline determinística

O combate deve ser modelável como uma sequência determinística de eventos temporais quando a mesma entrada e a mesma sequência de RNG são utilizadas.

Eventos conceituais podem incluir:

- ActorReady;
- ActionStarted;
- ActionResolved;
- DamageApplied;
- StatusApplied;
- StatusTriggered;
- ActorDied;
- PhaseChanged.

Essa característica deve permitir:

- debug;
- combat log;
- testes automatizados;
- simulações;
- reprodução de problemas;
- validação futura de sessões certificadas quando a estratégia escolhida utilizar reprodução determinística.

---

# 57. RNG reproduzível

Aleatoriedade deve ser centralizada e permitir seed/reprodução.

O código de domínio não deve espalhar fontes de aleatoriedade independentes sem controle.

Sistemas que dependem de RNG incluem:

- crítico;
- acerto/erro;
- loot;
- raridade;
- afixos;
- geração de Dungeon;
- eventos procedurais.

Uma execução importante deve poder registrar informação suficiente para reproduzir a sequência relevante quando necessário para debug/testes.

Conteúdo certificado capaz de produzir valor econômico deve utilizar RNG cuja autoridade não possa ser unilateralmente escolhida pelo cliente.

---

# 58. Comunicação entre módulos

A arquitetura utiliza três mecanismos conceituais distintos:

1. **contratos públicos entre módulos**;
2. **Use Cases para coordenar operações que atravessam módulos**;
3. **Domain Events para representar fatos e permitir reações desacopladas**.

## Contratos públicos

Cada módulo expõe somente operações necessárias aos demais.

Exemplo conceitual de Inventory:

```text
hasItems(...)
consumeItems(...)
addStack(...)
addItemInstance(...)
moveItem(...)
```

Outros módulos não recebem acesso direto ao repositório, tabela ou estrutura interna do Inventory.

## Application Use Cases

Operações que envolvem múltiplos módulos são coordenadas por casos de uso da aplicação.

Exemplo de crafting:

```text
CraftRecipeUseCase
├── Crafting valida receita
├── Skills valida requisito
├── Inventory valida/consome materiais
├── Crafting determina resultado
├── Inventory recebe resultado
└── Skills recebe XP
```

O Use Case conhece a sequência da operação, mas não reimplementa as regras internas dos módulos.

> **Use Cases coordenam; módulos executam suas próprias regras.**

A interface do usuário não deve manipular diretamente o formato de persistência. A mesma intenção de domínio deve poder ser atendida por uma implementação local ou, futuramente, por uma implementação Online quando a fronteira de confiança exigir.

## Evitar dependências circulares

Quando uma operação exigir Inventory + Equipment + Character, por exemplo, ela deve ser coordenada pelo Use Case apropriado em vez de fazer os módulos chamarem uns aos outros circularmente.

---

# 59. Commands e Domain Events

## Command / intenção

Representa algo que o usuário ou outro sistema deseja executar.

Exemplos:

- CraftRecipe;
- EquipItem;
- StartDungeon;
- ChooseBranch;
- UseConsumable.

## Domain Event / fato ocorrido

Representa algo que já aconteceu.

Exemplos:

- ItemCrafted;
- ItemEquipped;
- DungeonStarted;
- NarrativeChoiceMade;
- BossDefeated;
- SkillLeveledUp.

Eventos não substituem todas as chamadas síncronas.

> **Se algo é necessário para considerar a operação concluída, normalmente participa da operação síncrona e atômica. Se é uma reação ao que já aconteceu, pode ser tratado como evento.**

A utilização de Domain Events não implica event sourcing. O estado atual continua sendo persistido normalmente.

Efeitos externos ou secundários não devem ser publicados como definitivamente concluídos antes do commit da operação principal.

---

# 60. Atomicidade e consistência

Operações de negócio que alteram múltiplos estados devem ser atômicas dentro da fronteira de autoridade correspondente.

Exemplos:

## Crafting

```text
validar receita
↓
validar materiais
↓
consumir materiais
↓
gerar produto
↓
adicionar produto
↓
conceder XP
```

Ou toda a operação é confirmada, ou nenhuma alteração parcial permanece.

## Extração de Dungeon

```text
validar retirada
↓
transferir Expedition Bag
↓
marcar run como extraída
↓
confirmar operação
```

Uma falha intermediária não pode perder o loot nem duplicá-lo.

## Unidade de trabalho

Cada Use Case importante deve possuir uma fronteira clara de unidade de trabalho/transação.

A implementação concreta dessa transação depende da tecnologia e do modo do save, mas a propriedade de consistência é requisito arquitetural.

Operações de Mercado, emissão de Relíquia certificada e transferência de propriedade Online exigem atomicidade forte no servidor.

---

# 61. Idempotência e concorrência

Operações capazes de entregar valor ou alterar estados críticos precisam ser resistentes a repetição acidental da mesma solicitação quando atravessam uma fronteira persistente/Online.

Exemplos:

- recompensa de first clear;
- conclusão de quest;
- extração de Dungeon;
- compra/venda;
- crafting em lote;
- processamento Idle reconciliado;
- emissão de Relíquia certificada.

Repetir uma operação já confirmada não deve duplicar recompensa.

## First Clear

O first clear deve possuir estado explícito por personagem, Dungeon e dificuldade, em vez de depender apenas de inferências como “o personagem já possui a recompensa?”.

A concessão da recompensa e a marcação do first clear pertencem à mesma operação atômica dentro da persistência responsável por aquele save.

## Concorrência entre sessões

Quando um save Online puder ser aberto em mais de um dispositivo ou sessão, operações críticas precisam detectar/evitar que duas alterações simultâneas gastem os mesmos recursos ou processem o mesmo período reconciliado duas vezes.

Pode-se utilizar controle otimista, locks, constraints ou mecanismo equivalente conforme a tecnologia escolhida.

O requisito é:

> **um mesmo estado lógico certificado não pode ser consumido ou recompensado duas vezes por concorrência.**

---

# 62. Fronteiras de autoridade local e Online

A arquitetura não exige que o servidor simule continuamente todo o gameplay.

> **Gameplay é local por padrão; autoridade de servidor é obrigatória quando uma ação atravessa uma fronteira de confiança compartilhada.**

## Offline

No modo Offline, gameplay e persistência pertencem ao ambiente local do jogador.

Alterações locais não produzem propriedade econômica Online e não podem ser promovidas posteriormente para um save Online.

## Online

No modo Online, o jogo pode continuar executando gameplay comum localmente e sincronizar save/checkpoints conforme a política definida.

Armazenar um Cloud Save ou checkpoint **não transforma automaticamente todos os dados recebidos do cliente em fatos autoritativos**.

O servidor é autoridade obrigatória para, no mínimo:

- elegibilidade de acesso a conteúdo certificado que possa gerar valor negociável;
- estado e resultado econômico de Certified Dungeons capazes de emitir Relíquias negociáveis;
- criação de RelicInstances certificadas;
- existência, propriedade, status e provenance dessas Relíquias;
- listagens e transações do Mercado;
- saldo ou mecanismo de valor aceito pelo Mercado, conforme o modelo final de certificação econômica.

O cliente pode enviar intenções, checkpoints e dados para análise, mas não pode declarar unilateralmente como fato econômico:

```text
esta Relíquia existe
esta Relíquia é minha
vendi esta Relíquia
comprei esta Relíquia
tenho este saldo certificado
esta run pode emitir uma Relíquia
```

A autoridade do servidor deve ser concentrada onde fraude local poderia afetar outros jogadores ou a integridade da economia.

---

# 63. Persistência conceitual

## Estado operacional × Content Catalog

A persistência do estado do jogador é separada das definições do Content Catalog.

```text
Persistência operacional
= o que aconteceu / pertence ao jogador

Content Catalog
= o que existe e como funciona no jogo
```

Uma instância de equipamento pode persistir:

- ID da instância;
- ID da definição;
- raridade;
- upgrade;
- afixos.

Propriedades-base do modelo permanecem no Content Catalog e não precisam ser duplicadas como fonte de verdade em cada instância.

## Persistência local × persistência Online

A arquitetura deve permitir implementações de persistência diferentes sem alterar o domínio:

```text
Game Domain
↓
Persistence Contract
├── Local Persistence
└── Online Persistence / Sync
```

O modo Offline utiliza persistência local como fonte de verdade daquele save.

O modo Online pode combinar persistência local para execução/experiência, Cloud Save, checkpoints e persistência server-side para estados certificados.

## Modelo relacional/transacional Online

O estado operacional server-side que possui relações fortes, invariantes, unicidade e operações atômicas deve favorecer um modelo transacional e relacional, podendo utilizar estruturas flexíveis pontualmente quando o domínio realmente exigir.

Isso é um requisito de modelagem, não a escolha de um produto de banco específico.

## Separação por módulo

Mesmo que módulos compartilhem inicialmente a mesma infraestrutura de persistência, cada módulo controla seus próprios repositórios/estruturas e não acessa diretamente os detalhes internos de outro.

---

# 64. Versionamento e migrations

Devem existir dois conceitos independentes:

```text
save_schema_version
content_version
```

## Save schema version

Representa a estrutura persistida do estado.

Quando o formato estrutural mudar, deve existir migration explícita e versionada.

## Content version

Representa a versão das definições do jogo utilizadas pelo sistema.

Alterações de conteúdo e alterações de schema não devem ser tratadas como a mesma coisa.

## Migrations

Mudanças estruturais e transformações necessárias de dados existentes precisam ser reproduzíveis e versionadas.

Não se deve depender de uma aplicação “adivinhar” informalmente como converter saves antigos.

IDs de conteúdo precisam permanecer estáveis ao longo dessas mudanças.

Risk/Trust, checkpoints e validações de plausibilidade devem considerar a versão de conteúdo/balanceamento aplicável à época do estado analisado para não transformar mudanças legítimas de balanceamento em suspeita.

---

# 65. Estado persistente × estado temporário

## Persistente

Sobrevive entre sessões quando aplicável:

- identidade e modo do save;
- personagem;
- atributos;
- progressão;
- Skills;
- itens;
- Banco;
- equipamentos;
- habilidades aprendidas;
- quests;
- decisões narrativas;
- dinheiro;
- descobertas;
- DungeonRun ativa.

Em Online, checkpoints, Trust/Risk e estados econômicos certificados também podem possuir persistência própria no servidor.

## Temporário

Existe durante uma execução e pode ser reconstruído/descartado conforme a regra do sistema:

- cooldown de combate;
- buildup corrente;
- telegraph atual;
- ação em execução;
- Vida atual de inimigo;
- fila de eventos de uma luta.

DungeonRun é um estado persistente de atividade e pode conter recursos atuais do personagem entre encontros.

Vida/Mana/Stamina máximas permanecem derivadas; Vida/Mana/Stamina atuais podem ser persistidas dentro do contexto de uma run quando a regra de gameplay exigir continuidade.

---

# 66. Persistência de combate

O CombatState normal deve permanecer predominantemente temporário e não exige escrita persistente a cada ataque ou evento.

Ao concluir uma luta, CombatResult é aplicado ao estado persistente apropriado.

Não deve haver gravação obrigatória do tipo:

```text
HP 371
HP 365
HP 348
```

para cada passo da timeline apenas por existir uma persistência.

A estratégia para fechar o jogo exatamente no meio de um combate permanece **A definir** entre possibilidades como reinício controlado do encontro ou snapshot retomável.

Se snapshots forem adotados futuramente, precisam incluir estado suficiente para retomada determinística, inclusive RNG quando necessário.

Certified Dungeons podem adotar política de persistência de sessão diferente do combate local comum quando a segurança econômica exigir.

---

# 67. Narrative State e Quest State

Decisões narrativas não devem gerar uma nova coluna fixa no Character para cada escolha do jogo.

Estados narrativos precisam ser extensíveis e identificados por chave/definição estruturada.

Exemplo conceitual:

```text
key: dun_liath.protector
value: spared
```

O Content Catalog pode validar quais estados e valores são permitidos.

## Quests

QuestDefinition descreve objetivos, requisitos e recompensas.

QuestState descreve a progressão daquele personagem.

Objetivos individuais possuem estado próprio quando precisam acompanhar progresso.

Essa separação permite adicionar novas quests sem ampliar a estrutura central do Character a cada conteúdo novo.

---

# 68. Telemetry, logs, Risk/Trust e histórico de negócio

Esses conceitos são distintos.

## Estado/histórico de negócio

Mantém informações necessárias às regras do jogo, como:

- propriedade de Relíquias certificadas;
- transações de mercado;
- first clears;
- quests;
- estados narrativos relevantes.

## Telemetry

Serve para medir comportamento e balanceamento, como duração de combate, frequência de ações, uso de consumíveis e progressão.

No modo Online, telemetria e checkpoints também podem alimentar detecção de anomalias, sem se tornarem por si só prova absoluta de legitimidade.

## Risk/Trust

Risk Score e Trust Level representam avaliação interna de confiança para acesso a sistemas econômicos protegidos.

Eles não substituem Relic Registry, Certified Dungeon nem validação transacional do Mercado.

## Logs

Servem para diagnóstico e investigação técnica.

Não é necessário transformar cada ataque, recurso coletado ou ação comum em histórico permanente de negócio.

---

# 69. Baseline arquitetural aprovado

As seguintes decisões formam a baseline arquitetural atual:

1. arquitetura monolítica modular quando a camada de servidor for introduzida;
2. módulos com ownership explícito de estado;
3. contratos públicos pequenos entre módulos;
4. nenhum acesso direto aos detalhes internos de outro módulo;
5. Content Catalog orientado a dados;
6. separação Definition × State/Instance;
7. IDs de conteúdo estáveis e independentes do texto exibido;
8. estado fundamental persistido e estado derivado calculado;
9. Inventory como fonte de verdade de posse/localização dos itens daquele save;
10. Equipment referencia instâncias em vez de duplicá-las;
11. DungeonRun como estado persistível e aggregate próprio;
12. Expedition Bag pertencente à DungeonRun;
13. Combat Engine isolado do contexto narrativo/Dungeon;
14. timeline de combate determinística e RNG reproduzível;
15. Use Cases coordenam operações entre módulos;
16. módulos executam suas próprias regras;
17. Commands representam intenções e Domain Events representam fatos;
18. operações críticas são atômicas dentro da fronteira de autoridade responsável;
19. recompensas e operações críticas Online são idempotentes;
20. concorrência entre sessões não pode duplicar consumo/recompensa certificada;
21. gameplay comum é local por padrão; servidor é autoridade obrigatória nas fronteiras Online/econômicas definidas;
22. estado operacional e Content Catalog são separados;
23. persistência server-side crítica favorece modelo relacional/transacional sem fixar produto específico;
24. save schema e content version são versionados separadamente;
25. migrations são explícitas e reproduzíveis;
26. DungeonRun persiste estrutura gerada, não somente seed;
27. CombatState permanece predominantemente temporário;
28. stack tecnológica concreta permanece deliberadamente fora desta baseline;
29. existem dois modos de save, Offline e Online;
30. o modo do save é escolhido antes de nome/classe/presente e é imutável;
31. Offline não pode ser convertido em Online e Online não pode ser convertido em Offline;
32. estado Offline nunca é promovido para a economia Online;
33. Cloud Save/checkpoint Online não é sinônimo de autoridade sobre todo gameplay recebido do cliente;
34. Risk Score e Trust Level podem restringir acesso a sistemas econômicos protegidos, mas não são a única barreira de segurança;
35. conteúdo capaz de emitir Relíquia negociável exige Certified Dungeon/execução certificada Online;
36. Relíquias negociáveis são criadas como instâncias oficiais pelo servidor e registradas no Relic Registry;
37. Relic Registry é a fonte de verdade de existência, propriedade, estado e provenance das Relíquias negociáveis;
38. Mercado entre jogadores é server-side e nunca usa save local como prova de propriedade;
39. listagem, compra, venda e transferência de Relíquia precisam ser atômicas e idempotentes;
40. o mecanismo de saldo aceito pelo Mercado deve ser certificado pelo servidor; o modelo concreto permanece A definir;
41. a apresentação do jogo é Web-first, 2D e UI-heavy, com interface suave, consistente e fortemente orientada a feedback;
42. no estado seguro, a arquitetura de informação principal é Personagem, Atividades, Aventura e Cidade, com Jornada como camada global de continuidade;
43. atividade Idle continua em contextos seguros e durante Preparação, pausa em Combate/Dungeon e retoma automaticamente no retorno à segurança;
44. Preparação, Combate e Dungeon são estados contextuais próprios e não destinos permanentes da navegação principal;
45. o sistema visual reserva mídia por função: 16:9 contextual, 4:5 retratos, 1:1 itens/recursos/Técnicas/Relíquias.

Essas decisões podem ser reabertas quando surgir evidência concreta de problema estrutural, mas não devem ser rediscutidas sem motivo a cada etapa.

---

# 70. Modos de Save — Offline e Online

Existem exatamente dois modos de save:

1. **Offline**;
2. **Online**.

A escolha acontece ao iniciar um novo save, antes de nome, classe e presente.

> **O modo do save é uma propriedade imutável.**

Não existe conversão:

```text
Offline → Online  ❌
Online  → Offline ❌
```

## Offline

- fonte de verdade local;
- não depende da economia compartilhada Online;
- não acessa Mercado entre jogadores;
- não pode registrar Relíquias no Relic Registry Online;
- conteúdo local nunca é promovido posteriormente para propriedade econômica Online.

## Online

- ligado a identidade de conta;
- pode utilizar Cloud Save e checkpoints;
- pode acessar sistemas Online protegidos quando elegível;
- pode participar de Certified Dungeons e Mercado conforme regras de Risk/Trust e certificação.

O fato de ser Online não obriga o servidor a processar continuamente toda coleta, combate, crafting ou progressão comum.

---

# 71. Checkpoints e fronteira de confiança

O modo Online pode sincronizar snapshots/checkpoints relevantes do estado produzido durante gameplay local.

Checkpoints existem para:

- continuidade de Cloud Save;
- histórico de evolução;
- detecção de saltos/inconsistências;
- preparação para acesso a sistemas protegidos;
- recuperação e investigação de problemas.

Eventos adequados para checkpoint podem incluir, conforme implementação:

- login/logout;
- mudanças relevantes de progressão;
- conclusão de Dungeon;
- aquisição de item relevante;
- grande mudança econômica;
- tentativa de acessar Mercado;
- tentativa de iniciar Certified Dungeon.

A frequência exata não é regra do GDD.

> **Cloud Save armazena estado; certificação decide em que esse estado pode ser confiado.**

Antes de atravessar uma fronteira econômica, o servidor pode comparar estado atual, histórico, tempo, progressão, itens e outras evidências para determinar risco e elegibilidade.

---

# 72. Risk Score e Trust Level

## Objetivo

Risk/Trust existe para detectar comportamento anômalo e impedir que um save suspeito alcance sistemas capazes de afetar outros jogadores.

Não é um substituto para autoridade server-side.

## Risk Score

O sistema pode avaliar categorias separadas, como:

- Progression Risk;
- Economy Risk;
- Item Risk;
- Save Integrity Risk;
- Combat Risk;
- Dungeon Risk;
- Protocol Risk.

Um sinal pode possuir:

- categoria;
- gravidade;
- confiança;
- timestamp;
- versão de conteúdo relevante;
- evidência;
- regra de decay quando aplicável.

O valor exato do Risk Score é interno e não deve ser exposto como número operacional ao jogador.

## Trust Level

Trust Level representa quanto histórico confiável existe para permitir acesso a recursos protegidos.

Estados conceituais podem distinguir, por exemplo:

- novo/não verificado;
- normal;
- confiável;
- restrito.

Os nomes finais de UI permanecem A definir.

Conta nova não é automaticamente suspeita; pode apenas possuir pouco histórico.

## Restrições

Risk/Trust elevado pode:

- exigir validação adicional;
- bloquear temporariamente acesso ao Mercado;
- impedir início de Certified Dungeon;
- impedir emissão de Relíquia certificada.

Gameplay local que não ameaça a economia compartilhada não precisa ser bloqueado automaticamente.

Um único score não deve gerar punição irreversível sem contexto suficiente; sinais precisam ser investigáveis e o sistema deve ser desenhado para minimizar falsos positivos.

---

# 73. Certified Dungeons e emissão econômica

Toda Dungeon, rota, dificuldade ou evento capaz de criar uma **Relíquia negociável certificada** exige um save Online elegível e uma execução reconhecida pelo servidor.

Fluxo conceitual:

```text
solicitar conteúdo certificado
↓
validar identidade Online
↓
validar pré-requisitos
↓
validar checkpoint / Risk / Trust
↓
criar CertifiedDungeonRun
↓
servidor determina o resultado econômico válido
↓
se condição de Relíquia for satisfeita
↓
emitir RelicInstance oficial
```

A Certified Dungeon deve possuir autoridade server-side suficiente para impedir que o cliente declare unilateralmente vitória, RNG, dano, drop ou condição econômica.

O cliente continua responsável por apresentação:

- UI;
- animações;
- áudio;
- efeitos;
- input;
- interpolação e feedback visual.

O servidor é responsável pelo que precisa ser confiável para o resultado certificado, incluindo quando aplicável:

- identidade da run;
- seed/RNG oficial;
- regras lógicas da Dungeon;
- regras lógicas do combate;
- resultado;
- condição de emissão de Relíquia.

A estratégia concreta pode utilizar processamento ao vivo, reprodução determinística ou outra técnica, desde que preserve essa propriedade de autoridade.

---

# 74. Relic Registry, propriedade e Mercado

## Relic Registry

Uma Relíquia negociável existe como uma instância oficial emitida pelo servidor.

Campos conceituais mínimos:

```text
RelicInstance
- id
- definition_id
- owner_account_id
- source_run_id
- minted_at
- status
- content_version
```

O identificador pode ser opaco e imprevisível, mas **o identificador por si só não é a prova**. A prova é a existência do registro oficial.

Uma referência inventada no cliente não cria uma Relíquia econômica.

## Provenance

Transferências precisam permitir reconstruir histórico de propriedade quando essa informação fizer parte do produto.

Conceitualmente:

```text
RelicTransfer
- relic_id
- from_account
- to_account
- market_transaction_id
- transferred_at
```

## Estados

Estados mínimos incluem:

- `OWNED`;
- `LISTED`.

Estados adicionais só devem ser criados quando possuírem função real.

Ao ser listada, a Relíquia deve ficar bloqueada para operações incompatíveis até venda ou cancelamento.

## Mercado

O Mercado executa as operações economicamente relevantes no servidor.

Ao listar, comprar, vender ou cancelar, valida:

- identidade da conta;
- Risk/Trust quando aplicável;
- existência da Relíquia;
- proprietário atual;
- status atual;
- saldo certificado quando necessário;
- unicidade/idempotência da solicitação.

Uma compra precisa concluir atomicamente transferência de valor, taxa, mudança de proprietário, mudança de status e histórico, ou não concluir nenhuma dessas alterações.

---

# 75. Princípio de segurança econômica

> **Não é necessário tornar o computador do jogador inviolável; é necessário tornar inviolável a passagem entre o estado local e a economia compartilhada.**

A arquitetura assume que um jogador determinado pode alterar apresentação, memória ou arquivos locais.

A segurança econômica, portanto, não depende de esconder permanentemente um algoritmo no cliente.

Valores secretos, hashes locais, ofuscação e telemetria podem dificultar fraude casual e auxiliar investigação, mas não substituem:

- Certified Dungeon;
- Relic Registry;
- autoridade do Mercado;
- transações atômicas;
- validação de propriedade;
- Risk/Trust como camada adicional.

O objetivo é garantir que uma alteração local não consiga criar valor negociável, duplicar uma Relíquia, transferir propriedade inexistente ou consumir saldo não certificado.