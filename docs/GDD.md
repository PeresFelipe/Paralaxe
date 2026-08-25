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

As atividades concedem experiência para a skill relacionada.

Para as skills de coleta, o jogador escolherá diretamente a atividade ou recurso principal que deseja obter, em vez de iniciar uma coleta genérica e depender de aleatoriedade para receber o material desejado.

Exemplo:

```text
Mineração
↓
Seleciona Iarann
↓
aguarda o tempo da ação
↓
recebe Iarann + XP de Mineração
↓
chance de drops secundários
↓
repete automaticamente
```

Regra principal:

> Escolher uma atividade específica → aguardar o tempo da ação → receber recurso principal + XP → chance de drops secundários → repetir automaticamente.

##### Estrutura das atividades de coleta
A estrutura-base será utilizada principalmente por:

- Mineração;
- Lenhador;
- Pesca;
- Herbologia.

Cada atividade terá:

- recurso principal definido;
- requisito de nível quando aplicável;
- tempo próprio por ação;
- experiência da skill;
- pool próprio de recursos secundários;
- repetição automática enquanto estiver ativa.

O tempo exato das ações será definido durante o balanceamento.

A atividade poderá continuar durante o progresso offline, respeitando o limite de tempo offline do personagem.

##### Quantidade obtida por ação
Como base, cada ciclo de uma atividade de coleta concederá normalmente:

> **1 unidade garantida do recurso principal.**

Ferramentas, Prestígio, habilidades e outros efeitos poderão gerar unidades adicionais.

A quantidade-base e os modificadores específicos poderão variar durante o balanceamento, mas o jogador deverá ter uma fonte previsível do recurso principal escolhido.

##### Recursos secundários
Cada atividade terá seu próprio pequeno pool temático de recursos secundários.

Exemplo conceitual:

```text
Atividade de Mineração

Garantido:
→ recurso principal escolhido
→ XP de Mineração

Possíveis secundários:
→ minerais complementares
→ gemas
→ cristais
→ materiais raros
→ componentes de crafting ou upgrade
```

Os recursos secundários poderão ser utilizados em:

- crafting;
- ligas e componentes de Metalurgia;
- fabricação de ferramentas;
- fabricação de equipamentos;
- upgrades +1;
- upgrades +2 como componentes complementares.

A regra do upgrade +2 permanece válida:

> Um upgrade +2 exige pelo menos um material especial proveniente de conteúdo como Dungeon, Boss ou evento.

Um recurso raro obtido em uma atividade comum poderá participar da receita do +2, mas não substitui sozinho esse componente especial obrigatório.

Recursos secundários poderão aparecer raramente antes de o jogador liberar uma atividade que permita obtê-los diretamente.

Regra principal:

> O recurso principal oferece produção previsível; os recursos secundários conectam a atividade ao crafting, aos upgrades e a outras formas de progressão.

##### Ferramentas de coleta
As ferramentas de coleta formarão um sistema separado dos equipamentos de combate.

Elas não ocuparão slots como arma principal, mão secundária, armaduras, anéis ou amuleto.

Ferramentas previstas:

- **Mineração:** picareta;
- **Lenhador:** machado de corte;
- **Pesca:** equipamento de pesca;
- **Herbologia:** ferramenta própria de coleta/preparo — A definir.

As ferramentas poderão melhorar principalmente:

- velocidade da atividade;
- quantidade obtida;
- chance de recurso extra;
- chance de drop secundário raro;
- experiência da skill.

Ferramentas de coleta não deverão utilizar atributos de combate como foco de seus rolls procedurais.

##### Obtenção de ferramentas
Ferramentas de coleta terão somente duas fontes de obtenção:

1. **Fabricação**;
2. **Dungeons**.

A fabricação, principalmente através da Forja quando aplicável, será a fonte regular de progressão das ferramentas.

Dungeons poderão fornecer modelos próprios de ferramentas, com identidade ou características-base especiais.

Ferramentas não serão obtidas diretamente como progressão por lojas, NPCs, quests ou Prestígio.

##### Raridade procedural das ferramentas
Ferramentas normais utilizarão o mesmo sistema de raridade procedural dos equipamentos.

```text
Comum      → 1 atributo procedural
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Duas ferramentas com o mesmo modelo e raridade poderão possuir combinações diferentes de atributos.

O pool inicial de atributos procedurais será focado em:

- velocidade da atividade;
- quantidade obtida;
- chance de recurso extra;
- chance de drop secundário raro;
- XP da skill.

Modelos especiais encontrados em Dungeons também poderão utilizar raridade procedural quando forem itens normais e não Relíquias.

##### Upgrade de ferramentas
Ferramentas seguirão o mesmo conceito de upgrade dos equipamentos:

```text
+0
+1
+2
```

O upgrade de ferramenta:

- nunca falha;
- melhora somente seus atributos base;
- não altera nem rerrola atributos procedurais;
- não possui custo em dinheiro;
- não utiliza durabilidade.

O +1 poderá utilizar materiais de progressão normal.

O +2 deverá exigir pelo menos um material especial proveniente de conteúdo como:

- Dungeons;
- Bosses;
- eventos especiais.

##### Minigames das skills
Cada uma das sete skills terá um **minigame próprio e temático**, relacionado diretamente à fantasia da atividade.

O minigame não ficará disponível continuamente.

Depois de determinado tempo executando uma atividade, uma oportunidade de minigame será liberada.

O tempo exato necessário será definido posteriormente.

O progresso para liberar essa oportunidade poderá continuar durante a execução Idle/offline da atividade.

O jogador poderá ignorar o minigame e continuar progredindo normalmente.

Jogar o minigame com bom desempenho concederá um bônus temporário relacionado à atividade, podendo melhorar principalmente:

- eficiência;
- taxa de recursos extras;
- taxa de drops secundários;
- taxa de drops secundários raros.

Os valores e a combinação exata dos bônus serão definidos durante o balanceamento.

O minigame não deverá possuir recursos essenciais exclusivos que tornem a progressão Idle incompleta. A vantagem da interação ativa será melhorar temporariamente a eficiência das mesmas atividades e pools de recompensa.

O sistema poderá limitar a quantidade de oportunidades de minigame acumuladas. O limite exato será **A definir**.

Regra principal:

> O Idle gera a oportunidade; a interação ativa permite aproveitá-la melhor.

##### Direção temática dos minigames
Cada skill terá uma mecânica compatível com sua fantasia.

Direções iniciais:

- **Mineração:** quebrar uma formação rochosa identificando e atingindo pontos de fraqueza;
- **Lenhador:** trabalhar direção e momento dos cortes;
- **Pesca:** reagir à fisgada e controlar a tensão da linha;
- **Herbologia:** identificar e coletar corretamente partes da planta;
- **Metalurgia:** controlar temperatura e ponto do processo;
- **Forja:** trabalhar ritmo e precisão dos golpes;
- **Culinária:** controlar tempo e sequência de etapas do preparo.

As implementações exatas poderão ser refinadas posteriormente, preservando o princípio de que cada minigame representa a própria atividade.

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
Nv. 90 → Grianchloch
Nv. 99 → conclusão da progressão normal

Prestígio I
→ antiga progressão permanece relevante
→ novos materiais e atividades são introduzidos
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

##### Produção paralela no Prestígio I
Ao alcançar **Prestígio I**, todas as skills desbloquearão uma forma temática de produção paralela.

Direções definidas:

- **Mineração — Extração Dupla:** permite trabalhar com dois tipos de minério ao mesmo tempo;
- **Lenhador — Corte Duplo:** permite trabalhar com duas madeiras simultaneamente;
- **Pesca — Linha Dupla:** permite trabalhar com dois alvos de pesca;
- **Herbologia — Coleta Dupla:** permite trabalhar com duas plantas ou ingredientes;
- **Metalurgia — Fundição Paralela:** permite processar duas linhas de produção;
- **Forja — Produção Paralela:** permite manter duas fabricações em andamento;
- **Culinária — Preparo Paralelo:** permite manter dois preparos em andamento.

A segunda atividade começará com eficiência reduzida em relação à atividade principal.

Os percentuais exatos serão definidos durante o balanceamento.

A evolução dessa mecânica nos Prestígios II e III será **A definir** e poderá envolver melhoria de eficiência ou novas formas de executar a skill.

Regra principal:

> Habilidades e recompensas avançadas de skill devem, sempre que possível, mudar a forma de executar a atividade, e não apenas aumentar percentuais.

##### Convenção de nomenclatura dos recursos
Recursos do mundo poderão utilizar nomes em **irlandês** para criar identidade própria, desde que isso não prejudique a leitura do jogo.

A interface, os sistemas, atributos, dificuldades, instruções e descrições continuam utilizando português.

Regras principais:

> **Nome diferente, visual familiar.**

> **A mesma coisa sempre recebe o mesmo nome.**

> **Nunca usar uma palavra estrangeira quando ela só torna uma informação de sistema mais difícil de entender.**

Na prática:

- recursos importantes poderão ter nomes em irlandês;
- a arte deverá continuar deixando claro o que o recurso representa quando existir um equivalente reconhecível;
- um mesmo recurso nunca deverá receber nomes diferentes em contextos diferentes;
- traduções explicativas poderão existir na documentação de design, mas não precisam aparecer permanentemente na interface;
- termos puramente funcionais do sistema permanecerão em português quando a tradução estrangeira reduzir a clareza.

##### Mineração — identidade dos materiais
A progressão normal de Mineração utilizará materiais reais e reconhecíveis, porém seus nomes apresentados ao jogador serão em **irlandês**.

O ícone e a arte deverão representar claramente o material correspondente do mundo real, permitindo que o jogador crie a associação visual naturalmente.

Exemplo:

```text
Iarann
[imagem claramente reconhecível como minério de ferro]
```

A interface principal não precisará exibir permanentemente traduções como `Iarann (Ferro)`. O mapeamento abaixo existe para documentação de design e produção.

Nos Prestígios, a Mineração passa a utilizar materiais cada vez mais excepcionais, preservando a mesma convenção de nomenclatura.

A progressão temática completa será:

```text
Normal       → Natureza
Prestígio I  → Sobrenatural
Prestígio II → Guerra
Prestígio III→ Divindades
```

A evolução representa conceitualmente:

> **terra → sobrenatural → história → mito**

##### Mineração — progressão normal 1–99
A progressão normal utiliza materiais naturais e reconhecíveis.

| Nível | Nome no jogo | Material equivalente | Papel inicial |
|---:|---|---|---|
| 1 | **Cloch** | Pedra | construção e crafting básico |
| 10 | **Stán** | Estanho | ligas e componentes iniciais |
| 20 | **Copar** | Cobre | ferramentas e equipamentos iniciais |
| 30 | **Iarann** | Ferro | base importante de armas e armaduras |
| 45 | **Luaidhe** | Chumbo | receitas e componentes especializados |
| 60 | **Airgead** | Prata | equipamentos, acessórios e receitas especiais |
| 75 | **Ór** | Ouro | acessórios e crafting avançado |
| 90 | **Grianchloch** | Quartzo | crafting de alto nível e componentes especiais |

Os níveis entre os grandes desbloqueios continuarão sendo relevantes através de evolução da skill, acesso a receitas, melhoria de eficiência e outros conteúdos a serem detalhados.

Os tempos de ação e valores de XP serão definidos posteriormente durante o balanceamento.

##### Mineração — Prestígio I: Sobrenatural
O Prestígio I introduz materiais sobrenaturais. Eles não formam apenas uma escala de poder: cada material possui aplicações próprias.

| Nível P1 | Material | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Grianchloch** | Quartzo | antigo endgame normal torna-se o ponto de entrada |
| 15 | **Scáth** | Sombra | equipamentos rápidos, precisão e componentes especiais |
| 30 | **Gealach** | Lua | Mana, suporte, catalisadores e equipamentos mágicos |
| 45 | **Fuil** | Sangue | armas físicas e receitas ligadas a Sangramento |
| 60 | **Cuimhne** | Memória | receitas da civilização antiga e crafting especial |
| 75 | **Anam** | Alma | Fé, cura, suporte e equipamentos híbridos |
| 90 | **Réalta** | Estrela | crafting de alto nível e equipamentos excepcionais |

**Cuimhne** será especialmente associada a ruínas e vestígios da civilização antiga. O nome não precisa significar que o material literalmente guarda memórias; sua relação real com o passado poderá permanecer ambígua.

Ao entrar no Prestígio I, a Mineração também utiliza a mecânica já definida de **Extração Dupla**.

##### Mineração — Prestígio II: Guerra
O Prestígio II utiliza materiais culturalmente associados às marcas físicas deixadas pela guerra antiga.

| Nível P2 | Material | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Réalta** | Estrela | antigo endgame do P1 torna-se o ponto de entrada |
| 15 | **Cath** | Batalha | armas, armaduras e equipamentos voltados ao combate |
| 30 | **Luaith** | Cinzas | ligas, Metalurgia e receitas relacionadas a Fogo |
| 45 | **Mionn** | Juramento | defesa, Fé e suporte |
| 60 | **Créacht** | Ferida | Sangramento, dano físico e equipamentos agressivos |
| 75 | **Fothrach** | Ruína | equipamentos antigos e receitas ligadas à guerra |
| 90 | **Cogadh** | Guerra | crafting de endgame do P2 e equipamentos especiais |

A sequência possui também uma leitura narrativa:

> **Batalha → Cinzas → Juramentos → Feridas → Ruínas → Guerra**

Esses nomes são associações históricas criadas pelos povos atuais porque os materiais são encontrados repetidamente em locais marcados pelo conflito.

Isso **não confirma** que a guerra criou os materiais. Alguns podem ter sido formados pelo conflito, outros podem apenas ter sido expostos por destruições, e outros podem ser anteriores à própria guerra.

##### Mineração — Prestígio III: Divindades
O Prestígio III representa a camada máxima da Mineração. Os materiais são tão raros e poderosos que receberam nomes associados a antigas figuras divinas.

| Nível P3 | Material | Associação cultural | Identidade de crafting |
|---:|---|---|---|
| 1 | **Cogadh** | Guerra | antigo endgame do P2 torna-se o ponto de entrada |
| 15 | **Brigid** | metalurgia, criação e cura | Forja avançada, suporte e equipamentos especiais |
| 30 | **Nuada** | prata, realeza e combate | defesa, precisão e equipamentos de alta qualidade |
| 45 | **Goibniu** | ferreiros e fabricação de armas | armas, ferramentas e Forja de altíssimo nível |
| 60 | **Lugh** | habilidade, guerra e múltiplas artes | equipamentos híbridos e builds versáteis |
| 75 | **Mórrigan** | guerra e destino | crítico, Sangramento, status e equipamentos agressivos |
| 90 | **Dagda** | força, magia e grande versatilidade | material máximo de crafting do P3 |

Os nomes divinos são **associações culturais**. Sua utilização não confirma que essas divindades realmente existam, que tenham criado os materiais ou que a interpretação religiosa do mundo esteja correta.

Essa regra preserva a ambiguidade da religião e do atributo Fé.

Mesmo os materiais do Prestígio III deverão possuir identidades próprias. `Dagda`, por exemplo, representa um material máximo de crafting, mas não torna automaticamente todos os materiais anteriores inferiores ou desnecessários.

##### Mineração — utilidade contínua dos materiais
A progressão de Mineração não seguirá a lógica de que um material de nível maior torna automaticamente todos os anteriores obsoletos.

Materiais antigos continuarão sendo utilizados em:

- ligas;
- equipamentos;
- ferramentas;
- acessórios;
- upgrades;
- receitas avançadas;
- componentes especializados.

Exemplos conceituais:

```text
Stán + Copar
→ podem continuar sendo necessários em uma liga avançada

Iarann
→ pode continuar aparecendo em receitas avançadas

Ór
→ pode ser necessário para acessórios específicos sem ser simplesmente "melhor" que todos os outros materiais
```

Uma receita de endgame poderá combinar materiais de diferentes camadas:

```text
Iarann
+
Fuil
+
Cogadh
+
Dagda
+
material exclusivo de Boss
```

Regra principal:

> Um material possui função econômica e de crafting própria; nível de desbloqueio não representa uma escala absoluta de superioridade.

##### Lenhador — identidade
Lenhador seguirá a mesma convenção geral de recursos: nomes principais em irlandês, arte reconhecível quando houver equivalente natural e interface funcional em português.

A progressão temática completa será:

```text
Normal       → Floresta Natural
Prestígio I  → Floresta Sobrenatural
Prestígio II → Eras Antigas
Prestígio III→ Árvores Sagradas
```

Cada madeira terá aplicações próprias. Uma madeira liberada mais tarde não deverá ser simplesmente uma versão numericamente melhor da anterior.

##### Lenhador — progressão normal 1–99
A progressão normal utiliza espécies de árvores reconhecíveis.

| Nível | Nome no jogo | Equivalente | Identidade de uso |
|---:|---|---|---|
| 1 | **Giúis** | Pinheiro | construção simples, cabos e componentes básicos |
| 10 | **Beith** | Bétula | madeira leve, crafting inicial e utensílios |
| 20 | **Fearn** | Amieiro | peças flexíveis e componentes |
| 30 | **Saileach** | Salgueiro | madeira flexível, arcos e receitas naturais |
| 45 | **Coll** | Aveleira | bastões, arcos, ferramentas e componentes especializados |
| 60 | **Fuinseog** | Freixo | cabos de armas, ferramentas e equipamentos resistentes |
| 75 | **Dair** | Carvalho | escudos, estruturas e equipamentos pesados |
| 90 | **Iúr** | Teixo | arcos avançados, armas especiais e crafting de alto nível |

Cada árvore terá seu próprio pool temático de secundários, que poderá incluir itens como:

- resina;
- casca;
- galhos;
- sementes;
- seivas;
- componentes raros.

Esses itens secundários não precisam receber nomes estrangeiros quando isso não acrescentar identidade ou quando prejudicar a leitura.

##### Minigame de Lenhador
O minigame de Lenhador será baseado principalmente em **direção e timing dos cortes**.

O jogador deverá identificar bons pontos ou ângulos de corte e executar os golpes no momento correto.

Melhor desempenho concede o bônus temporário já definido pelo sistema geral de minigames, sem tornar a interação ativa obrigatória para a progressão.

##### Lenhador — Prestígio I: Floresta Sobrenatural
O Prestígio I introduz madeiras sobrenaturais que continuam visualmente reconhecíveis como madeira, porém apresentam propriedades impossíveis ou incomuns.

| Nível P1 | Madeira | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Iúr** | Teixo | antigo endgame normal torna-se o ponto de entrada |
| 15 | **Ceo** | Névoa | arcos leves, precisão e velocidade |
| 30 | **Oíche** | Noite | furtividade, crítico e equipamentos rápidos |
| 45 | **Draíocht** | Magia | cajados, catalisadores, Mana e equipamentos mágicos |
| 60 | **Aisling** | Sonho / visão | híbridos, suporte e componentes especiais |
| 75 | **Spiorad** | Espírito | Fé, cura, suporte e equipamentos espirituais |
| 90 | **Síoraí** | Eterno | crafting máximo do P1, resistência e componentes avançados |

Mesmo uma madeira sobrenatural deverá continuar parecendo madeira.

Exemplo conceitual:

```text
Draíocht
→ tronco reconhecível
→ casca escura
→ veios luminosos discretos
```

Ao entrar no Prestígio I, Lenhador também desbloqueia **Corte Duplo**, permitindo trabalhar com duas madeiras desbloqueadas simultaneamente, com eficiência reduzida na atividade secundária conforme a regra geral de produção paralela.

##### Lenhador — Prestígio II: Eras Antigas
O Prestígio II utiliza nomes e identidades relacionados a povos, estruturas, reinos e legados do passado.

| Nível P2 | Madeira | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Síoraí** | Eterno | antigo endgame do P1 torna-se o ponto de entrada |
| 15 | **Treibh** | Tribo / povo | arcos, ferramentas e crafting versátil |
| 30 | **Dún** | Fortaleza | escudos, estruturas e defesa |
| 45 | **Ríocht** | Reino | equipamentos refinados e acessórios |
| 60 | **Ríshliocht** | Dinastia | equipamentos únicos e receitas históricas |
| 75 | **Oidhreacht** | Herança / legado | receitas que combinam materiais de várias eras |
| 90 | **Seanchas** | Tradição / lore | crafting máximo do P2 e receitas ligadas à civilização antiga |

A sequência possui uma leitura histórica:

> **povos → fortalezas → reinos → dinastias → herança → história**

Os nomes representam associações culturais construídas ao longo do tempo e não significam que a madeira seja literalmente uma fortaleza, reino ou dinastia.

Por exemplo, `Dún` poderá ser encontrada com frequência próxima a fortificações antigas, enquanto `Seanchas` poderá existir em florestas tão antigas que diferentes povos contam histórias contraditórias sobre sua origem.

##### Lenhador — Prestígio III: Árvores Sagradas
O Prestígio III representa o ápice da skill através de madeiras associadas a grandes árvores sagradas e lendárias.

| Nível P3 | Madeira | Identidade visual / cultural | Especialização principal |
|---:|---|---|---|
| 1 | **Seanchas** | antigo endgame do P2 | entrada do P3 |
| 15 | **Bile** | grande árvore de importância sagrada | crafting ritual, avançado e versátil |
| 30 | **Eó Mugna** | grande carvalho lendário | defesa, estruturas e escudos |
| 45 | **Bile Tortan** | freixo lendário | armas, cabos e ferramentas máximas |
| 60 | **Eó Rossa** | teixo lendário | arcos, precisão, crítico e efeitos especiais |
| 75 | **Craeb Dáithí** | árvore lendária de madeira clara e padrões incomuns | equipamentos híbridos e crafting complexo |
| 90 | **Craeb Uisnig** | grande árvore sagrada | madeira máxima do P3 e receitas excepcionais |

A arte deverá continuar respeitando a origem visual de cada madeira. Uma versão lendária de carvalho, freixo ou teixo ainda precisa ser reconhecível como madeira e manter características compatíveis com sua espécie-base.

Assim como nos outros Prestígios, a madeira final não invalida as anteriores.

##### Lenhador — utilidade contínua das madeiras
Madeiras de todas as camadas continuarão relevantes por funções específicas.

Exemplos:

- **Fuinseog** poderá continuar sendo utilizada em cabos de armas e ferramentas;
- **Dair** poderá permanecer relevante para escudos e estruturas pesadas;
- **Iúr** poderá continuar sendo necessário em arcos;
- **Ceo** poderá ser utilizado em equipamentos que priorizam leveza e velocidade;
- **Draíocht** poderá permanecer importante para cajados e catalisadores;
- madeiras históricas e sagradas terão receitas próprias em vez de simplesmente substituírem as anteriores.

Receitas avançadas poderão misturar skills e Prestígios diferentes.

Exemplo conceitual:

```text
Arco avançado

Iúr
+
Ceo
+
Airgead
+
material de Dungeon
```

Ou:

```text
Ferramenta de endgame

Dair
+
Fuinseog
+
Goibniu
+
material especial
```

Regra principal:

> A progressão amplia as possibilidades de crafting; ela não transforma todos os recursos antigos em materiais descartáveis.

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
Forjar equipamento
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

Materiais de diferentes níveis não serão tratados apenas como substitutos numericamente superiores.

Exemplo conceitual:

```text
Copar
→ aplicações e ligas próprias

Iarann
→ base frequente de armas e armaduras

Airgead
→ aplicações específicas e especiais

Ór
→ acessórios e componentes avançados
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
O personagem poderá equipar até **4 habilidades ativas simultaneamente**.

A combinação entre essas habilidades será totalmente livre.

O jogador poderá equipar qualquer combinação de categorias, desde que cumpra os requisitos individuais de cada habilidade.

Exemplos:

```text
4 habilidades físicas
4 magias
4 milagres
2 físicas + 2 magias
1 física + 1 magia + 1 milagre + 1 universal
```

A classe inicial não limita quais habilidades poderão ser utilizadas.

Regra principal:

> O jogador pode equipar qualquer combinação de 4 habilidades ativas, independentemente da classe inicial ou da categoria da habilidade.

##### Categorias de habilidades
As habilidades ativas serão organizadas em cinco categorias:

1. **Físicas:** normalmente utilizam Stamina e representam técnicas de combate físico.
2. **Magias:** utilizam Mana e escalam principalmente com Inteligência.
3. **Milagres:** utilizam Mana e escalam principalmente com Fé.
4. **Híbridas:** combinam atributos, armas ou estilos diferentes.
5. **Universais:** podem ser utilizadas por qualquer personagem e têm o cooldown como sua principal limitação, sem depender necessariamente de Mana ou Stamina.

As categorias servem para organizar requisitos, custos, scaling e identidade das habilidades, e não para restringir combinações de build.

##### Desbloqueio de habilidades
Habilidades poderão ser obtidas por diferentes caminhos:

- progressão natural;
- NPCs;
- Dungeons;
- Bosses;
- quests;
- exploração e descobertas secretas;
- Prestígio.

Dessa forma, novas habilidades também funcionarão como recompensas de progressão, exploração e conteúdo especial.

##### Uso automático
Habilidades serão utilizadas automaticamente quando:

- o tempo de recarga terminar;
- houver recurso suficiente, quando aplicável;
- os requisitos da habilidade forem atendidos;
- a habilidade for priorizada pelo estilo de combate escolhido.

Exemplo:

```text
Golpe Pesado
Categoria: Física
Perfil: Agressiva
Cooldown: 8s
Custo: 30 Stamina
```

##### Perfil obrigatório das habilidades
Toda habilidade ativa deverá possuir obrigatoriamente um **Perfil de Combate**.

Existem apenas dois perfis:

- **Agressiva:** focada principalmente em dano, pressão ofensiva, efeitos ofensivos ou aumento da capacidade de ataque.
- **Defensiva:** focada principalmente em cura, proteção, mitigação, sobrevivência, resistência ou suporte defensivo.

O perfil é independente da categoria.

Uma habilidade Física, Magia, Milagre, Híbrida ou Universal poderá ser Agressiva ou Defensiva.

O perfil **Misto** não existe para habilidades individuais.

Exemplo:

```text
Bola de Fogo
Categoria: Magia
Perfil: Agressiva

Barreira Arcana
Categoria: Magia
Perfil: Defensiva
```

##### Estilo de combate
Antes do combate, o jogador poderá definir um dos três estilos de combate:

- **Agressivo:** prioriza habilidades com Perfil Agressiva.
- **Defensivo:** prioriza habilidades com Perfil Defensiva.
- **Misto:** alterna dinamicamente entre habilidades Agressivas e Defensivas conforme a situação do combate.

O estilo escolhido orienta a prioridade da automação, sem alterar as quatro habilidades equipadas.

No estilo Misto, o sistema deverá considerar o estado atual do personagem e da party para decidir entre pressão ofensiva e sobrevivência.

Regra principal:

> O jogador escolhe as habilidades da build e o estilo de combate determina como a automação prioriza seu uso.

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

## Inimigos e Bosses

##### Categorias de inimigos
Os inimigos serão divididos em três categorias principais:

1. **Comum**
2. **Elite**
3. **Boss**

Não existirá inicialmente uma categoria separada de mini-Boss. Quando necessário, um Elite poderá cumprir essa função dentro de uma Dungeon.

##### Estrutura básica
Todo inimigo deverá possuir uma ficha com informações como:

```text
Nome
Tipo: Comum / Elite / Boss

Vida
Ataque
Defesa
Velocidade de ataque

Fraquezas
Resistências
Habilidades
Drops
```

##### Tipos de dano
O jogo terá inicialmente sete tipos principais de dano:

- **Corte**
- **Perfuração**
- **Impacto**
- **Fogo**
- **Gelo**
- **Arcano**
- **Sagrado**

Inimigos poderão possuir fraquezas e resistências diferentes para cada tipo.

Essas relações deverão incentivar o jogador a adaptar equipamentos, habilidades e composição da party entre diferentes conteúdos.

##### Leitura de fraquezas e resistências
Fraquezas e resistências serão apresentadas em duas camadas.

Na visualização padrão, o jogador verá classificações simples:

- **Fraco**
- **Normal**
- **Resistente**
- **Muito Resistente**
- **Imune**

Na visualização avançada, o jogador poderá consultar também os percentuais reais utilizados pelo sistema.

Exemplo:

```text
Modo simples:
Fogo → Resistente

Modo avançado:
Fogo → Resistente — percentual real
```

Os percentuais e limites exatos de cada classificação serão definidos durante o balanceamento.

##### Efeitos de status
O jogo terá inicialmente cinco efeitos principais de status:

- **Veneno:** causa dano ao longo do tempo.
- **Sangramento:** acumula até provocar uma perda relevante de Vida.
- **Atordoamento:** interrompe temporariamente as ações do alvo.
- **Queimadura:** causa dano ao longo do tempo e possui identidade ligada a Fogo.
- **Congelamento:** reduz o ritmo de combate e a velocidade de ações do alvo.

Inimigos poderão possuir fraquezas, resistências ou imunidades específicas para esses efeitos.

##### Acúmulo de status
Os efeitos de status utilizarão um sistema de acúmulo.

Ataques, habilidades e equipamentos poderão adicionar acúmulo a uma barra específica do efeito.

Quando a barra atingir seu limite:

```text
Acúmulo chega a 100%
↓
Efeito é ativado
↓
Barra retorna a 0
↓
Alvo recebe resistência temporária ao mesmo efeito
```

As barras de status serão visíveis durante o combate para facilitar a leitura do sistema.

A interface deverá mostrar principalmente as barras que já possuem acúmulo, evitando excesso de informação.

Quando um efeito deixa de ser aplicado por algum tempo, seu acúmulo poderá diminuir gradualmente.

##### Resistência temporária após status
Depois que um efeito é ativado, o alvo recebe resistência temporária específica àquele mesmo efeito.

Durante esse período, o novo acúmulo poderá ser reduzido ou temporariamente bloqueado.

A intensidade e duração dessa resistência poderão variar conforme:

- inimigo;
- efeito;
- categoria do inimigo;
- dificuldade.

Essa regra será especialmente importante para **Atordoamento**, evitando ciclos de controle infinito.

##### Bosses e efeitos de status
Bosses utilizarão o mesmo sistema geral de dano e status dos demais inimigos.

Eles não serão automaticamente imunes a efeitos apenas por serem Bosses.

Entretanto, poderão possuir:

- resistências naturalmente maiores;
- barras de acúmulo mais difíceis de completar;
- resistência temporária mais forte após sofrer um efeito;
- imunidades específicas quando fizer sentido para sua identidade;
- fraquezas próprias que ainda possam ser exploradas pelo jogador.

##### Habilidades por categoria de inimigo
A complexidade das habilidades aumentará conforme a importância do inimigo.

**Comuns**

- poucas habilidades;
- funcionamento simples;
- leitura rápida.

**Elites**

- habilidades próprias;
- efeitos mais perigosos;
- pelo menos alguma característica que possa exigir adaptação da build ou da party.

**Bosses**

- conjunto completo de habilidades;
- mecânicas próprias;
- alterações de comportamento relacionadas a fases e dificuldade.

Regra principal:

> Quanto maior a importância do inimigo, mais suas habilidades devem alterar a dinâmica do combate, e não apenas aumentar dano.

##### Leitura de habilidades inimigas
Como o combate é automático, o jogador deverá conseguir entender claramente por que venceu ou perdeu.

Habilidades inimigas poderão apresentar:

- nome da habilidade sendo preparada;
- barra de conjuração ou preparação quando aplicável;
- ícone do efeito associado;
- destaque visual para ataques especialmente perigosos;
- histórico curto de combate para análise avançada.

##### Fases de Boss
Bosses poderão possuir fases.

A quantidade de fases não será padronizada.

Cada Boss terá seu número de fases definido individualmente de acordo com sua identidade e função dentro da Dungeon.

Uma mudança de fase poderá alterar:

- habilidades;
- comportamento;
- prioridades;
- velocidade;
- padrões de ataque;
- efeitos de status;
- mecânicas próprias.

Regra principal:

> As fases existem para mudar a dinâmica do confronto, não apenas para aumentar dano e Vida.

Nem todo Boss precisará ter três fases.

##### Dificuldade e comportamento
Dificuldades maiores deverão alterar o combate de maneira mecânica e estratégica, e não apenas aumentar atributos.

Poderão modificar:

- ataques e habilidades dos inimigos;
- resistências e fraquezas;
- frequência e tipos de Elites;
- fases dos Bosses;
- comportamento e agressividade;
- janelas de recuperação;
- efeitos de status utilizados;
- composição dos encontros;
- recompensas e qualidade do loot.

Regra principal:

> Dificuldades maiores devem introduzir novas exigências mecânicas e estratégicas, não apenas aumentar atributos.

##### Loot de inimigos comuns
Inimigos Comuns serão responsáveis principalmente por sustentar a progressão normal.

Poderão conceder:

- dinheiro;
- materiais comuns;
- consumíveis básicos;
- equipamentos normais com raridade e atributos procedurais;
- pequena chance de materiais menos comuns.

##### Loot de Elites
Elites poderão conceder tudo que inimigos Comuns oferecem, porém com recompensas superiores.

Poderão possuir:

- maior chance de equipamentos de raridade elevada;
- materiais raros;
- consumíveis melhores;
- pequena chance de receitas;
- materiais específicos da Dungeon ou daquele tipo de criatura.

Elites serão uma fonte importante para jogadores que desejarem buscar versões procedurais melhores de equipamentos.

##### Loot de Bosses
Bosses poderão conceder:

- dinheiro;
- equipamentos próprios e temáticos;
- materiais exclusivos;
- receitas especiais;
- habilidades;
- itens de quest ou lore;
- materiais utilizados em upgrades +2;
- chance de Relíquia, quando aquele Boss possuir uma Relíquia associada.

Equipamentos normais de Boss continuarão utilizando o sistema de raridade e atributos procedurais.

Relíquias continuam sendo exceções, nunca poderão ser fabricadas e poderão possuir condições próprias de obtenção, como dificuldade, segredo, evento ou outra condição especial.

Todo Boss terá pelo menos **um recurso exclusivo garantido por vitória**, além de sua tabela de drops aleatórios.

Regra principal:

> Comuns sustentam a progressão, Elites recompensam o farm e Bosses entregam acesso a conteúdo exclusivo.

##### Loot de exploração
Nem todas as recompensas de uma Dungeon virão diretamente do combate.

Salas secretas, eventos, caminhos especiais e descobertas poderão conceder recompensas como:

- receitas;
- habilidades;
- itens incomuns;
- materiais especiais;
- conteúdo narrativo;
- condições relacionadas a Relíquias.

##### Ameaça e Aggro
Em combates com party, os inimigos utilizarão um sistema de **Ameaça/Aggro**.

Cada personagem poderá gerar Ameaça através de ações como:

- dano causado;
- cura;
- suporte;
- habilidades específicas.

Como comportamento padrão, inimigos tenderão a atacar o personagem com maior Ameaça.

##### Manipulação de Ameaça
Habilidades poderão:

- aumentar a Ameaça do usuário;
- reduzir Ameaça;
- modificar a geração de Ameaça;
- **Provocar** um inimigo.

Aumentar Ameaça influencia naturalmente a seleção de alvo.

Provocar força temporariamente um inimigo a priorizar determinado personagem.

Bosses poderão desenvolver resistência temporária contra provocações repetidas.

##### Regras alternativas de alvo
O Aggro será a regra padrão, mas determinados inimigos e habilidades poderão utilizar outras formas de escolher alvos.

Exemplos:

- personagem com maior Ameaça;
- personagem com menor Vida;
- personagem que causou mais dano recentemente;
- alvo aleatório;
- personagem que está curando;
- personagem utilizando determinado tipo de habilidade;
- toda a party.

Cada inimigo utilizará apenas os comportamentos que fizerem sentido para sua identidade.

Habilidades especiais poderão indicar explicitamente que **ignoram Ameaça**.

##### Interface de Ameaça
A Ameaça será visível ao jogador em duas camadas.

Na interface padrão, serão mostrados principalmente:

- alvo atual do inimigo;
- indicação visual do personagem que possui a atenção do inimigo;
- aviso quando outro personagem estiver próximo de assumir o Aggro;
- mudanças de alvo.

Na visualização avançada, o jogador poderá consultar a distribuição percentual relativa de Ameaça entre os membros da party.

Exemplo:

```text
Ameaça

Guerreiro    46%
Mira         31%
Curandeiro   15%
Mago          8%
```

Quando um inimigo trocar de alvo, a interface deverá comunicar isso através de:

- aviso curto de troca de foco;
- destaque visual no novo alvo;
- atualização do indicador de Aggro;
- registro no histórico de combate.

##### Recompensas por dificuldade
Dificuldades maiores melhorarão as recompensas de duas formas:

1. aumentar a chance e a qualidade do loot já existente;
2. desbloquear itens exclusivos daquela dificuldade.

Conteúdos exclusivos de dificuldade poderão incluir:

- equipamentos;
- receitas;
- habilidades;
- materiais especiais;
- condições específicas relacionadas a Relíquias.

Bosses de dificuldades maiores poderão adicionar novos itens à própria tabela de loot sem necessariamente remover recompensas das dificuldades anteriores.

##### Primeiro clear de dificuldade
A primeira conclusão de cada dificuldade concederá pelo menos **uma recompensa especial garantida**.

Dependendo da Dungeon e da dificuldade, essa recompensa poderá ser:

- habilidade;
- receita;
- material exclusivo;
- equipamento fixo;
- item narrativo ou de progressão.

Depois do primeiro clear, essa recompensa específica não precisa permanecer garantida e as execuções seguintes utilizarão normalmente a tabela de loot daquela dificuldade.

Regra principal:

> A primeira vitória em cada dificuldade deve recompensar progresso real com pelo menos uma recompensa garantida especial.

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


##### Primeiro parceiro recrutável — Mira
**Mira** será a primeira parceira recrutável do jogo.

Características definidas:

- mulher;
- humana;
- ex-soldado da Ordem de Ferro;
- arqueira;
- parceira recrutada em uma Dungeon.

##### História de Mira
Mira deixou oficialmente a Ordem de Ferro.

Durante sua vida militar, sofreu preconceito por ser mulher e era frequentemente tratada como inferior por homens do exército.

Apesar disso, provou repetidamente sua capacidade e venceu diversas batalhas sem precisar de ajuda.

Depois de sair do exército, ficou sem dinheiro e passou a entrar em Dungeons em busca de loot para sobreviver.

Quando o jogador a encontra, ela já está sobrevivendo sozinha.

Entrar para a party não representa um resgate, mas passa a dar a ela um novo objetivo de vida.

##### Personalidade e desenvolvimento
Mira ainda possui preconceitos contra monstros no início.

Esse preconceito foi herdado da cultura humana e de sua formação militar.

Conforme a relação com o jogador aumenta, sua visão sobre monstros diminui gradualmente.

Mira não abandona a party por discordâncias.

Por sua formação militar, ela sabe seguir ordens mesmo quando discorda do jogador.

Isso não impede que ela:

- questione decisões;
- demonstre desaprovação;
- mude sua postura conforme a relação evolui.

##### Vantagem exclusiva
A habilidade passiva exclusiva de Mira será:

> **Olho de Caçadora**

Efeito:

> Aumenta a chance de crítico de todos os membros da party.

##### Observações
- Mira não possui ligação prévia com a fortificação da primeira Dungeon.
- Mira não terá quest pessoal focada em vingança contra antigos soldados.

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

##### Dificuldades ativas
Todas as Dungeons possuirão a mesma quantidade de dificuldades ativas.

Serão quatro:

1. **Fácil**
2. **Normal**
3. **Difícil**
4. **Impossível**

As dificuldades serão desbloqueadas sequencialmente.

A próxima dificuldade só ficará disponível depois que a anterior for concluída.

Dificuldades maiores deverão modificar o conteúdo de forma mecânica e estratégica, não apenas aumentar Vida e dano.

Poderão modificar:

- força dos inimigos;
- quantidade de salas;
- eventos;
- frequência e tipos de Elites;
- ataques e habilidades;
- resistências e fraquezas;
- mecânicas;
- comportamento e fases do Boss;
- aplicação de status;
- composição dos encontros;
- recompensas e qualidade do loot.

As regras de recompensas por dificuldade permanecem válidas:

- dificuldades maiores melhoram a chance e a qualidade do loot existente;
- podem desbloquear itens exclusivos;
- a primeira conclusão de cada dificuldade concede pelo menos uma recompensa especial garantida.

##### Incursão Automática
Além das quatro dificuldades ativas, todas as Dungeons terão acesso ao modo **Incursão Automática** após o desbloqueio apropriado.

A Incursão Automática é um modo separado e **não representa uma quinta dificuldade**.

Ela possuirá um preset próprio e padronizado de balanceamento para execução automática.

A Incursão Automática terá:

- duração;
- chance de sucesso;
- drops úteis;
- equipamentos;
- materiais;
- recompensas raras.

Porém:

> Os melhores drops serão exclusivos da exploração ativa.

Salas secretas, eventos secretos e as melhores recompensas do Boss deverão incentivar o jogador a realizar a Dungeon ativamente.

Se uma Incursão Automática falhar, aquela execução não entregará as recompensas esperadas.

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

Somente Relíquias poderão ser negociadas entre jogadores.

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

> As atividades de coleta oferecem um recurso principal previsível, normalmente 1 unidade garantida por ciclo, além de pools temáticos de recursos secundários.

> Recursos secundários das atividades podem alimentar crafting, ligas, ferramentas e upgrades.

> Materiais antigos continuam relevantes em receitas e ligas avançadas; desbloqueio mais alto não significa superioridade absoluta.

> Ferramentas de coleta são separadas do equipamento de combate, possuem raridade procedural, upgrades +0/+1/+2 e são obtidas somente por fabricação ou Dungeons.

> Cada skill possui um minigame temático periódico e opcional; o Idle gera a oportunidade e a interação ativa melhora temporariamente a eficiência ou os drops.

> No Prestígio I, todas as skills desbloqueiam uma forma temática de produção paralela, inicialmente com eficiência reduzida na segunda atividade.

> Recursos importantes do mundo podem utilizar nomes em irlandês seguindo três regras: nome diferente com visual familiar; a mesma coisa sempre recebe o mesmo nome; e palavras estrangeiras não devem prejudicar a clareza dos sistemas.

> A Mineração evolui tematicamente de Natureza para Sobrenatural, Guerra e Divindades, preservando a utilidade de materiais antigos em todas as camadas.

> Nomes de materiais ligados à guerra ou a divindades representam associações culturais e não confirmam sua origem real nem a existência objetiva das figuras religiosas.

> Lenhador evolui de Floresta Natural para Floresta Sobrenatural, Eras Antigas e Árvores Sagradas, mantendo cada madeira útil por propriedades e receitas próprias.

> O Prestígio do personagem concede 5 pontos permanentes para uma Árvore de Prestígio.

> A árvore terá mais opções do que pontos disponíveis, obrigando escolhas de build.

> Cada parceiro fixo deve possuir identidade narrativa e mecânica própria.

> O relacionamento com parceiros desbloqueia novas possibilidades.

> Relíquias são extremamente raras, poderosas, negociáveis e possuem histórico de donos.

> A identidade de uma Dungeon é fixa, mas sua exploração é procedural.

> Escolhas de caminho em uma Dungeon são irreversíveis durante aquela tentativa.

> Ao chegar ao Boss, o jogador escolhe entre garantir seu loot ou arriscar tudo por recompensas melhores.

> A Incursão Automática oferece boas recompensas, mas é um modo separado das quatro dificuldades ativas e as melhores recompensas exigem exploração ativa.

> O combate é automático, mas a build, os atributos, os equipamentos e a preparação determinam o resultado.

> Inimigos são divididos em Comuns, Elites e Bosses, com complexidade e recompensas crescentes.

> Fraquezas e resistências possuem leitura simples por categoria e visualização avançada por percentuais.

> Veneno, Sangramento, Atordoamento, Queimadura e Congelamento utilizam acúmulo com barras visuais e resistência temporária após ativação.

> Bosses usam o mesmo sistema de status dos demais inimigos, com resistências e imunidades definidas individualmente.

> Fases de Boss são definidas individualmente e devem mudar a dinâmica do confronto.

> Dificuldades maiores alteram mecânicas e estratégia, além de melhorar e expandir o loot.

> Todas as Dungeons possuem quatro dificuldades ativas fixas: Fácil, Normal, Difícil e Impossível.

> A Incursão Automática é um modo separado e não conta como uma quinta dificuldade.

> O sistema de Ameaça/Aggro orienta a seleção padrão de alvos em party, mas inimigos e habilidades podem usar regras próprias.

> A interface de Aggro possui leitura simples e visualização avançada por percentuais.

> Todo Boss possui pelo menos um recurso exclusivo garantido por vitória.

> A primeira conclusão de cada dificuldade concede pelo menos uma recompensa especial garantida.

> O personagem equipa até 4 habilidades ativas e pode combinar livremente suas categorias.

> Toda habilidade ativa possui Perfil Agressiva ou Defensiva.

> O estilo de combate Agressivo, Defensivo ou Misto determina como a automação prioriza as habilidades equipadas.

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
