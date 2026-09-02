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

##### Princípio das classes iniciais
As classes iniciais definem apenas a vantagem de começo do personagem.

Cada classe altera:

- distribuição inicial dos atributos;
- equipamento inicial;
- habilidade inicial.

Nenhuma classe bloqueia permanentemente:

- atributos;
- armas;
- equipamentos;
- skills;
- categorias de habilidade;
- caminhos de build.

Regra principal:

> **A classe define o começo, não o destino do personagem.**

##### Orçamento inicial de atributos
Todas as classes começam com o mesmo orçamento total de atributos.

A referência inicial será:

> **35 pontos distribuídos entre os 7 atributos.**

O total comum é uma regra de design para evitar que uma classe comece com mais poder bruto do que outra.

As distribuições abaixo são **referências de balanceamento**. Os valores individuais poderão ser ajustados depois de validar requisitos das armas, Vida, Mana, Stamina, scaling e dificuldade do início do jogo.

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

Habilidade inicial:

- uma habilidade **Física Agressiva**.

Identidade inicial:

> Combate corpo a corpo, sobrevivência, Força e Vigor.

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

Habilidade inicial:

- uma **Magia Agressiva**.

Identidade inicial:

> Mana, Inteligência e acesso imediato a combate mágico.

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

Habilidade inicial:

- uma habilidade **Física Agressiva à distância**.

Identidade inicial:

> Destreza, precisão e combate à distância.

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

Habilidade inicial:

- um **Milagre Defensivo**.

O Acólito poderá ser a classe cujo primeiro ativo enfatiza diretamente defesa, cura ou suporte.

Identidade inicial:

> Fé, Mente, cura e suporte.

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

Habilidade inicial:

- uma habilidade **Física Agressiva** ligada a crítico ou velocidade.

Identidade inicial:

> Destreza, crítico e combate rápido.

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

Habilidade inicial:

- uma habilidade **Universal**.

Identidade inicial:

> Não possui vantagem clara, mas também não possui atributo inicialmente atrasado.

##### Presente inicial
O presente é escolhido separadamente da classe.

Existirão sete opções iniciais:

| Presente | Função principal |
|---|---|
| **Chave Enferrujada** | exploração e segredo |
| **Bolsa de Moedas** | vantagem econômica inicial |
| **Frasco Carmesim** | sobrevivência emergencial |
| **Anel do Viajante** | pequeno bônus versátil enquanto equipado |
| **Pedra Sem Nome** | lore e conteúdo secreto |
| **Kit de Sobrevivência** | início confortável com consumíveis normais |
| **Nenhum Presente** | escolha puramente narrativa |

##### Chave Enferrujada
Uma chave antiga cuja fechadura não é explicada no começo do jogo.

Poderá abrir futuramente uma sala, cofre, caminho ou evento opcional.

Sua recompensa deverá ser interessante, mas não essencial para a progressão principal nem matematicamente obrigatória.

##### Bolsa de Moedas
O personagem começa com dinheiro adicional.

A quantidade exata será **A definir** durante o balanceamento.

Sua vantagem deve perder importância naturalmente conforme a economia do personagem cresce.

##### Frasco Carmesim
Consumível raro de emergência disponível desde o início.

Seu efeito exato será **A definir**, porém deverá servir principalmente para sobrevivência e não conceder progresso permanente.

O item poderá ser obtido novamente no mundo futuramente; não será um conteúdo permanentemente exclusivo da escolha inicial.

##### Anel do Viajante
Equipamento inicial fixo que aumenta, enquanto equipado:

- Vida máxima;
- Mana máxima;
- Stamina máxima.

Os valores exatos serão **A definir**.

O Anel do Viajante:

- ocupa normalmente um slot de Anel;
- não é uma Relíquia;
- não possui vantagem permanente depois de ser substituído;
- deve se tornar naturalmente substituível por equipamentos melhores.

##### Pedra Sem Nome
Objeto mineral incomum cuja função não é compreendida inicialmente.

Poderá se conectar futuramente a:

- quest secreta;
- diálogo;
- evento de Dungeon;
- civilização antiga;
- lore.

Não deverá conceder vantagem obrigatória à progressão principal.

##### Kit de Sobrevivência
Conjunto inicial de consumíveis normais, como refeições, poções ou outros itens apropriados.

A composição e quantidade exatas serão **A definir**.

Tudo presente no kit deverá poder ser obtido normalmente no jogo.

##### Nenhum Presente
O jogador pode escolher começar sem presente.

Essa opção não concede bônus escondido nem recompensa secreta automática por ter recusado as demais opções.

##### Limites dos presentes
Presentes iniciais não deverão conceder:

- Relíquia;
- material obrigatório de upgrade +2;
- habilidade permanentemente exclusiva;
- ponto de atributo permanente;
- Ponto de Prestígio;
- aumento permanente de XP;
- item globalmente limitado;
- equipamento destinado a permanecer dominante por grande parte da progressão.

Regra principal:

> **A classe define como o personagem começa a lutar; o presente define uma pequena vantagem, conveniência ou curiosidade com a qual ele começa a jornada.**

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

1. **Mineração** → minérios, pedras e materiais minerais.
2. **Lenhador** → madeiras e recursos de árvores.
3. **Pesca** → peixes e recursos aquáticos.
4. **Herbologia** → plantas, ervas, fungos e ingredientes naturais.
5. **Metalurgia** → transforma materiais minerais em formas processadas, lingotes, ligas e componentes.
6. **Forja** → armas, armaduras, ferramentas, arcos, acessórios, couro, tecidos e outros equipamentos.
7. **Culinária** → alimentos, bebidas, poções, elixires, antídotos e preparados especiais.

##### Skill e atividade
Uma **skill** representa aquilo que o personagem aprende e evolui.

Uma **atividade** representa aquilo que o jogador faz utilizando uma skill.

As atividades concedem experiência para a skill relacionada.

Nas skills de coleta, o jogador escolhe diretamente o recurso principal que deseja obter.

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
repete automaticamente
```

Regra principal:

> **Escolher uma atividade específica → aguardar o tempo da ação → receber o recurso ou produto definido + XP → repetir automaticamente.**

##### Atividades Idle e previsibilidade
Atividades Idle **não geram drops secundários aleatórios**.

Cada atividade entrega somente:

- o recurso ou produto que o jogador escolheu obter;
- XP da skill;
- possíveis unidades adicionais **desse mesmo resultado**, quando algum bônus permitir.

Exemplo:

```text
Seleciona Iarann
↓
resultado normal: 1 Iarann
↓
bônus de quantidade é ativado
↓
resultado: unidades adicionais de Iarann
```

O bônus nunca transforma a atividade em uma fonte aleatória de outros itens.

Não existirão, como efeito colateral aleatório da execução Idle:

- gemas inesperadas;
- sementes aleatórias;
- resinas aleatórias;
- escamas aleatórias;
- pós ou resíduos aleatórios;
- componentes raros aleatórios;
- materiais secretos aleatórios.

Regra principal:

> **O jogador sabe o que está produzindo. A aleatoriedade do Idle não deve multiplicar desnecessariamente a quantidade de itens e fontes de obtenção.**

##### Fontes explícitas para materiais especiais
Materiais especiais e raros continuam existindo, porém deverão possuir fontes claras de obtenção.

Poderão vir de:

- atividades próprias desbloqueáveis;
- receitas próprias;
- Dungeons;
- Bosses;
- eventos;
- exploração;
- quests;
- conteúdos ou desbloqueios de Prestígio.

Se determinado componente precisar existir no crafting, o jogador deverá conseguir identificar **onde buscá-lo**, em vez de depender de um drop secundário escondido dentro de outra atividade Idle.

##### Estrutura das atividades de coleta
A estrutura-base será utilizada principalmente por:

- Mineração;
- Lenhador;
- Pesca;
- Herbologia.

Cada atividade de coleta terá:

- recurso principal definido;
- requisito de nível quando aplicável;
- tempo próprio por ação;
- experiência da skill;
- repetição automática enquanto estiver ativa.

O tempo exato das ações será definido durante o balanceamento.

A atividade poderá continuar durante o progresso offline, respeitando o limite de tempo offline do personagem.

##### Quantidade obtida por ação
Como base, cada ciclo de uma atividade de coleta concederá normalmente:

> **1 unidade garantida do recurso principal.**

Ferramentas, Prestígio, habilidades e outros efeitos poderão gerar unidades adicionais do mesmo recurso.

A quantidade-base e os modificadores específicos poderão variar durante o balanceamento, mas o jogador deverá possuir uma fonte previsível do recurso escolhido.

##### Estrutura das atividades de produção
Metalurgia, Forja e Culinária utilizam receitas.

Fluxo geral:

```text
Seleciona receita
↓
consome os materiais definidos
↓
aguarda o tempo de produção
↓
recebe o produto definido + XP
↓
repete enquanto houver materiais e a produção estiver ativa
```

A produção normal não falha.

Quantidade consumida, quantidade produzida e tempo de cada receita serão definidos individualmente e balanceados posteriormente.

Produtos intermediários como ligas, extratos, óleos, essências ou materiais refinados deverão existir como **receitas ou atividades próprias**, e não como subprodutos aleatórios.

##### Ferramentas de coleta
As ferramentas de coleta formam um sistema separado dos equipamentos de combate.

Elas não ocupam slots como arma principal, mão secundária, armaduras, anéis ou amuleto.

Ferramentas definidas:

- **Mineração:** picareta;
- **Lenhador:** machado de corte;
- **Pesca:** equipamento de pesca;
- **Herbologia:** Kit de Herbologia.

O **Kit de Herbologia** representa um conjunto único de instrumentos de coleta e preparo, podendo incluir conceitualmente lâmina, tesoura, pá pequena e recipientes. Ele funciona como um único item de ferramenta no sistema.

Metalurgia e Culinária não possuem ferramenta equipável própria. Fornos, cadinhos, utensílios e outras instalações fazem parte da atividade ou estação de produção, e não de um slot de ferramenta.

##### Atributos de ferramentas
Ferramentas poderão melhorar principalmente:

- velocidade da atividade;
- quantidade obtida;
- chance de unidade adicional do mesmo recurso;
- experiência da skill.

Ferramentas de coleta não deverão utilizar atributos de combate como foco de seus rolls procedurais.

Atributos ligados a chance de drops secundários ou materiais raros aleatórios não fazem parte do sistema.

##### Obtenção de ferramentas
Ferramentas de coleta terão somente duas fontes de obtenção:

1. **Fabricação/Forja**;
2. **Dungeons**.

A Forja será a fonte regular de progressão das ferramentas.

Dungeons poderão fornecer modelos próprios de ferramentas, com identidade ou características-base especiais.

Ferramentas não serão obtidas diretamente como progressão por lojas, NPCs, quests ou Prestígio.

##### Raridade procedural das ferramentas
Ferramentas normais utilizam o mesmo sistema de raridade procedural dos equipamentos.

```text
Comum      → 1 atributo procedural
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Duas ferramentas com o mesmo modelo e raridade poderão possuir combinações diferentes de atributos.

Modelos especiais encontrados em Dungeons também poderão utilizar raridade procedural quando forem itens normais e não Relíquias.

##### Upgrade de ferramentas
Ferramentas seguem o mesmo conceito de upgrade dos equipamentos:

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

- velocidade ou eficiência;
- quantidade obtida ou produzida;
- chance de unidade adicional do mesmo resultado;
- experiência da skill.

O minigame não introduz pools de drops próprios e não gera materiais raros aleatórios que não façam parte da atividade escolhida.

O sistema poderá limitar a quantidade de oportunidades de minigame acumuladas. O limite exato será **A definir**.

Regra principal:

> **O Idle gera a oportunidade; a interação ativa permite aproveitá-la melhor.**

##### Direção temática dos minigames
Cada skill terá uma mecânica compatível com sua fantasia.

- **Mineração:** quebrar uma formação rochosa identificando e atingindo pontos de fraqueza.
- **Lenhador:** trabalhar direção e momento dos cortes.
- **Pesca:** reagir à fisgada e controlar a tensão da linha.
- **Herbologia — Identificação e Extração:** reconhecer partes corretas da planta e coletá-las na ordem e momento adequados.
- **Metalurgia — Controle de Fundição:** controlar temperatura, remover impurezas no momento correto e escolher a janela de vazamento.
- **Forja — Martelamento:** trabalhar ritmo, posição e força dos golpes, evitando excesso em uma mesma região.
- **Culinária — Sequência e Timing:** executar etapas da receita na ordem correta e dentro das janelas adequadas.

Desempenho ruim no minigame não deverá fazer a produção Idle normal falhar.

##### Técnicas internas
Uma skill poderá possuir técnicas ou categorias internas sem que elas sejam novas skills.

Forja inclui internamente:

```text
FORJA
│
├── Ferraria
│   └── armas, armaduras metálicas, escudos e ferramentas
│
├── Couraria
│   └── couro e armaduras leves
│
├── Tecelagem
│   └── vestes e tecidos
│
├── Arquearia
│   └── arcos e componentes relacionados
│
└── Ourivesaria
    └── anéis, amuletos e componentes refinados
```

Essas técnicas fazem parte da mesma progressão de Forja.

##### Herbologia e Culinária
Herbologia é responsável principalmente pela coleta de ingredientes naturais.

Culinária transforma ingredientes em itens consumíveis.

```text
Herbologia
↓
Ervas
Fungos
Raízes
Flores
Ingredientes naturais

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

Regra principal:

> **O antigo endgame se torna o novo início.**

Cada Prestígio deverá ampliar o conteúdo da skill através de elementos como:

- novos recursos ou produtos;
- novas atividades ou receitas;
- novas técnicas;
- novos equipamentos;
- novos bônus e possibilidades mecânicas;
- recompensas exclusivas;
- novas conexões com Dungeons, Bosses, quests, eventos e exploração.

A progressão deverá ficar mais longa a cada Prestígio.

##### Evolução mecânica das atividades por Prestígio
A estrutura de produção simultânea será comum às sete skills.

**Progressão Normal**

> **1 atividade ou linha de produção por vez.**

**Prestígio I — Produção Paralela**

> **2 atividades ou linhas simultâneas.**

A atividade principal funciona com eficiência completa como referência de design, enquanto a segunda começa com eficiência reduzida. O percentual exato será definido durante o balanceamento.

Versões temáticas:

- **Mineração — Extração Dupla:** dois recursos minerais.
- **Lenhador — Corte Duplo:** duas madeiras.
- **Pesca — Linha Dupla:** dois alvos de pesca.
- **Herbologia — Coleta Dupla:** duas plantas ou ingredientes.
- **Metalurgia — Fundição Paralela:** duas receitas de processamento.
- **Forja — Produção Paralela:** duas fabricações.
- **Culinária — Preparo Paralelo:** duas receitas.

A segunda atividade precisa estar desbloqueada normalmente.

**Prestígio II — Sincronização e Prioridade**

O jogador mantém duas atividades simultâneas, mas desbloqueia controle avançado sobre a distribuição de eficiência entre elas.

Direções de configuração:

- **Equilibrado:** distribui a eficiência de forma mais uniforme;
- **Prioridade Principal:** favorece a primeira atividade;
- **Prioridade Secundária:** favorece a segunda atividade.

Os percentuais e fórmulas exatos serão definidos durante o balanceamento.

A função do P2 é dar **controle** sobre o paralelismo, e não apenas adicionar mais uma linha.

**Prestígio III — Produção Tripla**

> **3 atividades ou linhas de produção simultâneas.**

Todas devem estar individualmente desbloqueadas.

Os valores de eficiência das três linhas serão definidos posteriormente.

Progressão mecânica resumida:

```text
Normal       → 1 atividade
Prestígio I  → 2 atividades
Prestígio II → 2 atividades + controle avançado de prioridade
Prestígio III→ 3 atividades
```

Regra principal:

> **Prestígio deve mudar a forma de executar a skill, não apenas aumentar números.**

##### Convenção de nomenclatura dos recursos
Recursos e nomes culturais do mundo poderão utilizar idiomas inspirados nas tradições que formam sua identidade, principalmente **irlandês** para a vertente céltica e, quando fizer sentido para outra tradição histórica ou cultural, referências **islandesas/nórdicas**.

O mundo não representa literalmente Irlanda ou Islândia. Essas línguas e tradições funcionam como referências para construir culturas próprias do universo do jogo.

A interface, os sistemas, atributos, dificuldades, instruções e descrições continuam utilizando português.

Regras principais:

> **Nome diferente, visual familiar.**

> **A mesma coisa sempre recebe o mesmo nome.**

> **Nunca usar uma palavra estrangeira quando ela só torna uma informação de sistema mais difícil de entender.**

> **A origem linguística de um nome pode funcionar como pista de qual tradição cultural ou histórica o nome pertence.**

Na prática:

- recursos já definidos mantêm sua nomenclatura cultural;
- nomes ligados a uma tradição de inspiração céltica poderão utilizar irlandês;
- nomes ligados a uma tradição de inspiração islandesa/nórdica poderão utilizar convenção própria dessa vertente;
- a escolha entre tradições não deverá ser aleatória;
- a arte deverá continuar deixando claro o que o recurso representa quando existir um equivalente reconhecível;
- um mesmo recurso nunca deverá receber nomes diferentes em contextos diferentes;
- traduções explicativas poderão existir na documentação, mas não precisam aparecer permanentemente na interface;
- termos funcionais do sistema permanecem em português quando a tradução estrangeira reduzir a clareza.

---

### Mineração

##### Identidade
A progressão normal utiliza materiais naturais e reconhecíveis, com nomes em irlandês e visual familiar.

Nos Prestígios, a Mineração passa a materiais progressivamente mais excepcionais.

```text
Normal        → Natureza
Prestígio I   → Sobrenatural
Prestígio II  → Guerra
Prestígio III → Divindades
```

Evolução conceitual:

> **terra → sobrenatural → história → mito**

##### Progressão normal 1–99
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

##### Prestígio I — Sobrenatural
| Nível P1 | Material | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Grianchloch** | Quartzo | antigo endgame normal torna-se o ponto de entrada |
| 15 | **Scáth** | Sombra | equipamentos rápidos, precisão e componentes especiais |
| 30 | **Gealach** | Lua | Mana, suporte, catalisadores e equipamentos mágicos |
| 45 | **Fuil** | Sangue | armas físicas e receitas ligadas a Sangramento |
| 60 | **Cuimhne** | Memória | receitas da civilização antiga e crafting especial |
| 75 | **Anam** | Alma | Fé, cura, suporte e equipamentos híbridos |
| 90 | **Réalta** | Estrela | crafting de alto nível e equipamentos excepcionais |

**Cuimhne** é especialmente associada a ruínas e vestígios da civilização antiga. O nome não confirma que o material literalmente guarde memórias.

##### Prestígio II — Guerra
| Nível P2 | Material | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Réalta** | Estrela | antigo endgame do P1 torna-se o ponto de entrada |
| 15 | **Cath** | Batalha | armas, armaduras e equipamentos voltados ao combate |
| 30 | **Luaith** | Cinzas | ligas, Metalurgia e receitas relacionadas a Fogo |
| 45 | **Mionn** | Juramento | defesa, Fé e suporte |
| 60 | **Créacht** | Ferida | Sangramento, dano físico e equipamentos agressivos |
| 75 | **Fothrach** | Ruína | equipamentos antigos e receitas ligadas à guerra |
| 90 | **Cogadh** | Guerra | crafting de endgame do P2 e equipamentos especiais |

Leitura narrativa:

> **Batalha → Cinzas → Juramentos → Feridas → Ruínas → Guerra**

Os nomes são associações históricas. Não confirmam que a guerra tenha criado os materiais.

##### Prestígio III — Divindades
| Nível P3 | Material | Associação cultural | Identidade de crafting |
|---:|---|---|---|
| 1 | **Cogadh** | Guerra | antigo endgame do P2 torna-se o ponto de entrada |
| 15 | **Brigid** | metalurgia, criação e cura | Forja avançada, suporte e equipamentos especiais |
| 30 | **Nuada** | prata, realeza e combate | defesa, precisão e equipamentos de alta qualidade |
| 45 | **Goibniu** | ferreiros e fabricação de armas | armas, ferramentas e Forja de altíssimo nível |
| 60 | **Lugh** | habilidade, guerra e múltiplas artes | equipamentos híbridos e builds versáteis |
| 75 | **Mórrigan** | guerra e destino | crítico, Sangramento, status e equipamentos agressivos |
| 90 | **Dagda** | força, magia e grande versatilidade | material máximo de crafting do P3 |

Os nomes divinos são associações culturais e não confirmam a existência objetiva dessas divindades nem que tenham criado os materiais.

##### Utilidade contínua
Materiais antigos continuam relevantes em:

- ligas;
- equipamentos;
- ferramentas;
- acessórios;
- upgrades;
- receitas avançadas;
- componentes especializados.

Regra principal:

> **Um material possui função econômica e de crafting própria; nível de desbloqueio não representa uma escala absoluta de superioridade.**

---

### Lenhador

##### Identidade
Lenhador utiliza nomes principais em irlandês, arte reconhecível e funções próprias para cada madeira.

```text
Normal        → Floresta Natural
Prestígio I   → Floresta Sobrenatural
Prestígio II  → Eras Antigas
Prestígio III → Árvores Sagradas
```

##### Progressão normal 1–99
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

##### Prestígio I — Floresta Sobrenatural
| Nível P1 | Madeira | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Iúr** | Teixo | antigo endgame normal torna-se o ponto de entrada |
| 15 | **Ceo** | Névoa | arcos leves, precisão e velocidade |
| 30 | **Oíche** | Noite | furtividade, crítico e equipamentos rápidos |
| 45 | **Draíocht** | Magia | cajados, catalisadores, Mana e equipamentos mágicos |
| 60 | **Aisling** | Sonho / visão | híbridos, suporte e componentes especiais |
| 75 | **Spiorad** | Espírito | Fé, cura, suporte e equipamentos espirituais |
| 90 | **Síoraí** | Eterno | crafting máximo do P1, resistência e componentes avançados |

Mesmo a madeira sobrenatural deverá continuar parecendo claramente madeira.

##### Prestígio II — Eras Antigas
| Nível P2 | Madeira | Significado-base | Identidade de crafting |
|---:|---|---|---|
| 1 | **Síoraí** | Eterno | antigo endgame do P1 torna-se o ponto de entrada |
| 15 | **Treibh** | Tribo / povo | arcos, ferramentas e crafting versátil |
| 30 | **Dún** | Fortaleza | escudos, estruturas e defesa |
| 45 | **Ríocht** | Reino | equipamentos refinados e acessórios |
| 60 | **Ríshliocht** | Dinastia | equipamentos únicos e receitas históricas |
| 75 | **Oidhreacht** | Herança / legado | receitas que combinam materiais de várias eras |
| 90 | **Seanchas** | Tradição / lore | crafting máximo do P2 e receitas ligadas à civilização antiga |

Leitura histórica:

> **povos → fortalezas → reinos → dinastias → herança → história**

##### Prestígio III — Árvores Sagradas
| Nível P3 | Madeira | Identidade visual / cultural | Especialização principal |
|---:|---|---|---|
| 1 | **Seanchas** | antigo endgame do P2 | entrada do P3 |
| 15 | **Bile** | grande árvore de importância sagrada | crafting ritual, avançado e versátil |
| 30 | **Eó Mugna** | grande carvalho lendário | defesa, estruturas e escudos |
| 45 | **Bile Tortan** | freixo lendário | armas, cabos e ferramentas máximas |
| 60 | **Eó Rossa** | teixo lendário | arcos, precisão, crítico e efeitos especiais |
| 75 | **Craeb Dáithí** | árvore lendária de madeira clara e padrões incomuns | equipamentos híbridos e crafting complexo |
| 90 | **Craeb Uisnig** | grande árvore sagrada | madeira máxima do P3 e receitas excepcionais |

##### Utilidade contínua
Madeiras antigas mantêm funções próprias. `Fuinseog`, `Dair`, `Iúr`, `Ceo`, `Draíocht` e outras poderão continuar aparecendo em receitas de endgame conforme suas propriedades.

Regra principal:

> **A progressão amplia as possibilidades de crafting; ela não transforma os recursos antigos em materiais descartáveis.**

---

### Pesca

##### Identidade
Os peixes e criaturas aquáticas continuam visualmente reconhecíveis como fauna aquática mesmo quando a progressão entra em conteúdos sobrenaturais ou lendários.

```text
Normal        → Águas Naturais
Prestígio I   → Águas Sobrenaturais
Prestígio II  → Mar de Guerra
Prestígio III → Lendas das Águas
```

Evolução conceitual:

> **natureza → sobrenatural → história da guerra → lenda**

##### Progressão normal 1–99
| Nível | Nome no jogo | Equivalente | Uso principal |
|---:|---|---|---|
| 1 | **Scadán** | Arenque | refeições simples e ingredientes básicos |
| 10 | **Breac** | Truta | refeições leves e buffs iniciais |
| 20 | **Sairdín** | Sardinha | receitas simples e produção em quantidade |
| 30 | **Ronnach** | Cavala | refeições energéticas |
| 45 | **Trosc** | Bacalhau | refeições de longa duração e receitas completas |
| 60 | **Bradán** | Salmão | buffs melhores e Culinária avançada |
| 75 | **Tuinnín** | Atum | refeições de alto valor e buffs físicos |
| 90 | **Doingean** | Robalo | pratos avançados e endgame normal |

##### Prestígio I — Águas Sobrenaturais
| Nível P1 | Espécie | Significado-base | Identidade de uso |
|---:|---|---|---|
| 1 | **Doingean** | Robalo | antigo endgame normal torna-se o ponto de entrada |
| 15 | **Tonn** | Onda | velocidade, Stamina e refeições leves |
| 30 | **Solas** | Luz | Mana, regeneração e suporte |
| 45 | **Taibhse** | Fantasma | Arcano, crítico e receitas incomuns |
| 60 | **Lasair** | Chama | Fogo, resistência a Queimadura e buffs ofensivos |
| 75 | **Stoirm** | Tempestade | velocidade, precisão e buffs de combate |
| 90 | **Doimhneacht** | Profundidade | Culinária avançada e receitas especiais do P1 |

##### Prestígio II — Mar de Guerra
| Nível P2 | Espécie | Significado-base | Identidade de uso |
|---:|---|---|---|
| 1 | **Doimhneacht** | Profundidade | antigo endgame do P1 torna-se o ponto de entrada |
| 15 | **Ancaire** | Âncora | defesa, resistência e refeições duradouras |
| 30 | **Cabhlach** | Frota / marinha | buffs de party e receitas em quantidade |
| 45 | **Ruathar** | Ataque / incursão | crítico, velocidade e buffs ofensivos |
| 60 | **Raic** | Destroço / naufrágio | resistência e receitas especiais |
| 75 | **Báite** | Afundado / submerso | Arcano, resistência e receitas incomuns |
| 90 | **Uaigh** | Túmulo | Culinária máxima do P2 e receitas excepcionais |

Leitura narrativa:

> **ancoram → formam uma frota → atacam → tornam-se destroços → afundam → o mar vira túmulo**

Os nomes são associações históricas. A guerra não é confirmada como causa biológica dessas espécies.

##### Prestígio III — Lendas das Águas
As espécies recebem nomes associados a criaturas lendárias por aparência, comportamento ou tradição cultural. O jogador continua pescando fauna aquática; os nomes não confirmam a existência literal dos seres mitológicos.

| Nível P3 | Espécie | Inspiração cultural | Identidade de uso |
|---:|---|---|---|
| 1 | **Uaigh** | Túmulo | antigo endgame do P2 torna-se o ponto de entrada |
| 15 | **Each Uisce** | Cavalo-d'água | Stamina, velocidade e evasão |
| 30 | **Dobhar-chú** | criatura aquática lendária | Força, crítico e buffs físicos |
| 45 | **Murúch** | tradição de sereia aquática | Mana, cura e suporte |
| 60 | **Tarbh Uisce** | touro-d'água | Vida, defesa e resistência |
| 75 | **Ollphéist** | grande monstro ou serpente aquática | status, receitas excepcionais e buffs agressivos |
| 90 | **Muirdris** | monstro lendário das águas | ingrediente máximo da Pesca P3 |

Regra narrativa:

> **A cultura dá nome ao desconhecido; o nome não prova que a lenda seja verdadeira.**

##### Utilidade contínua
Espécies antigas permanecem úteis devido às funções específicas de Culinária e crafting.

Regra principal:

> **O peixe determina a função da receita, não apenas sua potência.**

---

### Herbologia

##### Identidade
Herbologia trabalha com plantas, ervas, fungos, raízes, flores e ingredientes naturais.

A progressão temática será:

```text
Normal        → Flora Natural
Prestígio I   → Flora Sobrenatural
Prestígio II  → Flora do Norte: Fogo e Gelo
Prestígio III → Oráculos e Destino
```

Evolução conceitual:

> **natureza → sobrenatural → terras do norte → destino e mito**

A progressão também será a primeira demonstração forte, dentro das skills, da passagem de uma tradição linguística principalmente céltica para uma vertente nórdica/islandesa.

##### Progressão normal 1–99
| Nível | Nome | Equivalente | Identidade principal |
|---:|---|---|---|
| 1 | **Neantóg** | Urtiga | preparados básicos, Veneno e antídotos iniciais |
| 10 | **Seamair** | Trevo | suporte, refeições e preparados leves |
| 20 | **Caisearbhán** | Dente-de-leão | tônicos, regeneração e receitas comuns |
| 30 | **Fraoch** | Urze | Stamina, resistência e bebidas |
| 45 | **Aiteann** | Tojo | preparados e componentes especializados |
| 60 | **Raithneach** | Samambaia / feto | antídotos, resistência e ingredientes naturais |
| 75 | **Sáiste** | Sálvia | preparados avançados, suporte e recuperação |
| 90 | **Marós** | Alecrim | Culinária avançada, regeneração e preparados de alto nível |

##### Prestígio I — Flora Sobrenatural
| Nível P1 | Ingrediente | Significado | Especialização |
|---:|---|---|---|
| 1 | **Marós** | Alecrim | antigo endgame normal e entrada do P1 |
| 15 | **Drúcht** | Orvalho | cura e regeneração |
| 30 | **Suan** | Sono / repouso | controle, resistência e preparados calmantes |
| 45 | **Cogar** | Sussurro | precisão, velocidade e preparados sutis |
| 60 | **Rún** | Segredo | Arcano e catalisadores especiais |
| 75 | **Beatha** | Vida | Vida, cura e suporte |
| 90 | **Bás** | Morte | Veneno, antídotos superiores e preparados agressivos |

`Beatha` e `Bás` representam funções diferentes, não uma simples escala de superioridade.

##### Prestígio II — Flora do Norte: Fogo e Gelo
A nomenclatura passa a utilizar inspiração islandesa/nórdica porque essas espécies são associadas a terras frias, vulcânicas e culturalmente ligadas aos povos do norte.

| Nível P2 | Ingrediente | Significado | Especialização |
|---:|---|---|---|
| 1 | **Bás** | antigo P1 | entrada do P2 |
| 15 | **Mosi** | Musgo | resistência e regeneração |
| 30 | **Þoka** | Névoa | evasão, precisão e preparados sutis |
| 45 | **Ís** | Gelo | Gelo, Congelamento e resistência |
| 60 | **Aska** | Cinzas | toxinas, resistência e preparados especializados |
| 75 | **Hraun** | Lava | Fogo, defesa e preparados fortes |
| 90 | **Eldur** | Fogo | Fogo e preparados máximos do P2 |

Leitura da paisagem:

> **Musgo → Névoa → Gelo → Cinzas → Lava → Fogo**

##### Prestígio III — Oráculos e Destino
| Nível P3 | Ingrediente | Associação | Especialização |
|---:|---|---|---|
| 1 | **Eldur** | antigo endgame P2 | entrada do P3 |
| 15 | **Seiður** | magia / ritual | Arcano, efeitos especiais e catalisadores |
| 30 | **Völva** | vidente | percepção, suporte e preparados raros |
| 45 | **Urðr** | destino / passado | resistência e preparados persistentes |
| 60 | **Verðandi** | tornar-se / presente | regeneração e efeitos de duração |
| 75 | **Skuld** | obrigação / futuro | crítico e preparados condicionais |
| 90 | **Örlög** | Destino | ingrediente máximo de Herbologia P3 |

Os nomes representam associações culturais. Não confirmam que figuras, rituais ou forças mitológicas existam literalmente da forma descrita pelas tradições.

##### Minigame — Identificação e Extração
O jogador identifica quais partes de uma planta devem ser coletadas e em qual ordem.

Dependendo da espécie, a interação poderá envolver:

- folha;
- flor;
- raiz;
- fruto;
- semente;
- fungo;
- outra parte apropriada.

O minigame melhora temporariamente a eficiência da coleta, sem criar itens secundários exclusivos.

##### Ferramenta
Herbologia utiliza o **Kit de Herbologia**, conforme o sistema geral de ferramentas de coleta.

---

### Metalurgia

##### Conceito
Metalurgia transforma materiais minerais em formas processadas, lingotes, ligas e componentes utilizáveis por outras skills.

Regra principal:

> **Mineração descobre os materiais. Metalurgia descobre o que é possível fazer com eles.**

Processar um recurso não muda sua identidade sem necessidade.

Exemplo:

```text
Iarann
→ Lingote de Iarann
```

Quando o processo cria um material realmente novo, como uma liga, o produto poderá receber nome próprio.

Produções não geram subprodutos aleatórios. Se um material intermediário for necessário, ele deverá possuir receita própria.

##### Normal — Beneficiamento e Ligas Naturais
| Nível | Desbloqueio central | Base | Função |
|---:|---|---|---|
| 1 | **Cloch Tratada** | Cloch | blocos, estruturas e componentes básicos |
| 10 | **Lingote de Stán** | Stán | componentes e ligas iniciais |
| 20 | **Lingote de Copar** | Copar | equipamentos e ferramentas |
| 30 | **Cré-Umha** | Stán + Copar | liga versátil, equipamentos e ferramentas |
| 45 | **Fundição Pesada** | Iarann / Luaidhe | lingotes para armas, armaduras e componentes |
| 60 | **Cruach** | Iarann + componente apropriado | armas, ferramentas e equipamentos resistentes |
| 75 | **Metais Nobres** | Airgead / Ór | lingotes e ligas para acessórios e crafting especial |
| 90 | **Grianchloch Refinado** | Grianchloch | catalisadores, componentes arcanos e crafting avançado |

##### Prestígio I — Metalurgia Sobrenatural
| Nível P1 | Produto | Base principal | Especialização |
|---:|---|---|---|
| 1 | **Grianchloch Refinado** | Grianchloch | antigo endgame normal |
| 15 | **Liga de Scáth** | Scáth + metais anteriores | velocidade, precisão e equipamentos leves |
| 30 | **Liga de Gealach** | Gealach + Airgead | Mana, catalisadores e equipamentos mágicos |
| 45 | **Liga de Fuil** | Fuil + Iarann | dano físico e Sangramento |
| 60 | **Cuimhne Estabilizado** | Cuimhne + minerais anteriores | receitas antigas e componentes históricos |
| 75 | **Liga de Anam** | Anam + metais nobres | Fé, cura e suporte |
| 90 | **Liga de Réalta** | Réalta + materiais refinados | crafting excepcional do P1 |

Nem todo processamento precisa gerar um lingote. Materiais poderão ser estabilizados, refinados, vitrificados ou combinados conforme sua natureza.

##### Prestígio II — Metalurgia da Guerra
| Nível P2 | Produto | Base | Especialização |
|---:|---|---|---|
| 1 | **Liga de Réalta** | antigo P1 | entrada |
| 15 | **Liga de Cath** | Cath + Cruach | armas e armaduras de combate |
| 30 | **Vidro de Luaith** | Luaith + Grianchloch | Fogo, calor e componentes especiais |
| 45 | **Liga de Mionn** | Mionn + Airgead | defesa, Fé e suporte |
| 60 | **Liga de Créacht** | Créacht + materiais apropriados | Sangramento e equipamentos agressivos |
| 75 | **Fothrach Reforçado** | Fothrach + materiais estruturais | equipamentos antigos, defesa e reconstrução |
| 90 | **Liga de Cogadh** | Cogadh + ligas anteriores | material máximo da Metalurgia P2 |

##### Prestígio III — Metalurgia Mítica
| Nível P3 | Produto | Identidade |
|---:|---|---|
| 1 | **Liga de Cogadh** | antigo endgame P2 |
| 15 | **Liga de Brigid** | Forja avançada, suporte e equipamentos especiais |
| 30 | **Liga de Nuada** | defesa, precisão e equipamentos refinados |
| 45 | **Liga de Goibniu** | armas, ferramentas e componentes máximos de Forja |
| 60 | **Liga de Lugh** | equipamentos híbridos e versáteis |
| 75 | **Liga de Mórrigan** | crítico, Sangramento, status e builds agressivas |
| 90 | **Liga de Dagda** | material máximo da Metalurgia P3 |

O uso de nomes divinos continua sendo cultural e não comprova a existência real das divindades.

##### Minigame — Controle de Fundição
A interação ativa trabalha:

- temperatura;
- remoção de impurezas;
- momento correto do vazamento.

Desempenho ruim no minigame não destrói a produção normal.

Metalurgia não utiliza ferramenta equipável própria.

---

### Forja

##### Conceito
Forja transforma os materiais obtidos e processados em possibilidades de build.

Regra principal:

> **Metalurgia cria os materiais. Forja transforma esses materiais em possibilidades de build.**

A progressão libera técnicas, famílias de receitas e combinações, e não uma simples sequência de versões numericamente melhores da mesma arma.

##### Normal — Domínio dos Ofícios
| Nível | Marco | Principal evolução |
|---:|---|---|
| 1 | **Trabalho Básico** | armas, armaduras e ferramentas simples |
| 10 | **Reforços e Couraria** | couro, tiras, proteções leves e componentes |
| 20 | **Tecelagem** | vestes, tecidos e equipamentos ligados a Mana/Fé |
| 30 | **Arquearia** | arcos e estruturas compostas de madeira |
| 45 | **Ferraria Avançada** | armas e armaduras mais complexas |
| 60 | **Ourivesaria** | anéis, amuletos e componentes preciosos |
| 75 | **Construção Híbrida** | receitas que combinam várias skills e tipos de material |
| 90 | **Obra-Prima** | melhores receitas da progressão normal |

Tipos básicos de equipamento poderão existir antes desses marcos quando o gameplay exigir. Os níveis representam principalmente profundidade e domínio técnico.

##### Prestígio I — Forja Sobrenatural
| Nível P1 | Técnica | Função |
|---:|---|---|
| 1 | **Reforço Sobrenatural** | entrada do P1 e uso avançado do antigo endgame |
| 15 | **Vinculação** | unir materiais com propriedades muito diferentes |
| 30 | **Condução** | equipamentos ligados a Mana, Arcano e efeitos especiais |
| 45 | **Têmpera Reativa** | equipamentos ligados a dano, status e comportamento ofensivo |
| 60 | **Estrutura Híbrida** | mistura complexa de madeira, metal, cristal, couro e ingredientes |
| 75 | **Forja Espiritual** | equipamentos ligados a Fé, cura e suporte |
| 90 | **Obra-Prima Sobrenatural** | equipamentos máximos do P1 |

##### Prestígio II — Forja da Guerra
O jogador aprende a reproduzir e reinterpretar técnicas encontradas em antigas fortificações, equipamentos militares, ruínas, Dungeons e registros históricos.

| Nível P2 | Técnica | Especialização |
|---:|---|---|
| 1 | **Forja de Campanha** | fabricação eficiente e equipamentos funcionais |
| 15 | **Reforço Militar** | defesa, resistência e equipamentos pesados |
| 30 | **Têmpera de Cinzas** | Fogo, calor e materiais vitrificados |
| 45 | **Construção de Juramento** | defesa, suporte e Fé |
| 60 | **Lâmina de Ferida** | dano físico, crítico e Sangramento |
| 75 | **Reconstrução Antiga** | receitas provenientes de equipamentos e projetos históricos |
| 90 | **Obra-Prima de Guerra** | equipamentos máximos do P2 |

A Forja também poderá funcionar como ferramenta narrativa: descobrir uma receita antiga pode revelar como determinada cultura construía seus equipamentos.

##### Prestígio III — Forja Lendária
O último Prestígio representa o máximo que um artesão consegue fabricar, mas **não permite criar Relíquias**.

| Nível P3 | Técnica | Identidade |
|---:|---|---|
| 1 | **Forja Ancestral** | entrada do P3 |
| 15 | **Obra Sagrada** | equipamentos ligados a tradições e materiais excepcionais |
| 30 | **Precisão Absoluta** | armas, ferramentas e equipamentos refinados |
| 45 | **Forja Magistral** | grandes armas e ferramentas de endgame |
| 60 | **Obra Híbrida Superior** | equipamentos capazes de explorar várias escalas de atributos |
| 75 | **Forja de Lenda** | receitas extremamente raras provenientes do mundo |
| 90 | **Obra-Prima Absoluta** | ápice craftável da skill |

Regra principal:

> **Mesmo o melhor item fabricado no Prestígio III continua sendo um equipamento normal e nunca uma Relíquia.**

##### Receitas de Forja
Receitas poderão ser obtidas por:

- progressão da skill;
- Dungeons;
- Bosses;
- NPCs;
- quests;
- exploração;
- segredos;
- eventos.

Chegar ao nível máximo não significa conhecer automaticamente todas as receitas. O personagem pode possuir capacidade técnica para fabricar um item sem ainda ter descoberto seu projeto.

##### Materiais, receita e raridade
O equipamento final combina:

```text
RECEITA
+ MATERIAL
+ RARIDADE PROCEDURAL
= EQUIPAMENTO FINAL
```

O material influencia a identidade base do item.

A mesma receita feita com materiais diferentes poderá favorecer propriedades diferentes.

Equipamentos normais produzidos pela Forja utilizam:

```text
Comum      → 1 atributo procedural
Incomum    → 2
Raro       → 3
Épico      → 4
Lendário   → 5
```

Duas peças fabricadas pela mesma receita podem possuir atributos procedurais diferentes.

##### Ferramentas de coleta
Forja é a fonte regular para fabricação de:

- picaretas;
- machados de corte;
- equipamentos de pesca;
- Kits de Herbologia.

Dungeons continuam sendo a única outra fonte definida para ferramentas melhores.

##### Minigame — Martelamento
A interação trabalha:

- ritmo;
- posição;
- força do golpe.

Receitas diferentes poderão possuir padrões diferentes de martelamento.

O minigame não faz a fabricação normal falhar.

---

### Culinária

##### Conceito
Culinária transforma recursos renováveis e ingredientes em consumíveis, criando demanda contínua para Pesca, Herbologia e outros sistemas.

Tipos de consumível:

| Tipo | Papel |
|---|---|
| **Refeição** | buffs de duração maior |
| **Bebida** | recuperação ou buffs complementares |
| **Poção** | efeito imediato ou de curta duração |
| **Elixir** | efeito forte e especializado |
| **Antídoto** | remove ou oferece resistência contra status |
| **Preparado especial** | receitas incomuns ligadas a Dungeons, Bosses, eventos ou lore |

Regra central:

> **Culinária transforma os recursos acumulados pelo jogador em preparação para aquilo que ele pretende enfrentar.**

##### Buffs
Efeitos da mesma família não acumulam entre si.

Se dois consumíveis concederem o mesmo tipo de bônus, apenas o efeito válido mais forte permanece.

Combinações entre famílias diferentes poderão existir.

Quantidade máxima de efeitos simultâneos e regras exatas de substituição serão **A definir** durante o balanceamento.

##### Normal — Domínio do Preparo
| Nível | Marco | Desbloqueio principal |
|---:|---|---|
| 1 | **Preparo Básico** | refeições simples e bebidas básicas |
| 10 | **Conservação** | alimentos secos, conservados e preparados duráveis |
| 20 | **Infusão** | chás, tônicos e preparados herbais simples |
| 30 | **Cozimento Composto** | receitas com vários ingredientes |
| 45 | **Extração** | poções, antídotos e concentrados melhores |
| 60 | **Refeição Completa** | buffs especializados e receitas avançadas |
| 75 | **Elixires** | efeitos mais fortes e específicos |
| 90 | **Grande Preparo** | melhores receitas da progressão normal |

##### Prestígio I — Preparos Sobrenaturais
| Nível P1 | Técnica | Identidade |
|---:|---|---|
| 1 | **Preparo Sobrenatural** | entrada do P1 |
| 15 | **Infusão Superior** | extração eficiente de propriedades sobrenaturais |
| 30 | **Concentração Arcana** | Mana, Arcano e efeitos mágicos |
| 45 | **Neutralização** | Veneno, Sangramento e antídotos avançados |
| 60 | **Preparo Híbrido** | combinações de ingredientes de várias skills |
| 75 | **Elixir Espiritual** | Fé, cura e suporte |
| 90 | **Grande Preparo Sobrenatural** | receitas máximas do P1 |

Um ingrediente perigoso poderá participar justamente de uma receita destinada a neutralizar seu efeito, desde que isso esteja explicitamente definido na receita.

##### Prestígio II — Culinária de Campanha
As técnicas refletem alimentos e preparados desenvolvidos para sobrevivência, marcha, recuperação e guerra.

| Nível P2 | Técnica | Identidade |
|---:|---|---|
| 1 | **Ração de Campanha** | alimentos eficientes e duráveis |
| 15 | **Conservação Extrema** | refeições de longa duração |
| 30 | **Tônico de Marcha** | Stamina, recuperação e velocidade |
| 45 | **Medicina de Campo** | poções e antídotos voltados ao combate |
| 60 | **Refeição de Companhia** | efeitos especialmente úteis em party |
| 75 | **Preparo de Cerco** | receitas fortes usando ingredientes difíceis |
| 90 | **Banquete de Guerra** | receitas máximas do P2 |

Receitas poderão contar história cotidiana, incluindo técnicas usadas por soldados, comunidades humanas ou monstruosas e povos que sobreviveram ao conflito.

##### Prestígio III — Banquetes de Lenda
O P3 combina técnicas e ingredientes de diferentes culturas e eras.

| Nível P3 | Técnica | Identidade |
|---:|---|---|
| 1 | **Preparo Ancestral** | entrada do P3 |
| 15 | **Mesa dos Povos** | receitas que combinam tradições culturais diferentes |
| 30 | **Essência Perfeita** | alta concentração de propriedades específicas |
| 45 | **Preparo Condicional** | efeitos especializados para situações específicas |
| 60 | **Grande Banquete** | buffs voltados à party |
| 75 | **Receita Perdida** | técnicas raríssimas descobertas no mundo |
| 90 | **Banquete de Lenda** | ápice da Culinária |

**Mesa dos Povos** reforça a ideia de que diferentes culturas do mundo tiveram contato e trocaram conhecimento ao longo da história.

##### Receitas
Receitas poderão vir de:

- progressão;
- NPCs;
- quests;
- Dungeons;
- Bosses;
- exploração;
- documentos históricos;
- parceiros;
- eventos.

Chegar ao P3 99 não significa conhecer automaticamente todas as receitas.

##### Consumíveis não possuem raridade procedural
Consumíveis feitos pela mesma receita possuem efeitos fixos e podem ser empilhados normalmente.

Não existirão versões como uma mesma poção Comum, Rara ou Épica com efeitos procedurais diferentes.

A eficiência de Culinária será buscada por elementos como:

- quantidade produzida;
- velocidade;
- chance de unidade adicional do mesmo consumível;
- XP;
- acesso a receitas melhores.

Regra principal:

> **A mesma receita de consumível gera o mesmo item; o que muda é a eficiência da produção.**

##### Efeitos permanentes
Consumíveis não concedem aumento permanente de atributo.

Podem oferecer efeitos temporários fortes, mas progressão permanente continua pertencendo aos sistemas próprios do personagem.

##### Minigame — Sequência e Timing
O minigame trabalha:

- ordem das etapas;
- timing;
- controle do preparo.

Uma receita poderá exigir pequenas sequências como:

```text
cortar
↓
misturar
↓
aquecer
↓
adicionar ingrediente
↓
retirar
```

O minigame não cria uma versão exclusiva do consumível e não gera materiais secundários aleatórios.

Culinária não utiliza ferramenta equipável própria.

A localização diegética exata onde o jogador realiza Culinária permanece **A definir** e não exige a criação de uma nova estrutura inicial na Cidade Livre.

---

### Crafting, receitas e equipamentos

##### Crafting Idle
Metalurgia, Forja e Culinária fazem parte da progressão Idle.

O jogador poderá iniciar produções em quantidade e deixá-las sendo processadas ao longo do tempo.

##### Receitas combinadas
Receitas avançadas poderão exigir múltiplas skills e materiais de diferentes camadas de progressão.

Exemplo conceitual:

```text
Lâmina Arcana

Requisitos:
Forja 75
Metalurgia 70
Herbologia 40

Materiais:
Liga especial
Componente de madeira
Ingrediente específico
Material de Dungeon ou Boss, quando a receita exigir
```

##### Materiais e identidade
Materiais de diferentes níveis não são tratados apenas como substitutos numericamente superiores.

O item final de equipamento utiliza três camadas:

```text
RECEITA
+ MATERIAL
+ RARIDADE PROCEDURAL
= EQUIPAMENTO FINAL
```

Consumíveis são exceção à raridade procedural e seguem as regras próprias de Culinária.

##### Relíquias e Crafting
Relíquias nunca poderão ser fabricadas.

Nem Prestígio, receita secreta ou materiais especiais permitem criar uma Relíquia.

##### Upgrade de equipamentos
O upgrade +1 poderá utilizar materiais obtidos por:

- atividades explícitas;
- produção;
- drops de inimigos;
- Dungeons.

O upgrade +2 deverá exigir pelo menos um material especial obtido em conteúdos como:

- Dungeons;
- Bosses;
- eventos especiais.

O material obrigatório do +2 não poderá ser substituído por um antigo conceito de drop secundário Idle, pois esse sistema não existe mais.

##### Desmontagem
Desmontar equipamentos concede apenas dinheiro.

Não é utilizado como fonte de materiais de crafting.

---

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

##### Estrutura da Árvore de Prestígio
A Árvore de Prestígio possui **32 nós** no total:

- **6 nós de Corpo**;
- **6 nós de Arcano**;
- **6 nós de Espírito**;
- **6 nós de Técnica**;
- **8 nós híbridos**.

Os quatro ramos principais possuem a mesma estrutura de custo:

```text
Nó 1 → 1 ponto
Nó 2 → 1 ponto
Nó 3 → 2 pontos
Nó 4 → 2 pontos
Nó 5 → 2 pontos
Nó 6 → 2 pontos
```

Completar um ramo principal custa:

> **10 Pontos de Prestígio.**

Completar dois ramos custaria 20 pontos e, portanto, é impossível com o limite de 15.

Um especialista completo pode gastar 10 pontos em seu ramo principal e ainda possuir 5 pontos para complementar a build.

Regra principal:

> **A Árvore de Prestígio deve recompensar especialização e experimentação sem criar uma nova classe permanente.**

##### Estrutura dos híbridos
Existem quatro combinações híbridas iniciais:

1. Corpo + Arcano;
2. Corpo + Espírito;
3. Técnica + Arcano;
4. Técnica + Espírito.

Cada combinação possui dois nós:

- **Híbrido I:** custa 1 ponto;
- **Híbrido II:** custa 2 pontos e funciona como o capstone daquele caminho híbrido.

O Híbrido I exige pelo menos:

> **3 nós comprados em cada um dos dois ramos relacionados.**

Os três primeiros nós de um ramo custam 4 pontos. Portanto:

```text
3 nós do ramo A = 4
3 nós do ramo B = 4
Híbrido I       = 1
Total            = 9
```

O Híbrido II exige:

- Híbrido I;
- pelo menos 4 nós do primeiro ramo;
- pelo menos 4 nós do segundo ramo.

Os quatro primeiros nós de um ramo custam 6 pontos. Portanto, o híbrido completo custa exatamente:

```text
4 nós do ramo A = 6
4 nós do ramo B = 6
Híbrido I       = 1
Híbrido II      = 2
Total            = 15
```

Assim, uma build híbrida completa utiliza todo o orçamento disponível e abre mão dos capstones puros dos dois ramos.

##### Regra de balanceamento da árvore
A árvore seguirá estes princípios:

> **Capstones puros devem representar a melhor expressão daquela especialização.**

> **Híbridos completos devem ser competitivos quando utilizam corretamente os dois lados da combinação.**

> **Um híbrido que ignora metade de sua mecânica deve ser inferior ao especialista correspondente.**

> **Nenhuma combinação deve ser obrigatória para alcançar o melhor desempenho geral do jogo.**

Como referência conceitual de balanceamento, um especialista bem utilizado funciona como referência de 100% de eficiência no próprio papel. Um híbrido bem utilizado deverá ser competitivo em torno dessa referência e poderá superá-la levemente em situações ideais para sua sinergia, sem se tornar superior em todos os contextos.

Percentuais finais, durações, limites internos e fórmulas permanecem **A definir** durante o balanceamento.

---

### Ramo Corpo

Identidade:

> **Vida + Stamina + combate físico + sobrevivência sob pressão.**

##### 1. Constituição — 1 ponto
Aumenta a **Vida máxima**.

O valor exato será definido durante o balanceamento.

##### 2. Fôlego de Guerra — 1 ponto
Melhora:

- Stamina máxima;
- recuperação de Stamina.

##### 3. Ímpeto — 2 pontos
Utilizar uma **habilidade Física Agressiva** concede temporariamente eficiência física.

O bônus poderá afetar elementos como dano físico, Stamina ou ritmo da próxima ação física, com valores e forma final **A definir**.

##### 4. Inabalável — 2 pontos
Ao sofrer um golpe que represente uma parcela relevante da Vida máxima, o personagem recebe temporariamente redução de dano recebido.

Pequenos golpes repetidos não deverão ativar o efeito como se fossem ataques pesados.

##### 5. Segundo Fôlego — 2 pontos
Uma vez por combate, quando o personagem entra em uma condição crítica de Vida, recupera:

- parte da Vida;
- parte da Stamina.

Não é uma ressurreição.

A interação com um golpe que mate diretamente o personagem será definida no balanceamento.

##### 6. Último Bastião — 2 pontos
**Capstone de Corpo.**

Conforme a Vida diminui, o personagem recebe progressivamente:

- resistência;
- recuperação de Stamina.

O efeito utilizará faixas e limites para não incentivar o jogador a permanecer propositalmente com Vida extremamente baixa durante todo o combate.

---

### Ramo Arcano

Identidade:

> **Mana + Magias + rotação + manipulação eficiente de poder mágico.**

##### 1. Reserva Mental — 1 ponto
Aumenta a **Mana máxima**.

##### 2. Fluxo Arcano — 1 ponto
Melhora a **regeneração de Mana**.

##### 3. Canalização — 2 pontos
Utilizar Magias diferentes em sequência concede eficiência temporária à próxima Magia.

Repetir continuamente a mesma Magia não aproveita completamente essa mecânica.

##### 4. Ressonância — 2 pontos
Magias diferentes utilizadas em sequência acumulam **Ressonância** até um limite.

A Ressonância melhora temporariamente a eficiência mágica.

Repetições excessivas da mesma Magia ou interrupções prolongadas poderão interromper ou reduzir a sequência.

##### 5. Reserva Arcana — 2 pontos
Uma vez por combate, quando a Mana entra em condição crítica, o personagem obtém uma recuperação ou janela temporária de eficiência excepcional.

A forma final entre recuperação direta, redução temporária de custos ou efeito equivalente permanece **A definir**.

##### 6. Sobrecarga — 2 pontos
**Capstone de Arcano.**

Ao atingir Ressonância máxima, uma Magia poderá consumir essa preparação para tornar-se **Sobrecarregada**.

Uma Magia Sobrecarregada recebe um efeito fortalecido em troca de consumir a Ressonância e, quando apropriado, possuir custo adicional de Mana.

O comportamento deverá funcionar naturalmente com o combate automático.

Fluxo conceitual:

```text
rotacionar Magias
↓
acumular Ressonância
↓
Sobrecarregar
↓
consumir a preparação
↓
reconstruir Ressonância
```

---

### Ramo Espírito

Identidade:

> **Fé + cura + suporte + resistência + proteção da party.**

##### 1. Convicção — 1 ponto
Aumenta **Fé**.

##### 2. Graça Restauradora — 1 ponto
Melhora a eficiência das **curas realizadas**.

##### 3. Resistência Espiritual — 2 pontos
Melhora a resistência ao acúmulo de:

- Veneno;
- Sangramento;
- Atordoamento;
- Queimadura;
- Congelamento.

Não concede imunidade automática.

##### 4. Intercessão — 2 pontos
Parte de uma cura que ultrapassaria a Vida máxima do alvo pode ser convertida em uma **proteção temporária**, respeitando um limite.

##### 5. Vínculo de Companhia — 2 pontos
Determinados efeitos defensivos ou de suporte aplicados pelo personagem podem beneficiar parcialmente outros membros da party.

O efeito compartilhado será menor que o efeito principal.

##### 6. Comunhão — 2 pontos
**Capstone de Espírito.**

Cura ou proteção excedente pode ser parcialmente redirecionada para o membro da party que mais necessita naquele momento.

No conteúdo Solo, o nó terá funcionamento equivalente voltado ao próprio personagem, para não se tornar inútil sem parceiros.

---

### Ramo Técnica

Identidade:

> **Precisão + crítico + velocidade + execução eficiente de sequências.**

##### 1. Mão Firme — 1 ponto
Melhora **Precisão**.

##### 2. Golpe Preciso — 1 ponto
Melhora **chance de crítico**.

##### 3. Ritmo de Combate — 2 pontos
Utilizar habilidades ativas diferentes em sequência gera **Ritmo**.

Repetir continuamente a mesma habilidade não aumenta Ritmo com a mesma eficiência.

##### 4. Oportunismo — 2 pontos
Acertos críticos ajudam a acelerar ou preservar o Ritmo de Combate.

O efeito terá limites para evitar ciclos infinitos de crítico e aceleração.

##### 5. Execução — 2 pontos
Contra inimigos em condição de Vida baixa, críticos recebem um efeito adicional.

O efeito poderá envolver dano ou melhoria do ritmo da próxima ação; sua forma exata permanece **A definir**.

##### 6. Mestre do Ritmo — 2 pontos
**Capstone de Técnica.**

Ao atingir Ritmo máximo, a próxima habilidade ativa recebe uma melhoria especial e o Ritmo é consumido.

Fluxo conceitual:

```text
sequência de habilidades
↓
críticos e Ritmo
↓
Ritmo máximo
↓
habilidade fortalecida
↓
recomeça a construção
```

---

### Híbridos — Corpo + Arcano

##### Arma Encantada — 1 ponto
Requer:

- 3 nós de Corpo;
- 3 nós de Arcano.

Utilizar uma habilidade **Física Agressiva** fortalece temporariamente a próxima Magia.

A mecânica exige que o jogador realmente utilize os dois estilos para aproveitar o investimento híbrido.

##### Guerreiro Arcano — 2 pontos
Requer:

- Arma Encantada;
- 4 nós de Corpo;
- 4 nós de Arcano.

A interação passa a funcionar nos dois sentidos:

```text
Física
→ fortalece a próxima Magia

Magia
→ fortalece a próxima ação Física
```

Alternar corretamente entre os estilos cria um ciclo próprio de combate.

**Guerreiro Arcano** é o nome do caminho da árvore, não uma nova classe.

---

### Híbridos — Corpo + Espírito

##### Zelo — 1 ponto
Requer:

- 3 nós de Corpo;
- 3 nós de Espírito.

Utilizar uma habilidade Defensiva ligada a Fé ou suporte fortalece temporariamente a próxima ação Física apropriada.

##### Bastião Sagrado — 2 pontos
Requer:

- Zelo;
- 4 nós de Corpo;
- 4 nós de Espírito.

Ações físicas podem gerar uma reserva limitada de **Guarda**.

O próximo Milagre ou efeito defensivo apropriado pode consumir essa Guarda para fortalecer proteção ou cura.

Fluxo conceitual:

```text
combate físico
↓
gera Guarda
↓
Milagre / defesa consome Guarda
↓
efeito fortalecido
↓
retorna ao combate
```

**Bastião Sagrado** representa um caminho de build, não uma nova classe.

---

### Híbridos — Técnica + Arcano

##### Lâmina Arcana — 1 ponto
Requer:

- 3 nós de Técnica;
- 3 nós de Arcano.

Um crítico físico pode fortalecer a próxima Magia utilizada.

##### Conjuração Rápida — 2 pontos
Requer:

- Lâmina Arcana;
- 4 nós de Técnica;
- 4 nós de Arcano.

Uma Magia fortalecida pela interação de Lâmina Arcana cria uma janela temporária que favorece a próxima ação física precisa.

Fluxo conceitual:

```text
crítico físico
↓
Magia fortalecida
↓
janela física
↓
nova ação precisa
```

Limites internos impedirão ciclos infinitos.

Esse caminho tende conceitualmente a enfatizar mais velocidade e precisão do que Corpo + Arcano.

---

### Híbridos — Técnica + Espírito

##### Golpe de Convicção — 1 ponto
Requer:

- 3 nós de Técnica;
- 3 nós de Espírito.

Um crítico pode aumentar temporariamente a eficiência do próximo Milagre.

##### Inquisidor — 2 pontos
Requer:

- Golpe de Convicção;
- 4 nós de Técnica;
- 4 nós de Espírito.

Utilizar um Milagre apropriado fortalece temporariamente a próxima ação física precisa.

O fortalecimento poderá possuir interação com **dano Sagrado** quando fizer sentido para a habilidade ou equipamento utilizado.

Fluxo conceitual:

```text
crítico
↓
Milagre fortalecido
↓
ação física fortalecida
↓
nova oportunidade de crítico
```

**Inquisidor** é o nome do caminho híbrido, não uma nova classe.

##### Combinações não utilizadas inicialmente
**Corpo + Técnica** e **Arcano + Espírito** não recebem caminhos híbridos exclusivos na estrutura inicial.

Motivos:

- Corpo e Técnica já podem combinar naturalmente através de atributos, armas e habilidades físicas;
- Arcano e Espírito já compartilham Mana e podem coexistir naturalmente em builds de Inteligência/Fé;
- adicionar todos os pares possíveis aumentaria a árvore sem garantir uma identidade mecânica distinta para cada combinação.

Novos híbridos poderão ser adicionados futuramente se surgir uma razão mecânica forte e não redundante.

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
O início seguirá conceitualmente:

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
Primeira atividade escolhida pelo jogador
↓
Primeira melhoria de equipamento / crafting introdutório
↓
Primeiro combate simples
↓
Primeiro contrato importante
↓
Primeira Dungeon
```

##### Criação do personagem
O jogador escolhe:

- aparência;
- nome;
- classe;
- presente.

Na interface de classe, deverão ser apresentadas principalmente:

- identidade da classe;
- atributos inicialmente destacados;
- equipamento inicial;
- habilidade inicial.

A interface deverá deixar claro desde o começo:

> **A classe define apenas o início. Todas as formas de combate poderão ser aprendidas posteriormente.**

##### Primeira apresentação da Cidade Livre
A chegada deverá ser curta e predominantemente visual, sem grande exposição de lore.

O jogador poderá observar elementos como:

- humanos;
- monstros presentes sob as regras de neutralidade;
- guardas;
- comércio;
- tensão entre indivíduos diferentes.

O objetivo é apresentar que existe um conflito e que a Cidade Livre possui uma situação particular, sem explicar toda a política do mundo imediatamente.

##### Primeira conversa na Taverna
O primeiro diálogo obrigatório será curto.

Um NPC poderá perguntar por que o personagem chegou à cidade.

Respostas poderão permitir caracterização sem definir uma origem canônica rígida, por exemplo:

- procurar trabalho;
- procurar dinheiro;
- fugir do passado;
- apenas sobreviver.

Essas respostas não precisam determinar uma biografia oficial do protagonista.

##### Primeira atividade Idle
O jogador não será obrigado a começar pela Mineração.

Ele poderá escolher qual das quatro skills de coleta experimentar primeiro:

1. Mineração;
2. Lenhador;
3. Pesca;
4. Herbologia.

O tutorial inicial ensina somente o fluxo essencial:

```text
escolher recurso
↓
iniciar atividade
↓
aguardar tempo da ação
↓
receber recurso escolhido + XP
↓
atividade continua automaticamente
```

A primeira experiência deve reforçar a regra de que a atividade entrega o recurso escolhido, sem pools aleatórios secundários.

##### Primeiro crafting e melhoria de equipamento
Depois da introdução às atividades, o jogador será levado a obter ou produzir uma pequena melhoria de equipamento.

Metalurgia, Forja e Culinária não precisam ser ensinadas todas ao mesmo tempo.

Cada sistema de produção terá uma explicação curta quando o jogador o utilizar pela primeira vez.

##### Primeiro combate
Antes da primeira Dungeon, o jogador realiza um combate simples.

Esse encontro apresenta apenas o necessário para compreender:

- ataque automático;
- Vida;
- Mana;
- Stamina;
- habilidade ativa;
- consumíveis;
- estilos Agressivo, Defensivo e Misto.

O jogo poderá sugerir inicialmente um estilo de combate compatível com a classe escolhida, sem bloquear a alteração imediata pelo jogador.

Exemplos de sugestão:

- Guerreiro → Agressivo;
- Acólito → Defensivo;
- Errante → Misto.

A sugestão nunca funciona como restrição de classe.

##### Primeiro contrato importante
Após a introdução básica, o jogador recebe o primeiro trabalho relevante ligado à **Ordem de Ferro**.

O contrato leva à antiga fortificação militar que funciona como primeira Dungeon.

A missão é apresentada inicialmente como um trabalho direto de eliminação de monstros, recuperação de um objeto e obtenção de pagamento.

##### Tutorial contextual
O tutorial seguirá uma regra de **desbloqueio contextual**.

Um sistema avançado só deve ser explicado quando se tornar relevante para o jogador.

Exemplos:

- primeira utilização de Metalurgia → tutorial curto de Metalurgia;
- primeira utilização de Forja → tutorial curto de Forja;
- primeira utilização de Culinária → tutorial curto de Culinária;
- primeira oportunidade de minigame → tutorial do minigame;
- primeira skill apta a prestigiar → tutorial de Prestígio;
- primeiro parceiro recrutado → tutorial de party;
- primeira Relíquia → tutorial de Relicário e, quando aplicável, mercado.

Regra de UX:

> **O jogador aprende jogando; nenhum sistema avançado é explicado antes de se tornar relevante.**

##### Primeiro parceiro
O jogador começa sozinho.

O primeiro parceiro é introduzido posteriormente e não faz parte da sobrecarga inicial de sistemas do tutorial.

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

##### Identidade geográfica e cultural
O mundo terá uma identidade de **Dark Fantasy atlântico**, inspirada cultural e geograficamente na transição entre tradições **célticas e nórdicas**, especialmente referências que remetem à Irlanda e à Islândia.

O cenário será inteiramente fictício e não representará literalmente esses países ou sua história real.

A inspiração permite combinar de forma coerente elementos como:

- florestas antigas;
- penhascos e costas severas;
- mares frios e violentos;
- ilhas;
- montanhas;
- áreas vulcânicas;
- ruínas antigas;
- fortalezas costeiras.

As diferentes tradições culturais do mundo já tiveram contato entre si antes da guerra atual. Comércio, migrações, conflitos e civilizações antigas poderão ter deixado camadas linguísticas e arquitetônicas diferentes nos mesmos territórios.

A Cidade Livre funciona como um ponto importante de encontro entre essas influências culturais, reforçando seu papel de território neutro, comércio e convivência entre povos diferentes.

A diferença entre tradições linguísticas também poderá servir como pista narrativa. Um nome de origem cultural diferente pode indicar outra época, outro povo ou outra camada histórica do mundo.

Humanos e monstros não representam diretamente povos históricos reais. As referências célticas e nórdicas servem como inspiração estética, linguística e cultural para sociedades próprias do universo do jogo.

Regra principal:

> **O mundo possui uma identidade atlântica sombria, inspirada culturalmente na transição entre tradições célticas e nórdicas, sem representar literalmente Irlanda ou Islândia.**

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

##### Identidade visual atlântica
A direção visual do mundo deverá combinar a atmosfera Dark Fantasy com referências do Atlântico Norte e das tradições célticas e nórdicas.

Elementos recorrentes poderão incluir:

- florestas antigas e úmidas;
- penhascos;
- costas rochosas;
- mares frios e violentos;
- ilhas;
- montanhas;
- paisagens vulcânicas;
- fortalezas e ruínas costeiras;
- construções e objetos que revelem diferentes camadas culturais do passado.

A combinação dessas referências deve produzir uma identidade própria do universo, e não uma reprodução histórica direta de Irlanda, Islândia ou qualquer outro país real.

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

> Todas as classes iniciais usam o mesmo orçamento total de atributos; a referência atual é 35 pontos distribuídos entre os sete atributos, com distribuições individuais sujeitas a balanceamento.

> Classe inicial altera apenas distribuição inicial, equipamento inicial e habilidade inicial; não cria exclusividades permanentes de build.

> Guerreiro começa orientado a físico e sobrevivência; Mago a Mana e Magias; Caçador a combate à distância; Acólito a Fé e suporte; Ladino a crítico e velocidade; Errante a equilíbrio e habilidade Universal.

> Existem sete opções de presente inicial: Chave Enferrujada, Bolsa de Moedas, Frasco Carmesim, Anel do Viajante, Pedra Sem Nome, Kit de Sobrevivência e Nenhum Presente.

> O Anel do Viajante aumenta Vida, Mana e Stamina máximas enquanto equipado e deve ser naturalmente substituível pela progressão.

> Presentes iniciais não podem criar vantagem permanente dominante nem conteúdo essencial exclusivo.

> O antigo endgame de uma skill se torna o novo início após o Prestígio.

> As sete skills principais estão definidas: Mineração, Lenhador, Pesca, Herbologia, Metalurgia, Forja e Culinária.

> Atividades Idle não geram drops secundários aleatórios; entregam somente o recurso ou produto escolhido, XP e possíveis unidades adicionais do mesmo resultado.

> Materiais especiais e raros devem possuir fontes explícitas de obtenção, como atividades próprias, receitas, Dungeons, Bosses, eventos, exploração, quests ou conteúdos de Prestígio.

> Nas atividades de coleta, a base normal é 1 unidade garantida do recurso escolhido por ciclo, sujeita a modificadores de quantidade do mesmo recurso.

> Ferramentas de coleta são separadas do equipamento de combate, possuem raridade procedural, upgrades +0/+1/+2 e são obtidas somente por Forja ou Dungeons.

> As ferramentas de coleta definidas são picareta, machado de corte, equipamento de pesca e Kit de Herbologia.

> Ferramentas não possuem atributos relacionados a drops secundários; seus bônus se concentram em velocidade, quantidade, unidades adicionais do mesmo recurso e XP.

> Cada skill possui um minigame temático periódico e opcional; o Idle gera a oportunidade e a interação ativa melhora temporariamente a eficiência da atividade escolhida.

> Os minigames não introduzem pools próprios de materiais aleatórios.

> A evolução mecânica das skills é: Normal com 1 atividade; Prestígio I com 2 atividades simultâneas; Prestígio II com 2 atividades e controle avançado de prioridade; Prestígio III com 3 atividades simultâneas.

> Prestígio deve mudar a forma de executar uma skill, e não apenas aumentar números.

> Materiais antigos continuam relevantes em receitas avançadas; desbloqueio mais alto não significa superioridade absoluta.

> Recursos importantes do mundo podem utilizar nomes inspirados em tradições célticas ou nórdicas quando houver coerência cultural, enquanto termos funcionais da interface permanecem em português.

> A origem linguística de nomes pode funcionar como pista cultural e histórica.

> A Mineração evolui de Natureza para Sobrenatural, Guerra e Divindades.

> Lenhador evolui de Floresta Natural para Floresta Sobrenatural, Eras Antigas e Árvores Sagradas.

> Pesca evolui de Águas Naturais para Águas Sobrenaturais, Mar de Guerra e Lendas das Águas.

> Herbologia evolui de Flora Natural para Flora Sobrenatural, Flora do Norte — Fogo e Gelo, e Oráculos e Destino.

> Herbologia é a primeira skill cuja progressão demonstra fortemente a passagem da vertente linguística céltica para a nórdica/islandesa.

> Metalurgia evolui de Beneficiamento e Ligas Naturais para Metalurgia Sobrenatural, Metalurgia da Guerra e Metalurgia Mítica.

> Mineração descobre materiais; Metalurgia descobre como processá-los e combiná-los.

> Formas processadas mantêm o nome-base quando continuam sendo o mesmo material; novos nomes são usados quando o processo cria um material realmente novo.

> Metalurgia não possui subprodutos aleatórios nem ferramenta equipável própria.

> Forja evolui de Domínio dos Ofícios para Forja Sobrenatural, Forja da Guerra e Forja Lendária.

> Metalurgia cria os materiais; Forja transforma esses materiais em possibilidades de build.

> Mesmo o melhor equipamento fabricado no Prestígio III nunca é uma Relíquia.

> Equipamentos fabricados continuam utilizando raridade e atributos procedurais.

> Culinária evolui de Domínio do Preparo para Preparos Sobrenaturais, Culinária de Campanha e Banquetes de Lenda.

> Culinária produz refeições, bebidas, poções, elixires, antídotos e preparados especiais.

> Consumíveis da mesma receita possuem efeito fixo, são empilháveis e não utilizam raridade procedural.

> Consumíveis não concedem aumentos permanentes de atributo.

> Culinária não possui ferramenta equipável própria; sua localização diegética permanece A definir sem exigir uma nova estrutura inicial na cidade.

> O mundo possui identidade atlântica sombria inspirada na transição entre tradições célticas e nórdicas, sem representar literalmente Irlanda ou Islândia.

> Nomes ligados à guerra, divindades, lendas ou destino são associações culturais e não confirmam automaticamente a origem dos materiais nem a verdade objetiva dos mitos.

> O Prestígio do personagem concede 5 pontos permanentes, até um máximo de 15.

> A Árvore de Prestígio possui 32 nós: 24 em Corpo, Arcano, Espírito e Técnica e 8 híbridos.

> Cada ramo principal possui seis nós e custa 10 pontos para ser completado.

> Um híbrido completo exige quatro nós em cada um de dois ramos, mais seus dois nós híbridos, consumindo exatamente os 15 Pontos de Prestígio disponíveis.

> Especialistas mantêm acesso aos capstones puros; híbridos completos abrem mão dos dois capstones em troca de uma sinergia exclusiva entre os ramos.

> Os quatro caminhos híbridos iniciais são Corpo + Arcano, Corpo + Espírito, Técnica + Arcano e Técnica + Espírito.

> Caminhos híbridos são configurações da árvore e não novas classes.

> Capstones puros devem representar a melhor expressão da especialização; híbridos devem ser competitivos quando sua sinergia é realmente utilizada, sem se tornarem obrigatoriamente superiores.

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

> O tutorial será curto, contextual e integrado ao fluxo normal do jogo.

> A primeira atividade Idle é escolhida pelo jogador entre Mineração, Lenhador, Pesca e Herbologia.

> O jogador aprende sistemas avançados apenas quando eles se tornam relevantes: nenhum sistema avançado deve ser explicado antecipadamente sem necessidade.

> Antes da primeira Dungeon, o jogador experimenta uma atividade, uma pequena melhoria de equipamento e um combate simples.

> A primeira Dungeon apresenta uma comunidade de monstros tentando sobreviver em uma fortificação abandonada.

> A primeira escolha entre matar ou poupar um monstro não possui resposta moral indicada pelo jogo.

> O primeiro Boss aparenta ser apenas uma ameaça, mas posteriormente pode ser compreendido como protetor daquela comunidade.

> Um fragmento de antigo tratado será uma das primeiras evidências de que humanos e monstros já tentaram negociar.
