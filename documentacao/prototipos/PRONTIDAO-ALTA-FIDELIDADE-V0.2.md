# Prontidão de teste com jogadores — Alta fidelidade v0.2

Este documento verifica se `greywake-fluxo-alta-fidelidade-v0.2.html` possui superfícies e interações suficientes para executar o roteiro de UX antes de convidar participantes.

> **Prontidão não é resultado de teste com jogadores.** Um cenário estar testável significa apenas que o protótipo oferece estímulos suficientes para observar o comportamento correspondente.

## Lista de verificação

| Cenário | Estado | Evidência no protótipo |
|---|---|---|
| 1. Orientação inicial | ✅ testável | Mineração/Cloch e indicador Ocioso global aparecem simultaneamente; navegação segura preserva a atividade. |
| 2. Troca de recurso | ✅ testável | Stán pode ser selecionado; a consequência de substituir a atividade aparece antes de confirmar; confirmação atualiza o indicador global. |
| 3. Coleta → produção | ✅ testável | Cloch mostra `Usos conhecidos` e atalho contextual para Metalurgia. |
| 4. Produção / custo de oportunidade | ✅ testável | Metalurgia mostra a atividade atual, a substituição antes da ação e resposta depois de iniciar. |
| 5. Personagem / Técnicas | ✅ testável | Personagem possui aba Técnicas; quatro espaços aparecem em ordem de prioridade real. |
| 6. Cidade / Taverna | ✅ testável | Cidade apresenta cinco estabelecimentos; Taverna é navegável; Brann e contrato são reconhecíveis. |
| 7. Jornada | ✅ testável | Jornada abre como folha global sem substituir a tela segura atual. |
| 8. Preparação | ✅ testável | Slots vazios, risco e fronteira Ocioso estão explícitos; navegação e atividade continuam visíveis com peso reduzido. |
| 9. Combate explicável | ✅ testável | Aviso de ataque mostra nome, efeito conhecido e tempo; Recuo permite abrir a razão da não execução. |
| 10. Masmorra / risco | ✅ testável | Sala atual, Bolsa, quantidade em risco e rotas conhecidas/parciais aparecem juntas; navegação segura está recolhida. |
| 11. Retorno sem conexão | ✅ testável | Ausência, atividade processada, recurso, XP, nível e desbloqueio aparecem como reconciliação de estado. |
| 12. Celular | 🟡 pronto para observação visual | Disposição responsivo preserva quatro destinos em Safe/Preparação, três recursos vitais e folhas; Combate/Dungeon recolhem navegação. Precisa ser observado em viewport/dispositivo real. |

## Correções incorporadas desde v0.1

- Vida, Mana e Fôlego não desaparecem em celular;
- recursos vitais possuem símbolo/texto curto além de cor;
- Inventário rápido passou a ser um folha funcional;
- Cloch → Stán pode ser realmente executado;
- Produção atualiza o estado global de atividade;
- retorno a Mineração/Produção recalcula corretamente a decisão em relação à atividade atual;
- bloqueios usam texto + símbolo, não apenas aparência;
- Escape fecha folhas;
- foco visível e região `aria-live` foram adicionados ao protótipo;
- `prefers-reduced-movimento` remove transições não essenciais;
- Preparação preserva shell seguro reduzido; Combate/Dungeon recolhem o shell; retorno sem conexão usa foco temporário.

## Limitações intencionais

O protótipo ainda não tenta validar:

- arte final;
- som;
- animações de produção;
- persistência real;
- fórmula/balanceamento real;
- toda a superfície de Mercado/Banco/Ferreiro/Relicário;
- Masmorra completa sala a sala;
- navegação por leitor de tela em nível de produção;
- compatibilidade cross-browser final.

Essas limitações não impedem os cenários de modelo mental definidos para esta fase.

## Decisão de passagem

O hi-fi v0.2 está **pronto para teste com jogadores**, mas não está validado por jogadores.

A próxima evidência necessária é comportamento observado. Problemas de preferência visual podem ser registrados, mas somente confusão, hesitação, expectativa incorreta ou falha de execução justificam reabrir arquitetura congelada sem outro motivo estrutural.
