# Game Design Document — Especificação do Jogo

> **Este documento é a fonte canônica das regras de negócio, sistemas, conteúdo e princípios de design do jogo.**
>
> Ele não descreve escopo de builds, valores provisórios de balanceamento, cenários de teste ou critérios de aceite de uma versão específica. Esses itens pertencem aos documentos de build em `docs/builds/`.

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
- **Apple:** simplicidade, consistência, organização visual e experiência de uso.

## Plataformas

Inicialmente previstas:

- Web;
- Desktop;
- Mobile.

2D ou 3D permanece **A definir**.

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

- é negociável;
- possui histórico de donos;
- utiliza o Relicário;
- pode registrar primeiro descobridor e vendas.

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

Filtros, favoritos e bloqueio de itens devem evitar venda/desmontagem acidental.

Capacidades numéricas e limites de stack são dados de economia/UX, não regras estruturais.

---

# 36. Relíquias e mercado

## Relíquias

São exceções ao equipamento normal:

- extremamente raras;
- poderosas;
- identidade/efeito próprios;
- provenance/histórico;
- negociáveis;
- nunca craftáveis.

Somente Relíquias podem ser negociadas entre jogadores.

Algumas podem possuir quantidade global limitada, definida individualmente.

## Mercado

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
Criação
↓
Classe
↓
Presente
↓
Cidade Livre
↓
Taverna
↓
primeira coleta escolhida
↓
primeira produção/preparação
↓
primeiro combate
↓
técnicas básicas
↓
primeiro contrato
↓
Dún Liath
```

## Criação

Mostra principalmente:

- identidade;
- atributos destacados;
- equipamento inicial;
- habilidade inicial.

Mensagem explícita:

> **A classe define apenas o início. Todas as formas de combate poderão ser aprendidas posteriormente.**

## Cidade Livre

Introdução curta e visual. Pode mostrar humanos e monstros sob trégua, comércio e tensão.

Sem lore dump.

## Taverna

Primeira conversa obrigatória curta.

Respostas podem envolver trabalho, dinheiro, fugir do passado ou sobreviver, caracterizando o personagem sem fixar origem canônica.

## Primeira atividade Idle

Escolha livre entre:

1. Mineração;
2. Lenhador;
3. Pesca;
4. Herbologia.

Ensina:

`escolher → iniciar → aguardar → recurso + XP → automático`

## Produção

Primeira preparação útil demonstra o ciclo correspondente à coleta escolhida.

Metalurgia, Forja e Culinária são ensinadas no primeiro uso relevante.

## Primeiro combate

Deve ser um encontro simples que ensina:

- ataque automático;
- Vida/Mana/Stamina;
- habilidade ativa;
- consumível;
- estilos;
- primeiro telegraph simples.

O primeiro inimigo deve preferencialmente ser uma ameaça selvagem ou neutra ao conflito político, para não antecipar a revelação narrativa sobre a inteligência dos monstros.

## Técnicas básicas

Habilidades gerais podem ser aprendidas por contexto e uso dos sistemas, não por uma árvore de habilidades precoce obrigatória.

Antes do primeiro contrato de Dungeon, o personagem deve ter opções suficientes para que os quatro slots ativos sejam um sistema real, ainda que não seja obrigatório preenchê-los todos.

## Contrato de Dún Liath

Antes de entrar, o jogador deve ter oportunidade clara de:

- revisar equipamento;
- revisar habilidades;
- selecionar estilo;
- configurar consumíveis;
- entender o risco da Bolsa de Expedição.

## Regra de diálogo obrigatório

Conversas obrigatórias do onboarding devem devolver controle ao jogador rapidamente; referência de 3–5 falas antes de nova ação do jogador.

> **O jogador aprende jogando.**

---

# 41. UX e interface

## Direção

- minimalista;
- elegante;
- padronizada;
- moderna;
- inspiração Apple em clareza e consistência;
- claramente Game UI, não aplicativo genérico.

## Regras de UX

> **A informação necessária para decidir deve aparecer antes da decisão.**

> **Combate automático deve ser explicável visualmente.**

> **Nenhuma ação manual concede uma ação adicional.**

> **Itens em risco devem ser visualmente distintos dos itens seguros.**

> **Telegraph perigoso deve ser legível antes de ser punitivo.**

> **Valores podem mudar sem exigir reconstrução da hierarquia das telas.**

## Combate

A interface deve permitir observar:

- Vida e recursos;
- ação atual;
- cooldowns;
- condição inválida;
- falta de recurso;
- habilidade escolhida pela automação;
- telegraphs;
- buildup de status;
- log recolhível.

O jogador deve conseguir entender por que uma ação foi escolhida.

## Habilidades

Os quatro slots aparecem em ordem de prioridade real.

A interface mostra:

- categoria;
- perfil;
- custo;
- cooldown;
- requisito;
- condição defensiva quando houver.

## Consumíveis

Slots mostram item, condição automática e estado de cooldown.

A interface informa explicitamente que consumir ocupa a ação atual.

## Dungeon

A navegação mostra:

- sala atual;
- conexões disponíveis;
- rota percorrida;
- bifurcações irreversíveis;
- Bolsa de Expedição;
- itens seguros vs encontrados.

Uma decisão irreversível deve ser comunicada antes da confirmação.

## Matar/Poupar

A interface não usa cores, ícones ou linguagem que classifiquem uma opção como moralmente correta.

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

## Interface

- minimalista;
- elegante;
- padronizada;
- moderna;
- informação hierarquizada;
- inspiração Apple em experiência de uso;
- Game UI reconhecível.

---

# 45. Regras documentais

Este GDD contém somente especificação canônica do jogo.

Devem ficar fora deste arquivo:

- escopo de uma build específica;
- números provisórios exclusivos de playtest;
- cronogramas;
- critérios de entrada/saída de versão;
- matriz de testes;
- resultados de simulações de balanceamento;
- ferramentas temporárias de desenvolvimento.

Esses itens pertencem aos documentos em `docs/builds/`.

Quando uma decisão de build revelar uma nova **regra permanente de negócio**, a regra deve ser promovida para este GDD e reescrita sem referência à build que a originou.

Quando um número continuar sendo apenas baseline de balanceamento de uma versão, ele permanece no documento da build.

---

# 46. Pontos ainda A definir

Continuam deliberadamente em aberto quando não houver decisão canônica:

- nome e slogan do jogo;
- público-alvo formal;
- modelo de monetização;
- custo de desenvolvimento;
- 2D ou 3D;
- fórmulas e números finais de balanceamento;
- limites definitivos de inventário/stack;
- preços finais da economia;
- valores finais de habilidades, consumíveis, inimigos e status;
- limites finais dos buffs de Culinária;
- eficiências exatas dos Prestígios;
- detalhes numéricos de Relíquias e dificuldades avançadas;
- conteúdo da segunda Dungeon e expansões posteriores ainda não desenhadas.

Esses pontos podem ser fechados incrementalmente sem misturar planejamento de versão com a especificação do jogo.