# Build de Validação 0.1 — Plano de Testes

## Papel deste arquivo

Este documento organiza o primeiro recorte jogável real do projeto para implementação, teste e balanceamento.

A Build 0.1 **não é um protótipo descartável**. Ela deve ser construída sobre a estrutura real do jogo e servir de base para as próximas builds.

> **Cada build incrementa a anterior. Sistemas permanecem; conteúdo e valores podem evoluir.**

O GDD continua sendo a fonte principal das regras de negócio. Quando um número deste arquivo estiver marcado como provisório, ele existe para validação e pode ser alterado sem representar uma decisão final de balanceamento.

---

## Objetivo da Build 0.1

Validar o loop integrado:

```text
Criação
↓
Classe + Presente
↓
Cidade Livre / Taverna
↓
primeira coleta escolhida
↓
produção / preparação / pequena melhoria
↓
primeiro combate
↓
primeiro contrato
↓
Dún Liath — Fácil
↓
Fairtheoir
↓
consequência
↓
retorno à Cidade Livre
```

Endpoint natural da campanha da Build 0.1:

> **primeira conclusão de Dún Liath na dificuldade Fácil.**

A build deve ser pequena em conteúdo, mas honesta com a estrutura final do jogo.

---

# Escopo funcional

## Entra normalmente na Build 0.1

- criação do personagem;
- seis classes iniciais;
- sete presentes iniciais;
- Cidade Livre e Taverna no fluxo inicial;
- inventário e armazenamento necessários ao loop;
- quatro escolhas iniciais de coleta;
- subconjunto inicial de Metalurgia, Forja e Culinária;
- equipamentos iniciais e primeiros equipamentos obtíveis;
- combate automático em tempo real;
- quatro slots de habilidade;
- estilos Agressivo, Defensivo e Misto;
- dois slots de consumíveis de combate;
- primeiro combate;
- primeiro contrato;
- Dún Liath na dificuldade Fácil;
- Crúbach;
- Tromghiallach;
- Cosantóir;
- Fairtheoir;
- Bolsa de Expedição;
- retirada pré-Boss;
- evento Matar/Poupar;
- fragmento do tratado;
- sala de recuperação;
- recompensa de primeiro clear: Guarda Instintiva;
- persistência mínima da consequência narrativa;
- retorno à Cidade Livre.

## Conteúdo reduzido

A Build 0.1 não precisa implementar toda a progressão 1–99.

Recursos iniciais de referência:

| Skill | Nível 1 | Nível 10 |
|---|---|---|
| Mineração | Cloch | Stán |
| Lenhador | Giúis | Beith |
| Pesca | Scadán | Breac |
| Herbologia | Neantóg | Seamair |

Metalurgia inicial deve incluir pelo menos:
- Cloch Tratada;
- Lingote de Stán.

Forja deve possuir poucas receitas suficientes para provar:

```text
receita → materiais → tempo → equipamento
```

Culinária deve possuir poucas receitas suficientes para provar:

```text
recurso → preparo → buff/recuperação → combate
```

## Não precisa estar na progressão natural da 0.1

- Prestígio de Skill;
- Prestígio do personagem;
- Dún Liath Normal/Difícil/Impossível;
- Arquivo Selado;
- Selo de Dún Liath;
- mercado de jogadores;
- Mira;
- Party;
- segunda Dungeon;
- progressão completa 1–99/P3;
- minigames completos.

Sistemas longos podem ser validados por ferramentas internas/aceleração quando necessário.

---

# Regra de convergência das quatro coletas

Não deve existir uma escolha inicial secretamente correta.

As quatro rotas precisam gerar uma preparação útil para o primeiro combate e convergir para a progressão principal.

```text
Mineração
→ Cloch
→ Metalurgia
→ reforço / equipamento
→ combate
```

```text
Lenhador
→ Giúis
→ componente / Forja
→ equipamento ou ferramenta
→ combate
```

```text
Pesca
→ Scadán
→ Culinária
→ refeição / preparação
→ combate
```

```text
Herbologia
→ Neantóg
→ Culinária
→ preparado / recuperação
→ combate
```

### Critério de teste

Todas as quatro escolhas devem permitir continuar o tutorial sem grind obrigatório desproporcional e sem exigir que o jogador abandone sua escolha para seguir uma rota considerada “correta”.

---

# Valores provisórios de atributos — Build 0.1

Estes valores são referência de teste, não balanceamento final.

## Recursos máximos

```text
Vida máxima    = 100 + (Vitalidade × 12)
Mana máxima    = 30  + (Mente × 10)
Stamina máxima = 60  + (Vigor × 8)
```

## Regeneração

```text
Mana por segundo    = 1,5 + (Mente × 0,35)
Stamina por segundo = 5 + (Vigor × 0,6)
```

Vida não possui regeneração natural significativa durante combate.

Fora de combate normal, recuperação pode ser rápida para evitar tempo morto.

Em Dungeon, Vida e demais recursos persistem entre encontros até recuperação por sistema apropriado.

---

# Scaling provisório

Ataques e habilidades podem usar:

```text
Poder Base
+ (Atributo × multiplicador de scaling)
```

Referência:

| Scaling | Multiplicador |
|---|---:|
| S | 1,00 |
| A | 0,85 |
| B | 0,70 |
| C | 0,50 |
| D | 0,30 |
| E | 0,15 |

---

# Defesa provisória

```text
Mitigação = Defesa / (Defesa + 100 + 5 × Nível do atacante)
```

Teto provisório de mitigação por Defesa:

> **75%**

```text
Dano recebido = Dano bruto × (1 - Mitigação)
```

---

# Resistências provisórias

## Dano

| Leitura | Dano recebido |
|---|---:|
| Fraco | 125% |
| Normal | 100% |
| Resistente | 80% |
| Muito Resistente | 60% |
| Imune | 0% |

## Buildup de status

| Leitura | Buildup recebido |
|---|---:|
| Fraco | 125% |
| Normal | 100% |
| Resistente | 75% |
| Muito Resistente | 50% |
| Imune | 0% |

---

# Precisão, crítico e velocidade provisórios

## Precisão

```text
Precisão = 100 + (Destreza × 2) + bônus
```

Chance de acerto de referência:

```text
90% + (Precisão - Evasão) × 0,25%
```

Limites provisórios:

```text
mínimo: 70%
máximo: 99%
```

## Crítico

```text
Chance de crítico = 5% + (Destreza × 0,25%) + bônus
```

Multiplicador-base:

> **150% do dano normal.**

## Velocidade

Referência inicial:

```text
Bônus de velocidade de ataque = Destreza × 0,4%
```

Cap provisório:

> **25%**

Destreza não reduz globalmente cooldowns.

### Ponto obrigatório de observação

Destreza concentra scaling apropriado, Precisão, crítico e velocidade. A Build 0.1 deve verificar se isso a torna um atributo universalmente obrigatório.

---

# Responsabilidade dos atributos

| Atributo | Papel principal |
|---|---|
| Vitalidade | Vida |
| Mente | Mana máxima e regeneração |
| Vigor | Stamina máxima e regeneração |
| Força | scaling físico apropriado e requisitos |
| Destreza | scaling apropriado, precisão, crítico e velocidade |
| Inteligência | Magias e Arcano |
| Fé | Milagres, cura e Sagrado |

Mente e Vigor não aumentam dano diretamente na referência inicial.

---

# Kits iniciais provisórios

As cópias de equipamentos recebidas na criação são fixas e não utilizam RNG procedural. Equipamentos equivalentes obtidos posteriormente podem seguir o sistema procedural normal.

Slots não fornecidos pelo kit começam vazios, salvo presente equipado aplicável.

## Guerreiro

**Espada de Milícia**
- Corte;
- Poder Base 14;
- intervalo 2,1 s;
- Força B;
- Destreza C;
- requisito Força 5 / Destreza 3.

**Escudo de Milícia**
- Defesa 8.

**Peitoral de Milícia**
- Defesa 18.

Defesa inicial de referência: **26**.

**Golpe de Força — Física Agressiva**
- 155% do dano da arma;
- 28 Stamina;
- cooldown 6 s.

## Mago

**Cajado Simples**
- ataque básico Arcano;
- Poder Base 9;
- intervalo 2,4 s;
- Inteligência C;
- requisito Inteligência 6.

**Vestes Simples**
- Defesa 6.

**Pulso Arcano — Magia Agressiva**
- Poder Base 18;
- Inteligência A;
- Arcano;
- 24 Mana;
- cooldown 5 s.

## Caçador

**Arco Curto**
- Perfuração;
- Poder Base 12;
- intervalo 2,3 s;
- Força D;
- Destreza A;
- requisito Destreza 7.

**Gibão de Caça**
- Defesa 10.

**Disparo Preciso — Física Agressiva**
- 150% do dano da arma;
- +15 pontos percentuais de chance de acerto nessa ação;
- 24 Stamina;
- cooldown 6 s.

## Acólito

**Maça Simples**
- Impacto;
- Poder Base 14;
- intervalo 2,3 s;
- Força C;
- Destreza D;
- requisito Força 3.

**Catalisador Simples**
- requisito Fé 7;
- necessário para Milagres apropriados.

**Vestes do Acólito**
- Defesa 8.

**Prece Restauradora — Milagre Defensivo**
- cura-base 24;
- Fé S;
- 36 Mana;
- cooldown 10 s.

## Ladino

**Adaga de Caça**
- Perfuração;
- Poder Base 7;
- intervalo 1,45 s;
- Força D;
- Destreza B;
- requisito Destreza 8.

**Traje Leve**
- Defesa 9.

**Golpe Oportuno — Física Agressiva**
- 125% do dano da arma;
- +25 pontos percentuais de crítico nessa ação;
- 20 Stamina;
- cooldown 5 s.

## Errante

**Lança de Viagem**
- Perfuração;
- Poder Base 13;
- intervalo 2,1 s;
- Força B;
- Destreza C;
- requisito Força 4 / Destreza 4.

**Proteção de Viagem**
- Defesa 12.

**Abertura — Universal Agressiva**
- funciona independentemente da categoria da arma;
- 135% do dano-base da ação apropriada;
- +10 pontos percentuais de Precisão;
- sem custo de Mana ou Stamina;
- cooldown 7 s.

## Regra das habilidades iniciais

As habilidades iniciais não são permanentemente exclusivas das classes e poderão ser aprendidas posteriormente por outros personagens que cumpram seus requisitos.

---

# Combate automático — resolução de ações

## Regra central aprovada

> **Uma habilidade ativa substitui o ataque básico que seria realizado naquela ação.**

Habilidades não são dano adicional paralelo ao ataque básico.

## Relógio de ação

Cada combatente possui seu próprio intervalo de ação derivado principalmente da arma/ataque.

Quando fica pronto para agir, o sistema decide uma única ação. Depois da ação, o intervalo é reiniciado.

Cooldowns de habilidades são relógios separados e continuam transcorrendo durante outras ações.

## Ordem do personagem

```text
1. Consumível automático válido
2. Habilidade válida conforme estilo, condição e ordem dos slots
3. Ataque básico
```

A primeira opção válida é executada.

Uma habilidade só entra em cooldown quando realmente é usada.

## Quatro slots de habilidade

A ordem visual representa prioridade real:

```text
Slot 1 → Slot 2 → Slot 3 → Slot 4 → Ataque básico
```

O sistema verifica cooldown, recurso, requisitos, condição e perfil/estilo antes de usar o slot.

## Estilos

**Agressivo**
- prioriza habilidades Agressivas;
- Defensivas entram quando suas condições apropriadas são atendidas.

**Defensivo**
- prioriza habilidades Defensivas quando válidas;
- depois considera Agressivas.

**Misto**
- Agressivas e Defensivas competem de forma mais direta conforme ordem dos slots e condições.

Valores e refinamento da priorização poderão ser ajustados após teste.

---

# Condições defensivas configuráveis

Habilidades defensivas podem possuir limiar percentual configurável pelo jogador.

Exemplos:
- Vida ≤ 60%;
- Mana ≤ 30%;
- Stamina ≤ 25%;
- futuramente, aliado com Vida ≤ X%.

A condição é verificada quando chega o momento de ação.

A Build 0.1 não exige editor lógico complexo com AND/OR ou scripting.

---

# Consumíveis em combate

## Slots

Referência da Build 0.1:

> **2 slots de consumíveis.**

Cada slot pode possuir condição automática simples, por exemplo:
- Vida ≤ X%;
- Mana ≤ X%;
- Stamina ≤ X%.

Prioridade:

```text
Consumível 1 → Consumível 2
```

## Consumo de ação

Uso automático ou manual de consumível ocupa a ação atual.

> **Jogar ativamente concede controle, não ações extras.**

O jogo executa o limiar escolhido pelo jogador e não deve contradizê-lo por uma IA oculta de “economia de consumível”.

## Cooldown global provisório

Após usar qualquer consumível:

> **8 segundos de cooldown global de consumíveis.**

Valor provisório para teste.

## Dungeon

Consumíveis de Dungeon vêm da preparação feita antes da expedição. Não existe acesso ao Banco durante a run.

---

# Telegraphs, preparação e interrupção

## Telegraph

Ataques normais resolvem na ação.

Habilidades perigosas podem iniciar um tempo de preparação antes do efeito.

Durante a preparação:
- o usuário da habilidade fica comprometido com aquela ação;
- não realiza ataques básicos ou outras habilidades;
- os outros combatentes continuam agindo normalmente.

Ao resolver, o intervalo normal do usuário reinicia.

A UI deve mostrar pelo menos:
- nome;
- ícone;
- barra regressiva;
- alvo quando aplicável;
- destaque visual simples;
- registro no log.

## Interrupção

Não existe botão universal de interrupção.

Interrupções vêm de Atordoamento ou habilidades/efeitos que explicitamente possam interromper.

Uma habilidade telegráfica pode ser:
- Interrompível;
- Resistente;
- Ininterruptível.

Se uma habilidade for interrompida:
- seu efeito não ocorre;
- ela entra em cooldown normalmente.

Morte durante a preparação cancela a ação, salvo futura exceção explícita.

## Cooldown inicial

Habilidades começam o combate disponíveis, salvo regra individual contrária.

Uma habilidade pode possuir **Atraso Inicial** para controlar quando pode ser escolhida pela primeira vez sem alterar seu cooldown normal.

---

# Ordem determinística

Se uma ação já começou, ela resolve antes de uma nova ação que fique disponível exatamente no mesmo instante, salvo interrupção válida.

Se duas novas ações ficam disponíveis no mesmo timestamp, referência atual:

```text
1. personagem principal
2. parceiros pela posição futura
3. inimigos
```

Na Build 0.1 Solo, a regra relevante é personagem antes do inimigo em empate exato.

---

# Fases de Boss

Ao cruzar o limiar de uma nova fase, uma ação que já começou pode terminar normalmente.

A mudança de fase ocorre depois da resolução da ação atual.

Para Fairtheoir:
- Fase 1: O Vigia;
- Fase 2: Desespero;
- limiar numérico ainda A definir.

Última Investida deve possuir telegraph longo, dano alto de Impacto, buildup alto de Atordoamento e janela posterior de vulnerabilidade.

---

# Arquitetura comportamental de inimigos

Inimigos usam a mesma fundação temporal e de resolução do combate, mas **não precisam imitar os quatro slots configuráveis do jogador**.

Cada inimigo pode possuir sua própria lista de comportamentos, condições, cooldowns, fases e atrasos iniciais.

> **O motor fornece regras universais; a identidade do inimigo surge da combinação dessas regras.**

---

# Cenários mínimos de teste

## Criação

- criar personagem com cada uma das seis classes;
- confirmar orçamento de 35 atributos;
- confirmar recursos máximos derivados;
- confirmar kit fixo correto;
- confirmar slots restantes vazios;
- confirmar que habilidade inicial não é marcada como exclusiva permanente.

## Coleta e produção

Para cada uma das quatro escolhas iniciais:
- iniciar atividade;
- receber exatamente o recurso escolhido + XP;
- confirmar ausência de drop secundário aleatório;
- produzir/preparar algo útil;
- chegar ao primeiro combate sem trocar obrigatoriamente para outra coleta.

## Combate básico

Com cada classe:
- confirmar intervalo de arma;
- confirmar ataque básico automático;
- confirmar que habilidade substitui o ataque básico;
- confirmar consumo e regeneração de Mana/Stamina;
- confirmar cooldown separado do relógio de ação;
- confirmar Precisão, crítico, Defesa e resistência;
- confirmar comportamento quando recurso é insuficiente.

## Automação

- testar quatro slots em ordens diferentes;
- testar Agressivo;
- testar Defensivo;
- testar Misto;
- testar habilidade defensiva em diferentes limiares;
- garantir que condição falsa faz o sistema seguir para o próximo slot.

## Consumíveis

- testar dois slots;
- testar uso automático;
- testar uso manual;
- confirmar que ambos consomem ação;
- confirmar cooldown global de 8 s;
- confirmar execução exata do limiar configurado;
- confirmar ausência de acesso ao Banco durante Dungeon.

## Telegraph e interrupção

- iniciar habilidade telegráfica inimiga;
- confirmar que jogador continua agindo durante preparação;
- interromper habilidade permitida com Atordoamento;
- confirmar cancelamento do efeito;
- confirmar entrada em cooldown;
- testar habilidade resistente;
- testar habilidade ininterruptível quando existir;
- matar atacante durante preparação e confirmar cancelamento.

## Dún Liath

- concluir primeira run controlada;
- validar bifurcação irreversível;
- validar Bolsa de Expedição;
- validar Cosantóir e primeiro grande telegraph;
- validar Matar/Poupar sem recompensa moral explícita;
- encontrar fragmento do tratado;
- usar recuperação;
- testar retirada pré-Boss;
- lutar contra Fairtheoir;
- validar transição de fase;
- validar Última Investida;
- receber Fragmento de Fairtheoir;
- receber Guarda Instintiva no primeiro clear Fácil;
- retornar à Cidade Livre;
- confirmar pelo menos uma consequência persistente da escolha narrativa.

---

# Métricas e perguntas obrigatórias

Registrar durante testes:
- duração do tutorial;
- duração até primeiro combate;
- duração até Dún Liath;
- duração da primeira run;
- duração de cada encontro;
- dano recebido por classe;
- consumo de Mana/Stamina;
- quantidade e uso de consumíveis;
- mortes por classe;
- taxa de acerto;
- frequência de crítico;
- frequência de habilidades;
- frequência de ataques básicos substituídos;
- tempo médio sob telegraph;
- interrupções tentadas e bem-sucedidas;
- valor percebido de crafting vs loot;
- impacto de cada uma das quatro coletas iniciais.

Perguntas qualitativas:
- as seis classes parecem diferentes sem existir uma claramente superior?
- Mente/Vigor criam decisão de sustentabilidade?
- Destreza está valendo demais?
- habilidades parecem escolhas ou dano gratuito?
- consumíveis têm peso sem dominar o combate?
- o jogador entende por que uma ação foi escolhida automaticamente?
- Fairtheoir é legível antes de ser difícil?
- Dún Liath conecta sistemas sem parecer uma sequência de tutoriais?
- Matar/Poupar mantém impacto sem virar escolha de recompensa?

---

# Critério de sucesso da Build 0.1

A Build 0.1 não precisa estar balanceada de forma final.

Ela é considerada estruturalmente bem-sucedida quando:

1. qualquer classe consegue percorrer o fluxo principal;
2. qualquer coleta inicial escolhida gera progresso útil;
3. crafting, equipamento, combate e consumíveis se conectam;
4. automação é previsível e explicável;
5. Dún Liath funciona do início ao fim;
6. Fairtheoir utiliza as mesmas regras fundamentais do motor de combate;
7. escolha narrativa gera estado persistente;
8. dados coletados permitem corrigir valores sem substituir os sistemas centrais;
9. a próxima build pode ser construída por incremento, não por recomeço.

> **Construir de verdade, mas somente o suficiente para provar que os sistemas encaixam.**
