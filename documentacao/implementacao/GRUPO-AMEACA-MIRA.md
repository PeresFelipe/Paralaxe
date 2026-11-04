# Grupo, Ameaça e Mira — etapa de fundação

**Referência canônica:** GDD §§18, 21–23. **Branch:** `develop`. **Save:** v18.

## Entregue

- Grupo persistente com líder e até três parceiros, sem duplicatas, com recrutamento e formação separados.
- Modelo de relacionamento: Desconhecido → Conhecido → Aliado → Companheiro → Leal, sem romance.
- Marcos ordenados de Mira: rastros, encontro, cooperação temporária, divergência, Chefe em dupla, reencontro na Taverna e recrutamento.
- Marcos na Masmorra exigem uma expedição pós-Dún Liath em andamento. Reencontro e recrutamento exigem retorno à Taverna.
- Mira não sai por discordância. Integração temporária não se confunde com recrutamento permanente.
- Olho de Caçadora: bônus crítico de grupo de **5 pontos percentuais** (provisório).
- Ameaça por dano, cura, suporte e habilidade; alteração de foco; Provocar, redução de Ameaça, habilidade que ignora Ameaça e resistência temporária de Chefe.
- Simulador de Grupo determinístico, com relógios individuais, acerto, crítico, cura, ataque do inimigo e avisos. Resultados são transitórios, sem XP, itens nem alteração do save.
- A bancada de Grupo permite testar o simulador sem recrutamento fictício: quando nenhum parceiro está disponível, usa combatentes de treinamento exclusivamente não narrativos.
- Migração de partidas v1–v17 para v18, preservando contratos, itens, incursões e progresso anterior. Nome físico do IndexedDB mantido.

## Integração futura que depende do conteúdo canônico

O GDD deixa a **segunda Masmorra sem definição completa**. Esta entrega não inventa o nome, o Chefe ou o conteúdo narrativo definitivo. Por isso a campanha ainda não executa os marcos de Mira em uma Masmorra jogável. A sequência de recrutamento fica preparada e protegida, mas **Mira não pode ser obtida em uma partida normal até que a segunda Masmorra seja desenvolvida**.

O simulador multiagente não substitui o motor completo de salas, economia, consumíveis, saques ou penalidades. A primeira Masmorra oficial continua sendo Solo; a futura Masmorra em Grupo deverá conectar o resultado do simulador às transições persistidas, à Bolsa e às recompensas da exploração.

Os valores de Mira, Ameaça, duração da Provocação e resistência de Chefes são parâmetros preliminares de balanceamento.

## Validação

Testes de domínio: formação, limites, marcos narrativos, bônus crítico, empate de foco, Provocação, resistência de Chefe, cura, suporte, relógios, telegraph e repetibilidade por semente. Teste de persistência: v17 → v18 preservando a Incursão Automática. Verificar CI e build do commit final antes de declarar entrega aprovada.
