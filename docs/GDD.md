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
O personagem utilizará:

- **Vida**
- **Mana**
- **Stamina**

Relação principal:

```text
Vitalidade → Vida
Mente      → Mana
Vigor      → Stamina
```

##### Liberdade de build
A classe define apenas o ponto de partida.

Um Guerreiro pode investir futuramente em:

- Mente;
- Inteligência;
- Fé;

e se tornar um personagem mágico ou híbrido.

Da mesma forma, um Mago pode investir em:

- Força;
- Vitalidade;
- Vigor;

e se tornar um combatente físico.

Regra principal:

> A classe define o começo, não o destino do personagem.

##### Requisitos e scaling
Equipamentos, armas e habilidades poderão possuir requisitos de atributos.

Exemplo:

```text
Espadão do Carrasco

Força necessária: 24
Destreza necessária: 8
```

Também poderão possuir scaling.

Exemplo:

```text
Espada do Cavaleiro

Força      B
Destreza   D
```

Ou:

```text
Lâmina Arcana

Força         C
Destreza      D
Inteligência  A
```

A eficiência de um equipamento dependerá da build construída pelo jogador.

---

## Classes

##### Classes iniciais
Classes definidas:

- Guerreiro
- Mago
- Caçador
- Acólito
- Ladino
- Errante

##### Funções iniciais
- **Guerreiro:** combate corpo a corpo, vida, defesa, Força e Vigor.
- **Mago:** Mente, Inteligência, Mana e magia.
- **Caçador:** Destreza, precisão e combate à distância.
- **Acólito:** Fé, Mente, cura e suporte.
- **Ladino:** Destreza, crítico e velocidade.
- **Errante:** início equilibrado e sem especialização forte.

##### Presente inicial
O presente é escolhido separadamente da classe.

Poderá incluir:

- chave;
- consumível raro;
- moeda;
- anel;
- material misterioso;
- item com utilidade futura;
- opção de não escolher presente.

---

## Skills

##### Filosofia
O jogo terá poucas skills, porém cada uma representará uma profissão ampla e profunda.

A complexidade virá de:

- atividades;
- técnicas;
- receitas;
- materiais;
- Prestígios;
- conteúdos desbloqueados.

Regra principal:

> O jogo terá poucas skills, porém cada uma representará uma profissão ampla e profunda. A complexidade virá das atividades, técnicas, receitas, materiais e Prestígios, e não da criação excessiva de skills semelhantes.

##### Skills iniciais
As 7 skills principais serão:

1. **Mineração** → minérios, pedras e gemas.
2. **Lenhador** → madeiras e recursos de árvores.
3. **Pesca** → peixes e recursos aquáticos.
4. **Herbologia** → plantas, ervas, fungos e ingredientes raros.
5. **Metalurgia** → transforma minérios em barras e ligas.
6. **Forja** → armas, armaduras, equipamentos metálicos, arcos, acessórios, couro, tecidos e outros equipamentos.
7. **Culinária** → alimentos, buffs, poções, consumíveis e preparados especiais.

##### Skill e atividade
Uma **skill** representa aquilo que o personagem aprende e evolui.

Uma **atividade** representa aquilo que o jogador faz utilizando uma skill.

Exemplo:

```text
Skill: Mineração

Atividades:
- Mina de Pedra
- Mina de Cobre
- Mina de Ferro
- Mina de Ouro
```

As atividades concedem experiência para a skill relacionada.

##### Técnicas internas
Uma skill poderá possuir técnicas ou categorias internas sem que elas sejam novas skills.

Exemplo:

```text
FORJA
│
├── Ferraria
│   └── espadas, machados e armaduras
│
├── Couraria
│   └── couro e armaduras leves
│
├── Tecelagem
│   └── vestes e tecidos
│
├── Arquearia
│   └── arcos
│
└── Ourivesaria
    └── anéis e amuletos
```

Essas técnicas fazem parte da mesma progressão de Forja.

##### Herbologia e Culinária
Herbologia será responsável principalmente pela coleta e preparação de ingredientes naturais.

Culinária será responsável por transformar ingredientes em itens consumíveis.

Exemplo:

```text
Herbologia
↓
Ervas
Fungos
Raízes
Ingredientes raros

Culinária
↓
Alimentos
Bebidas
Poções
Elixires
Antídotos
Preparados especiais
```

##### Progressão
Cada skill possui nível de **1 a 99**.

Ao alcançar o nível 99, a skill poderá realizar Prestígio.

Cada skill poderá chegar até:

- Prestígio I;
- Prestígio II;
- Prestígio III.

##### Prestígio de Skill
Ao realizar Prestígio, a skill volta ao nível 1, porém não repete simplesmente o mesmo conteúdo.

O antigo conteúdo final passa a ser o novo ponto de partida.

Exemplo:

```text
Mineração normal
Nv. 1 → materiais básicos
...
Nv. 99 → Ouro

Prestígio I
Nv. 1 → Ouro
...
Nv. 99 → novo material exclusivo
```

Regra principal:

> O antigo endgame se torna o novo início.

Cada Prestígio deverá trazer:

- novos conteúdos;
- novos materiais;
- novas atividades;
- novas técnicas;
- novos drops;
- novos equipamentos;
- novos talentos ou bônus;
- recompensas exclusivas.

A progressão deverá ficar mais longa a cada Prestígio.

##### Crafting
Crafting também fará parte da progressão Idle.

O jogador poderá iniciar produções em quantidade e deixá-las sendo processadas ao longo do tempo.

Exemplo:

```text
Produzir 100 barras
Tempo: 1h 35min
```

##### Receitas
Receitas poderão ser desbloqueadas por uma combinação de:

- nível da skill;
- Prestígio;
- Dungeons;
- NPCs;
- quests;
- eventos;
- exploração.

Receitas comuns tendem a ser desbloqueadas pela progressão normal.

Receitas especiais poderão exigir conteúdo específico do mundo.

##### Receitas combinadas
Receitas avançadas poderão exigir múltiplas skills.

Exemplo:

```text
Lâmina Arcana

Requisitos:
Forja 75
Metalurgia 70
Herbologia 40

Materiais:
Liga especial
Cristal arcano
Essência rara
```

##### Crafting procedural
Itens fabricados também poderão gerar raridade e atributos procedurais.

A raridade do item produzido será aleatória.

As chances poderão melhorar conforme:

- nível da skill;
- Prestígio;
- qualidade dos materiais;
- bônus do personagem.

Exemplo:

```text
Forjar Espada de Aço
↓
Comum
Incomum
Raro
Épico
Lendário
```

Mesmo dois itens Lendários produzidos pela mesma receita poderão ter atributos diferentes.

Regra principal:

> Crafting também é uma forma de buscar loot.

##### Materiais e identidade
O material utilizado poderá influenciar as características base do equipamento.

Exemplo:

```text
Ferro
→ equipamento básico

Aço
→ melhor dano ou defesa

Mithril
→ maior eficiência

Obsidiana
→ características próprias
```

O item final será resultado de três camadas:

```text
RECEITA
define o item

+

MATERIAL
define características base

+

RARIDADE PROCEDURAL
define atributos aleatórios

=

EQUIPAMENTO FINAL
```

##### Relíquias e Crafting
Relíquias nunca poderão ser fabricadas.

Nem Prestígio, receita secreta ou materiais especiais permitirão criar uma Relíquia.

##### Upgrade de equipamentos
O upgrade +1 poderá utilizar materiais obtidos por:

- atividades;
- produção;
- drops comuns;
- Dungeons.

O upgrade +2 deverá exigir pelo menos um material especial obtido em conteúdos como:

- Dungeons;
- Bosses;
- eventos especiais.

##### Desmontagem
Desmontar equipamentos concederá apenas dinheiro.

Não será utilizado como fonte de materiais de crafting.


## Prestígio do personagem

##### Requisito
O Prestígio do personagem só será liberado quando:

> Todas as skills tiverem pelo menos **Prestígio I**.

##### Funcionamento
O personagem poderá alcançar:

- Prestígio I;
- Prestígio II;
- Prestígio III.

Ao prestigiar:

- o nível geral volta para 1;
- a progressão de nível começa novamente;
- os pontos normais de atributo podem ser redistribuídos durante a nova jornada;
- o personagem mantém seu progresso permanente;
- uma nova camada da Árvore de Prestígio é utilizada.

Cada Prestígio concede:

> **5 Pontos de Prestígio.**

Total máximo:

> **15 Pontos de Prestígio.**

##### Árvore de Prestígio
Os Pontos de Prestígio são permanentes e utilizados em uma árvore própria.

A árvore terá mais opções do que pontos disponíveis, obrigando o jogador a fazer escolhas.

Ramos principais:

- **Corpo**
- **Arcano**
- **Espírito**
- **Técnica**

Também poderão existir nós híbridos entre os ramos.

##### Corpo
Focado em:

- Vida;
- Stamina;
- Força;
- resistência;
- equipamentos pesados.

##### Arcano
Focado em:

- Mana;
- Inteligência;
- regeneração;
- eficiência de magias;
- redução de custos.

##### Espírito
Focado em:

- Fé;
- cura;
- suporte;
- resistência;
- benefícios para a party.

##### Técnica
Focado em:

- Destreza;
- velocidade;
- crítico;
- precisão;
- versatilidade com armas.

##### Nós híbridos
Poderão existir combinações como:

```text
Corpo + Arcano
→ Guerreiro Arcano

Corpo + Espírito
→ Paladino

Técnica + Arcano
→ Lâmina Arcana

Técnica + Espírito
→ Inquisidor
```

Esses nomes representam caminhos de build, não novas classes.

Regra principal:

> Os primeiros nós melhoram a base da build; os nós mais avançados devem mudar a forma de jogar.

---

## Progressão offline

O tempo de atividade offline aumenta conforme o nível geral do personagem.

A cada **10 níveis**, o limite aumenta em **2 horas**.

---

## Combate

##### Conceito
O combate será automático em tempo real.

Cada personagem terá:

- velocidade própria de ataque;
- habilidades;
- tempo de recarga;
- recursos;
- comportamento configurável.

Regra principal:

> O jogador não precisa executar cada ataque, mas sua preparação e suas escolhas devem determinar o resultado.

##### Ataques
Cada arma ou personagem poderá possuir uma velocidade própria.

Exemplo:

```text
Espadão
Ataque a cada 3,4s

Adaga
Ataque a cada 1,2s
```

Atributos e equipamentos poderão modificar essa velocidade.

##### Habilidades
Habilidades serão utilizadas automaticamente quando:

- o tempo de recarga terminar;
- houver recurso suficiente;
- a condição da habilidade for atendida.

Exemplo:

```text
Golpe Pesado
Cooldown: 8s
Custo: 30 Stamina

↓
Cooldown terminou
↓
Possui recurso
↓
Usa automaticamente
```

##### Consumíveis
Consumíveis poderão ser utilizados:

- manualmente;
- automaticamente.

O uso automático poderá ser configurado por condição.

Exemplo:

```text
Poção de Vida

Usar quando:
Vida ≤ 30%
```

##### Morte fora de Dungeons
Ao morrer fora de uma Dungeon:

- o personagem retorna para a cidade;
- perde dinheiro.

A quantidade perdida será calculada conforme o nível do personagem.

Os valores exatos serão definidos durante o balanceamento.

---

## Party e parceiros

##### Party
Existirão Dungeons Solo e Dungeons em Party.

Nas Dungeons em Party, o grupo será formado por:

- personagem principal;
- até 3 parceiros.

O jogador poderá substituir ou expulsar membros.

##### Parceiros
Parceiros poderão ser encontrados durante:

- Dungeons;
- história;
- quests;
- eventos.

Eles não terão um sistema completo de níveis e skills como o personagem principal.

Sua evolução será baseada principalmente na relação com o jogador.

Cada parceiro fixo deverá possuir:

- identidade narrativa própria;
- vantagem mecânica exclusiva;
- função específica na party;
- diálogos e acontecimentos próprios;
- possíveis quests pessoais.

Regra principal:

> Nenhum parceiro deve existir apenas como uma versão numericamente melhor de outro.

##### Relação
A relação poderá evoluir.

Exemplo:

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

Uma relação maior poderá liberar:

- bônus em Dungeons;
- habilidades;
- passivas;
- diálogos;
- quests;
- informações sobre o mundo;
- vantagens exclusivas.

Decisões do jogador poderão aumentar ou diminuir a relação.

Em alguns casos, um parceiro poderá abandonar o jogador.

Não haverá sistema de romance.

##### Cidade / Taverna
Parceiros recrutados poderão permanecer em uma cidade ou taverna.

Esse local funcionará como ponto de encontro e gerenciamento da party.

---

## Dungeons

##### Conceito
Dungeons são expedições compostas por:

- combates automáticos;
- caminhos;
- eventos;
- decisões;
- armadilhas;
- segredos;
- Boss.

O jogador é responsável principalmente pela preparação e pelas decisões de exploração.

##### Identidade
Cada Dungeon representa um local fixo do mundo.

Exemplos:

- Castelo Abandonado;
- Cripta;
- Mina;
- Torre;
- Floresta.

Cada Dungeon terá:

- temática própria;
- inimigos próprios;
- eventos;
- salas;
- segredos;
- recompensas;
- Boss único.

O Boss será fixo e funcionará como parte central da identidade da Dungeon.

##### Geração procedural
Apesar de o local ser fixo, a estrutura interna será gerada proceduralmente a cada tentativa.

Poderão variar:

- quantidade e ordem das salas;
- inimigos;
- eventos;
- bifurcações;
- elites;
- armadilhas;
- salas secretas;
- salas de recuperação.

A geração procedural deverá respeitar a identidade da Dungeon.

##### Dungeons Solo
Dungeons Solo terão inicialmente entre:

> **15 e 20 salas.**

Novas Dungeons poderão aumentar aproximadamente:

> **2 a 4 salas por etapa.**

##### Dungeons em Party
Dungeons em Party terão inicialmente entre:

> **30 e 40 salas.**

Novas Dungeons poderão aumentar aproximadamente:

> **2 a 4 salas por etapa.**

##### Tamanho desconhecido
O jogador não saberá previamente quantas salas a Dungeon possui naquela tentativa.

O Boss estará sempre no final.

##### Caminhos
Dungeons poderão possuir bifurcações.

Cada caminho terá uma breve descrição.

Exemplo:

```text
Esquerda:
"Você escuta metal sendo arrastado pelo chão."

Direita:
"Um vento gelado atravessa o corredor."
```

Ao escolher um caminho:

> O jogador segue em frente e não pode retornar naquela tentativa.

Em uma nova tentativa, a Dungeon será gerada novamente e novos caminhos poderão aparecer.

##### Tipos de sala
Poderão existir:

- combate;
- elite;
- evento;
- recuperação;
- tesouro;
- armadilha;
- secreta;
- Boss.

##### Recuperação
Não existirão checkpoints seguros.

Algumas salas poderão restaurar:

- Vida;
- Mana;
- Stamina;
- outros recursos de combate.

Essas salas não protegem o loot.

##### Armadilhas
Armadilhas poderão:

- causar dano;
- aplicar efeitos negativos;
- consumir recursos;
- iniciar combates;
- bloquear caminhos;
- ativar eventos.

Poderão ser detectadas ou contornadas através de:

- parceiros;
- atributos;
- skills;
- equipamentos;
- itens.

##### Requisitos especiais
Algumas salas ou caminhos poderão exigir:

- atributo mínimo;
- determinada skill;
- chave;
- parceiro específico;
- equipamento;
- item encontrado dentro da Dungeon.

##### Eventos persistentes
Alguns eventos poderão gerar consequências permanentes no mundo.

Poderão:

- revelar personagens;
- abrir quests;
- alterar relações;
- desbloquear serviços;
- modificar acontecimentos futuros.

##### Segredos
Salas e eventos secretos serão difíceis de encontrar.

O jogador poderá concluir uma Dungeon diversas vezes sem descobrir tudo que existe nela.

Os melhores conteúdos ativos poderão estar ligados a:

- salas secretas;
- eventos secretos;
- Boss.

##### Morte
Ao morrer dentro de uma Dungeon:

- o personagem renasce na cidade;
- mantém tudo que possuía antes de entrar;
- perde todo item e recurso obtido naquela tentativa.

##### Decisão antes do Boss
O jogador não poderá abandonar a Dungeon a qualquer momento levando o loot.

A oportunidade de retirada acontece antes de entrar na sala do Boss.

Nesse ponto poderá escolher:

```text
Retornar à cidade
→ mantém todo o loot obtido

ou

Enfrentar o Boss
→ arrisca todo o loot
→ pode receber as melhores recompensas
```

##### Dificuldade
Uma Dungeon poderá possuir várias dificuldades.

A próxima dificuldade só ficará disponível depois que a anterior for concluída.

Dificuldades maiores poderão modificar:

- força dos inimigos;
- quantidade de salas;
- eventos;
- elites;
- mecânicas;
- comportamento do Boss;
- recompensas.

##### Modo Idle
Depois que uma Dungeon for concluída, ela poderá liberar uma versão Idle.

O modo Idle possuirá uma dificuldade própria e padronizada.

A expedição Idle terá:

- duração;
- chance de sucesso;
- drops úteis;
- equipamentos;
- materiais;
- recompensas raras.

Porém:

> Os melhores drops serão exclusivos da exploração ativa.

Salas secretas, eventos secretos e as melhores recompensas do Boss deverão incentivar o jogador a realizar a Dungeon ativamente.

Se uma expedição Idle falhar, aquela execução não entregará as recompensas esperadas.

---

## Equipamentos

##### Slots de equipamento
O personagem poderá equipar:

- Cabeça
- Peitoral
- Luvas
- Pernas
- Botas
- Arma principal
- Mão secundária / Escudo
- Amuleto
- Anel 1
- Anel 2

##### Tipos de armas iniciais
- Espada
- Espadão
- Machado
- Lança
- Adaga
- Arco
- Cajado
- Catalisador mágico
- Escudo

##### Peso
Não haverá sistema de peso de equipamentos.

##### Atributos procedurais
Equipamentos normais possuem uma parte fixa e uma parte procedural.

A parte fixa define:

- nome;
- tipo;
- dano ou defesa base;
- requisitos;
- scaling principal.

A parte procedural adiciona atributos aleatórios conforme a raridade.

Regra principal:

> Os atributos procedurais não são limitados pela função tradicional do item.

Uma espada poderá receber Vigor, Mente ou Inteligência, assim como um cajado poderá receber Força, Vitalidade ou Destreza.

A raridade define a quantidade de atributos aleatórios:

```text
Comum      → 1
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Não existirão atributos negativos nem nomes procedurais.

##### Upgrade
Todo equipamento poderá ser melhorado até:

```text
+0
+1
+2
```

O upgrade:

- nunca falha;
- melhora somente os atributos base;
- não altera atributos procedurais;
- não altera efeitos únicos.

Não haverá durabilidade.

O upgrade +1 poderá utilizar materiais de atividades, produção e drops comuns.

O upgrade +2 deverá exigir pelo menos um material especial obtido em conteúdo como:

- Dungeons;
- Bosses;
- eventos especiais.

Não haverá custo em dinheiro para realizar upgrades.

##### Troca em Dungeons
Durante uma Dungeon, equipamentos só poderão ser trocados em salas de recuperação/cura.

---

## Inventário e armazenamento

##### Inventário
O inventário terá espaço limitado.

O jogador poderá aumentar sua capacidade permanentemente ao longo da progressão.

Expansões de inventário e banco poderão exigir dinheiro e requisitos de progressão.

##### Empilhamento
Materiais e consumíveis poderão ser empilhados.

Exemplos:

- minérios;
- madeiras;
- peixes;
- ervas;
- barras;
- alimentos;
- poções.

Equipamentos ocuparão slots individuais, pois podem possuir atributos procedurais diferentes.

##### Banco
A cidade possuirá um banco/baú para armazenamento geral.

O banco será separado do inventário carregado pelo personagem.

##### Bolsa de Dungeon
O loot obtido durante uma Dungeon será armazenado em uma bolsa de expedição separada.

Se o jogador morrer:

> Todo o conteúdo da bolsa daquela tentativa é perdido.

Ao sair antes do Boss ou concluir a Dungeon, o conteúdo poderá ser transferido para o armazenamento normal.

##### Relicário
Relíquias possuirão um armazenamento e coleção próprios: o **Relicário**.

O Relicário exibirá informações como:

- nome;
- número/identificador;
- origem;
- primeiro dono;
- dono atual;
- histórico de donos.

##### Organização
O inventário e banco deverão possuir filtros e organização automática.

Filtros previstos:

- tipo;
- raridade;
- atributo;
- upgrade;
- equipamento;
- material;
- consumível.

Itens poderão ser marcados como:

- favoritos;
- bloqueados.

Isso evitará vendas ou desmontagens acidentais.

---

## Itens e mercado

##### Atributos procedurais de equipamentos
Equipamentos normais terão uma parte fixa e uma parte procedural.

A parte fixa define a identidade do item, como:

- nome;
- tipo;
- dano ou defesa base;
- requisitos;
- scaling principal.

A parte procedural adiciona atributos aleatórios conforme a raridade.

Regra principal:

> Os atributos procedurais não são limitados pela função tradicional do item.

Isso significa que uma espada poderá receber Vigor, Mente ou Inteligência, assim como um cajado poderá receber Força, Vitalidade ou Destreza.

O objetivo é permitir combinações incomuns, favorecer builds híbridas e incentivar a busca por versões específicas de um mesmo equipamento.

Exemplo:

```text
Espada do Vigia
Raridade: Raro

Base:
Dano: 42
Scaling:
Força B
Destreza C

Atributos aleatórios:
+4 Vigor
+3 Inteligência
+6% Crítico
```

A raridade define a quantidade de atributos aleatórios:

```text
Comum      → 1 atributo aleatório
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Não existirão atributos negativos nem nomes procedurais.

Dois equipamentos com o mesmo nome poderão ter combinações diferentes de atributos.

##### Upgrade de equipamentos
Equipamentos poderão ser melhorados até:

```text
+0
+1
+2
```

O upgrade:

- nunca falha;
- melhora apenas os atributos base;
- não altera os atributos procedurais;
- não altera efeitos únicos.

Não haverá durabilidade.

##### Troca de equipamentos em Dungeons
Durante uma Dungeon, o jogador só poderá trocar equipamentos em salas de recuperação/cura.

##### Relíquias
Relíquias são exceção ao sistema procedural comum.

Elas terão:

- identidade fixa;
- efeito único;
- poder elevado;
- histórico de donos;
- regra própria de obtenção;
- possibilidade de pequena variação em atributos secundários, quando aplicável.

O principal valor de uma Relíquia deverá vir de seu efeito único e de sua importância dentro do mundo, e não apenas da quantidade de atributos aleatórios.


##### Raridade
A raridade normal poderá seguir categorias como:

- Comum
- Incomum
- Raro
- Épico
- Lendário

Além delas, existirá uma categoria especial:

### Relíquia

Relíquias serão itens:

- extremamente raros;
- extremamente poderosos;
- negociáveis;
- especiais dentro do mundo;
- com histórico próprio.

Nem todo item raro será negociável.

O mercado entre jogadores será focado principalmente em Relíquias e outros itens excepcionais.

##### Histórico de donos
Cada Relíquia deverá manter o histórico de propriedade.

Exemplo:

```text
Lâmina do Primeiro Rei
Relíquia #00017

Descoberta por:
Thoren

Antigos donos:
Thoren
Eldric
Vael

Dono atual:
Arkan
```

##### Eventos limitados
Alguns eventos poderão possuir itens de quantidade global limitada.

Exemplo:

```text
100 unidades existentes
```

##### Mercado
O mercado funcionará inicialmente por preço fixo.

Fluxo:

```text
Jogador anuncia Relíquia
↓
Define preço
↓
Outro jogador compra
↓
Item muda de dono
↓
Histórico é atualizado
```

---

## Economia

##### Moeda
O jogo utilizará **uma única moeda principal**.

Essa moeda será usada em:

- comerciantes;
- expansões de inventário;
- expansões de banco;
- compras de NPCs;
- mercado de Relíquias;
- outros serviços da cidade.

##### Venda para NPCs
NPCs poderão comprar itens comuns e equipamentos por valores definidos pelo sistema.

Itens desmontados também serão convertidos somente em dinheiro.

##### Mercado entre jogadores
Somente **Relíquias** poderão ser negociadas entre jogadores.

O vendedor poderá definir livremente o preço.

O anúncio não expira e permanece ativo até:

- ser vendido;
- ser cancelado pelo vendedor.

Cada jogador terá um limite de anúncios simultâneos.

##### Taxa de mercado
Toda venda no mercado terá uma taxa.

Essa taxa será removida da economia e funcionará como mecanismo de controle de inflação.

##### Histórico de mercado
O mercado deverá registrar informações como:

- última venda;
- média de vendas;
- maior venda registrada;
- quantidade de negociações;
- histórico da Relíquia.

##### Custos e sinks
A moeda será removida da economia por meios como:

- expansões de inventário;
- expansões de banco;
- taxas de mercado;
- morte fora de Dungeons;
- serviços de NPCs, quando aplicável.

##### Crafting e upgrades
Crafting comum não terá custo em dinheiro.

Upgrades +1 e +2 também não terão custo em dinheiro, exigindo apenas os materiais definidos.

##### Dungeons
Dungeons normais não cobrarão dinheiro para entrada.

Conteúdos especiais poderão exigir itens, chaves ou condições próprias, mas não uma taxa monetária padrão.

##### Prestígio
Prestígios não terão custo em dinheiro.

##### Comerciantes e serviços
A cidade poderá possuir NPCs especializados, como:

- ferreiro;
- cozinheiro;
- mercador;
- curandeiro;
- vendedor de materiais básicos.

NPCs poderão vender equipamentos, porém apenas opções básicas.

Equipamentos relevantes para progressão avançada deverão vir principalmente de:

- crafting;
- exploração;
- Dungeons;
- Bosses;
- eventos.

##### Morte fora de Dungeons
Ao morrer fora de uma Dungeon:

- o personagem retorna para a cidade;
- perde uma quantidade de dinheiro calculada conforme seu nível.

O dinheiro perdido é removido da economia.

---

## Cidade e estrutura do mundo

##### Cidade principal
O jogo terá inicialmente **uma única cidade principal**.

A cidade funcionará como centro de:

- NPCs;
- serviços;
- comércio;
- gerenciamento;
- narrativa;
- preparação para Dungeons.

A cidade será uma **cidade livre e território de trégua**.

Dentro de seus limites:

- conflitos entre humanos e monstros são proibidos;
- comércio é permitido entre ambos;
- origem e aparência não determinam direitos;
- dinheiro, contratos e estabilidade têm prioridade sobre disputas externas.

Humanos e monstros poderão coexistir dentro da cidade mesmo quando exista tensão entre eles.

Existe a possibilidade de expansão futura, porém novas cidades não fazem parte da estrutura inicial.

##### Estruturas da cidade
A cidade terá inicialmente somente:

- **Taverna** → parceiros e NPCs;
- **Banco** → armazenamento;
- **Relicário** → coleção e gestão de Relíquias;
- **Mercado** → negociação de Relíquias entre jogadores;
- **Ferreiro** → serviços relacionados a equipamentos.

##### Estrutura do mundo
O jogo não utilizará regiões como estrutura de progressão.

Não haverá sistema de viagem entre regiões.

Atividades e Dungeons serão acessadas diretamente pelos próprios sistemas do jogo, respeitando seus requisitos quando existirem.

##### Progressão da cidade
Por enquanto, a cidade não possuirá sistema próprio de evolução ou níveis.

##### Cidade como ponto narrativo
A cidade será o principal ponto de encontro dos NPCs.

NPCs poderão aparecer na cidade em consequência de:

- Dungeons;
- quests;
- eventos;
- decisões do jogador;
- progressão narrativa.

Exemplo:

```text
Jogador encontra ou ajuda um NPC
↓
acontecimento é concluído
↓
NPC passa a aparecer na cidade
↓
novos diálogos, quests ou interações ficam disponíveis
```

##### Eventos na cidade
Eventos poderão afetar temporariamente a cidade.

Exemplos:

- invasões;
- eclipses;
- epidemias;
- festivais;
- ataques de criaturas;
- chegada de novos grupos;
- mercadores especiais;
- eventos relacionados a Relíquias.

Esses eventos poderão alterar temporariamente:

- NPCs presentes;
- diálogos;
- quests;
- serviços;
- aparência da cidade;
- acontecimentos disponíveis.

---

## Quests, NPCs e narrativa

##### Tipos de quest
As quests serão divididas em:

- **Principal**
- **Secundária**
- **Parceiro**
- **Evento**
- **Secreta**

##### Quest principal
A quest principal conduzirá a narrativa central.

Ela não deverá bloquear a progressão Idle básica do personagem, mas poderá liberar ou apresentar conteúdos narrativos importantes.

##### Escolhas e consequências
Quests poderão apresentar escolhas com consequências.

Essas decisões poderão alterar:

- relação com parceiros;
- comportamento e diálogos de NPCs;
- quests futuras;
- recompensas;
- eventos;
- estados narrativos do jogo.

##### Falha de quests
Algumas quests poderão falhar permanentemente.

Esse recurso deverá ser utilizado com moderação para que determinadas decisões tenham peso real.

##### NPCs
NPCs não morrerão nem desaparecerão definitivamente como consequência das escolhas do jogador.

Entretanto, sua presença, comportamento, diálogos e disponibilidade poderão mudar conforme o estado narrativo.

##### Quests secretas
Quests secretas poderão existir sem marcador tradicional.

Elas poderão começar através de:

- itens;
- Dungeons;
- parceiros;
- diálogos;
- eventos;
- condições específicas;
- combinações pouco evidentes de ações.

Exemplo:

```text
Encontra item estranho
↓
conversa com NPC específico
↓
leva o item para uma Dungeon
↓
evento secreto é ativado
```

Regra principal:

> Quests não existem apenas em uma lista; elas podem nascer de itens, Dungeons, parceiros, diálogos e acontecimentos da cidade.

##### Marcadores
Quests normais terão marcador ou orientação clara.

Quests secretas poderão ocultar parte ou toda essa orientação.

##### Diálogos
Os diálogos serão curtos e objetivos.

Informações adicionais de lore poderão ser apresentadas de maneira opcional para jogadores que desejarem aprofundar-se no mundo.

##### Memória narrativa
NPCs deverão lembrar decisões relevantes realizadas pelo jogador.

Essas decisões serão refletidas em estados narrativos persistentes.

##### Requisitos de quest
Quests e interações poderão exigir condições como:

- nível de atributo;
- nível ou Prestígio de skill;
- item específico;
- parceiro específico;
- conclusão de outra quest;
- acontecimento anterior;
- condição narrativa.

Exemplo:

```text
Força 25
→ força uma porta

Herbologia 40
→ identifica uma substância

Fé 30
→ reconhece um ritual
```

---

## Prólogo e início do jogo

##### Origem do personagem
O personagem vem de uma **terra distante**, sem grandes explicações sobre seu passado.

A origem deverá permanecer propositalmente aberta.

##### Chegada à Cidade Livre
O personagem chega à Cidade Livre procurando:

- sobrevivência;
- trabalho;
- uma forma de recomeçar.

No início, ele não conhece sua possível relação com a profecia e não manifesta nenhum sinal especial ligado a ela.

##### Fluxo inicial
```text
Criação do personagem
↓
Escolha da classe
↓
Escolha do presente
↓
Chegada à Cidade Livre
↓
Conversa curta na Taverna
↓
Primeira atividade
↓
Primeiros equipamentos
↓
Primeira Dungeon
```

##### Tutorial
O tutorial será curto e integrado ao gameplay.

Apresentará apenas o essencial:

- atividades;
- equipamentos;
- combate;
- cidade;
- Dungeon.

O jogador começará sozinho.

O primeiro parceiro será introduzido posteriormente.

##### Visão inicial sobre os monstros
No começo, a narrativa apresentará principalmente a visão humana dominante.

Os monstros serão descritos como perigosos, irracionais e ameaças que precisam ser eliminadas.

Essa visão começará a ser questionada através dos acontecimentos da primeira Dungeon.

---

## Primeira Dungeon

##### Conceito
A primeira Dungeon será uma **fortificação militar abandonada** próxima à Cidade Livre.

O local já foi utilizado como posição militar durante a guerra.

Atualmente, uma pequena comunidade de monstros vive ali tentando sobreviver.

Os humanos tratam o local apenas como uma fortificação tomada por monstros.

##### Missão inicial
O jogador recebe a missão de um NPC humano ligado à **Ordem de Ferro**.

A missão é apresentada como um trabalho simples:

```text
Entrar na fortificação
↓
eliminar os monstros
↓
recuperar um objeto
↓
derrotar o Boss
```

##### Primeiro choque narrativo
Durante a exploração, o jogador encontra um monstro ferido protegendo outro monstro mais fraco.

O monstro:

- fala normalmente;
- demonstra medo;
- tenta proteger outro indivíduo;
- entende que os humanos vieram para matá-los.

Esse encontro será a primeira evidência clara de que a visão apresentada sobre os monstros está incompleta.

##### Primeira escolha
O jogador poderá:

```text
Matar
ou
Poupar
```

Nenhuma das opções será apresentada como moralmente correta.

Não existirão indicadores de bondade, maldade ou alinhamento moral.

A decisão terá consequências narrativas futuras.

##### Boss
O Boss será um monstro visualmente ameaçador e brutal.

Durante o combate, ele não falará.

Posteriormente será possível descobrir que:

> O Boss estava protegendo a comunidade de monstros que vivia na fortificação.

Essa descoberta deverá mudar retroativamente o significado do primeiro confronto.

##### Objeto recuperado
Dentro da Dungeon, o jogador encontrará um **fragmento de um antigo tratado entre humanos e monstros**.

Inicialmente poderá parecer apenas um documento antigo.

Mais tarde, ele servirá como uma das primeiras evidências de que humanos e monstros já tentaram negociar e coexistir no passado.

##### Retorno à Cidade Livre
Depois da Dungeon, o jogador retorna à Cidade Livre e conclui a missão.

```text
Retorna à cidade
↓
entrega o objetivo
↓
recebe pagamento
↓
NPC da Ordem de Ferro elogia a eliminação
↓
refere-se aos monstros como animais
```

Nesse momento, o jogador já sabe que essa descrição não corresponde completamente ao que presenciou.

Regra narrativa:

> A primeira Dungeon não revela a verdade; ela apenas cria a primeira rachadura na versão que o jogador recebeu.

---

## História

#### Lore
Dark Fantasy com construção de mundo inspirada em grandes eras, povos, conflitos e acontecimentos antigos.

A narrativa principal será construída sobre um conflito político entre **humanos e monstros**.

O jogo inicialmente apresenta grande parte do mundo através da visão humana, na qual monstros são tratados como criaturas inferiores, irracionais ou perigosas.

Com o avanço da história, o jogador começa a descobrir que essa visão é incompleta.

##### Monstros
Monstros possuem:

- inteligência;
- sentimentos;
- linguagem;
- memória;
- cultura;
- capacidade moral;
- interesses políticos.

Eles possuem capacidades emocionais e intelectuais equivalentes às dos humanos.

A principal diferença entre humanos e monstros está na aparência.

Monstros possuem aparências consideradas extremamente grotescas, deformadas ou assustadoras pelos padrões humanos.

Essa diferença visual é uma das principais origens do preconceito humano.

Entre os próprios monstros, aparência não possui valor social.

Beleza e feiura não são utilizadas para determinar valor, posição ou dignidade.

Para os monstros, indivíduos são julgados principalmente por:

- ações;
- caráter;
- capacidade;
- posição;
- história.

Regra narrativa:

> Monstros não são inimigos por natureza. São um povo tratado como inimigo.

O termo **“monstro”** será principalmente uma classificação utilizada pelos humanos.

Os próprios monstros poderão possuir outra forma de se identificar.

##### Conflito atual
O mundo vive uma guerra extremamente antiga entre humanos e monstros.

A origem do conflito foi perdida com o tempo.

Ninguém vivo sabe com certeza:

- quem iniciou a guerra;
- qual foi o primeiro ataque;
- qual lado rompeu primeiro os acordos;
- quais acontecimentos antigos foram reais ou distorcidos.

A guerra se mantém porque gerações sucessivas continuam obedecendo ordens, tradições e justificativas herdadas de pessoas que também já não sabiam por que o conflito havia começado.

Regra narrativa:

> A guerra continua funcionando mesmo depois de todos terem esquecido por que ela começou.

Ao longo dos séculos, novos acontecimentos foram utilizados para justificar sua continuidade, incluindo:

- morte de líderes;
- ataques terroristas;
- roubos;
- descumprimento de tratados;
- massacres;
- retaliações;
- ataques contra civis.

Tanto humanos quanto monstros cometeram atrocidades.

O jogador encontrará evidências suficientes para formular sua própria interpretação sobre a origem da guerra, porém a verdade nunca será confirmada por completo.

##### Sociedade humana e guerra
A sociedade humana é fortemente orientada para o conflito.

A distribuição aproximada de posições será:

- **90%** → seguem, apoiam ou participam da guerra;
- **5%** → Dissidentes que recusam participar;
- **5%** → Conciliadores que defendem paz ou reconciliação.

A doutrina dominante humana estabelece que:

> Não se deve negociar com monstros nem deixá-los vivos.

Essa regra vale principalmente fora da Cidade Livre, onde a neutralidade impede que essa doutrina seja aplicada abertamente.

Humanos que ajudam monstros poderão ser tratados como:

- traidores;
- criminosos;
- desertores;
- inimigos do Estado.

##### Facções humanas
As três principais posições humanas serão:

**Ordem de Ferro**

- maior força política e militar;
- defende a continuidade da guerra;
- considera negociação uma fraqueza;
- sustenta a doutrina de não negociar e não poupar monstros.

**Dissidentes**

- desertores;
- rebeldes;
- pessoas que recusam servir à guerra;
- indivíduos que questionam ordens e tradições herdadas.

**Conciliadores**

- defendem diálogo;
- reconhecem que monstros também cometem atrocidades;
- acreditam que o conflito precisa terminar;
- representam uma minoria da sociedade humana.

##### Liderança humana
O poder central humano é militar.

O governante de fato ocupa a **maior patente possível do exército**.

Essa patente é hereditária e permanece dentro da mesma família geração após geração.

Na prática, o comando militar tornou-se uma dinastia.

O líder atual possui interesse econômico direto na continuidade da guerra.

A guerra movimenta:

- armas;
- equipamentos;
- contratos;
- recursos;
- exército;
- produção;
- comércio ligado ao conflito.

A família que controla a patente máxima lucra diretamente com esse sistema.

Regra narrativa:

> A guerra deixou de ser apenas um conflito e se tornou uma indústria.

O líder humano ajuda a manter a guerra porque ela sustenta seu poder e sua riqueza.

O jogador nunca encontrará esse líder pessoalmente.

Sua presença será percebida através de:

- ordens;
- soldados;
- documentos;
- discursos;
- propaganda;
- decisões militares;
- consequências econômicas.

##### Política monstruosa
Os monstros possuirão uma estrutura política mais organizada que a humana.

Eles terão:

- partidos;
- debate político;
- eleições;
- instituições;
- liderança representativa.

O governante principal será um **Presidente eleito democraticamente através de votos**.

O presidente deseja a paz, porém encontra dificuldade para justificá-la politicamente devido à brutalidade humana e às constantes perdas sofridas pelo seu povo.

Cada novo massacre, ataque ou quebra de acordo fortalece os grupos que defendem retaliação.

O jogador nunca encontrará o presidente pessoalmente.

Sua presença também será percebida através de:

- discursos;
- representantes;
- documentos;
- decisões políticas;
- relatos;
- acontecimentos do mundo.

##### Facções monstruosas
As três principais posições monstruosas serão:

**Retaliadores**

- defendem resposta violenta às ações humanas;
- acreditam que humanos só entendem força;
- podem atacar soldados, caravanas, cidades e civis.

**Sobreviventes**

- priorizam a continuidade do povo;
- querem proteger comunidades;
- evitam conflitos quando possível;
- não possuem necessariamente interesse em vencer uma guerra.

**Pactários**

- acreditam que coexistência e negociação ainda podem ser possíveis;
- defendem diálogo;
- podem colaborar com humanos.

Monstros não possuem uma regra equivalente à doutrina humana de proibir qualquer colaboração com o outro povo.

Um monstro pode negociar, conversar ou trabalhar com humanos sem ser automaticamente condenado pelo próprio povo.

Isso não impede críticas, divergências ou conflitos internos.

##### Origem dos monstros
Ninguém sabe com certeza onde os monstros surgiram ou qual foi seu território original.

Essa informação será mantida como um mistério do mundo.

##### Propaganda
Humanos e monstros utilizam propaganda para sustentar suas próprias interpretações da guerra.

Relatos poderão:

- exagerar acontecimentos;
- omitir informações;
- transformar derrotas em martírio;
- justificar retaliações;
- culpar o outro lado por eventos antigos;
- repetir versões herdadas como se fossem fatos.

O jogador deverá aprender a desconfiar de versões apresentadas como verdades absolutas.


##### Cidade livre
A cidade principal existe como território neutro.

Dentro dela, guerra e ataques entre humanos e monstros são proibidos.

A cidade sobrevive principalmente através de:

- comércio;
- contratos;
- dinheiro;
- neutralidade;
- estabilidade.

Ela funciona como um dos poucos locais onde humanos e monstros podem coexistir publicamente.

Essa coexistência não significa amizade.

NPCs poderão demonstrar:

- preconceito;
- medo;
- desconfiança;
- respeito;
- curiosidade;
- pragmatismo.

##### Profecia
Existe uma antiga profecia relacionada ao conflito entre humanos e monstros.

A versão original não existe mais.

Restaram apenas:

- histórias;
- tradições orais;
- interpretações;
- versões transmitidas ao longo de gerações.

Com o passar do tempo, a profecia foi distorcida.

Nenhum dos lados precisa ter alterado seu significado propositalmente.

Humanos e monstros possuem interpretações diferentes da mesma profecia e ambos podem estar errados.

A ideia central preservada é que:

> Em determinado momento da crise surgirá alguém capaz de alterar o destino dos povos.

A profecia não identifica claramente:

- nome;
- aparência;
- origem;
- família;
- momento exato;
- resultado.

O personagem do jogador é alguém que poderá cumprir essa profecia.

A profecia não garante sucesso.

Regra narrativa:

> A profecia prevê que alguém surgirá, mas não garante que essa pessoa chegará ao fim de sua jornada.

Durante a história, o jogador poderá encontrar em uma Dungeon um registro muito mais antigo da profecia.

Esse registro não será apresentado como verdade absoluta, mas como a versão mais próxima da origem conhecida até aquele momento.

A descoberta mostrará que as interpretações modernas foram alteradas por:

- tempo;
- tradição;
- política;
- guerra;
- interesses culturais.


##### Civilização antiga
Existiu uma antiga civilização ou reino extremamente importante antes dos acontecimentos atuais.

Sua existência será frequentemente citada, porém sua história não será totalmente explicada.

O jogador encontrará vestígios através de:

- ruínas;
- equipamentos;
- Relíquias;
- Dungeons;
- inscrições;
- NPCs;
- relatos contraditórios.

A queda dessa civilização permanecerá envolta em mistério.

##### Versões contraditórias do passado
NPCs poderão apresentar versões diferentes sobre acontecimentos antigos.

Exemplo:

```text
NPC A:
"Eles destruíram a si mesmos."

NPC B:
"Foram traídos."

NPC C:
"Os monstros acabaram com eles."

NPC D:
"Os humanos começaram a guerra."

NPC E:
"Não foi uma guerra."
```

Essas versões poderão compartilhar elementos semelhantes sem necessariamente confirmar uma verdade definitiva.

O jogo poderá manter certos acontecimentos históricos propositalmente ambíguos.

##### Religião e Fé
Existirão crenças, religiões e interpretações espirituais diferentes.

Alguns NPCs acreditarão profundamente em forças divinas.

Outros considerarão essas crenças:

- mitos;
- interpretações de magia;
- histórias antigas;
- construções culturais.

Mesmo com **Fé** existindo como atributo, o jogo não precisará confirmar definitivamente qual interpretação religiosa está correta.

##### Antagonismo
O principal inimigo ou causa central do conflito não será revelado no início.

O jogador conhecerá primeiro:

- ataques;
- conflitos;
- mortes;
- perseguições;
- propaganda;
- retaliações.

Depois começará a perceber:

- interesses políticos;
- líderes;
- grupos;
- manipulações;
- consequências de acontecimentos antigos.

A narrativa não precisa depender de um único “grande vilão”.

##### Facções e lados
A história possuirá lados e facções, porém o jogador não escolherá uma facção permanente através de uma seleção simples.

Não existirá uma escolha do tipo:

```text
Escolher:
[Humanos]
[Monstros]
```

As relações serão construídas através das decisões narrativas.

O jogador poderá:

- ajudar um humano e discordar dele posteriormente;
- colaborar com monstros sem pertencer formalmente a uma facção;
- ajudar grupos de posições políticas diferentes;
- tomar decisões que alterem relações e acontecimentos.

Parceiros recrutáveis poderão vir de diferentes grupos políticos humanos e monstruosos.

Isso permitirá que a própria party possua opiniões divergentes sobre a guerra.

##### Encontro entre lideranças
Existem teorias de que, em algum momento do passado, representantes máximos humanos e monstruosos chegaram a se encontrar ou negociar.

Nenhuma versão é totalmente confiável.

Alguns relatos dizem que:

- houve um encontro;
- um acordo chegou a ser discutido;
- um dos lados traiu o outro;
- alguém sabotou a negociação;
- os líderes nunca chegaram realmente a se encontrar.

O único consenso é que qualquer tentativa de paz daquele período não produziu um resultado duradouro.


##### Dungeons e narrativa
Dungeons serão uma das principais formas de contar a história do mundo.

Cada Dungeon poderá revelar informações através de:

- arquitetura;
- inimigos;
- Boss;
- itens;
- Relíquias;
- NPCs;
- eventos;
- salas secretas.

Uma Dungeon poderá mudar completamente de significado quando o jogador obtiver novas informações posteriormente.

O jogador poderá descobrir que criaturas enfrentadas anteriormente não eram simplesmente inimigos irracionais.

##### História de fundo
O mundo já passou por períodos de grandeza e decadência.

Civilizações antigas, guerras, reis, monstros, humanos e acontecimentos políticos deixaram marcas no presente.

A verdade completa sobre esses períodos não será apresentada diretamente.

##### Momento atual no jogo
O jogador chega enquanto o conflito entre humanos e monstros já está acontecendo.

Inicialmente, grande parte das informações recebidas favorece a perspectiva humana.

Conforme progride, o jogador começa a encontrar evidências de que:

- monstros possuem sociedade e sentimentos;
- versões humanas da história podem estar incompletas;
- ambos os lados possuem responsabilidades;
- a guerra atual possui causas políticas e históricas;
- acontecimentos antigos continuam influenciando o presente.

A história será apresentada através de:

- acontecimentos atuais;
- Dungeons;
- NPCs;
- parceiros;
- itens;
- Relíquias;
- quests;
- ruínas;
- eventos;
- relatos contraditórios.

##### Finais
O primeiro grande arco narrativo terá **dois finais principais**.

Os dois resultados representam:

1. **Continuar o ciclo da guerra**
2. **Romper o ciclo da guerra**

Nenhum deles será classificado oficialmente como:

- final bom;
- final ruim.

##### Continuar o ciclo
O jogador toma decisões que preservam ou reforçam a estrutura atual.

A guerra continua.

Um dos lados poderá obter vantagem, líderes ou acontecimentos poderão mudar, mas a máquina política, econômica e cultural da guerra permanece funcionando.

A profecia ainda poderá ser considerada cumprida:

> O personagem alterou o destino dos povos, mas não necessariamente encerrou o conflito.

##### Romper o ciclo
O jogador consegue criar condições para interromper a guerra como estado inevitável entre humanos e monstros.

Esse final não cria uma paz perfeita.

Ainda existirão:

- ódio;
- preconceito;
- famílias marcadas pela guerra;
- grupos extremistas;
- desconfiança;
- ataques isolados;
- interesses econômicos ameaçados;
- pessoas que desejam reiniciar o conflito.

A diferença é que, pela primeira vez em incontáveis gerações:

> A guerra deixa de ser inevitável.

A paz não estará garantida.

Ela apenas se torna possível.

Mesmo após qualquer um dos finais, o jogo poderá continuar com:

- progressão;
- novos acontecimentos;
- eventos;
- expansões narrativas.


---

## Arte

##### Temática
Dark Fantasy.

O mundo deverá transmitir:

- decadência;
- mistério;
- antiguidade;
- perigo;
- grandeza perdida;
- conflito atual.

##### Estilos
- **Minimalista:** reduzir excesso de informação.
- **Elegante:** interface limpa e organizada.
- **Padronizado:** componentes seguem os mesmos padrões.
- **Moderno:** inspiração na experiência dos sistemas Apple.
- **Dark Fantasy:** mundo sombrio e decadente.
- **Game UI:** a interface deve continuar parecendo um jogo.

---

## Conclusão do projeto

##### Créditos
A definir.

##### Desvio da idealização inicial
Será registrado conforme o projeto evoluir.

##### Defeitos e mudanças posteriores
Será utilizado para registrar:

- melhorias;
- expansões;
- novos sistemas;
- mudanças de balanceamento;
- feedback dos jogadores.

---

## Observações atuais

O projeto deverá ser modular e preparado para expansão.

Novas skills, atividades, itens, Dungeons, parceiros, equipamentos e conteúdos narrativos devem poder ser adicionados sem exigir grandes alterações nos sistemas existentes.

Princípios centrais definidos:

> A classe define o começo, não o destino do personagem.

> O antigo endgame de uma skill se torna o novo início após o Prestígio.

> O Prestígio do personagem concede 5 pontos permanentes para uma Árvore de Prestígio.

> A árvore terá mais opções do que pontos disponíveis, obrigando escolhas de build.

> Cada parceiro fixo deve possuir identidade narrativa e mecânica própria.

> O relacionamento com parceiros desbloqueia novas possibilidades.

> Relíquias são extremamente raras, poderosas, negociáveis e possuem histórico de donos.

> A identidade de uma Dungeon é fixa, mas sua exploração é procedural.

> Escolhas de caminho em uma Dungeon são irreversíveis durante aquela tentativa.

> Ao chegar ao Boss, o jogador escolhe entre garantir seu loot ou arriscar tudo por recompensas melhores.

> O modo Idle oferece boas recompensas; as melhores recompensas exigem exploração ativa.

> O combate é automático, mas a build, os atributos, os equipamentos e a preparação determinam o resultado.

> O inventário possui limite e pode ser expandido permanentemente.

> O loot de Dungeon fica separado na bolsa de expedição e é perdido em caso de morte.

> Relíquias possuem um Relicário próprio, separado do inventário comum.

> Somente Relíquias podem ser negociadas entre jogadores.

> O mercado utiliza preço livre, taxa sobre vendas e histórico de negociações.

> O jogo possui uma única moeda principal.

> Equipamentos procedurais podem receber atributos fora da função tradicional do item, favorecendo builds híbridas.

> A cidade principal será o centro narrativo e de serviços do jogo.

> O jogo não utilizará regiões nem sistema de viagem como estrutura de progressão.

> NPCs lembrarão decisões relevantes do jogador.

> A aparência é a principal diferença percebida entre humanos e monstros; entre os monstros, aparência não possui valor social.

> A cidade principal é território neutro onde humanos e monstros podem coexistir sob regras de trégua e comércio.

> A profecia prevê que alguém poderá alterar o destino dos povos, mas não garante que essa pessoa concluirá sua jornada.

> O passado será contado através de versões incompletas e contraditórias.

> O primeiro grande arco narrativo terá dois finais principais, sem classificação oficial de bom ou ruim.

> A guerra entre humanos e monstros é tão antiga que sua origem foi perdida.

> O poder central humano é militar, hereditário e economicamente beneficiado pela continuidade da guerra.

> Os monstros possuem um governo democrático liderado por um presidente eleito.

> Humanos e monstros possuem múltiplas facções políticas com posições diferentes sobre o conflito.

> O jogador nunca encontra pessoalmente os líderes máximos humano ou monstruoso.

> A versão original da profecia foi perdida e ambos os povos possuem interpretações distorcidas.

> Os dois finais principais representam continuar o ciclo da guerra ou romper esse ciclo.

> Mesmo ao romper o ciclo, a paz continuará imperfeita e frágil.

> O personagem chega de uma terra distante procurando sobrevivência e trabalho, sem conhecer sua relação com a profecia.

> O tutorial será curto e integrado ao fluxo normal do jogo.

> A primeira Dungeon apresenta uma comunidade de monstros tentando sobreviver em uma fortificação abandonada.

> A primeira escolha entre matar ou poupar um monstro não possui resposta moral indicada pelo jogo.

> O primeiro Boss aparenta ser apenas uma ameaça, mas posteriormente pode ser compreendido como protetor daquela comunidade.

> Um fragmento de antigo tratado será uma das primeiras evidências de que humanos e monstros já tentaram negociar.
