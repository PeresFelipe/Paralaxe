# Teste com jogadores UX — Alta fidelidade v0.2

Este roteiro valida `paralaxe-fluxo-alta-fidelidade-v0.2.html` durante o **M5.5 — Fundamentos de UX**.

O objetivo é observar compreensão, orientação, confiança, risco e modelo mental. Não é uma votação estética.

## Preparação

- abrir `paralaxe-fluxo-alta-fidelidade-v0.2.html` em navegador;
- começar em **Mineração**;
- não explicar previamente onde cada função está;
- usar o seletor `PROTÓTIPO` apenas para posicionar o participante em uma tela quando o cenário exigir;
- não tratar o seletor como parte da interface do jogo;
- para celular, repetir em área visível estreito ou dispositivo real.

## Regra de observação

Quando houver hesitação, registrar antes de ajudar.

Perguntas de preferência ficam para o final.

> **Problema observado ≠ solução sugerida pelo jogador.**

---

## 1 — Orientação e continuidade Ocioso

Perguntar:

> O que seu personagem está fazendo agora?

Depois:

> Vá até Personagem. O que você espera que aconteça com essa atividade?

Esperado: identificar `Mineração · Cloch`, atividade em andamento e expectativa de continuidade em contexto seguro.

---

## 2 — Trocar Cloch por Stán

Pedir:

> Comece a minerar Stán.

Antes da confirmação:

> O que vai acontecer com Cloch?

Esperado: selecionar Stán, perceber a substituição e confirmar conscientemente. Depois, o indicador global deve refletir `Mineração · Stán`.

---

## 3 — Descobrir uso de Cloch

Reposicionar em Mineração/Cloch se necessário.

Pedir:

> Descubra algo útil que você pode fazer com Cloch além de guardá-la.

Esperado: encontrar `Usos conhecidos` e/ou o atalho para Metalurgia sem adivinhar a relação.

---

## 4 — Iniciar Produção

Em Metalurgia:

> Comece a produzir Cloch Tratada.

Antes da ação:

> O que acontecerá com a atividade atual?

Esperado: compreender a substituição antes de clicar. Depois, o indicador global deve virar `Metalurgia · Cloch Tratada`.

---

## 5 — Técnicas e prioridade

Pedir:

> Descubra quais Técnicas seu personagem usa em combate.

Depois:

> Qual Técnica será considerada primeiro pela automação?

Esperado: Personagem → Técnicas; `Golpe Calculado` no espaço 1 é reconhecido como primeira prioridade real.

---

## 6 — Cidade, Taverna e Brann

Pedir:

> Brann tem algo novo para falar. Onde você procuraria por ele?

Depois:

> Onde você encontraria novamente o contrato de Dún Liath depois de já tê-lo aceitado?

Esperado: Cidade → Taverna → Brann; contrato recuperável por Aventura/Jornada.

---

## 7 — Jornada sem abandonar contexto

Em qualquer tela segura:

> Você esqueceu por que estava se preparando para Dún Liath. Descubra sem abandonar a tela em que está.

Esperado: abrir Jornada como painel/sheet e reconstruir contexto.

Observar se Jornada parece destino principal, lista de verificação obrigatório ou camada de continuidade.

---

## 8 — Preparação e fronteira de risco

Ir para Aventura → `Preparar expedição`.

Perguntar:

> O que está incompleto?

> O que acontecerá com sua atividade automática se você entrar?

> Você ainda poderia desistir e ir para outra área sem entrar na Masmorra?

Esperado: identificar espaços vazios como fatos; entender que Ocioso **ainda continua**; entender que só pausa ao confirmar; perceber navegação global reduzida mas disponível; reconhecer saques futuro em risco.

---

## 9 — Combate explicável

Usar o seletor de protótipo para abrir Combate ou entrar via Masmorra → Investigar.

Perguntar:

> O que está prestes a acontecer?

> Por que Recuo não foi usado?

Esperado: `Talho`, impacto em `0,8 s`, Sangramento conhecido e `condição não atendida`. O participante deve conseguir abrir a explicação de Recuo.

Falha grave: ameaça percebida somente por cor/movimento ou automação interpretada como bug inexplicável.

---

## 10 — Masmorra e Bolsa de Expedição

Na sala `Quartel Velho` perguntar:

> Onde você está?

> O que possui agora que ainda pode perder?

> Para onde pode seguir?

Esperado: identificar sala, Bolsa, `7 itens em risco`, rotas parcialmente conhecidas e ausência da navegação segura normal.

---

## 11 — Retorno sem conexão

Abrir `Retorno ausente` pelo seletor de protótipo.

Perguntar:

> O que aconteceu enquanto você esteve fora?

Esperado: reconstruir ausência, Mineração/Cloch, recurso obtido, XP, nível e Stán desbloqueado.

Observar especialmente se parece reconciliação de estado ou recompensa diária de login. O objetivo é a primeira interpretação.

---

## 12 — Celular

Executar novamente os cenários 1, 2, 7, 8, 9 e 10 em área visível estreito.

Esperado:

- Personagem / Atividades / Aventura / Cidade continuam reconhecíveis em Safe;
- Vida, Mana e Fôlego continuam visíveis;
- moeda pode perder prioridade antes dos recursos vitais;
- Jornada e Inventário rápido continuam acessíveis;
- Preparação mantém navegação reduzida e Ocioso ativo;
- Combate/Dungeon recolhem navegação;
- aviso de ataque continua acima da dobra ou em posição de leitura prioritária;
- nenhuma ação essencial depende de hover;
- não existe leitura horizontal obrigatória.

---

# Registro por cenário

```text
PARTICIPANTE
identificador anônimo

CENÁRIO
1–12

RESULTADO
sem ajuda / parcial / não concluiu

HESITAÇÃO
onde parou, voltou ou procurou repetidamente?

EXPECTATIVA
o que achou que aconteceria antes da ação?

INTERPRETAÇÃO FINAL
como descreveu o estado depois?

ERRO DE MODELO MENTAL
nenhum / descrição

EVIDÊNCIA
comportamento ou frase curta

SEVERIDADE
baixa / média / alta / bloqueadora
```

## Severidade

**Bloqueadora:** impede fluxo ou cria interpretação oposta a uma regra central.

**Alta:** usuário conclui com risco significativo de erro de estado, perda ou estratégia baseada em informação incorreta.

**Média:** hesitação/retrabalho perceptível, mas recuperável.

**Baixa:** polimento, preferência ou pequena demora sem erro conceitual.

## Critério antes da Fase 3

Não iniciar a migração completa dos workbenches se houver problema bloqueador nos seguintes temas:

- Safe × Risk;
- continuidade/pausa do Ocioso;
- substituição de atividade;
- Jornada;
- prioridade de Técnicas;
- explicabilidade do combate;
- Bolsa de Expedição;
- navegação celular principal.

A saída do teste com jogadores deve ser uma lista de **problemas observados**, priorizada por severidade e causa provável. Soluções entram somente depois dessa síntese.
