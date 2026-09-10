from pathlib import Path

GDD = Path('docs/GDD.md')
UX = Path('docs/UX-GDD.md')

# Canonical GDD: keep the business/design rule concise and implementation-agnostic.
gdd = GDD.read_text()
gdd_anchor = "> **Atividades Idle não geram drops secundários aleatórios. Cada atividade entrega apenas seu recurso ou produto definido, além de XP e possíveis unidades adicionais desse mesmo resultado.**\n\nColeta:"
gdd_insert = "> **Atividades Idle não geram drops secundários aleatórios. Cada atividade entrega apenas seu recurso ou produto definido, além de XP e possíveis unidades adicionais desse mesmo resultado.**\n\n## Comunicação de progresso Idle\n\n> **Toda atividade Idle ativa deve comunicar progresso temporal de forma contínua e inequívoca. A interface mostra o avanço da ação atual, o resultado esperado da próxima conclusão e feedback quando o ciclo termina. Uma atividade que não avança deve explicar objetivamente o motivo.**\n\nO jogador deve conseguir perceber três escalas de progresso quando pertinentes:\n\n```text\nAGORA\nprogresso da ação atual e tempo até a próxima conclusão\n\nSESSÃO\nresultado acumulado desde o início da atividade ou recorte atual\n\nLONGO PRAZO\nnível e progresso da Skill\n```\n\nEm Coleta, a conclusão de um ciclo comunica o recurso e XP recebidos. Em Produção, a conclusão comunica de forma compreensível a transformação de materiais em produto e XP.\n\nQuando uma Produção não puder continuar por falta de materiais, requisito ou outra causa conhecida, o estado deve ser explicitamente comunicado; uma barra parada nunca deve ser a única indicação.\n\n> **O progresso da atividade atual permanece perceptível enquanto o jogador navega por outras áreas seguras.**\n\nColeta:"
if gdd_anchor not in gdd:
    raise SystemExit('GDD anchor not found')
gdd = gdd.replace(gdd_anchor, gdd_insert, 1)
GDD.write_text(gdd)

# Detailed UX spec: shell continuity.
ux = UX.read_text()
ux_anchor = "A atividade atual aparece como indicador pequeno e expansível. Jornada e Inventário abrem sem destruir o contexto corrente."
ux_insert = "A atividade atual aparece como indicador pequeno e expansível. Quando houver uma ação Idle em andamento, esse indicador também comunica de forma compacta o avanço do ciclo atual e o tempo até a próxima conclusão, para que o jogador perceba que a atividade continua viva enquanto navega por áreas seguras. Jornada e Inventário abrem sem destruir o contexto corrente.\n\nSe a atividade estiver pausada ou interrompida, o indicador não deve parecer simplesmente congelado: ele informa o estado e, quando conhecido, o motivo."
if ux_anchor not in ux:
    raise SystemExit('UX shell anchor not found')
ux = ux.replace(ux_anchor, ux_insert, 1)

# Detailed UX spec: Skill feedback grammar.
ux_anchor2 = "## Relações entre materiais e usos\n"
ux_insert2 = """## Feedback de ciclo Idle\n\nToda atividade de Coleta ou Produção ativa possui uma leitura temporal clara do ciclo em andamento.\n\nA gramática conceitual usa três escalas complementares:\n\n```text\nAGORA\nbarra/indicador da ação atual\ntempo restante\nresultado esperado na próxima conclusão\n\nSESSÃO\nrecursos/produtos obtidos\nXP obtido no recorte atual\n\nLONGO PRAZO\nnível da Skill\nprogresso para o próximo nível\n```\n\nA escala **Agora** é a mais importante para comunicar que o jogo não está parado. O indicador avança continuamente durante a ação e reinicia quando um novo ciclo começa.\n\nAo concluir um ciclo, a interface oferece microfeedback proporcional, por exemplo `+1 Cloch` e `+4 XP`, sem modal ou interrupção desnecessária.\n\nEm Produção, o feedback deve tornar legível a relação entre entrada e saída quando pertinente, por exemplo:\n\n```text\n5 Cloch → 1 Cloch Tratada\n```\n\nSe a produção parar, a interface substitui a ambiguidade por um estado explícito, como:\n\n```text\nPRODUÇÃO INTERROMPIDA\nCloch 3 / 5\nFaltam 2\n```\n\nAtalhos para a fonte conhecida do material podem ser oferecidos, mantendo a regra de navegar sem iniciar automaticamente outra atividade.\n\nMovimento pode reforçar visualmente que o ciclo está avançando, mas informação necessária nunca depende apenas da animação. Com redução de movimento, tempo, estado e progresso continuam legíveis por meios estáticos/numerais.\n\n## Relações entre materiais e usos\n"""
if ux_anchor2 not in ux:
    raise SystemExit('UX activities anchor not found')
ux = ux.replace(ux_anchor2, ux_insert2, 1)

# Detailed UX spec: risk-state transition feedback.
ux_anchor3 = "O jogo deve comunicar essa retomada sem exigir confirmação manual."
ux_insert3 = "O jogo deve comunicar essa retomada sem exigir confirmação manual. A leitura compacta do ciclo pode mudar explicitamente entre `ativa`, `pausada durante risco` e `retomada`, preservando a atividade escolhida e eliminando a impressão de travamento."
if ux_anchor3 not in ux:
    raise SystemExit('UX continuity anchor not found')
ux = ux.replace(ux_anchor3, ux_insert3, 1)
UX.write_text(ux)
