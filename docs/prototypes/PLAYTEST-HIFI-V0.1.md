# Playtest UX — Hi-Fi v0.1

Este roteiro valida os protótipos em `docs/prototypes` durante o **M5.5 — UX Foundation**.

O objetivo não é perguntar se a interface é bonita. O teste procura evidência de compreensão, orientação, confiança e modelo mental.

## Materiais

- `mining-hifi-v0.1.html` — referência visual focada em Atividades → Mineração;
- `greywake-hifi-flow-v0.1.html` — fluxo navegável de alta fidelidade.

Os arquivos são protótipos isolados, sem integração com o runtime real.

---

## Regra do teste

Não explicar previamente onde cada função está.

Quando o participante hesitar, registrar a hesitação antes de ajudar.

Perguntas como “você gostou?” podem ser feitas depois, mas não substituem observação do comportamento.

> **Problema observado ≠ solução sugerida pelo jogador.**

---

## Cenário 1 — Orientação inicial

### Situação

O participante chega à tela de Mineração com Cloch já sendo minerada.

### Tarefa

Perguntar:

> O que seu personagem está fazendo agora?

Depois:

> Se você sair desta tela para ver seu personagem, o que espera que aconteça com essa atividade?

### Evidência desejada

Sem ajuda, o participante identifica:

- Mineração;
- Cloch;
- atividade em andamento;
- continuidade em contexto seguro.

### Observar

- onde olha primeiro;
- se confunde progresso da Skill com progresso do ciclo;
- se percebe o indicador global inferior;
- se a mesma informação repetida parece redundante ou útil.

---

## Cenário 2 — Troca de recurso

### Tarefa

> Você quer parar de minerar Cloch e começar a minerar Stán. O que faria?

### Evidência desejada

O participante:

- identifica Stán como disponível;
- entende que é uma alternativa de atividade;
- espera que a atividade anterior seja substituída, não executada em paralelo.

### Observar

- se “NOVO” parece recompensa ou apenas disponibilidade nova;
- se bloqueios de Copar/Iarann são compreendidos sem depender só de cor;
- se procura um botão global de “parar” antes de trocar.

---

## Cenário 3 — Relação coleta → produção

### Tarefa

> Descubra algo que você pode fazer com Cloch além de guardá-la.

### Evidência desejada

O participante encontra a relação com Metalurgia através de “Usos conhecidos” e/ou navegação contextual.

### Falha importante

O participante precisa memorizar ou adivinhar onde Cloch é usada.

---

## Cenário 4 — Produção e custo de oportunidade

### Tarefa

Na Metalurgia:

> Comece a produzir Cloch Tratada.

Antes de confirmar, perguntar:

> O que acontecerá com a Mineração que estava ativa?

### Evidência desejada

A consequência de substituir a atividade Idle é compreendida antes da ação.

---

## Cenário 5 — Personagem e Técnicas

### Tarefa

> Onde você procuraria para entender quais Técnicas seu personagem usa em combate?

Depois:

> Qual delas será considerada primeiro pela automação?

### Evidência desejada

O participante associa Técnicas a Personagem e entende que a ordem visual representa prioridade real.

---

## Cenário 6 — Cidade e Taverna

### Tarefa

> Brann tem algo novo para falar. Onde você procuraria por ele?

Depois:

> Onde encontraria o contrato de Dún Liath depois de já tê-lo aceitado?

### Evidência desejada

O participante entende:

- Cidade → Taverna → Brann;
- contrato pode ser recuperado via Aventura/Jornada;
- Cidade não é necessária para acessar Atividades.

---

## Cenário 7 — Jornada

### Tarefa

Em qualquer tela segura:

> Você voltou ao jogo e esqueceu por que estava se preparando para Dún Liath. Como descobriria o que estava acontecendo sem abandonar sua tela atual?

### Evidência desejada

O participante encontra Jornada e entende que ela é uma camada de continuidade, não um quinto destino equivalente.

### Observar

- se Jornada compete visualmente com a navegação principal;
- se parece uma lista obrigatória de tarefas;
- se preserva sensação de contexto.

---

## Cenário 8 — Preparação

### Tarefa

> Você está prestes a entrar em Dún Liath. Diga o que está incompleto e o que acontecerá com sua atividade Idle se você entrar.

### Evidência desejada

O participante identifica:

- slots vazios como fatos, não avaliação de qualidade;
- Idle continua enquanto ainda está na Preparação;
- Idle pausa apenas ao confirmar entrada;
- loot encontrado ficará em risco.

### Teste crítico de navegação

Perguntar:

> Você ainda conseguiria desistir da preparação e ir para outra área agora?

A navegação global deve continuar reconhecível, embora visualmente reduzida.

---

## Cenário 9 — Combate explicável

### Tarefa

No combate contra Crúbach:

> O que está prestes a acontecer?

Depois:

> Por que Recuo não foi usado?

### Evidência desejada

O participante identifica:

- Talho;
- tempo até o impacto;
- efeito/tipo conhecido;
- Recuo como “condição não atendida”, não bug da automação.

### Falha crítica

A ameaça só é percebida pela cor ou pelo movimento.

---

## Cenário 10 — Dungeon e risco

### Tarefa

> Onde você está? O que encontrou nesta expedição que ainda pode perder? Para onde pode ir agora?

### Evidência desejada

O participante identifica:

- sala atual;
- Bolsa de Expedição;
- quantidade em risco;
- rotas conhecidas/parcialmente conhecidas;
- diferença entre contexto da Dungeon e navegação segura.

---

## Cenário 11 — Retorno offline

### Tarefa

Mostrar a tela de retorno e perguntar:

> O que aconteceu enquanto você esteve fora?

### Evidência desejada

O participante consegue reconstruir rapidamente:

- duração da ausência;
- atividade processada;
- recurso obtido;
- XP;
- nível ganho;
- desbloqueio relevante.

### Observar

Se a tela parece uma recompensa de login ou uma reconciliação de estado. O segundo é o objetivo.

---

## Cenário 12 — Mobile / largura reduzida

Executar pelo menos os cenários 1, 7, 8, 9 e 10 em viewport estreito.

### Evidência desejada

- os quatro destinos continuam reconhecíveis;
- nenhuma ação essencial depende de hover;
- telegraph continua em alta prioridade;
- Jornada continua acessível;
- Preparação preserva navegação reduzida;
- Combate/Dungeon recolhem navegação;
- nenhuma informação crítica exige leitura horizontal impossível.

---

# Registro por cenário

Para cada tarefa, registrar:

```text
RESULTADO
Concluiu sem ajuda? sim / parcial / não

TEMPO / HESITAÇÃO
Onde parou ou voltou?

INTERPRETAÇÃO
O que o participante achou que aconteceria?

ERRO DE MODELO MENTAL
Houve? Qual?

EVIDÊNCIA
Comportamento ou frase relevante.

SEVERIDADE
baixa / média / alta / bloqueadora
```

Não registrar imediatamente a solução de design como se fosse diagnóstico.

---

# Critérios para avançar

O protótipo não precisa ser perfeito para avançar, mas problemas bloqueadores devem ser corrigidos antes da Fase 3.

Sinais especialmente graves:

- não distinguir Safe de Risk;
- acreditar que Idle continua durante Dungeon;
- acreditar que abrir Preparação já pausa Idle;
- não encontrar atividade atual;
- não entender que iniciar outra atividade substitui a anterior;
- não encontrar Jornada depois de retorno;
- não perceber loot em risco;
- não entender ameaça/telegraph antes da resolução;
- tratar falha da automação como comportamento inexplicável;
- confundir Ferreiro com a Skill Forja;
- depender de cor, hover ou drag-and-drop para ação essencial.

---

# Saída do playtest

A saída deve ser uma lista priorizada de **problemas observados**, agrupados por causa provável:

```text
orientação
hierarquia
navegação
estado
compreensão
feedback
risco
responsividade
acessibilidade
```

Somente depois dessa síntese as soluções devem ser escolhidas e aplicadas ao protótipo.