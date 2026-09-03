# Requisitos v1 — Game Design Document

## Nome do jogo

**Nome:** A definir

##### Slogan
_A definir._

---

## Definições gerais

##### Tags
`Idle` `RPG` `Dark Fantasy` `Online` `Economia` `Crafting` `Dungeons` `Marketplace`

##### Ambição
Criar um Idle RPG de longa duração, com progressão profunda, itens extremamente raros e poderosos, exploração de um mundo em decadência e uma interface elegante, simples e padronizada.

O jogo deve ser modular, fácil de manter e preparado para receber novos conteúdos ao longo do tempo.

##### Resumo
O jogador controla um personagem principal que chega a um mundo em caos.

Enquanto tenta sobreviver e evoluir, descobre aos poucos o passado desse mundo, suas eras, povos, conflitos e ruínas.

O personagem poderá desenvolver todas as skills disponíveis, realizar Prestígios, formar uma party com parceiros encontrados durante a jornada, explorar Dungeons procedurais e conquistar Relíquias extremamente raras.

##### Referências
- **Melvor Idle:** progressão por skills e atividades Idle.
- **Dark Souls 1:** atmosfera, início por classe e presente, liberdade de build e mundo decadente.
- **Tolkien:** construção de mundo, povos, eras, conflitos e história antiga.
- **World of Warcraft:** identidade própria de cada Dungeon e Boss.
- **Apple:** simplicidade, consistência, organização visual e experiência de uso.

##### Semelhantes / concorrência
- Melvor Idle
- Idle Clans
- IdleOn
- RuneScape
- Dark Souls

##### Proposta para o mercado de jogos
Principais diferenciais:

- interface elegante e organizada;
- liberdade de build;
- progressão baseada em Prestígio;
- Dungeons procedurais com identidade fixa;
- exploração ativa com risco e recompensa;
- itens extremamente raros e poderosos;
- mercado restrito a itens especiais;
- histórico de donos das Relíquias;
- parceiros com funções únicas;
- mundo com história antiga e acontecimentos atuais;
- estrutura modular e expansível.

##### Proposta de valor
- **Custo de desenvolvimento:** A definir.
- **Modelo de monetização:** A definir.

##### Como se joga
O jogador escolhe atividades, evolui skills, distribui atributos, obtém recursos, fabrica equipamentos, enfrenta inimigos, explora Dungeons e melhora seu personagem.

Exemplo:

```text
Mineração
↓
Obtém recursos
↓
Metalurgia
↓
Produz materiais
↓
Forja
↓
Cria equipamentos
↓
Usa para progredir
```

##### Requisitos
- **Público-alvo:** A definir.
- **Hardware:** requisitos modestos.
- **Condição física:** sem requisitos especiais previstos.

##### Plataformas
Inicialmente:

- Web
- Desktop
- Mobile

---

## Regras do jogo

##### Desafios
O jogador deverá decidir:

- quais skills desenvolver primeiro;
- como distribuir seus atributos;
- quais atividades executar;
- quais recursos guardar;
- o que fabricar;
- quais equipamentos utilizar;
- quando realizar Prestígio;
- como reconstruir sua build após Prestígio;
- quais parceiros levar para uma Dungeon;
- quais caminhos escolher durante uma Dungeon;
- quando arriscar o loot contra o Boss;
- quais Relíquias conservar ou vender.

##### Evolução
O personagem possui:

- nível geral;
- atributos;
- níveis individuais para cada skill;
- Prestígio do personagem;
- Prestígio individual por skill.

Todas as skills ficam disponíveis para o mesmo personagem.

A classe inicial influencia apenas o começo da jornada e não impede o jogador de seguir outros estilos futuramente.

---

## Nível geral e atributos

##### Nível geral
O personagem possui nível geral de **1 a 99**.

A experiência geral poderá vir de uma combinação de:

- atividades;
- combate;
- quests;
- conquistas;
- progressão das skills.

A cada nível geral ganho, o personagem recebe:

> **+1 ponto de atributo.**

##### Atributos
A base de atributos será:

- **Vitalidade:** aumenta Vida.
- **Mente:** aumenta Mana.
- **Vigor:** aumenta Stamina.
- **Força:** melhora armas pesadas e dano físico.
- **Destreza:** melhora armas rápidas, precisão e velocidade.
- **Inteligência:** melhora magias e dano arcano.
- **Fé:** melhora milagres, cura e poderes divinos.

##### Recursos principais
O personagem utilizará somente:

- **Vida**
- **Mana**
- **Stamina**

Relação principal:

```text
Vitalidade → Vida
Mente      → Mana
Vigor      → Stamina
```

Mana não é um recurso exclusivo de Magos.

##### Liberdade de build
A classe define apenas o ponto de partida.

Um Guerreiro poderá investir futuramente em Mente, Inteligência ou Fé e tornar-se mágico ou híbrido. Um Mago poderá investir em Força, Vitalidade ou Vigor e tornar-se um combatente físico.

Regra principal:

> **A classe define o começo, não o destino do personagem.**

##### Requisitos e scaling
Equipamentos, armas e habilidades poderão possuir requisitos de atributos e scaling.

Exemplo:

```text
Espadão do Carrasco
Força necessária: 24
Destreza necessária: 8
```

Exemplo de scaling:

```text
Lâmina Arcana
Força         C
Destreza      D
Inteligência  A
```

A eficiência de um equipamento dependerá da build construída pelo jogador.

---

## Classes

##### Princípio das classes iniciais
Cada classe altera somente:

1. distribuição inicial dos atributos;
2. equipamento inicial;
3. habilidade inicial.

Nenhuma classe bloqueia permanentemente atributos, armas, equipamentos, skills, categorias de habilidade ou caminhos de build.

##### Orçamento inicial de atributos
Todas as classes começam com o mesmo orçamento total de atributos.

Referência atual:

> **35 pontos distribuídos entre os 7 atributos.**

As distribuições individuais abaixo são referências de balanceamento e poderão ser ajustadas depois de validar requisitos de armas, Vida, Mana, Stamina, scaling, habilidades iniciais e dificuldade de Dún Liath.

##### Guerreiro
| Atributo | Referência inicial |
|---|---:|
| Vitalidade | 7 |
| Mente | 2 |
| Vigor | 7 |
| Força | 8 |
| Destreza | 4 |
| Inteligência | 2 |
| Fé | 5 |

Equipamento inicial de referência:
- Espada;
- Escudo;
- armadura física básica.

Habilidade inicial: **Física Agressiva**.

Identidade: combate corpo a corpo, sobrevivência, Força e Vigor.

##### Mago
| Atributo | Referência inicial |
|---|---:|
| Vitalidade | 4 |
| Mente | 8 |
| Vigor | 3 |
| Força | 2 |
| Destreza | 3 |
| Inteligência | 10 |
| Fé | 5 |

Equipamento inicial de referência:
- Cajado;
- vestes básicas.

Habilidade inicial: **Magia Agressiva**.

Identidade: Mana, Inteligência e acesso imediato a combate mágico.

##### Caçador
| Atributo | Referência inicial |
|---|---:|
| Vitalidade | 5 |
| Mente | 3 |
| Vigor | 6 |
| Força | 4 |
| Destreza | 10 |
| Inteligência | 2 |
| Fé | 5 |

Equipamento inicial de referência:
- Arco;
- proteção leve.

Habilidade inicial: **Física Agressiva à distância**.

Identidade: Destreza, precisão e combate à distância.

##### Acólito
| Atributo | Referência inicial |
|---|---:|
| Vitalidade | 5 |
| Mente | 8 |
| Vigor | 4 |
| Força | 3 |
| Destreza | 2 |
| Inteligência | 3 |
| Fé | 10 |

Equipamento inicial de referência:
- arma simples;
- Catalisador;
- vestes.

Habilidade inicial: **Milagre Defensivo**.

O Acólito é a classe cuja primeira habilidade ativa enfatiza diretamente defesa, cura ou suporte.

##### Ladino
| Atributo | Referência inicial |
|---|---:|
| Vitalidade | 4 |
| Mente | 3 |
| Vigor | 7 |
| Força | 3 |
| Destreza | 11 |
| Inteligência | 4 |
| Fé | 3 |

Equipamento inicial de referência:
- Adaga;
- armadura leve.

Habilidade inicial: **Física Agressiva** ligada a crítico ou velocidade.

##### Errante
| Atributo | Referência inicial |
|---|---:|
| Vitalidade | 5 |
| Mente | 5 |
| Vigor | 5 |
| Força | 5 |
| Destreza | 5 |
| Inteligência | 5 |
| Fé | 5 |

Equipamento inicial de referência:
- arma simples e versátil;
- proteção básica.

Habilidade inicial: **Universal**.

Identidade: equilíbrio, sem atributo inicialmente atrasado.

##### Valores ainda não finais
Nomes e efeitos exatos dos equipamentos e habilidades iniciais permanecem **A definir** para o balanceamento final. A Build de Validação 0.1 usa fichas provisórias específicas registradas na seção de Build de Validação deste GDD. Os valores das distribuições individuais permanecem referências para balanceamento.

---

## Presentes iniciais

Regra principal:

> **A classe define como o personagem começa a lutar; o presente define uma pequena vantagem, conveniência ou curiosidade com a qual ele começa a jornada.**

Existirão sete opções:

| Presente | Função principal |
|---|---|
| **Chave Enferrujada** | exploração e segredo |
| **Bolsa de Moedas** | vantagem econômica inicial |
| **Frasco Carmesim** | sobrevivência emergencial |
| **Anel do Viajante** | pequeno bônus versátil enquanto equipado |
| **Pedra Sem Nome** | lore e conteúdo secreto |
| **Kit de Sobrevivência** | início confortável com consumíveis normais |
| **Nenhum Presente** | escolha narrativa |

##### Chave Enferrujada
Chave antiga cuja fechadura não é explicada no começo. Pode abrir antecipadamente uma sala, cofre, caminho ou evento opcional. A recompensa deve ser interessante, mas nunca obrigatória.

Em Dún Liath, poderá permitir acesso antecipado ao **Alojamento do Oficial**. Jogadores que não escolheram a chave poderão encontrar outra forma de acesso posteriormente.

##### Bolsa de Moedas
Concede dinheiro adicional no início. Quantidade **A definir**. Sua vantagem perde importância naturalmente conforme a economia cresce.

##### Frasco Carmesim
Consumível raro de emergência. Efeito exato **A definir**. Não concede progresso permanente e poderá ser obtido novamente no mundo.

##### Anel do Viajante
Equipamento inicial fixo que aumenta, enquanto equipado:
- Vida máxima;
- Mana máxima;
- Stamina máxima.

Valores **A definir**.

Ocupa um slot normal de Anel, não é Relíquia e deve ser naturalmente substituído pela progressão.

##### Pedra Sem Nome
Objeto mineral incomum ligado potencialmente a quest secreta, diálogo, evento de Dungeon, civilização antiga ou lore. Não concede vantagem obrigatória.

##### Kit de Sobrevivência
Conjunto de consumíveis normais. Composição e quantidade **A definir**. Tudo no kit deve ser normalmente obtível.

##### Nenhum Presente
Não concede bônus escondido nem recompensa secreta automática.

##### Limites dos presentes
Presentes não podem conceder:
- Relíquia;
- material obrigatório de upgrade +2;
- habilidade permanentemente exclusiva;
- ponto permanente de atributo;
- Ponto de Prestígio;
- bônus permanente de XP;
- item globalmente limitado;
- equipamento destinado a dominar grande parte da progressão.

---

## Skills

##### Filosofia
O jogo terá poucas skills, porém cada uma representará uma profissão ampla e profunda. A complexidade virá de atividades, técnicas, receitas, materiais, Prestígios e conteúdos desbloqueados, não da criação excessiva de skills semelhantes.

##### Skills principais
Exatamente sete:

1. **Mineração**
2. **Lenhador**
3. **Pesca**
4. **Herbologia**
5. **Metalurgia**
6. **Forja**
7. **Culinária**

Técnicas internas não são novas skills. Forja, por exemplo, pode incluir Ferraria, Couraria, Tecelagem, Arquearia e Ourivesaria.

##### Regra global das atividades Idle

> **Atividades Idle não geram drops secundários aleatórios. Cada atividade entrega apenas seu recurso ou produto definido, além de XP e possíveis unidades adicionais desse mesmo resultado. Materiais especiais devem possuir fontes explícitas de obtenção.**

Nas skills de coleta:

```text
Escolher recurso específico
↓
aguardar a ação
↓
receber recurso escolhido + XP
↓
repetir automaticamente
```

A quantidade-base normal é **1 unidade garantida por ciclo**. Ferramentas, Prestígios e outros efeitos podem conceder unidades adicionais do mesmo resultado.

Não existirão como efeito colateral aleatório do Idle: gemas, sementes, resinas, escamas, pós, componentes raros ou materiais secretos desconectados da atividade escolhida.

##### Fontes explícitas para materiais especiais
Materiais raros ou especiais poderão vir de:
- atividades próprias desbloqueáveis;
- receitas;
- Dungeons;
- Bosses;
- eventos;
- exploração;
- quests;
- conteúdos de Prestígio.

O jogador deve conseguir descobrir onde buscar um material.

##### Produção
Metalurgia, Forja e Culinária utilizam receitas:

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

Produção normal não falha. Produtos intermediários são receitas ou atividades explícitas, nunca subprodutos aleatórios.

##### Ferramentas de coleta
Separadas dos equipamentos de combate e sem durabilidade:
- Mineração → picareta;
- Lenhador → machado de corte;
- Pesca → equipamento de pesca;
- Herbologia → Kit de Herbologia.

Metalurgia e Culinária não possuem ferramenta equipável própria. Forja é uma skill de produção.

Ferramentas focam em:
- velocidade;
- quantidade;
- chance de unidade adicional do mesmo resultado;
- XP da skill.

Fontes de ferramentas:
1. Forja;
2. Dungeons.

Ferramentas normais usam raridade procedural:

```text
Comum      → 1 atributo
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Upgrade:

```text
+0 → +1 → +2
```

Sem falha, sem rerroll procedural, sem dinheiro e sem durabilidade. +2 exige ao menos um componente especial de Dungeon, Boss ou evento.

##### Minigames
Cada skill possui minigame temático periódico e opcional.

> **O Idle gera a oportunidade; a interação ativa permite aproveitá-la melhor.**

O progresso da oportunidade pode acumular offline. Limite exato **A definir**.

Bom desempenho concede bônus temporário de eficiência, velocidade, quantidade, chance de unidade adicional do mesmo resultado ou XP. Não existe pool de drops raro próprio.

Direções:
- Mineração → pontos de fraqueza da rocha;
- Lenhador → direção/timing de cortes;
- Pesca → fisgada e tensão da linha;
- Herbologia → **Identificação e Extração**;
- Metalurgia → **Controle de Fundição**;
- Forja → **Martelamento**;
- Culinária → **Sequência e Timing**.

Desempenho ruim não faz a produção Idle normal falhar.

##### Prestígio de Skill
Cada skill possui nível 1–99 e Prestígio I–III.

Ao prestigiar, a skill volta ao nível 1, mas seu antigo endgame torna-se o novo ponto de entrada.

> **O antigo endgame se torna o novo início.**

A progressão fica mais longa a cada Prestígio e amplia recursos, atividades, receitas, técnicas, equipamentos, possibilidades mecânicas e conexões com o mundo.

##### Evolução mecânica das atividades por Prestígio

```text
Normal        → 1 atividade ou linha
Prestígio I   → 2 simultâneas
Prestígio II  → 2 simultâneas + prioridade avançada
Prestígio III → 3 simultâneas
```

Prestígio I: atividade principal em eficiência de referência completa e secundária em eficiência reduzida. Percentuais **A definir**.

Prestígio II oferece configurações:
- Equilibrado;
- Prioridade Principal;
- Prioridade Secundária.

Percentuais **A definir**.

Prestígio III permite três atividades individualmente desbloqueadas. Eficiências **A definir**.

Nomes temáticos do P1:
- Mineração — Extração Dupla;
- Lenhador — Corte Duplo;
- Pesca — Linha Dupla;
- Herbologia — Coleta Dupla;
- Metalurgia — Fundição Paralela;
- Forja — Produção Paralela;
- Culinária — Preparo Paralelo.

Regra:

> **Prestígio deve mudar a forma de executar a skill, não apenas aumentar números.**

---

## Convenção de nomenclatura do mundo

Recursos e nomes culturalmente importantes podem usar idiomas inspirados nas tradições do universo, principalmente irlandês para a vertente céltica e islandês/nórdico quando outra camada histórica ou cultural justificar.

O mundo não representa literalmente Irlanda ou Islândia.

Regras:

> **Nome diferente, visual familiar.**

> **A mesma coisa sempre recebe o mesmo nome.**

> **Nunca usar uma palavra estrangeira quando ela só torna uma informação de sistema mais difícil de entender.**

> **A origem linguística de um nome pode funcionar como pista cultural ou histórica.**

Termos funcionais permanecem em português: Mineração, Forja, Prestígio, Vida, Ameaça, Fácil, Normal etc.

Descrições e efeitos permanecem em português.

A escolha linguística não deve ser aleatória. Nomes sobrenaturais, históricos, divinos ou míticos representam associações culturais e não provam a origem objetiva do recurso ou a existência literal da tradição.

##### Inimigos, Bosses e locais importantes
A mesma filosofia vale para Bosses, inimigos importantes, locais antigos e itens de lore:

- nome cultural coerente com a camada histórica do conteúdo;
- significado real quando possível;
- título funcional em português quando ajudar a leitura;
- nunca utilizar pseudo-fantasia aleatória apenas para parecer exótico.

Regra prática:

> **O nome pode ser estranho; a função precisa ser compreensível.**

Exemplos já definidos:
- **Dún Liath — A Fortaleza Cinzenta**;
- **Fairtheoir — O Último Vigia**;
- **Cosantóir — Protetor da Passagem**.

---

## Mineração

Progressão temática:

```text
Normal        → Natureza
Prestígio I   → Sobrenatural
Prestígio II  → Guerra
Prestígio III → Divindades
```

> **terra → sobrenatural → história → mito**

##### Normal
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

##### Prestígio I
| Nível | Recurso |
|---:|---|
| 1 | Grianchloch |
| 15 | Scáth |
| 30 | Gealach |
| 45 | Fuil |
| 60 | Cuimhne |
| 75 | Anam |
| 90 | Réalta |

##### Prestígio II
| Nível | Recurso |
|---:|---|
| 1 | Réalta |
| 15 | Cath |
| 30 | Luaith |
| 45 | Mionn |
| 60 | Créacht |
| 75 | Fothrach |
| 90 | Cogadh |

Leitura: **Batalha → Cinzas → Juramentos → Feridas → Ruínas → Guerra**.

##### Prestígio III
| Nível | Recurso |
|---:|---|
| 1 | Cogadh |
| 15 | Brigid |
| 30 | Nuada |
| 45 | Goibniu |
| 60 | Lugh |
| 75 | Mórrigan |
| 90 | Dagda |

Os nomes divinos são associações culturais, não confirmação objetiva de divindades.

Regra:

> **Um material possui função econômica e de crafting própria; nível de desbloqueio não representa uma escala absoluta de superioridade.**

---

## Lenhador

```text
Normal        → Floresta Natural
Prestígio I   → Floresta Sobrenatural
Prestígio II  → Eras Antigas
Prestígio III → Árvores Sagradas
```

##### Normal
`Giúis → Beith → Fearn → Saileach → Coll → Fuinseog → Dair → Iúr`

Níveis: `1, 10, 20, 30, 45, 60, 75, 90`.

##### Prestígio I
`Iúr → Ceo → Oíche → Draíocht → Aisling → Spiorad → Síoraí`

Níveis: `1, 15, 30, 45, 60, 75, 90`.

##### Prestígio II
`Síoraí → Treibh → Dún → Ríocht → Ríshliocht → Oidhreacht → Seanchas`

Leitura histórica: **povos → fortalezas → reinos → dinastias → herança → história**.

##### Prestígio III
`Seanchas → Bile → Eó Mugna → Bile Tortan → Eó Rossa → Craeb Dáithí → Craeb Uisnig`

Recursos antigos continuam relevantes em receitas de endgame.

---

## Pesca

```text
Normal        → Águas Naturais
Prestígio I   → Águas Sobrenaturais
Prestígio II  → Mar de Guerra
Prestígio III → Lendas das Águas
```

##### Normal
`Scadán → Breac → Sairdín → Ronnach → Trosc → Bradán → Tuinnín → Doingean`

Níveis: `1, 10, 20, 30, 45, 60, 75, 90`.

##### Prestígio I
`Doingean → Tonn → Solas → Taibhse → Lasair → Stoirm → Doimhneacht`

##### Prestígio II
`Doimhneacht → Ancaire → Cabhlach → Ruathar → Raic → Báite → Uaigh`

##### Prestígio III
`Uaigh → Each Uisce → Dobhar-chú → Murúch → Tarbh Uisce → Ollphéist → Muirdris`

Regra narrativa:

> **A cultura dá nome ao desconhecido; o nome não prova que a lenda seja verdadeira.**

Regra de função:

> **O peixe determina a função da receita, não apenas sua potência.**

---

## Herbologia

```text
Normal        → Flora Natural
Prestígio I   → Flora Sobrenatural
Prestígio II  → Flora do Norte: Fogo e Gelo
Prestígio III → Oráculos e Destino
```

##### Normal
`Neantóg → Seamair → Caisearbhán → Fraoch → Aiteann → Raithneach → Sáiste → Marós`

##### Prestígio I
`Marós → Drúcht → Suan → Cogar → Rún → Beatha → Bás`

##### Prestígio II
A nomenclatura passa à vertente islandesa/nórdica por coerência cultural com terras frias e vulcânicas:

`Bás → Mosi → Þoka → Ís → Aska → Hraun → Eldur`

##### Prestígio III
`Eldur → Seiður → Völva → Urðr → Verðandi → Skuld → Örlög`

Os nomes representam associações culturais, sem confirmar literalmente mitos ou forças sobrenaturais.

Minigame: **Identificação e Extração**.

Ferramenta: **Kit de Herbologia**.

---

## Metalurgia

Regra:

> **Mineração descobre os materiais. Metalurgia descobre o que é possível fazer com eles.**

A mesma matéria mantém sua identidade quando apenas processada: `Iarann → Lingote de Iarann`. Um nome novo aparece quando o processo cria um material realmente novo, como uma liga.

Sem subprodutos aleatórios e sem ferramenta equipável própria.

##### Normal
1. Cloch Tratada
2. Lingote de Stán
3. Lingote de Copar
4. Cré-Umha
5. Fundição Pesada
6. Cruach
7. Metais Nobres
8. Grianchloch Refinado

Marcos: `1, 10, 20, 30, 45, 60, 75, 90`.

##### Prestígio I
`Grianchloch Refinado → Liga de Scáth → Liga de Gealach → Liga de Fuil → Cuimhne Estabilizado → Liga de Anam → Liga de Réalta`

##### Prestígio II
`Liga de Réalta → Liga de Cath → Vidro de Luaith → Liga de Mionn → Liga de Créacht → Fothrach Reforçado → Liga de Cogadh`

##### Prestígio III
`Liga de Cogadh → Liga de Brigid → Liga de Nuada → Liga de Goibniu → Liga de Lugh → Liga de Mórrigan → Liga de Dagda`

Minigame: **Controle de Fundição**.

---

## Forja

Regra:

> **Metalurgia cria os materiais. Forja transforma esses materiais em possibilidades de build.**

Forja inclui técnicas internas como Ferraria, Couraria, Tecelagem, Arquearia e Ourivesaria.

##### Normal
`Trabalho Básico → Reforços e Couraria → Tecelagem → Arquearia → Ferraria Avançada → Ourivesaria → Construção Híbrida → Obra-Prima`

##### Prestígio I
`Reforço Sobrenatural → Vinculação → Condução → Têmpera Reativa → Estrutura Híbrida → Forja Espiritual → Obra-Prima Sobrenatural`

##### Prestígio II
`Forja de Campanha → Reforço Militar → Têmpera de Cinzas → Construção de Juramento → Lâmina de Ferida → Reconstrução Antiga → Obra-Prima de Guerra`

##### Prestígio III
`Forja Ancestral → Obra Sagrada → Precisão Absoluta → Forja Magistral → Obra Híbrida Superior → Forja de Lenda → Obra-Prima Absoluta`

> **Mesmo o melhor item fabricado no Prestígio III continua sendo um equipamento normal e nunca uma Relíquia.**

Receitas podem vir de progressão, Dungeons, Bosses, NPCs, quests, exploração, segredos e eventos. Chegar ao nível máximo não significa conhecer todas as receitas.

Equipamentos fabricados usam:

```text
RECEITA + MATERIAL + RARIDADE PROCEDURAL = EQUIPAMENTO FINAL
```

Forja é a fonte regular de todas as ferramentas de coleta; Dungeons são a única outra fonte definida.

Minigame: **Martelamento**.

---

## Culinária

Regra:

> **Culinária transforma os recursos acumulados pelo jogador em preparação para aquilo que ele pretende enfrentar.**

Tipos:
- Refeição;
- Bebida;
- Poção;
- Elixir;
- Antídoto;
- Preparado especial.

Buffs da mesma família não acumulam; prevalece o efeito válido mais forte. Famílias diferentes podem combinar. Limites exatos **A definir**.

##### Normal
`Preparo Básico → Conservação → Infusão → Cozimento Composto → Extração → Refeição Completa → Elixires → Grande Preparo`

##### Prestígio I
`Preparo Sobrenatural → Infusão Superior → Concentração Arcana → Neutralização → Preparo Híbrido → Elixir Espiritual → Grande Preparo Sobrenatural`

##### Prestígio II
`Ração de Campanha → Conservação Extrema → Tônico de Marcha → Medicina de Campo → Refeição de Companhia → Preparo de Cerco → Banquete de Guerra`

##### Prestígio III
`Preparo Ancestral → Mesa dos Povos → Essência Perfeita → Preparo Condicional → Grande Banquete → Receita Perdida → Banquete de Lenda`

Consumíveis não usam raridade procedural: a mesma receita gera o mesmo item e efeito. Não concedem aumento permanente de atributo.

Culinária não possui ferramenta equipável própria. Sua localização diegética permanece **A definir** e não exige nova estrutura inicial na Cidade Livre.

Minigame: **Sequência e Timing**.

---

## Crafting, receitas e equipamentos fabricados

Metalurgia, Forja e Culinária fazem parte da progressão Idle.

Receitas avançadas podem exigir múltiplas skills, materiais de várias camadas de progressão e componentes de Dungeon/Boss quando explicitamente definido.

Relíquias nunca podem ser fabricadas.

Upgrade +1 pode usar materiais normais de atividades, produção, inimigos e Dungeons.

Upgrade +2 exige pelo menos um material especial proveniente de Dungeon, Boss ou evento.

Desmontar equipamento concede somente dinheiro e não é fonte de materiais.

---

## Prestígio do personagem

##### Requisito
Só é liberado quando **todas as skills possuem pelo menos Prestígio I**.

##### Funcionamento
Prestígio I–III.

Ao prestigiar:
- nível geral volta a 1;
- pontos normais de atributo podem ser reconstruídos/redistribuídos ao longo da nova jornada;
- progresso permanente permanece;
- Árvore de Prestígio permanece.

Cada Prestígio concede **5 Pontos de Prestígio**, máximo **15**.

##### Estrutura da Árvore
32 nós:
- Corpo: 6;
- Arcano: 6;
- Espírito: 6;
- Técnica: 6;
- híbridos: 8.

Custo dos seis nós de cada ramo:

`1 → 1 → 2 → 2 → 2 → 2`

Um ramo completo custa 10.

Um especialista completo gasta 10 e mantém 5 para suporte.

##### Híbridos
Quatro combinações iniciais:
1. Corpo + Arcano;
2. Corpo + Espírito;
3. Técnica + Arcano;
4. Técnica + Espírito.

Híbrido I custa 1 e exige 3 nós de cada ramo. Chegada: `4 + 4 + 1 = 9`.

Híbrido II custa 2 e exige Híbrido I + 4 nós de cada ramo. Híbrido completo: `6 + 6 + 1 + 2 = 15`.

O híbrido completo abre mão dos nós 5 e 6/capstones puros de seus ramos.

Regras de balanceamento:

> **Capstones puros devem representar a melhor expressão daquela especialização.**

> **Híbridos completos devem ser competitivos quando utilizam corretamente os dois lados da combinação.**

> **Um híbrido que ignora metade de sua mecânica deve ser inferior ao especialista correspondente.**

> **Nenhuma combinação deve ser obrigatória para alcançar o melhor desempenho geral do jogo.**

Referência conceitual: especialista bem utilizado = 100% de referência em seu papel; híbrido pode superar levemente em condições ideais da própria sinergia, sem ser geralmente superior.

##### Corpo
1. **Constituição — 1:** Vida máxima.
2. **Fôlego de Guerra — 1:** Stamina máxima e recuperação.
3. **Ímpeto — 2:** Física Agressiva concede eficiência física temporária; efeito exato **A definir**.
4. **Inabalável — 2:** golpe relevante em relação à Vida máxima concede redução temporária de dano; pequenos golpes repetidos não ativam como golpe pesado.
5. **Segundo Fôlego — 2:** uma vez por combate, condição crítica recupera Vida e Stamina; não é ressurreição.
6. **Último Bastião — 2:** capstone; Vida menor concede resistência e recuperação de Stamina progressivas e limitadas.

##### Arcano
1. **Reserva Mental — 1:** Mana máxima.
2. **Fluxo Arcano — 1:** regeneração de Mana.
3. **Canalização — 2:** diferentes Magias em sequência fortalecem eficiência da próxima; repetição não recebe valor completo.
4. **Ressonância — 2:** sequência diversa acumula Ressonância até limite e melhora eficiência mágica.
5. **Reserva Arcana — 2:** uma vez por combate em Mana crítica, recuperação ou janela excepcional; forma **A definir**.
6. **Sobrecarga — 2:** capstone; Ressonância máxima permite Magia Sobrecarregada, consumindo preparação e, quando apropriado, Mana adicional.

Loop: `rotacionar → Ressonância → Sobrecarga → reconstruir`.

##### Espírito
1. **Convicção — 1:** Fé.
2. **Graça Restauradora — 1:** cura realizada.
3. **Resistência Espiritual — 2:** resistência ao buildup de Veneno, Sangramento, Atordoamento, Queimadura e Congelamento; sem imunidade automática.
4. **Intercessão — 2:** overheal parcialmente convertido em proteção temporária limitada.
5. **Vínculo de Companhia — 2:** efeitos defensivos/suporte podem beneficiar parcialmente outros membros da party, em potência menor.
6. **Comunhão — 2:** capstone; cura/proteção excedente parcialmente redirecionada ao membro mais necessitado; equivalente Solo para não ser inútil.

##### Técnica
1. **Mão Firme — 1:** Precisão.
2. **Golpe Preciso — 1:** chance de crítico.
3. **Ritmo de Combate — 2:** diferentes ativos em sequência geram Ritmo.
4. **Oportunismo — 2:** críticos aceleram ou preservam Ritmo, com limites.
5. **Execução — 2:** contra inimigos em Vida baixa, crítico recebe efeito adicional; forma **A definir**.
6. **Mestre do Ritmo — 2:** capstone; Ritmo máximo fortalece próximo ativo e é consumido.

Loop: `sequência → crítico/Ritmo → Ritmo máximo → ativo fortalecido → reinício`.

##### Corpo + Arcano
**Arma Encantada — 1:** Física Agressiva fortalece próxima Magia.

**Guerreiro Arcano — 2:** interação bidirecional `Física ↔ Magia`. É nome do caminho, não nova classe.

##### Corpo + Espírito
**Zelo — 1:** habilidade Defensiva ligada a Fé/suporte fortalece próxima ação Física apropriada.

**Bastião Sagrado — 2:** ações físicas geram Guarda limitada; Milagre/defesa apropriado consome Guarda para fortalecer proteção ou cura. Nome de caminho, não classe.

##### Técnica + Arcano
**Lâmina Arcana — 1:** crítico físico fortalece próxima Magia.

**Conjuração Rápida — 2:** Magia fortalecida abre janela para ação física precisa. Limites evitam loops infinitos. Identidade mais rápida/frágil que Corpo + Arcano.

##### Técnica + Espírito
**Golpe de Convicção — 1:** crítico fortalece próximo Milagre.

**Inquisidor — 2:** Milagre apropriado fortalece próxima ação física precisa, podendo interagir com Sagrado. Nome de caminho, não classe.

Corpo + Técnica e Arcano + Espírito não possuem caminho exclusivo inicialmente por já terem sobreposição natural e não haver identidade mecânica suficientemente distinta.

---

## Progressão offline

O limite de atividade offline aumenta em **2 horas a cada 10 níveis gerais**.

A quantidade-base inicial de horas permanece **A definir**.

O progresso para oportunidades de minigame pode acumular offline, respeitando limites ainda **A definir**.

---

## Combate

##### Conceito
Combate automático em tempo real.

Ataques básicos são automáticos. Cada arma possui intervalo próprio.

> **O jogador não precisa executar cada ataque, mas sua preparação e suas escolhas devem determinar o resultado.**

##### Habilidades ativas
Até **4 slots ativos**.

Combinação livre, respeitando apenas requisitos individuais.

Categorias:
1. Físicas;
2. Magias;
3. Milagres;
4. Híbridas;
5. Universais.

A classe inicial nunca restringe categorias.

##### Perfil das habilidades
Cada habilidade ativa é obrigatoriamente:
- **Agressiva**; ou
- **Defensiva**.

Não existe Perfil Misto em uma habilidade individual.

##### Estilo de combate
- **Agressivo:** prioriza perfis Agressivos;
- **Defensivo:** prioriza perfis Defensivos;
- **Misto:** alterna dinamicamente conforme estado do personagem/party.

> **O jogador escolhe as habilidades da build e o estilo de combate determina como a automação prioriza seu uso.**

##### Uso automático
Um ativo pode ser usado quando:
- cooldown terminou;
- recurso suficiente existe;
- requisitos são atendidos;
- estilo de combate o prioriza.

##### Consumíveis
Uso manual ou automático, incluindo condições como limiar de Vida.

##### Morte fora de Dungeons
Retorno à Cidade Livre e perda de dinheiro calculada conforme nível. Fórmula **A definir**. O dinheiro é destruído como sink.

---

## Inimigos e Bosses

##### Categorias
Exatamente:
1. **Comum**
2. **Elite**
3. **Boss**

Sem categoria separada de mini-Boss inicialmente.

##### Ficha-base
- Nome;
- Tipo;
- Vida;
- Ataque;
- Defesa;
- velocidade de ataque;
- fraquezas/resistências;
- habilidades;
- drops.

##### Tipos de dano
Exatamente:
- Corte;
- Perfuração;
- Impacto;
- Fogo;
- Gelo;
- Arcano;
- Sagrado.

##### Resistências
Leitura padrão:
- Fraco;
- Normal;
- Resistente;
- Muito Resistente;
- Imune.

Modo avançado poderá mostrar percentuais reais. Valores finais **A definir**; a Build 0.1 possui percentuais provisórios de teste definidos na seção da Build de Validação.

##### Status
Exatamente:
- Veneno;
- Sangramento;
- Atordoamento;
- Queimadura;
- Congelamento.

Usam buildup em barras. Ao atingir o limite, o efeito ativa, a barra reseta e o alvo recebe resistência temporária ao mesmo efeito. Acúmulo pode decair sem aplicação.

Bosses usam o mesmo sistema e não são automaticamente imunes por serem Bosses.

##### Telegraph
Ataques perigosos devem comunicar:
- nome;
- barra de preparação/conjuração quando aplicável;
- ícone/efeito;
- destaque de perigo;
- registro curto de combate.

Regra:

> **Quanto mais perigosa uma habilidade, mais legível ela deve ser.**

##### Fases de Boss
Quantidade individual. Fases devem mudar comportamento, habilidades ou dinâmica, não apenas números.

##### Dificuldade
Dificuldades maiores podem mudar ataques, resistências, Elites, fases, comportamento, recuperação, status, composições e loot.

> **Dificuldades maiores devem introduzir novas exigências mecânicas e estratégicas, não apenas aumentar atributos.**

##### Loot
Comuns sustentam progressão normal com dinheiro, consumíveis, materiais apropriados e equipamento procedural.

Elites aumentam qualidade/chance e podem possuir receitas ou materiais específicos quando houver função real.

Bosses podem conceder equipamentos temáticos, materiais exclusivos, receitas, habilidades, lore, materiais +2 e condições de Relíquia.

Todo Boss concede pelo menos **um recurso exclusivo garantido por vitória**.

##### Ameaça / Aggro
Em party, dano, cura, suporte e habilidades podem gerar Ameaça. Regra padrão: inimigo tende a atacar o personagem de maior Ameaça.

Habilidades podem aumentar/reduzir Ameaça ou Provocar. Bosses podem ganhar resistência temporária a Provocações repetidas.

Ataques podem usar regras alternativas e ignorar Ameaça explicitamente.

Interface padrão mostra alvo atual e mudanças de foco; modo avançado pode mostrar percentuais.

##### Recompensas por dificuldade
Dificuldades maiores melhoram loot existente e podem adicionar conteúdo exclusivo.

A primeira conclusão de cada dificuldade garante pelo menos **uma recompensa especial**.

---

## Party e parceiros

##### Party
Dungeons em Party usam:
- personagem principal;
- até 3 parceiros.

Parceiros são substituíveis/removíveis.

##### Parceiros
São NPCs fixos e únicos, com identidade narrativa e mecânica própria. Não possuem sistema completo de nível/skills igual ao personagem principal.

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

Relação pode liberar passivas, habilidades, diálogos, quests, lore e utilidade.

Não há romance.

Alguns parceiros futuros poderão abandonar a party conforme suas regras narrativas; isso não significa desaparecer permanentemente do mundo. **Mira é uma exceção explícita e não abandona a party por discordância.**

Regra:

> **O primeiro encontro de um parceiro deve demonstrar quem ele é antes de explicar sua ficha.**

---

## Mira

##### Identidade
Primeira parceira recrutável.

- mulher humana;
- ex-soldado da Ordem de Ferro;
- arqueira;
- deixou oficialmente a Ordem;
- sofreu preconceito e sexismo no exército;
- provou sua capacidade e venceu batalhas por mérito próprio;
- após sair, ficou sem dinheiro e passou a explorar Dungeons por loot e sobrevivência;
- não possui arco de vingança contra antigos soldados.

Mira inicia com preconceitos contra monstros derivados da cultura humana, formação militar e experiências reais de guerra. Sua visão muda gradualmente, sem a narrativa afirmar que tudo que ela viu anteriormente era falso.

Ela nunca abandona a party por discordância, mas pode questionar, desaprovar e mudar de postura.

Passiva exclusiva:

> **Olho de Caçadora — aumenta a chance de crítico de todos os membros da party.**

##### Introdução oficial
Mira entra **depois de Dún Liath**, durante a segunda Dungeon, que será a primeira experiência em Party.

Fluxo:

```text
Jogador entra sozinho na segunda Dungeon
↓
encontra sinais de outro explorador
↓
encontra Mira combatendo sozinha
↓
cooperação pragmática
↓
Mira entra como Parceira Temporária
↓
tutorial contextual de Party e Aggro
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

Mira não é resgatada: ao ser encontrada, está lutando e sobrevivendo por conta própria, ainda que gastando recursos.

A cooperação inicial ocorre por conveniência e sobrevivência, não amizade imediata.

O tutorial nesse momento apresenta apenas o necessário: Party, alvo/Aggro e Olho de Caçadora.

Um encontro específico deve demonstrar troca de alvo conforme Mira gera Ameaça.

A primeira divergência narrativa deve mostrar seu preconceito sem torná-la caricata. Ela pode favorecer eliminar uma ameaça que o jogador decide ignorar/poupar e ainda assim continuar a missão.

Após o Boss, Mira inicialmente segue seu próprio caminho. Na Taverna, torna-se recrutável. Se o jogador não convidá-la na primeira oportunidade, poderá recrutá-la posteriormente.

O tutorial completo de relacionamento só aparece depois do recrutamento oficial.

##### Progressão e quest pessoal
Mira não usa um sistema completo de níveis. A relação desbloqueia gradualmente novas capacidades.

Sua quest pessoal trata de identidade, propósito e vida depois de servir uma guerra que ela começa a questionar — não de vingança.

---

## Dungeons — regras gerais

##### Conceito
Expedições com combate automático, caminhos, eventos, escolhas, armadilhas, segredos e Boss.

O jogador controla principalmente preparação, party e decisões de exploração.

##### Identidade fixa e execução procedural
Cada Dungeon representa um local fixo do mundo, com temática, inimigos, eventos, segredos, recompensas e Boss único.

Sua estrutura interna pode variar por run.

> **A geração procedural muda o caminho, mas nunca contradiz a história do local.**

##### Tamanho
Solo inicial: **15–20 salas**.

Party inicial: **30–40 salas**.

Dungeons posteriores podem crescer aproximadamente 2–4 salas por etapa.

O jogador não sabe o número exato antes de concluir a run.

##### Caminhos
Bifurcações possuem descrições ambientais e são irreversíveis por run. Não existe backtracking. Nova tentativa regenera a estrutura.

Descrições devem fornecer risco/contexto, não revelar diretamente `Tesouro`, `Elite`, `melhor caminho` etc.

##### Salas
- combate;
- Elite;
- evento;
- recuperação;
- tesouro;
- armadilha;
- secreta;
- Boss.

##### Recuperação
Não é checkpoint seguro. Pode restaurar Vida, Mana, Stamina e outros recursos de combate. Não protege o loot.

Troca de equipamentos dentro de Dungeon só é permitida em salas de recuperação.

##### Armadilhas
Podem causar dano, status/debuff, consumir recursos, iniciar combate, bloquear caminhos ou ativar eventos.

Detecção/contorno pode depender de parceiro, atributo, skill, equipamento ou item.

##### Requisitos especiais
Podem abrir vantagens, atalhos, conteúdo opcional ou segredos por atributo, skill, chave, parceiro, equipamento ou item.

> **Nenhuma geração pode exigir uma condição que o jogador não possui para chegar ao Boss.**

A rota de conclusão sempre existe.

##### Eventos persistentes
Podem revelar personagens, abrir quests, alterar relações, serviços ou acontecimentos futuros.

##### Segredos
Difíceis e opcionais. O jogador pode concluir a Dungeon muitas vezes sem encontrar tudo.

As melhores recompensas ativas podem estar ligadas a salas/eventos secretos ou Boss.

##### Bolsa de Expedição
Loot da run permanece separado. Morte perde tudo obtido naquela tentativa e preserva o que o jogador possuía antes de entrar.

##### Retirada
Não é permitida livremente com loot. Antes do Boss existe decisão:

```text
Retornar à Cidade Livre
→ mantém loot da expedição

Enfrentar Boss
→ arrisca todo o loot
→ acessa recompensas finais
```

##### Dificuldades
Exatamente:
1. Fácil;
2. Normal;
3. Difícil;
4. Impossível.

Desbloqueio sequencial.

##### Incursão Automática
Modo separado, não quinta dificuldade. Liberado após conclusão/requisito apropriado.

Possui preset, duração, chance de sucesso e recompensas úteis. Falha não entrega recompensas esperadas.

Melhores segredos, conteúdo de exploração e recompensas especiais de Boss/Relíquia permanecem exclusivos da atividade quando definido.

---

# Dún Liath — A Fortaleza Cinzenta

## Papel
Primeira Dungeon oficial do jogo e primeira grande validação integrada de combate, exploração, risco/recompensa e narrativa.

É uma Dungeon **Solo**. Mira e Party entram posteriormente.

Regra central:

> **A primeira Dungeon ensina mecânica através de exploração e narrativa através de contradição.**

Regra narrativa:

> **A primeira Dungeon não revela a verdade; ela apenas cria a primeira rachadura na versão que o jogador recebeu.**

## Identidade do local
Dún Liath é uma antiga fortificação militar humana próxima à Cidade Livre, construída em posição costeira e exposta a chuva, neblina, vento, sal e mar frio.

Identidade visual:

> **pedra molhada + mar frio + ferrugem + neblina**

Possui muralhas quebradas, torre de vigia, portão danificado, penhasco, mar ao fundo e estruturas que descem para a rocha.

A fortificação controlava historicamente uma estrada costeira, suprimentos, aproximações à Cidade Livre e movimentos militares.

O local possui camadas de diferentes períodos:

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

Regra visual:

> **Construções antigas devem parecer ter história, não terem sido erguidas apenas para funcionar como fase.**

## Situação atual
Humanos afirmam que monstros tomaram a fortificação.

Na realidade, uma pequena comunidade monstruosa usa as ruínas para sobreviver e se proteger.

As barricadas recentes estão orientadas **contra a entrada**, sugerindo defesa contra invasores.

A leitura da Dungeon evolui:

> **Fortaleza tomada → posição defensiva → assentamento improvisado → refúgio sitiado.**

## Primeiro contrato
Um NPC humano ligado à Ordem de Ferro apresenta a tarefa como:

```text
entrar
↓
eliminar monstros
↓
recuperar objeto
↓
derrotar Boss
```

O NPC pode genuinamente desconhecer o significado histórico dos documentos encontrados.

## Estrutura da primeira visita
A primeira visita é **parcialmente controlada**, não totalmente procedural, para garantir os beats narrativos e tutoriais.

Após o primeiro clear, Dún Liath passa a utilizar a geração procedural normal com maior liberdade.

Primeira run: aproximadamente **16–18 salas**, número exato oculto do jogador.

Sequência conceitual obrigatória embutida entre salas variáveis:

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

## Setores visuais
### 1. Muralha Externa
Mais próxima da fantasia aparente de “fortaleza ocupada”. Patrulhas, antigas barricadas, postos de vigia e depósitos.

### 2. Quartel
Camas humanas antigas, depósitos, arsenal abandonado e reparos recentes.

### 3. Interior Ocupado
Camas improvisadas, alimentos, recipientes, ferramentas, curativos e espaços adaptados para viver. Aqui ocorre o evento do monstro ferido.

### 4. Bastião Interno
Área mais defensável. Cosantóir protege uma passagem importante, existe recuperação e o Portão do Bastião leva a Fairtheoir.

## Primeiros combates
Dois inimigos Comuns principais ensinam ritmos opostos.

### Crúbach — Batedor das Muralhas
**Categoria:** Comum.

Papel: rápido e frágil.

Dano principal: **Corte**.

Visual: corpo relativamente magro, braços longos, garras, pouca proteção e sinais claros de uso de roupas, bolsas, ferramentas e peças reaproveitadas.

Habilidades-base:
- **Talho** — Corte simples;
- **Salto Curto** — acelera/pressiona a próxima ação.

Resistências-base:
- Corte: Normal;
- Perfuração: Fraco;
- Impacto: Normal;
- Fogo: Normal;
- Gelo: Normal;
- Arcano: Normal;
- Sagrado: Normal.

Sem imunidades automáticas. Corpo leve favorece vulnerabilidade a Atordoamento.

Função didática:

> **velocidade também é uma ameaça.**

### Tromghiallach — Guarda Pesado
**Categoria:** Comum.

Papel: lento e resistente.

Dano principal: **Impacto**.

Visual: corpo pesado, pescoço curto, mandíbula larga, pele espessa, placas de madeira/metal reaproveitadas e arma improvisada feita de partes da fortificação.

Habilidades-base:
- **Golpe Pesado** — ataque lento de Impacto;
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

Leitura inicial:

```text
Crúbach → rápido / vulnerável
Tromghiallach → lento / resistente
```

## Cosantóir — Protetor da Passagem
**Categoria:** Elite.

É um indivíduo da comunidade com função de defesa, não uma espécie ou tier biológico diferente.

Visual: escudo improvisado, lança curta, armadura de peças humanas reaproveitadas, marcas de reparo e aparência funcional, não ornamentação de vilão.

Habilidades-base:
- **Estocada** — Perfuração moderada;
- **Golpe de Escudo** — Impacto + buildup de Atordoamento;
- **Postura de Defesa** — redução temporária de dano;
- **Avanço do Guardião** — primeiro grande telegraph do jogo, com barra de preparação, ataque forte de Impacto/Perfuração, buildup alto de Atordoamento e pequena janela posterior de vulnerabilidade.

Mecânica de **Defesa de Outro**: quando acompanhado por um Comum em condição crítica, Cosantóir pode tentar assumir pressão/Ameaça ou proteger o aliado.

Isso introduz sutilmente a ideia de que os monstros se defendem como grupo antes do tutorial completo de Party.

Loot temático possível: **Escudo da Passagem**.

Identidade do Escudo da Passagem:
- defesa;
- Vitalidade;
- Vigor;
- resistência a Atordoamento;
- atributos procedurais normais conforme raridade.

## Composições iniciais
Exemplos de progressão:
1. 1 Crúbach;
2. 1 Tromghiallach;
3. 2 Crúbach;
4. 1 Tromghiallach + 1 Crúbach;
5. 1 Tromghiallach + 2 Crúbach;
6. Cosantóir + 1 Crúbach.

## Progressão narrativa dos inimigos

> **Patrulha → Resistência → Defesa → Proteção → Último Vigia.**

Na primeira leitura, os inimigos apenas parecem ficar mais fortes. Na leitura posterior, quanto mais fundo o jogador avança, mais desesperadamente a comunidade tenta impedir que ele chegue até ela.

## Primeiro Elite obrigatório
Na primeira visita, Cosantóir é obrigatório para ensinar:
- telegraph;
- habilidade perigosa;
- buildup relevante;
- janela de vulnerabilidade;
- proteção de outro indivíduo.

Ele não deve ser apenas um Comum com mais Vida.

## Primeira bifurcação
Irreversível, com descrições ambientais curtas e sem indicar “caminho bom/ruim”. Ensina ausência de backtracking.

## Primeira recompensa relevante e Bolsa de Expedição
Ainda no começo da Dungeon, o jogador obtém recompensa prática — dinheiro, equipamento, consumível ou material — e aprende que tudo obtido naquela expedição permanece em risco até uma saída segura.

## Evento obrigatório — monstro ferido
Um monstro adulto ferido protege outro indivíduo mais fraco. O protegido não precisa ser criança, evitando tornar a decisão moralmente óbvia.

O ferido ergue a arma, mas não ataca imediatamente. Sua fala deve ser curta e comunicar algo equivalente a:

> “Já levaram os outros. Não vai levar este.”

O jogador percebe fala, compreensão, medo e proteção.

Escolha apresentada apenas como:

```text
Matar
Poupar
```

Sem cores de moralidade, coração, alinhamento, pontos ou aviso de consequências.

### Matar
O jogador luta e recebe loot normal apropriado. O indivíduo protegido pode fugir ou permanecer silencioso conforme encenação.

### Poupar
O ferido permanece desconfiado, não agradece calorosamente e recua/permite passagem junto do protegido.

**Poupar não concede recompensa imediata de item**, evitando transformar a escolha narrativa em cálculo de loot.

Consequências são posteriores e ambos os caminhos geram conteúdo.

Regra:

> **Escolhas narrativas mudam o caminho; não escolhem entre “conteúdo” e “castigo”.**

## Evidência ambiental depois do evento
Quanto mais fundo o jogador avança, mais aparecem:
- camas improvisadas;
- comida armazenada;
- itens reparados;
- espaços de cuidado;
- desenhos/inscrições;
- objetos pessoais.

O cenário sugere comunidade sem texto explícito dizendo ao jogador o que pensar.

## Fragmento do tratado
Obrigatório na segunda metade, encontrado em antiga **Sala de Comando** humana próxima ao objetivo da missão.

O documento é parcialmente destruído e sugere elementos como cessar hostilidades, representantes ou passagem segura, sem declarar amizade plena.

O fato de estar em arquivos humanos reduz a leitura de que foi fabricado pela comunidade atual.

A fortificação foi relevante historicamente, mas o tratado não precisa ter sido assinado ali; pode ter sido arquivado, copiado ou transportado.

## Recuperação garantida da primeira visita
Antes da reta final há uma sala garantida que:
- restaura recursos;
- permite primeira troca de equipamento dentro de Dungeon;
- reforça que recuperação **não protege o loot**.

Pode assumir visual de antiga enfermaria humana ou abrigo recentemente abandonado.

## Foreshadowing de Fairtheoir
Antes do Boss aparecem:
- portas reforçadas pelo lado de dentro;
- corpos de invasores;
- marcas enormes;
- caminhos deliberadamente bloqueados;
- sinais de que indivíduos menores eram protegidos atrás da linha defensiva.

Primeira leitura: “há uma criatura terrível lá dentro”.

Leitura posterior: “ela manteve os invasores do lado de fora”.

## Decisão pré-Boss
Interface enfatiza risco:

```text
Retornar à Cidade Livre
→ mantém Bolsa de Expedição

Entrar no Portão do Bastião
→ loot continua em risco
→ enfrentar Fairtheoir
```

Não apresentar “continuar = recompensa melhor” como decisão moral ou óbvia.

---

# Fairtheoir — O Último Vigia

## Papel narrativo
Boss fixo de Dún Liath.

É um monstro adulto e principal defensor da comunidade. Não é rei, chefe tribal, general, criatura invocada ou besta irracional.

Sua função narrativa é simples:

> ele foi o indivíduo que permaneceu na passagem enquanto os outros recuavam.

A Ordem o descreve apenas como uma criatura maior ocupando o interior.

## Aparência
- alto;
- torso largo;
- braços longos;
- postura levemente curvada;
- pele espessa, irregular e marcada;
- mandíbula larga e dentes expostos;
- visual grotesco segundo padrões humanos, mas não demoníaco.

## Equipamento
Armadura defensiva remendada com:
- peças da fortificação;
- placas militares humanas reaproveitadas;
- couro;
- correntes;
- madeira;
- múltiplos reparos.

Arma: **Viga de Guarda**, peça de madeira/metal reforçada derivada das defesas da fortificação.

Escudo: **Escudo da Muralha**, grande placa irregular reforçada e marcada por ataques.

## Ficha conceitual
**Categoria:** Boss.

Papel: defensor físico.

Dano principal: **Impacto**.

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

Não possui imunidade automática por ser Boss. A configuração inicial evita tornar uma classe inicial “errada”.

## Fase 1 — O Vigia
Fairtheoir mantém posição entre o jogador e o setor protegido.

Habilidades:
- **Pancada** — Impacto lento/moderado;
- **Golpe Pesado** — telegraph, alto Impacto e buildup de Atordoamento;
- **Varredura** — mais rápida, dano moderado;
- **Postura de Guarda** — defesa temporária.

## Fase 2 — Desespero
Limiar de Vida exato **A definir**.

Fairtheoir observa a passagem atrás de si, perde/abandona o escudo e utiliza a Viga de Guarda com duas mãos.

Fica:
- menos defensivo;
- mais frequente/agressivo;
- mais vulnerável;
- mais perigoso.

Habilidade marcante:

**Última Investida** — telegraph longo, alto Impacto, buildup alto de Atordoamento e vulnerabilidade posterior.

A mudança de fase altera comportamento, não apenas números.

Fairtheoir nunca foge e preserva o posicionamento de proteção.

## Morte
Sem fala, flashback ou texto moral.

Fairtheoir cai de joelhos, tenta uma última vez colocar o corpo entre o jogador e a passagem e então desaba.

## Depois do Boss
Atrás do Portão do Bastião existem:
- suprimentos;
- camas;
- objetos pessoais;
- bandagens/ferramentas;
- sinais de evacuação;
- saída secundária aberta ou recentemente usada.

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

## Bestiário
Entrada: **Fairtheoir — O Último Vigia**.

Informações podem evoluir conforme descobertas posteriores, incluindo observação de que seu posicionamento parecia deliberadamente defensivo.

---

# Loot de Dún Liath

Filosofia:

> **Poucos itens exclusivos, mas cada um com função clara.**

## Sucata de Dún Liath
Material geral compartilhado da Dungeon, representando placas militares, rebites, ferragens e componentes recuperados.

Fontes possíveis:
- Crúbach;
- Tromghiallach;
- Cosantóir;
- salas de tesouro;
- eventos apropriados.

Usos: Forja, reparos, equipamentos temáticos, receitas defensivas e upgrades normais.

Não criar materiais como Garra de Crúbach, Dente de Tromghiallach etc. apenas para dar identidade a cada inimigo.

> **Identidade de inimigo não exige um material de crafting exclusivo para cada criatura.**

## Fragmento de Fairtheoir
Recurso exclusivo garantido em **toda vitória contra Fairtheoir**.

Fonte explícita: Fairtheoir.

Pode ser usado em:
- equipamentos do Boss;
- receitas especiais;
- upgrade +2;
- crafting defensivo de Dún Liath.

## Equipamentos temáticos
### Escudo da Passagem
Associado a Cosantóir. Defesa, Vitalidade, Vigor e resistência a Atordoamento como identidade-base; atributos procedurais normais.

### Escudo do Último Vigia
Modelo de Boss, mais pesado e defensivo. Identidade-base:
- alta defesa física;
- resistência a Impacto;
- sobrevivência/estabilidade;
- possível interação com Ameaça conforme balanceamento.

Continua equipamento normal procedural, permitindo rolls fora do papel tradicional.

### Viga do Vigia
Versão adaptada da arma de Fairtheoir para uso do personagem:
- arma pesada;
- Impacto alto;
- ataque lento;
- bom buildup de Atordoamento;
- alto consumo de Stamina;
- favorece Força.

## Receita — Reforço do Vigia
Receita de Forja usando conceitualmente:

`Sucata de Dún Liath + material normal + Fragmento de Fairtheoir`

Quantidades **A definir**.

Representa técnica defensiva da fortificação e não cria nova categoria de item.

## Primeiro clear por dificuldade
| Dificuldade | Recompensa especial garantida |
|---|---|
| **Fácil** | **Guarda Instintiva** |
| **Normal** | **Receita: Reforço do Vigia** |
| **Difícil** | **Escudo do Último Vigia** |
| **Impossível** | **Lacre do Comandante** |

### Guarda Instintiva
Categoria: **Universal**.

Perfil: **Defensiva**.

Reduz temporariamente o próximo dano significativo recebido. Valores, duração e cooldown **A definir**.

É a primeira recompensa ideal por ser utilizável por qualquer classe e apresentar uma habilidade Universal.

### Reforço do Vigia
Primeiro clear Normal desbloqueia permanentemente a receita. Não exige que o jogador continue esperando o mesmo conhecimento dropar.

### Escudo do Último Vigia — Difícil
Primeiro clear garante o modelo, não necessariamente um roll procedural perfeito. Farm posterior pode buscar versões melhores.

### Lacre do Comandante — Impossível
Item permanente de exploração/lore, não equipamento nem material consumível.

Descrição conceitual: lacre militar antigo cujo símbolo não corresponde completamente às insígnias atuais da Ordem de Ferro.

Permite acessar o **Arquivo Selado**.

---

# Segredos de Dún Liath

## Segredo simples
Sala pequena com Sucata, equipamento, documento ou consumíveis. Descoberta por pistas/exploração normal.

## Alojamento do Oficial
Ligado à Chave Enferrujada para acesso antecipado.

Pode conter:
- loot interessante;
- registro militar;
- pista sobre o Arquivo Selado.

Nenhuma recompensa essencial. Outra forma de acesso deve existir futuramente.

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
Evento raro que pode aparecer antes de o jogador saber resolvê-lo. A porta antiga inicialmente não abre. Conhecimento ou item posterior revela sua relação com camadas profundas do Arquivo.

O objetivo é criar reconhecimento persistente: “eu já vi isso antes”.

---

# Relíquia secreta — Selo de Dún Liath

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

Condição/chance final **A definir**.

Efeito único conceitual: **Trégua Instável**.

Alternar adequadamente entre habilidades de perfis diferentes cria sinergia:

```text
Agressiva
↓
próxima Defensiva recebe benefício

Defensiva
↓
próxima Agressiva recebe benefício
```

Valores, janela e limites **A definir**.

A mecânica representa duas forças diferentes funcionando melhor quando alternadas e conecta gameplay à história da Dungeon.

Como Relíquia:
- é negociável no mercado;
- possui histórico de donos;
- utiliza o Relicário;
- pode registrar primeiro descobridor e vendas.

Quantidade global limitada ou não permanece **A definir**.

---

# Eventos e geração procedural de Dún Liath

Depois do primeiro clear, runs combinam combate, Elite, evento, tesouro, armadilha, recuperação, segredo e Boss, com limites para evitar gerações incoerentes.

## Bifurcações
Usam pistas ambientais, nunca informação explícita da recompensa.

Exemplos de leitura:
- marcas recentes atravessando poeira;
- vento com cheiro de sal/ferrugem;
- ruído de metal;
- sinais de uso recente.

> **A descrição informa risco e contexto, não o resultado exato.**

O conhecimento acumulado do próprio jogador pode tornar certas pistas reconhecíveis ao longo das runs.

## Eventos-base
Dún Liath começa com aproximadamente 8–10 eventos possíveis, dos quais apenas alguns aparecem por run. Quantidade exata pode mudar no balanceamento de conteúdo.

### Barricada Abandonada
Opções como Forçar Passagem ou procurar outro acesso. Pode usar atributos/condições e reforça que a comunidade estava se defendendo.

### Depósito Esquecido
Antigo depósito humano com Sucata, consumíveis ou equipamento normal; pode conter mecanismo antigo.

### Ferido Ausente
Curativos usados, água e sinais de alguém que estava sendo tratado. Evento ambiental sem NPC necessário.

### Vozes Atrás da Parede
O jogador ouve moradores em área inacessível, demonstrando vida além das salas de combate.

### Soldado Antigo
Cadáver humano de período claramente anterior à ocupação atual, podendo conter insígnia, documento ou loot e separando eras históricas.

### Suprimentos da Comunidade
O jogador pode **Levar** ou **Deixar**. Não existe barra moral. Levar dá recursos; deixar pode mudar conteúdo posterior. Nenhuma opção é declarada correta.

## Armadilhas
### Queda de Pedras
Dano e possível Atordoamento.

### Piso Instável
Pode causar dano, consumir Vida antes de encontro ou ocasionalmente levar a sala alternativa.

### Dispositivo Militar Antigo
Mecanismo humano de lança, peso, portão ou defesa antiga.

### Barricada Improvisada
Defesa recente da comunidade, distinguível visualmente das estruturas humanas antigas. Pode causar dano ou iniciar combate.

A Dungeon diferencia:

> **defesas humanas antigas** vs **defesas recentes da comunidade**.

## Detecção
Interface pode evoluir de alerta vago para informação mais precisa conforme atributos, parceiro, equipamento ou conhecimento. Não é necessário mostrar percentual na leitura padrão.

## Salas de recuperação
Podem assumir visual de:
- **Antiga Enfermaria** humana;
- **Abrigo Abandonado** recentemente usado pela comunidade.

Mesma função mecânica, interpretação narrativa diferente.

## Persistência de Matar/Poupar
### Se poupou
Podem aparecer sinais de passagem sem combate, mudanças em inscrições, recursos deixados em determinado contexto, diálogos ou encontro futuro relacionado aos sobreviventes.

### Se matou
Podem aparecer barricadas diferentes, outro personagem, registros, interpretações ou caminhos narrativos alternativos.

Nenhum lado recebe simplesmente “mais loot”.

## Segredos por dificuldade
- Fácil: estrutura básica;
- Normal: mais eventos militares/documentos;
- Difícil: armadilhas e eventos históricos mais exigentes;
- Impossível: camadas profundas, incluindo caminho do Arquivo Selado.

> **Dificuldade não aumenta apenas números; ela expande a própria Dungeon.**

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

O jogador ganha não apenas loot, mas conhecimento permanente sobre o local.

---

# Dificuldades de Dún Liath

Regra de progressão:

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

Objetivo: ensinar telegraphs, ritmos e a existência das duas fases.

## Normal
Inimigos começam a interagir entre si.

### Crúbach — Cerco
Aumenta pressão quando outro inimigo mantém a atenção do jogador.

### Tromghiallach — Cobertura Pesada
Firmar Posição concede pequena proteção temporária a aliados próximos.

### Cosantóir — Interposição
Ao detectar aliado em condição crítica, pode priorizar sua defesa e assumir pressão/Ameaça.

### Fairtheoir — Contra-Impacto
Durante Postura de Guarda, receber ataques suficientes/intensos prepara contra-ataque de Impacto ao terminar a postura. Não pune atacar; pune ignorar completamente o estado defensivo.

Última Investida pode gerar **Destroços** ou consequência temporária de arena. Forma exata **A definir**.

## Difícil
Status e formações tornam-se centrais.

### Crúbach — Ferida Aberta
Pressão de ataques consecutivos pode gerar Sangramento.

### Tromghiallach — Golpe Concussivo
Golpe Pesado gera buildup relevante de Atordoamento.

### Cosantóir — Formação Defensiva
Com Crúbach, protege o aliado rápido e mantém pressão. Com Tromghiallach, cria linha defensiva limitada enquanto ambos estão ativos.

### Fairtheoir — Ruptura
Golpeia chão/estrutura com a Viga de Guarda, causando Impacto, Atordoamento e alteração temporária da arena. Forma exata da alteração **A definir**.

Postura de Guarda torna determinados ataques menos eficientes sem criar imunidade.

Fase 2 alterna agressão intensa e breves retornos defensivos.

## Impossível
A defesa da fortificação funciona de forma coordenada.

### Crúbach — Caçada Coordenada
IA oportunista: pressiona quando aliado defende, acelera após Atordoamento e reage a vulnerabilidades legíveis.

### Tromghiallach — Muralha Viva
Firmar Posição ganha função de cobertura/formação, exigindo decisão de pressionar ou aguardar mudança de estado.

### Cosantóir — Última Linha
Alterna de forma comunicada entre:
- Proteger;
- Avançar;
- Reorganizar.

### Fairtheoir — kit definitivo
Mantém duas fases.

Fase 1 usa Guarda, Contra-Impacto, Ruptura e posicionamento defensivo completo.

Nova mecânica: **Linha Intransponível** — durante determinada postura, a rotação/forma de ataque do jogador pode fortalecer ou enfraquecer a defesa do Boss. Fórmula **A definir**.

Transição de fase é mais expressiva: Fairtheoir percebe movimento atrás do portão e abandona parte da própria defesa, reforçando visualmente que está comprando tempo.

Fase 2: **Desespero Absoluto**.

Combina Última Investida, Ruptura, ataques mais rápidos e Golpe Pesado modificado.

Final: **Até o Último** — em Vida muito baixa, deixa de utilizar Postura de Guarda e executa última sequência agressiva. Não cura, não recebe nova barra, não ressuscita.

A versão Impossível da Última Investida é extremamente perigosa, porém continua com telegraph longo e janela posterior clara.

## Armadilhas por dificuldade
- Fácil: poucas e simples;
- Normal: mais variedade e alguns status;
- Difícil: podem influenciar próximo combate;
- Impossível: mecanismos mais complexos e atalhos acompanhados de risco.

Nunca existir armadilha aleatória de morte instantânea sem informação adequada.

## Recuperação por dificuldade
Pode ficar menos frequente ou menos completa em dificuldades maiores, mas não precisa desaparecer totalmente. Continua importante para troca de equipamento e preparação pré-Boss.

## Elites
Cosantóir não deve ser banalizado por aparecer em excesso. Frequência e composição aumentam, mas sua identidade permanece especial.

---

## Equipamentos

##### Slots
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

##### Tipos iniciais
- Espada;
- Espadão;
- Machado;
- Lança;
- Adaga;
- Arco;
- Cajado;
- Catalisador mágico;
- Escudo.

Sem peso e sem durabilidade.

##### Procedural
Equipamento normal = parte fixa + atributos procedurais.

Atributos procedurais podem sair do papel tradicional do item, favorecendo builds híbridas.

```text
Comum      → 1 atributo
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Sem atributos negativos e sem nomes procedurais.

##### Upgrade
`+0 / +1 / +2`.

Sem falha. Melhora apenas atributos base; não rerrola procedurais nem efeitos únicos.

+1 usa materiais normais. +2 exige componente especial de Dungeon/Boss/evento. Sem custo em dinheiro.

Troca dentro de Dungeon somente em recuperação.

---

## Inventário e armazenamento

Inventário limitado e permanentemente expansível.

Materiais e consumíveis empilham. Equipamentos são individuais.

Banco separado do inventário carregado.

Bolsa de Expedição separa loot de Dungeon e o perde em caso de morte da run.

Relíquias ficam no **Relicário**, com origem, identificador, primeiro dono, dono atual e histórico.

Filtros, favoritos e bloqueio de itens devem evitar venda/desmontagem acidental.

---

## Relíquias e mercado

Relíquias são exceções ao equipamento normal:
- extremamente raras;
- poderosas;
- identidade/efeito próprios;
- provenance/histórico;
- negociáveis;
- nunca craftáveis.

Somente Relíquias podem ser negociadas entre jogadores.

Algumas podem ter quantidade global limitada; isso é definido individualmente.

##### Mercado
Preço fixo definido livremente pelo vendedor. Sem leilão ou ofertas inicialmente.

Anúncio permanece até venda ou cancelamento. Limite de anúncios **A definir**.

Venda possui taxa removida da economia.

Mercado acompanha:
- última venda;
- média;
- maior venda;
- quantidade de negociações;
- histórico/provenance.

---

## Economia

Uma única moeda principal.

NPCs compram itens/equipamentos por valores do sistema.

Desmontagem concede somente dinheiro.

Sinks:
- expansão de inventário;
- expansão de banco;
- taxas de mercado;
- morte fora de Dungeon;
- serviços de NPC quando aplicável.

Crafting e upgrades não custam dinheiro.

Dungeons não possuem taxa monetária normal de entrada.

Prestígio não custa dinheiro.

NPCs podem exercer papéis de ferreiro, cozinheiro, mercador, curandeiro e vendedor básico **dentro das estruturas já existentes**, sem exigir novos edifícios iniciais.

Equipamento avançado vem principalmente de crafting, exploração, Dungeons, Bosses e eventos.

---

## Cidade e estrutura do mundo

##### Cidade Livre
Uma única cidade principal inicialmente.

Centro de NPCs, serviços, comércio, gerenciamento, narrativa e preparação.

Território neutro de trégua:
- ataques humanos/monstros proibidos;
- comércio permitido;
- origem/aparência não definem direitos;
- estabilidade e contratos têm prioridade.

Coexistência não significa amizade.

##### Estruturas iniciais — somente cinco
1. **Taverna** — parceiros e NPCs;
2. **Banco** — armazenamento;
3. **Relicário** — coleção/gestão de Relíquias;
4. **Mercado** — negociação de Relíquias;
5. **Ferreiro** — serviços de equipamento.

##### Mundo
Não existe estrutura de progressão por regiões nem sistema de viagem entre regiões. Atividades e Dungeons são acessadas diretamente pelos sistemas do jogo respeitando requisitos.

Cidade não possui nível/evolução própria por enquanto.

NPCs e estados da cidade podem mudar por Dungeon, quest, evento, decisão e progressão narrativa.

Eventos globais temporários podem alterar NPCs, diálogos, serviços, aparência e acontecimentos.

---

## Quests, NPCs e narrativa

Tipos:
- Principal;
- Secundária;
- Parceiro;
- Evento;
- Secreta.

Quest principal não bloqueia progressão Idle básica.

Escolhas podem alterar relação, NPCs, quests futuras, recompensas, eventos e estados narrativos.

Falha permanente de quest pode existir com moderação.

NPCs não morrem nem desaparecem definitivamente devido às escolhas do jogador; presença, comportamento e disponibilidade podem mudar.

Quests secretas podem nascer de itens, Dungeons, parceiros, diálogos, eventos e combinações de condições, sem marcador tradicional.

Diálogos são curtos e objetivos; lore profundo é opcional.

NPCs lembram decisões relevantes.

Requisitos podem usar atributos, skill/Prestígio, item, parceiro, quest ou estado anterior.

---

## Prólogo e início do jogo

##### Origem
Personagem de terra distante, passado propositalmente aberto. Chega à Cidade Livre buscando sobrevivência, trabalho ou recomeço. Não conhece profecia nem manifesta poder especial.

##### Fluxo

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
primeira melhoria/crafting
↓
primeiro combate
↓
primeiro contrato
↓
Dún Liath
```

##### Criação
Mostra principalmente:
- identidade;
- atributos destacados;
- equipamento inicial;
- habilidade inicial.

Mensagem explícita:

> **A classe define apenas o início. Todas as formas de combate poderão ser aprendidas posteriormente.**

##### Cidade Livre
Introdução curta e visual. Pode mostrar humanos, monstros sob trégua, guardas, comércio e tensão. Sem lore dump.

##### Taverna
Primeira conversa obrigatória curta. Respostas podem envolver trabalho, dinheiro, fugir do passado ou sobreviver, caracterizando sem fixar origem canônica.

##### Primeira atividade Idle
Escolha livre entre:
1. Mineração;
2. Lenhador;
3. Pesca;
4. Herbologia.

Ensina `escolher → iniciar → aguardar → recurso + XP → automático` e reforça ausência de drops secundários aleatórios.

##### Produção
Primeira pequena melhoria de equipamento segue. Metalurgia, Forja e Culinária são ensinadas separadamente no primeiro uso.

##### Primeiro combate
Ensina apenas:
- ataque automático;
- Vida/Mana/Stamina;
- ativo;
- consumível;
- estilos Agressivo/Defensivo/Misto.

Pode sugerir estilo amigável à classe — Guerreiro Agressivo, Acólito Defensivo, Errante Misto — mas o jogador pode mudar imediatamente.

##### Tutorial contextual

> **O jogador aprende jogando; nenhum sistema avançado é explicado antes de se tornar relevante.**

Aplicações: primeira Metalurgia, Forja, Culinária, minigame, Prestígio, parceiro, Relíquia, Relicário e mercado.

Jogador começa sozinho. Mira é introduzida depois de Dún Liath.

##### Visão inicial dos monstros
A narrativa inicial usa principalmente a visão humana dominante. Dún Liath é a primeira contradição clara.

---

## História e lore

##### Identidade cultural/geográfica

> **O mundo possui uma identidade atlântica sombria, inspirada culturalmente na transição entre tradições célticas e nórdicas, sem representar literalmente Irlanda ou Islândia.**

Referências visuais/geográficas:
- florestas antigas e úmidas;
- penhascos e costas severas;
- mares frios;
- ilhas;
- montanhas;
- paisagens vulcânicas;
- ruínas;
- fortificações costeiras.

Culturas tiveram contato por comércio, migração, conflito e civilizações antigas. Camadas linguísticas e arquitetônicas podem coexistir.

Humanos e monstros não representam diretamente povos históricos reais.

##### Conflito
Dark Fantasy centrado em guerra extremamente antiga entre humanos e monstros. A origem do conflito foi perdida.

Ambos cometeram atrocidades e produzem propaganda. O jogador encontra evidências, mas a verdade completa nunca precisa ser confirmada.

> **A guerra continua funcionando mesmo depois de todos terem esquecido por que ela começou.**

##### Monstros
Possuem inteligência, sentimentos, linguagem, memória, cultura, capacidade moral e política equivalentes às humanas.

Diferença central percebida é aparência grotesca segundo padrões humanos. Entre monstros, aparência não possui valor social.

> **Monstros não são inimigos por natureza. São um povo tratado como inimigo.**

O termo “monstro” é principalmente classificação humana; o próprio povo poderá usar outra autodesignação futuramente.

Monstros também podem ser cruéis, corruptos ou violentos; a narrativa não os idealiza.

##### Sociedade humana
Aproximação política:
- 90% apoiam/seguem/participam da guerra;
- 5% Dissidentes;
- 5% Conciliadores.

Doutrina dominante: não negociar e não deixar monstros vivos fora das exceções impostas pela Cidade Livre.

Facções:
- **Ordem de Ferro** — principal força militar, pró-guerra;
- **Dissidentes** — desertores/rebeldes/recusam guerra;
- **Conciliadores** — defendem diálogo e fim do conflito reconhecendo atrocidades de ambos os lados.

##### Liderança humana
Poder militar hereditário: maior patente permanece na mesma família, formando dinastia de fato.

Líder atual lucra com economia da guerra.

> **A guerra deixou de ser apenas um conflito e se tornou uma indústria.**

O jogador nunca encontra pessoalmente o líder máximo; percebe sua influência por ordens, documentos, soldados, propaganda e economia.

##### Política monstruosa
Estrutura democrática com partidos, debate, instituições e presidente eleito por voto.

O presidente quer paz, mas enfrenta pressão crescente conforme ataques humanos fortalecem grupos retaliadores.

O jogador nunca o encontra pessoalmente.

Facções:
- **Retaliadores** — resposta violenta;
- **Sobreviventes** — continuidade/proteção do povo;
- **Pactários** — coexistência e negociação.

Não existe regra universal monstruosa equivalente à proibição humana de colaboração.

##### Cidade Livre
Território neutro onde humanos e monstros podem coexistir publicamente sob regras de trégua e comércio. NPCs podem demonstrar preconceito, medo, respeito, curiosidade ou pragmatismo.

##### Profecia
Versão original perdida. Restam histórias, tradições e interpretações distorcidas.

Ideia preservada:

> **Em determinado momento da crise surgirá alguém capaz de alterar o destino dos povos.**

Não identifica claramente nome, aparência, origem, família, momento ou resultado.

O personagem poderá cumpri-la, mas ela não garante sucesso.

> **A profecia prevê que alguém surgirá, mas não garante que essa pessoa chegará ao fim de sua jornada.**

Registro muito antigo poderá ser encontrado posteriormente e mostrar distorções modernas, sem ser apresentado como verdade absoluta.

##### Civilização antiga
Existiu civilização/reino extremamente importante antes do presente. Sua queda permanece ambígua.

Vestígios por ruínas, equipamentos, Relíquias, Dungeons, inscrições, NPCs e relatos contraditórios.

##### Religião e Fé
Diferentes crenças e interpretações. Fé como atributo não confirma qual religião é objetivamente verdadeira.

##### Antagonismo
Não depende de um único grande vilão. O jogador primeiro conhece consequências e depois interesses políticos, líderes, grupos e manipulações.

##### Facções e escolhas
Jogador não escolhe “Humanos” ou “Monstros” em seleção permanente. Relações são construídas por decisões.

Parceiros podem representar posições humanas e monstruosas diferentes.

##### Encontro histórico de lideranças
Há relatos contraditórios de antigos encontros/negociações entre representantes máximos. Nenhuma versão é totalmente confiável; qualquer tentativa não produziu paz duradoura.

##### Dungeons como arqueologia narrativa
Dungeons contam história por arquitetura, inimigos, Bosses, itens, Relíquias, NPCs, eventos e segredos. Um local pode mudar de significado quando novas informações são descobertas.

---

## Finais

Dois finais principais para o primeiro grande arco:
1. **Continuar o ciclo da guerra**;
2. **Romper o ciclo da guerra**.

Sem classificação oficial de bom/ruim.

##### Continuar o ciclo
Estrutura política/econômica/cultural da guerra permanece, ainda que um lado ou liderança mude. A profecia pode ser considerada cumprida porque o personagem alterou destinos sem encerrar o conflito.

##### Romper o ciclo
A guerra deixa de ser inevitável, mas não surge paz perfeita.

Continuam ódio, preconceito, extremismo, famílias marcadas, desconfiança, ataques isolados e interesses econômicos ameaçados.

> **A guerra deixa de ser inevitável.**

A paz apenas se torna possível.

O jogo pode continuar após qualquer final com progressão, eventos e expansões narrativas.

---

## Arte

##### Temática
Dark Fantasy: decadência, mistério, antiguidade, perigo, grandeza perdida e conflito atual.

##### Identidade visual atlântica
- florestas antigas/úmidas;
- penhascos;
- costas rochosas;
- mares frios/violentos;
- ilhas;
- montanhas;
- vulcanismo;
- fortalezas/ruínas costeiras;
- camadas culturais em arquitetura e objetos.

Não reproduzir literalmente Irlanda, Islândia ou outro país real.

##### Interface
- minimalista;
- elegante;
- padronizada;
- moderna;
- inspiração Apple na experiência de uso;
- claramente Game UI e não interface genérica de aplicativo.

Uso de 2D ou 3D permanece **A definir**.

---

# Build de Validação Interna

## Objetivo
O foco atual do projeto deixa temporariamente de ser expansão de conteúdo e passa a ser a montagem de uma **versão jogável interna para o próprio desenvolvimento**, destinada a verificar se os sistemas já definidos realmente se encaixam quando executados juntos.

Essa versão **não é tratada como BETA público**.

Nome de trabalho:

> **Build de Validação 0.1**

O objetivo é responder:

> **Quando os sistemas são jogados juntos, o resultado continua parecendo o mesmo jogo imaginado no GDD?**

## Princípio de escopo
Até a Build de Validação 0.1 demonstrar que o núcleo funciona:

> **não expandir o mundo com novos sistemas grandes, novas Dungeons ou grande volume de conteúdo sem necessidade de validação.**

Conteúdo já desenhado para etapas futuras permanece documentado, mas não precisa ser implementado imediatamente.

### Regra incremental das builds

A Build 0.1 não é um protótipo descartável.

> **Cada build incrementa a anterior.**

A fundação implementada deve permanecer e ser ampliada nas builds seguintes. Sistemas centrais devem nascer de acordo com a estrutura real pretendida, mesmo quando a primeira build possui pouco conteúdo.

> **Pouco conteúdo, estrutura real.**

Combate, inventário, crafting, skills, equipamentos, Dungeon e save não devem ser soluções temporárias feitas para descarte. Valores, conteúdo, quantidades, tempos, XP, dano, loot e balanceamento podem mudar livremente entre builds.

Referência conceitual:

```text
Build 0.1 → núcleo real + conteúdo reduzido
Build 0.2 → correções + aprofundamento dos sistemas existentes
Build 0.3+ → expansão incremental de conteúdo e sistemas já planejados
```

## Recorte integrado principal
O fluxo mais importante a ser validado é:

```text
Criação
↓
Classe + Presente
↓
Cidade Livre / Taverna
↓
coleta escolhida
↓
produção / pequena melhoria
↓
combate
↓
contrato
↓
Dún Liath
↓
Fairtheoir
↓
consequência e retorno à Cidade Livre
```

O endpoint natural da campanha jogável da Build 0.1 é:

> **primeira conclusão de Dún Liath na dificuldade Fácil.**

Dún Liath funciona como principal ponto de integração porque já conecta:
- build;
- recursos;
- equipamentos;
- consumíveis;
- combate;
- status;
- Elite;
- Boss;
- loot em risco;
- exploração;
- escolha narrativa;
- persistência;
- recompensa.

## Conteúdo reduzido é permitido
A Build de Validação não precisa implementar imediatamente toda a progressão 1–99/P3 de cada skill.

Pode usar subconjuntos suficientes para provar ciclos como:

```text
Mineração → Metalurgia → Forja → equipamento → combate
```

E:

```text
Pesca / Herbologia → Culinária → consumível → combate
```

O objetivo é validar relações entre sistemas antes de produzir grande volume de conteúdo.

### Conteúdo mínimo inicial das coletas

A Build 0.1 usa inicialmente os dois primeiros recursos de cada coleta como referência de conteúdo:

| Skill | Nível 1 | Nível 10 |
|---|---|---|
| Mineração | Cloch | Stán |
| Lenhador | Giúis | Beith |
| Pesca | Scadán | Breac |
| Herbologia | Neantóg | Seamair |

Metalurgia deve possuir pelo menos **Cloch Tratada** e **Lingote de Stán** no primeiro recorte.

Forja e Culinária usam poucas receitas, mas suficientes para provar os ciclos reais de produção.

### Convergência das quatro coletas

Não pode existir uma escolha inicial secretamente correta.

As quatro opções devem gerar uma preparação útil e permitir continuar o tutorial:

```text
Mineração → material → Metalurgia/Forja → reforço/equipamento → combate
Lenhador → material → Forja → equipamento/ferramenta → combate
Pesca → alimento → Culinária → preparação → combate
Herbologia → preparado → Culinária → recuperação/preparação → combate
```

O primeiro combate deve ser vencível e compreensível independentemente da coleta escolhida, sem exigir grind desproporcional ou troca obrigatória para outra rota.

## Sistemas avançados
Prestígio, progressão longa, dificuldades avançadas, Relíquias e outros estados podem usar ferramentas internas/atalhos de desenvolvimento para validação, sem exigir que o testador reproduza naturalmente centenas de horas.

A forma técnica desses atalhos será definida somente durante implementação.

Mira, Party, segunda Dungeon, Dún Liath Normal/Difícil/Impossível, Arquivo Selado, Selo de Dún Liath, mercado de jogadores, progressão completa 1–99/P3 e minigames completos não precisam fazer parte da progressão natural da campanha da Build 0.1.

## Mira e Party nesta etapa
O design de Mira e de sua introdução permanece oficial.

A Build de Validação principal prioriza o personagem Solo e Dún Liath antes de implementar a campanha da segunda Dungeon. Party/Aggro/Mira podem ser validados separadamente ou em etapa posterior da build, sem alterar o design já aprovado.

## Valores de balanceamento da Build
Valores atualmente marcados como **A definir** podem receber números provisórios explicitamente tratados como **Valores de Balanceamento da Build de Validação**, sem se tornarem valores finais do GDD.

Esses números existem para teste e podem mudar livremente conforme resultados.

### Recursos máximos provisórios

```text
Vida máxima    = 100 + (Vitalidade × 12)
Mana máxima    = 30  + (Mente × 10)
Stamina máxima = 60  + (Vigor × 8)
```

### Regeneração provisória

```text
Mana por segundo    = 1,5 + (Mente × 0,35)
Stamina por segundo = 5 + (Vigor × 0,6)
```

Vida não possui regeneração natural significativa durante combate.

Fora de combate normal, a recuperação pode ser rápida para evitar tempo morto. Em Dungeon, Vida, Mana e Stamina persistem entre encontros até recuperação por sistema apropriado.

### Scaling provisório

Ataques e habilidades usam a estrutura:

```text
Poder Base + soma(Atributo × multiplicador de scaling)
```

| Scaling | Multiplicador |
|---|---:|
| S | 1,00 |
| A | 0,85 |
| B | 0,70 |
| C | 0,50 |
| D | 0,30 |
| E | 0,15 |

### Defesa provisória

```text
Mitigação = Defesa / (Defesa + 100 + 5 × Nível do atacante)
```

Teto provisório de mitigação por Defesa: **75%**.

```text
Dano recebido = Dano bruto × (1 - Mitigação)
```

### Resistências provisórias

Dano recebido:

| Leitura | Multiplicador |
|---|---:|
| Fraco | 125% |
| Normal | 100% |
| Resistente | 80% |
| Muito Resistente | 60% |
| Imune | 0% |

Buildup recebido:

| Leitura | Multiplicador |
|---|---:|
| Fraco | 125% |
| Normal | 100% |
| Resistente | 75% |
| Muito Resistente | 50% |
| Imune | 0% |

### Precisão provisória

```text
Precisão = 100 + (Destreza × 2) + bônus
```

```text
Chance de acerto = 90% + (Precisão - Evasão) × 0,25%
```

Limite provisório: mínimo **70%**, máximo **99%**.

### Crítico provisório

```text
Chance de crítico = 5% + (Destreza × 0,25%) + bônus
```

Crítico-base: **150% do dano normal**.

### Velocidade provisória

```text
Bônus de velocidade de ataque = Destreza × 0,4%
```

Cap provisório: **25%**.

Destreza não reduz cooldowns globalmente.

### Responsabilidade dos atributos na Build 0.1

| Atributo | Papel principal |
|---|---|
| Vitalidade | Vida |
| Mente | Mana máxima e regeneração |
| Vigor | Stamina máxima e regeneração |
| Força | scaling físico apropriado e requisitos |
| Destreza | scaling apropriado, Precisão, crítico e velocidade |
| Inteligência | Magias e Arcano |
| Fé | Milagres, cura e Sagrado |

Mente e Vigor não aumentam dano diretamente na referência inicial.

Destreza possui mais funções derivadas que os demais atributos ofensivos e deve ser observada explicitamente durante os testes para evitar que se torne obrigatória em todas as builds.

## Fichas iniciais provisórias da Build 0.1

As cópias de equipamento recebidas na criação são **fixas e sem RNG procedural**. Modelos equivalentes obtidos posteriormente seguem o sistema procedural normal quando aplicável.

Slots que não fazem parte do kit começam vazios, salvo presente equipado aplicável. Isso permite que primeiros crafts e drops tenham valor imediato.

As habilidades iniciais não são permanentemente exclusivas das classes e poderão ser aprendidas posteriormente por outros personagens que cumpram seus requisitos.

### Guerreiro

**Espada de Milícia**
- Corte;
- Poder Base 14;
- intervalo-base 2,1 s;
- Força B;
- Destreza C;
- requisito Força 5 / Destreza 3.

**Escudo de Milícia:** Defesa 8.

**Peitoral de Milícia:** Defesa 18.

Defesa inicial de referência: **26**.

**Golpe de Força — Física Agressiva**
- 155% do dano da arma;
- custo 28 Stamina;
- cooldown 6 s.

### Mago

**Cajado Simples**
- ataque básico Arcano;
- Poder Base 9;
- intervalo-base 2,4 s;
- Inteligência C;
- requisito Inteligência 6.

**Vestes Simples:** Defesa 6.

**Pulso Arcano — Magia Agressiva**
- Poder Base 18;
- Inteligência A;
- dano Arcano;
- custo 24 Mana;
- cooldown 5 s.

### Caçador

**Arco Curto**
- Perfuração;
- Poder Base 12;
- intervalo-base 2,3 s;
- Força D;
- Destreza A;
- requisito Destreza 7.

**Gibão de Caça:** Defesa 10.

**Disparo Preciso — Física Agressiva**
- 150% do dano da arma;
- +15 pontos percentuais de chance de acerto nessa ação;
- custo 24 Stamina;
- cooldown 6 s.

### Acólito

**Maça Simples**
- Impacto;
- Poder Base 14;
- intervalo-base 2,3 s;
- Força C;
- Destreza D;
- requisito Força 3.

**Catalisador Simples**
- requisito Fé 7;
- necessário para Milagres apropriados.

**Vestes do Acólito:** Defesa 8.

**Prece Restauradora — Milagre Defensivo**
- cura-base 24;
- Fé S;
- custo 36 Mana;
- cooldown 10 s.

### Ladino

**Adaga de Caça**
- Perfuração;
- Poder Base 7;
- intervalo-base 1,45 s;
- Força D;
- Destreza B;
- requisito Destreza 8.

**Traje Leve:** Defesa 9.

**Golpe Oportuno — Física Agressiva**
- 125% do dano da arma;
- +25 pontos percentuais de crítico nessa ação;
- custo 20 Stamina;
- cooldown 5 s.

### Errante

**Lança de Viagem**
- Perfuração;
- Poder Base 13;
- intervalo-base 2,1 s;
- Força B;
- Destreza C;
- requisito Força 4 / Destreza 4.

**Proteção de Viagem:** Defesa 12.

**Abertura — Universal Agressiva**
- funciona independentemente da categoria da arma;
- 135% do dano-base da ação apropriada;
- +10 pontos percentuais de Precisão;
- sem custo de Mana ou Stamina;
- cooldown 7 s.

## Resolução do combate automático

### Regra central

> **Uma habilidade ativa substitui o ataque básico que seria realizado naquela ação.**

Habilidades não acontecem como dano adicional paralelo ao ataque básico.

Cada combatente possui seu próprio intervalo. Quando fica pronto para agir, escolhe uma única ação e depois reinicia seu intervalo.

Cooldowns são relógios separados e continuam transcorrendo durante outras ações.

### Ordem de decisão do personagem

```text
1. Consumível automático válido
2. Habilidade válida conforme estilo, condição e ordem dos slots
3. Ataque básico
```

Uma habilidade só entra em cooldown quando realmente é usada. Falta de recurso, requisito ou condição apenas faz o sistema continuar para a próxima opção.

### Ordem dos quatro slots

A ordem visual é a prioridade real:

```text
Slot 1 → Slot 2 → Slot 3 → Slot 4 → Ataque básico
```

### Estilos

**Agressivo:** prioriza habilidades Agressivas; Defensivas entram quando suas condições apropriadas forem atingidas.

**Defensivo:** prioriza habilidades Defensivas válidas; depois considera Agressivas.

**Misto:** Agressivas e Defensivas competem de forma mais direta segundo ordem dos slots e condições.

A implementação pode ajustar detalhes de prioridade após teste sem alterar o princípio desses três estilos.

## Condições defensivas configuráveis

Habilidades defensivas podem usar limiar percentual configurável pelo jogador.

Exemplos:
- Vida ≤ X%;
- Mana ≤ X%;
- Stamina ≤ X%;
- futuramente, aliado com Vida ≤ X%.

A condição é verificada quando chega o momento de ação. A Build 0.1 não precisa de editor de lógica, AND/OR ou scripting.

## Consumíveis em combate

A Build 0.1 usa **2 slots de consumíveis**.

Cada slot pode possuir condição automática simples, como Vida, Mana ou Stamina abaixo de um percentual.

Prioridade:

```text
Consumível 1 → Consumível 2
```

Uso automático ou manual ocupa a ação atual.

> **Jogar ativamente concede controle, não ações extras.**

O jogo executa o limiar configurado pelo jogador e não utiliza IA oculta para ignorar a configuração por considerar o uso “ineficiente”.

Cooldown global provisório de consumíveis: **8 segundos** após o uso de qualquer consumível.

Durante Dungeon, consumíveis vêm da preparação da expedição. Não existe acesso ao Banco durante a run.

## Telegraphs, preparação e interrupções

Ataques normais resolvem na ação. Habilidades perigosas podem possuir tempo de preparação.

Durante um telegraph:
- o usuário fica comprometido com a ação;
- não realiza ataques básicos ou outras habilidades;
- outros combatentes continuam agindo normalmente;
- ao resolver, o intervalo normal do usuário reinicia.

A UI deve comunicar pelo menos nome, ícone, barra regressiva, alvo quando aplicável, destaque visual e registro no log.

Não existe botão universal de interrupção.

Interrupções vêm de Atordoamento ou de efeitos/habilidades que explicitamente possam interromper.

Uma habilidade telegráfica pode ser:
- **Interrompível**;
- **Resistente**;
- **Ininterruptível**.

Se uma habilidade for interrompida:
- seu efeito não ocorre;
- ela entra em cooldown normalmente.

Morte durante a preparação cancela a ação, salvo exceção futura explícita.

Habilidades começam o combate disponíveis, salvo regra individual. Uma habilidade pode possuir **Atraso Inicial** para controlar quando pode ser escolhida pela primeira vez sem alterar seu cooldown normal.

## Ordem determinística de ações

Uma ação já iniciada resolve antes de uma nova ação que fique disponível exatamente no mesmo instante, salvo interrupção válida.

Se duas novas ações ficam disponíveis no mesmo timestamp, a referência é:

```text
1. personagem principal
2. parceiros pela posição
3. inimigos
```

Na Build 0.1 Solo, personagem principal vence empate exato contra inimigo.

## Fases de Boss

Quando a Vida cruza o limiar de uma nova fase, uma ação já iniciada termina normalmente. A mudança de fase ocorre depois da resolução da ação atual.

Para Fairtheoir:
- Fase 1: **O Vigia**;
- Fase 2: **Desespero**;
- limiar numérico ainda **A definir**.

**Última Investida** deve possuir telegraph longo, dano alto de Impacto, buildup alto de Atordoamento e janela posterior de vulnerabilidade.

## Comportamento de inimigos

Inimigos e Bosses utilizam a mesma fundação temporal e de resolução do combate, mas não precisam imitar os quatro slots configuráveis do jogador.

Cada inimigo pode possuir sua própria lista de comportamentos, condições, cooldowns, fases e Atrasos Iniciais.

> **O motor de combate fornece regras universais; a identidade do inimigo surge da combinação dessas regras.**

## Ciclos que precisam fechar
A Build de Validação deve permitir testar pelo menos os seguintes encadeamentos conceituais:

> **Tempo → recurso → progressão**

> **Recurso → crafting → equipamento**

> **Equipamento + build → combate**

> **Combate → loot → nova preparação**

> **Preparação → Dungeon → risco/recompensa**

> **Exploração → informação → decisão narrativa**

> **Decisão → estado persistente**

> **Progressão longa → Prestígio → nova forma de executar sistemas**

O último ciclo pode ser testado com progressão acelerada interna enquanto a duração real ainda não estiver balanceada.

## Perguntas de validação
A build deve revelar, entre outros problemas:
- crafting demora demais ou de menos;
- loot de Dungeon invalida Forja;
- Mana ou Stamina não criam decisões reais;
- recursos Idle entram rápido/lento demais na economia;
- consumíveis são irrelevantes ou obrigatórios;
- raridade procedural supera demais identidade-base;
- Dún Liath fica longa/curta demais;
- escolha Matar/Poupar perde impacto na execução;
- atributos não geram builds suficientemente distintas;
- Destreza concentra poder demais;
- automação não deixa claro por que uma ação foi escolhida;
- Prestige não altera a execução de forma percebida.

O plano operacional, cenários de teste e critérios de sucesso da Build 0.1 são mantidos também em `docs/BUILD_0.1_TESTES.md`.

Arquitetura técnica, modelagem de dados e decisões de implementação continuam deliberadamente posteriores ao fechamento do design necessário para essa validação.

---

## Conclusão do projeto

##### Créditos
A definir.

##### Desvio da idealização inicial
Será registrado conforme o projeto evoluir.

##### Defeitos e mudanças posteriores
Registrar:
- melhorias;
- expansões;
- novos sistemas;
- mudanças de balanceamento;
- resultados da Build de Validação;
- feedback futuro.

---

## Observações atuais

O projeto deve permanecer modular e preparado para expansão.

Princípios centrais consolidados:

> A classe define o começo, não o destino do personagem.

> Todas as classes usam o mesmo orçamento inicial de atributos; referência atual de 35 pontos.

> Existem sete presentes iniciais e nenhum concede vantagem permanente dominante ou conteúdo essencial exclusivo.

> Existem exatamente sete skills: Mineração, Lenhador, Pesca, Herbologia, Metalurgia, Forja e Culinária.

> Atividades Idle entregam apenas o resultado escolhido, XP e possíveis unidades adicionais desse mesmo resultado; materiais especiais possuem fontes explícitas.

> Prestígio muda a forma de executar a skill, não apenas números.

> O antigo endgame se torna o novo início após Prestígio.

> A Árvore de Prestígio do personagem possui 32 nós, quatro ramos puros e quatro combinações híbridas iniciais.

> Combate é automático, mas build, preparação, equipamentos, habilidades e escolhas determinam o resultado.

> Uma habilidade ativa substitui o ataque básico daquela ação; não acontece gratuitamente em paralelo.

> O personagem equipa até quatro habilidades ativas e a ordem dos slots participa da prioridade real da automação.

> Habilidades defensivas podem utilizar limiares percentuais configuráveis pelo jogador.

> A Build 0.1 usa dois slots de consumíveis; uso manual ou automático consome a ação e compartilha cooldown global provisório de 8 segundos.

> Telegraphs não pausam os demais combatentes e podem possuir regras explícitas de interrupção.

> Inimigos usam a mesma fundação temporal de combate, mas possuem comportamentos próprios em vez de copiar os quatro slots do jogador.

> Inimigos são Comuns, Elites ou Bosses e usam sete tipos de dano e cinco status principais.

> Quanto mais perigosa uma habilidade, mais legível ela deve ser.

> Dificuldades alteram comportamento, mecânicas e conteúdo, não apenas Vida e dano.

> Dungeons possuem identidade fixa e exploração procedural; a geração nunca deve contradizer a história do local.

> Escolhas narrativas mudam caminhos e conteúdo, não escolhem entre recompensa e castigo.

> Dún Liath — A Fortaleza Cinzenta é a primeira Dungeon oficial e funciona como fortificação humana antiga transformada em refúgio sitiado por uma comunidade monstruosa.

> Crúbach e Tromghiallach são os dois Comuns básicos de Dún Liath; Cosantóir é o Elite defensivo; Fairtheoir — O Último Vigia é o Boss fixo.

> A progressão dos defensores de Dún Liath é Patrulha → Resistência → Defesa → Proteção → Último Vigia.

> Fairtheoir possui duas fases e sua segunda fase representa Desespero, não apenas aumento numérico.

> Dún Liath utiliza Sucata de Dún Liath como material geral e Fragmento de Fairtheoir como recurso exclusivo garantido do Boss.

> Os primeiros clears de Dún Liath garantem Guarda Instintiva no Fácil, Reforço do Vigia no Normal, Escudo do Último Vigia no Difícil e Lacre do Comandante no Impossível.

> O Arquivo Selado e o Selo de Dún Liath representam a camada de segredo de longo prazo da primeira Dungeon.

> Selo de Dún Liath é Relíquia e sua mecânica Trégua Instável recompensa alternância apropriada entre perfis Agressivo e Defensivo; valores permanecem A definir.

> Fácil ensina cada peça; Normal ensina como as peças trabalham juntas; Difícil exige resposta aos sistemas; Impossível exige domínio completo da Dungeon.

> A primeira Dungeon não revela a verdade; ela apenas cria a primeira rachadura na versão que o jogador recebeu.

> Mira é a primeira parceira recrutável, é encontrada sobrevivendo sozinha na segunda Dungeon e introduz Party/Aggro por cooperação pragmática.

> Mira nunca abandona a party por discordância e sua quest pessoal não é uma história de vingança.

> O primeiro encontro de um parceiro deve demonstrar quem ele é antes de explicar sua ficha.

> Relíquias são os únicos itens negociáveis entre jogadores e nunca são craftáveis.

> A Cidade Livre possui inicialmente somente Taverna, Banco, Relicário, Mercado e Ferreiro.

> O mundo não utiliza regiões nem viagem como estrutura de progressão.

> O mundo possui identidade atlântica sombria inspirada em tradições célticas e nórdicas sem representar literalmente países reais.

> Nomes culturais podem funcionar como pistas históricas; termos funcionais de sistema permanecem em português.

> Humanos e monstros possuem capacidade moral e política equivalente; aparência é a principal diferença percebida e não possui valor social entre monstros.

> A guerra é antiga demais para que sua origem seja conhecida com certeza; ambos os lados cometeram atrocidades e produzem versões contraditórias do passado.

> Existem dois finais principais: continuar o ciclo ou romper o ciclo, sem classificação oficial de bom ou ruim.

> A Build 0.1 é a primeira fundação real e incremental do jogo, com conteúdo reduzido e endpoint natural no primeiro clear de Dún Liath no Fácil.

> Cada build incrementa a anterior; sistemas centrais não são protótipos descartáveis.

> O foco atual é montar a Build de Validação Interna para verificar se os sistemas já definidos fecham juntos antes de expandir o mundo ou entrar na arquitetura técnica definitiva.
