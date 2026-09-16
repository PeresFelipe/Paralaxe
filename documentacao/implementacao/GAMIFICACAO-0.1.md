# Versão 0.1 — primeiro pacote de gamificação

Data: 15/09/2026. Aplicação autorizada após o plano de gamificação.

## Experiência entregue

- Uma meta de fabricação por personagem, escolhida, trocada ou dispensada na Jornada.
- As quatro receitas iniciais de fabricação podem ser acompanhadas. Reforço exige um alvo concreto e continua na tela de equipamento.
- Faixa de objetivo disponível nos quatro destinos seguros, com acesso à Jornada em telas pequenas.
- Materiais disponíveis e faltantes calculados a partir do Inventário; materiais no Banco são informados separadamente.
- Atalhos para consultar coleta e produção. Escolher uma meta ou usar os atalhos não inicia nem substitui trabalho.
- Comparação dos totais reais de combate ao equipar a peça fabricada +0, incluindo o efeito do item atualmente equipado e seus reforços/afixos. Perdas e diferenças nulas são exibidas.
- Primeira fabricação registrada por receita com resposta visual discreto. Conclusão de meta fica preservada mesmo após usar, vender ou guardar o resultado.
- Resumo sem conexão explica quando a coleta avançou a meta, reuniu os materiais ou concluiu a fabricação. Os ganhos são salvos antes de Continuar.
- Jornada reconhece o contrato concluído de Dún Liath. Brann distingue contrato pendente, conclusão e a decisão persistida sobre o Protetor. Retirada ou derrota não são anunciadas como conclusão.

## Persistência e regras

Esquema 10 adiciona `jornada.meta` e `jornada.idsDasReceitasFabricadas`. Migrações anteriores iniciam esses campos vazios, preservando personagem, inventário, Banco, Prestígio e Masmorra. O estoque de um partida antigo não é usado para inventar um histórico de fabricação.

A conclusão é registrada pelo processamento de fabricação somente depois de um ciclo bem-sucedido, com o mesmo caminho para atividade ativa e sem conexão. O histórico não concede moeda, XP ou itens adicionais. A data de conclusão registra o momento do processamento; um lote sem conexão pode ter horário de registro diferente de ciclos de processamento presenciais, mantendo produção, XP e estado de conclusão equivalentes.

Ciclos de processamento e ações de meta, coleta, produção, equipamento, atributos e Banco são enfileirados a partir do partida mais recente, para preservar metas e materiais durante escritas assíncronas. A atividade continua sendo única; o comportamento de pausa em risco permanece.

## Validação

- `pnpm verificar`: análise estática e tipos aprovados; **89 testes** (50 domínio, 35 conteúdo, 4 persistência).
- `pnpm compilar`: compilação de produção e geração de PWA aprovadas.
- Testes de conteúdo cobrem coleta → fabricação com catálogo real, consumo/depósito de materiais, igualdade dos ganhos ativos/offline, capacidade bloqueada, repetição sem duplicar o primeiro feito, comparação negativa e estados narrativos.
- Teste de IndexedDB verifica migração real de v9, ausência de histórico inventado e reabertura de meta concluída.
- Fluxos da versão exercitados em DOM simulado e IndexedDB: seleção, atalhos, coleta, produção, equipamento, recarga, retorno sem conexão e conversa de Brann. Os fluxos anteriores de navegação, Banco e inventário também passaram.
- Revisão gráfica em navegador real permanece pendente, pois a prévia local foi bloqueada neste ambiente. A validação de DOM não mede disposição, pintura nem diversão.

## Próxima avaliação de produto

Observar o primeiro ciclo com jogadores antes de acrescentar receitas ou sistemas. Verificar se conseguem explicar a finalidade da coleta, interpretar a comparação de equipamento e escolher uma segunda meta por vontade própria. Não houve teste com jogadores de diversão nesta implementação.

Novas receitas, Códice completo, desafios de Masmorra, novas moedas e expansão do Prestígio não fazem parte deste primeiro pacote.
