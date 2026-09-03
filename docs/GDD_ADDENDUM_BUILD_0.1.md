# GDD — Adendo Oficial da Build de Validação 0.1

## Status

Este arquivo registra decisões de design aprovadas após a última consolidação de `docs/GDD.md`.

Ele **complementa o GDD oficial** e deve ser incorporado integralmente ao próximo passe seguro de consolidação do documento principal. Em caso de conflito sobre os tópicos abaixo, estas decisões mais recentes prevalecem para a Build de Validação 0.1.

Valores numéricos marcados como provisórios são referências de balanceamento da Build 0.1 e não valores finais do jogo.

---

# Filosofia incremental das builds

A Build de Validação 0.1 não é um protótipo descartável.

> **Cada build incrementa a anterior.**

A fundação implementada deve permanecer e ser ampliada nas builds seguintes. Sistemas centrais devem ser construídos de acordo com sua estrutura pretendida, mesmo quando a primeira build possuir pouco conteúdo.

Regra:

> **Pouco conteúdo, estrutura real.**

Sistemas como combate, inventário, crafting, skills, equipamentos, Dungeon e save não devem ser implementados como soluções temporárias destinadas a serem descartadas depois.

Valores, conteúdo, quantidades, tempos, XP, dano, loot e balanceamento podem mudar livremente entre builds.

Referência conceitual:

```text
Build 0.1 → núcleo real + conteúdo reduzido
Build 0.2 → correções + aprofundamento dos sistemas existentes
Build 0.3+ → expansão incremental de conteúdo e sistemas já planejados
```

---

# Escopo principal da Build 0.1

O endpoint natural da campanha jogável da Build 0.1 é:

> **primeira conclusão de Dún Liath na dificuldade Fácil.**

Fluxo principal:

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

A Build 0.1 pode usar conteúdo reduzido, mas os sistemas implementados devem representar a estrutura real do jogo.

## Progressão inicial das quatro coletas

A primeira atividade Idle continua sendo escolha livre entre:
- Mineração;
- Lenhador;
- Pesca;
- Herbologia.

Não deve existir uma escolha inicial secretamente correta.

Cada rota precisa produzir uma preparação útil para o primeiro combate e convergir para a progressão principal.

```text
Mineração → material → Metalurgia / Forja → equipamento → combate
```

```text
Lenhador → material → Forja → equipamento/ferramenta → combate
```

```text
Pesca → alimento → Culinária → preparação → combate
```

```text
Herbologia → preparado → Culinária → preparação → combate
```

Para a Build 0.1, referência mínima de conteúdo:

| Skill | Nível 1 | Nível 10 |
|---|---|---|
| Mineração | Cloch | Stán |
| Lenhador | Giúis | Beith |
| Pesca | Scadán | Breac |
| Herbologia | Neantóg | Seamair |

Metalurgia precisa inicialmente provar pelo menos Cloch Tratada e Lingote de Stán.

Forja e Culinária podem começar com poucas receitas, desde que comprovem seus ciclos reais.

---

# Valores de balanceamento provisórios — Build 0.1

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

Fora de combate normal, a recuperação pode ser rápida para evitar tempo morto.

Em Dungeon, recursos persistem entre encontros até serem recuperados por mecanismos apropriados.

## Scaling

Referência provisória:

| Scaling | Multiplicador |
|---|---:|
| S | 1,00 |
| A | 0,85 |
| B | 0,70 |
| C | 0,50 |
| D | 0,30 |
| E | 0,15 |

Fórmula conceitual:

```text
Dano bruto = Poder Base + soma(Atributo × scaling correspondente)
```

## Defesa

```text
Mitigação = Defesa / (Defesa + 100 + 5 × Nível do atacante)
```

Teto provisório de mitigação por Defesa:

> **75%**

```text
Dano recebido = Dano bruto × (1 - Mitigação)
```

## Resistências de dano

| Leitura | Dano recebido |
|---|---:|
| Fraco | 125% |
| Normal | 100% |
| Resistente | 80% |
| Muito Resistente | 60% |
| Imune | 0% |

## Resistências de buildup

| Leitura | Buildup recebido |
|---|---:|
| Fraco | 125% |
| Normal | 100% |
| Resistente | 75% |
| Muito Resistente | 50% |
| Imune | 0% |

## Precisão

```text
Precisão = 100 + (Destreza × 2) + bônus
```

Referência de chance de acerto:

```text
90% + (Precisão - Evasão) × 0,25%
```

Limites provisórios:

```text
mínimo 70%
máximo 99%
```

## Crítico

```text
Chance de crítico = 5% + (Destreza × 0,25%) + bônus
```

Multiplicador-base:

> **150% do dano normal.**

## Velocidade

Referência provisória:

```text
Bônus de velocidade de ataque = Destreza × 0,4%
```

Cap provisório:

> **25%**

Destreza não reduz globalmente cooldowns.

A Build 0.1 deve observar explicitamente se Destreza concentra funções demais e se torna obrigatória em builds que não deveriam depender dela.

## Responsabilidade dos atributos

- Vitalidade → Vida;
- Mente → Mana máxima e regeneração;
- Vigor → Stamina máxima e regeneração;
- Força → scaling físico apropriado e requisitos;
- Destreza → scaling apropriado, Precisão, crítico e velocidade;
- Inteligência → Magias e Arcano;
- Fé → Milagres, cura e Sagrado.

Mente e Vigor não aumentam dano diretamente na referência inicial.

---

# Kits iniciais provisórios da Build 0.1

Equipamentos concedidos diretamente pela criação possuem atributos fixos e não usam RNG procedural.

Modelos equivalentes obtidos posteriormente podem utilizar o sistema procedural normal.

Slots não fornecidos pelo kit começam vazios, salvo presente aplicável. Isso garante valor imediato aos primeiros crafts e drops.

As habilidades iniciais não são permanentemente exclusivas das classes e poderão ser aprendidas posteriormente por outros personagens que cumpram os requisitos apropriados.

## Guerreiro

**Espada de Milícia**
- Corte;
- Poder Base 14;
- intervalo 2,1 s;
- Força B;
- Destreza C;
- requisito Força 5 / Destreza 3.

**Escudo de Milícia** — Defesa 8.

**Peitoral de Milícia** — Defesa 18.

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

**Vestes Simples** — Defesa 6.

**Pulso Arcano — Magia Agressiva**
- Poder Base 18;
- Inteligência A;
- dano Arcano;
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

**Gibão de Caça** — Defesa 10.

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

**Vestes do Acólito** — Defesa 8.

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

**Traje Leve** — Defesa 9.

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

**Proteção de Viagem** — Defesa 12.

**Abertura — Universal Agressiva**
- funciona independentemente da categoria da arma;
- 135% do dano-base da ação apropriada;
- +10 pontos percentuais de Precisão;
- não consome Mana nem Stamina;
- cooldown 7 s.

---

# Resolução do combate automático

## Regra central

> **Uma habilidade ativa substitui o ataque básico que seria realizado naquela ação.**

Habilidades não acontecem como dano adicional paralelo ao ataque básico.

Cada combatente possui um relógio próprio de ação derivado principalmente do intervalo de sua arma/ataque.

Cooldowns são relógios separados e continuam transcorrendo durante outras ações.

Quando o personagem fica pronto para agir:

```text
Consumível automático válido
↓
primeira habilidade válida conforme estilo, condição e ordem dos slots
↓
ataque básico se nada anterior for usado
```

Depois da ação, o intervalo normal é reiniciado.

Uma habilidade só entra em cooldown quando realmente é utilizada.

## Ordem dos quatro slots

A ordem visual é a prioridade real:

```text
Slot 1 → Slot 2 → Slot 3 → Slot 4 → Ataque básico
```

Antes do uso, verificar:
- cooldown;
- Mana/Stamina;
- requisitos de arma/catalisador;
- condição;
- compatibilidade com estilo/perfil.

## Estilos

**Agressivo:** prioriza habilidades Agressivas; Defensivas entram quando condições apropriadas forem atendidas.

**Defensivo:** prioriza Defensivas válidas; depois considera Agressivas.

**Misto:** permite que Agressivas e Defensivas disputem a ação mais diretamente conforme ordem dos slots e condições.

O refinamento exato da priorização pode ser ajustado pela Build 0.1 sem alterar a regra central.

---

# Condições configuráveis de habilidades defensivas

Habilidades Defensivas podem possuir limiar percentual configurável pelo jogador.

Exemplos:
- Vida ≤ X%;
- Mana ≤ X%;
- Stamina ≤ X%;
- futuramente aliado com Vida ≤ X%.

A condição é verificada no momento em que chega a ação.

Se for falsa, o sistema segue para o próximo slot.

A Build 0.1 não possui editor lógico complexo com AND/OR ou scripting.

---

# Consumíveis em combate

Referência da Build 0.1:

> **2 slots de consumíveis.**

Cada slot pode possuir uma condição automática simples, como Vida, Mana ou Stamina abaixo de determinado percentual.

Prioridade interna:

```text
Consumível 1 → Consumível 2
```

Uso manual ou automático de consumível ocupa a ação atual.

> **Jogar ativamente concede controle, não ações extras.**

O jogo deve respeitar exatamente o limiar configurado pelo jogador, sem uma IA oculta decidir arbitrariamente poupar o item.

Cooldown global provisório após qualquer consumível:

> **8 segundos.**

Dentro de Dungeon, consumíveis vêm da preparação feita antes da expedição. Não existe acesso ao Banco durante a run.

---

# Telegraphs e preparação

Ataques normais resolvem em sua ação.

Habilidades especiais podem possuir tempo de preparação.

Durante esse período:
- o usuário fica comprometido com a ação;
- não realiza ataques básicos ou outras habilidades;
- outros combatentes continuam agindo normalmente.

Quando a habilidade resolve, o intervalo normal do usuário reinicia.

A UI deve comunicar:
- nome da habilidade;
- ícone;
- barra regressiva;
- alvo quando aplicável;
- destaque visual;
- registro no log.

O telegraph não pausa o combate.

---

# Interrupções

Não existe botão universal de interrupção.

Interrupção ocorre por Atordoamento ou por efeitos/habilidades que explicitamente a permitam.

Cada habilidade telegráfica pode ser:
- Interrompível;
- Resistente;
- Ininterruptível.

Ao ser interrompida:
- a habilidade não resolve seu efeito;
- entra em cooldown normalmente.

Morte durante a preparação cancela a ação, salvo futura exceção explícita.

Habilidades começam o combate disponíveis por padrão, mas podem possuir **Atraso Inicial** individual para impedir uso imediato quando isso melhorar o design do encontro.

---

# Ordem determinística de ações

Uma ação já iniciada resolve antes de uma nova ação que fique disponível no mesmo instante, salvo interrupção válida.

Quando duas ações novas ficam prontas exatamente no mesmo timestamp, referência:

```text
1. personagem principal
2. parceiros pela posição
3. inimigos
```

Na Build 0.1 Solo, o personagem principal vence empate exato contra o inimigo.

---

# Fases de Boss

Cruzar o limiar de fase não cancela automaticamente uma ação já iniciada.

A mudança ocorre após a resolução da ação corrente.

Para Fairtheoir:
- Fase 1 — O Vigia;
- Fase 2 — Desespero;
- limiar exato permanece A definir.

**Última Investida** deve possuir:
- telegraph longo;
- alto dano de Impacto;
- buildup alto de Atordoamento;
- janela posterior clara de vulnerabilidade.

---

# Comportamento dos inimigos

Inimigos e Bosses usam a mesma fundação temporal e de resolução do combate, mas não precisam imitar os quatro slots configuráveis do jogador.

Cada inimigo possui sua própria lista de comportamentos, condições, cooldowns, fases e atrasos iniciais.

Regra:

> **O motor fornece regras universais; a identidade do inimigo surge da combinação dessas regras.**

Isso vale para Crúbach, Tromghiallach, Cosantóir, Fairtheoir e conteúdos futuros.

---

# Próxima etapa de balanceamento

Com as regras acima fechadas, o próximo bloco necessário é atribuir fichas numéricas provisórias para:
- Crúbach;
- Tromghiallach;
- Cosantóir;
- Fairtheoir.

Essas fichas devem permitir simular encontros completos por classe e medir tempo para matar, dano recebido, sustentabilidade, frequência de habilidades, status, telegraphs e consumíveis.
