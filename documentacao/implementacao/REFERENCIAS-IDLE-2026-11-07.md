# Referências de jogos Idle — Integração e licenças (07/11/2026)

## Proveniência
Foram estudados Universal-AI (TechLuddite, MIT), IktahMetrics (Merrill Lines, MIT), The Septenary Forest (Yrahcaz7, MIT; bases de Acamaeda e Jacorb, MIT), PrestigePreview (seanpm2001, GPL-3.0) e Idle Hero (alexis-labs, sem licença publicada). Trechos do código MIT de Universal-AI e IktahMetrics foram adaptados. Nenhum recurso gráfico foi copiado. The Septenary Forest, PrestigePreview e Idle Hero permanecem somente referências de ideias.

## Implementações próprias
- Prioridades explicáveis: núcleo de pontuação e classificação adaptado das funções scored/rankActions do Universal-AI (TechLuddite, MIT), com alternativas ranqueadas pelos gargalos dos materiais da Jornada e justificativas visíveis. Sem IA externa.
- Taxas teóricas e ETA: cálculo do domínio e formatação de duração adaptada de IktahMetrics (Merrill Lines, MIT), sem OCR nem novas dependências.
- Prévia e marcos de Prestígio I–III: regras existentes do domínio e UI local.
- Retorno offline: resumo comparativo dos estados antes/depois de processar a ausência, sem crédito adicional de recursos.

## Direitos e créditos
Os autores, páginas originais e licenças estão em CREDITOS.md e no catálogo de Créditos e licenças dentro do jogo. A obra The Septenary Forest documenta também as bases de Acamaeda e Jacorb. As cópias integrais dos avisos MIT estão em `aplicativos/jogo/publico/creditos/universal-ai-MIT.txt` e `iktahmetrics-MIT.txt`, distribuídas pelo Vite e incluídas no pré-cache do PWA. A interface de créditos mostra origem, modificação e licença. Os demais projetos (incluindo GPL-3.0 e repositórios sem licença) são usados somente como referência de ideias, sem código.

## Testes e aceite
Executar pnpm verificar, pnpm compilar e pnpm verificar:creditos, além de conferir a UI em ambos os temas com e sem atividades. Inspeção estática não substitui execução. Nenhuma alteração de save, economia, balanceamento ou conexões externas foi intencionalmente adicionada.

## Recomendações contextuais opcionais
Com uma meta de fabricação pendente e duas atividades simultâneas, a UI identifica se o trabalho principal, o secundário ou ambos produzem um material em falta. Recomenda a prioridade e explica o motivo. A sugestão só é aplicada se o jogador clicar no botão; o motor ocioso e os dados salvos permanecem inalterados.

## Revisão de qualidade para distribuição comercial
Copiados apenas trechos independentes, com valor direto: fórmula de pontuação/classificação e formatador de ETA. Não foram importados motores inteiros, WebLLM, Electron, OCR, imagens ou bancos de dados de outros jogos. As regras de Prestígio, inventário, saves e recompensas permanecem no domínio do Paralaxe. Validar build, testes e telas antes do lançamento.
