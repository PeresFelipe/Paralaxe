# Conformidade integral do GDD — execução incremental

Referência canônica: `documentacao/GDD.md`, 75 seções. Base de código: branch `develop`. Este documento é um **registro incremental de auditoria e implementação**, não uma declaração de conclusão integral. Para detalhamento anterior consulte `MATRIZ-CONFORMIDADE-GDD-2026-11-04.md`.

## Critério de status
- **Implementado:** recurso testado e acessível conforme o escopo canônico aplicável.
- **Parcial:** uma parte existe, mas requisitos canônicos ainda faltam.
- **Pendente:** inexistente ou apenas placeholder.
- **A definir:** depende de decisão explicitamente aberta no GDD.
- **Divergência:** regras implementadas diferem da especificação canônica.

## Matriz por capítulos do GDD

| Seções | Requisito | Situação | Código / testes verificados ou referência | Trabalho pendente |
| --- | --- | --- | --- | --- |
| 1–3 | Nome, escopo e filosofia | Parcial | `documentacao/GDD.md`, shell do jogo | Confirmar pontos em aberto da seção 46 |
| 4 | Nível geral 1–99, pontos de atributo | Parcial | `pacotes/dominio/fonte/progressao.ts`, `progressao.test.ts` | Validar balanceamento definitivo, progressão narrativa e pacing |
| 5–6 | Classes e presentes | Base implementada | `pacotes/conteudo/fonte/criacaoDePersonagem.ts` | Refinamento de conteúdo/UX |
| 7–9 | Sete Ofícios 1–99, Prestígios, ferramentas e minigames | Parcial | `ocioso.ts`, `fabricacao.ts`, `prioridadesDeOficio.ts`, `minigamesDeOficio.ts`, `prestigiosAvancados.test.ts`, `minigamesDeOficio.test.ts` | Prestígio I–III: dois ou três trabalhos e prioridades implementados; sete desafios opcionais de escolha integrados. Pendem balanceamento, profundidade dos minigames, raridades e mais ferramentas |
| 10–14 | Convenções, coleta/Metalurgia/Forja/Culinária | Parcial | `atividadesOciosas.ts`, `receitasDeFabricacao.ts`, `conteudoDePrestigios.ts`, `conteudoDePrestigios.test.ts` | Marcos normais até 90 e catálogos exclusivos I–III implantados: 84 coletas, 63 receitas, 21 equipamentos e 21 consumíveis. Faltam profundidade de técnicas, decisões de balanceamento e condições especiais das linhas |
| 15 | Reforços sem falha +0 → +2 | Implementado na trilha básica | `fabricacao.ts`, `equipamento.ts`, `fabricacao.test.ts`, `receitasDeFabricacao.ts` | +0→+1 e +1→+2 funcionais, sem falha, com fragmento especial de Fairtheoir. Ainda pendem variações de materiais e ajustes finais de balanceamento |
| 16–17 | Prestígio do personagem e ausência | Parcial | `prestigio.ts`, `ocioso.ts` | Integração do conteúdo e balanceamento amplo para 99 níveis |
| 18–20 | Combate, estados, resistências e chefes | Parcial | `combate.ts` domínio/conteúdo | Conteúdo completo, estratégias e mecânicas de níveis avançados |
| 21–22 | Grupo, Ameaça e Mira | Pendente | Sem agregado funcional de Grupo | Até 3 parceiros, IA multiagente, aggro e introdução narrativa |
| 23–33 | Masmorras e Dún Liath | Parcial | `masmorra.ts`, `geracaoDeDunLiath.ts`, `geracaoDeDunLiath.test.ts`, `dificuldadesDeDunLiath.test.ts` | Grafo procedural pós-primeira visita com semente e snapshot persistidos, armadilha não letal, segredo opcional, quatro dificuldades com desbloqueio sequencial e recompensas de primeira conclusão. Pendem kits próprios de inimigos por dificuldade, eventos narrativos raros, Arquivo Selado, Incursão Automática e testes visuais |
| 34–37 | Equipamentos, armazenamento, Relíquias e economia | Parcial | `equipamento.ts`, `armazenamento.ts`, `economia.ts` | Raridades e afixos ampliados, Relicário funcional, itens únicos |
| 38 | Cidade Livre e mundo | **Divergência** | `projetosDaCidade.ts`, `legadoDaCidade.ts` | Resolver incompatibilidade Cidade Viva × ausência de evolução da Cidade no GDD |
| 39–40 | Missões, NPCs e prólogo | Parcial | `jornada.ts`, telas e estados de contrato | Novos arcos, condições, ramificações e reação dos PNJs |
| 41, 44 | UX, interface e arte | Parcial | Componentes React e estilos da aplicação | Testes reais nas resoluções exigidas e mais conteúdo visual |
| 42–43 | Lore e finais | Pendente/parcial | Introdução e primeiro arco em Jornada | História ampliada, dois finais e dependências narrativas |
| 45–46 | Regras documentais e decisões em aberto | **A definir** | `GDD.md` | Monetização, números finais, segunda Masmorra e especificações de infraestrutura |
| 47–61 | Arquitetura, conteúdo/estado, atomicidade, RNG e persistência | Parcial | Pacotes `dominio`, `conteudo`, `persistencia` | Novos agregados, migrações, idempotência de economias e concorrência avançada |
| 62–75 | Modo Conectado, segurança, certificações, P2P | Pendente | Modo Sem conexão como base local | Conta, servidor autoritativo, transações, mercados, risco/confiança, hospedagem |

## Entregas implementadas nesta execução

### Entrega A — níveis de 1 a 99

Arquivos: `pacotes/dominio/fonte/ocioso.ts`, `progressao.ts`, três arquivos de testes e `TelaDeAtividades.tsx`.

- O limite efetivo de profissão e personagem foi elevado para 99.
- Os custos históricos das nove primeiras transições foram preservados.
- A curva estendida está isolada no domínio como **balanceamento provisório**, aguardando ajustes e simulações de longo prazo.
- Prestígio de Ofício agora exige nível 99. O save anterior mantém os níveis/Prestígios já gravados, mas um novo Prestígio exige alcançar o novo limite.
- Não houve mudança no formato de dados: **sem migração estrutural nesta entrega**.

### Entrega C — ferramentas de coleta

Arquivos: `pacotes/dominio/fonte/equipamento.ts`, `ocioso.ts`, `pacotes/conteudo/fonte/equipamento.ts`, `receitasDeFabricacao.ts`, serviço de processamento e telas de atividades/equipamento.

- As quatro ferramentas base (Picareta, Machado de Corte, Equipamento de Pesca e Kit de Herbologia) são fabricadas na Forja e equipadas em **slots próprios**, separados de armas e armaduras.
- A ferramenta equipada concede **XP adicional determinístico** exclusivamente no Ofício correspondente; sem durabilidade ou resultado secundário.
- O processamento normal e offline utiliza o mesmo motor; ao equipar, primeiro é processado o intervalo ainda pendente com a configuração antiga, evitando bônus retroativo.
- Reutiliza `itensDeEquipamento` e o mapa de equipamentos já persistidos, cujos campos são opcionais: saves antigos não exigem migração estrutural.
- Os valores de XP e ingredientes são provisórios. Ferramentas com raridade procedural e outros efeitos ainda dependem das expansões futuras.

### Entrega B — coleta e fabricação de nível 10 dos Ofícios restantes

Arquivos: `pacotes/conteudo/fonte/atividadesOciosas.ts`, `receitasDeFabricacao.ts`, `equipamento.ts`, `combate.ts`, ícones/rótulos da aplicação e teste de integração `expansaoOficiosNivel10.test.ts`.

- Lenhador: **Beith** → Arco de Beith fabricável na Forja, utilizável em combate.
- Pesca: **Breac** → Breac Assado, utilizável como consumível de combate.
- Herbologia: **Seamair** → Infusão de Seamair, utilizável como consumível de combate.
- Mineração, Metalurgia e Forja já possuem a cadeia **Stán → Lingote de Stán → Braçadeiras Rebitadas de Stán**, implementada em entrega anterior.
- XP, durações, custos e efeitos de produtos novos são **provisórios** e não são apresentados como valores definitivos do GDD.
- Não foram removidas ou renomeadas definições existentes.

### Entrega D — nível 20–30 dos quatro Ofícios e cadeias de produção

- Coleta normal dos oito recursos previstos no GDD §11: Copar, Iarann, Fearn, Saileach, Sairdín, Ronnach, Caisearbhán e Fraoch.
- Metalurgia: Lingote de Copar, Lingote de Iarann e a liga Cré-Umha (a última usa Stán e Copar processados).
- Forja: Broquel Trançado de Fearn, Couraça de Iarann e Arco de Saileach, todos equipáveis pelo motor existente.
- Culinária: Sairdín em Conserva, Infusão de Caisearbhán e Ensopado de Ronnach e Fraoch, consumíveis com efeitos definidos.
- Novos nomes/ícones, integração ao Códice e testes de desbloqueio/produção; não há mudança de formato de save.
- **Escopo:** os nomes/níveis dos recursos e as etapas temáticas vêm do GDD; nomes das peças, composição exata de receitas, tempos, XP e atributos são conteúdo provisório, pendente de balanceamento.

### Entrega E — níveis 45 e 60 (coleta → produção → uso)

- **GDD §11:** Luaidhe, Coll, Trosc e Aiteann no nível 45; Airgead, Fuinseog, Bradán e Raithneach no nível 60.
- **GDD §12:** lingotes de Luaidhe e Airgead, Fundição Pesada (placas) e Cruach, aproveitando também Iarann e Coll.
- **GDD §13:** Peitoral de Fundição Pesada, Arco de Fuinseog e Anel de Airgead.
- **GDD §14:** Trosc Defumado, Extrato de Aiteann e Refeição de Bradán e Raithneach.
- Os catálogos existentes fornecem desbloqueios, ciclos offline, Códice e interfaces. Os IDs de saves anteriores permanecem inalterados e nenhuma migração estrutural é necessária.
- **Ainda provisório:** custos, cadências, XP, peças novas e efeitos de equipamento/consumíveis. Não foram definidos como cânone pelo GDD.
- Testes: `pacotes/conteudo/fonte/progressoOficiosNiveis45e60.test.ts` (bloqueios, consumo, saída, Códice e compatibilidade com saves).

### Entrega F — recursos normais 75/90 integrados à produção

- **Coleta (GDD §11):** Ór/Grianchloch, Dair/Iúr, Tuinnín/Doingean e Sáiste/Marós, com desbloqueio exatamente nos níveis 75/90.
- **Metalurgia (GDD §12):** Lingote de Ór, Metais Nobres e Grianchloch Refinado, sem subprodutos aleatórios.
- **Forja (GDD §13):** Peitoral Híbrido de Dair, Arco de Iúr e Grianchloch e Cajado de Grianchloch, todos equipamentos normais.
- **Culinária (GDD §14):** Refeição de Tuinnín e Sáiste, Banquete de Doingean e Marós e Elixir de Marós, com efeitos de recuperação não permanentes.
- Os oito novos recursos são consumidos por ao menos uma receita. Itens das faixas antigas permanecem relevantes em receitas avançadas.
- **Balanceamento provisório:** custos, cadências, XP, atributos, receitas criativas e nomes de peças (não prescritos no GDD). Não há alteração no esquema dos saves ou mudança de IDs já persistidos.
- Testes de desbloqueio, consumo, equipagem, Códice e geração determinística em `progressoOficiosNiveis75e90.test.ts`. A validação visual permanece pendente.

### Entrega G — Prestígio I: segunda coleta simultânea (primeiro passo)

- O domínio passa a salvar uma atividade secundária no estado Ocioso sem substituir a principal.
- A segunda coleta exige Prestígio I da mesma profissão e um recurso distinto; seus ciclos são processados com 50% de velocidade, parâmetro de balanceamento provisório.
- O motor reaproveita coleta determinística, capacidade do inventário, limite de ausência e atualização de XP, processando a principal antes da secundária.
- Trocar o trabalho principal ou iniciar produção encerra a secundária; o processamento pendente ocorre antes da troca.
- Entrar em combate ou Masmorra congela ambos os relógios, preservando o progresso parcial.
- Esquema v14: saves v13 ganham `ocioso.atividadeSecundaria: null`; versões anteriores também são normalizadas.
- Interface da profissão mostra progresso e comandos para início/fim do segundo espaço.
- **Ainda faltam:** duas receitas simultâneas, prioridade configurável do P2, terceiro trabalho do P3, conteúdos de Prestígio e validação visual.

### Entrega H — Prestígio I: produção paralela dos Ofícios de produção

- Segundo relógio em `fabricacao.receitaSecundaria` persistido no esquema v15.
- Uma receita secundária exige Prestígio I, pertence ao mesmo Ofício da principal e precisa estar desbloqueada; reforços não são paralelizáveis.
- Principal é processada antes da secundária, usando estoque remanescente. Cada ciclo valida capacidade antes de consumir, e equipamentos compartilham a sequência global de instâncias.
- Velocidade secundária em 50% (balanceamento provisório).
- Interface permite acompanhar, iniciar ou interromper a produção secundária. A continuidade pausa ambos os relógios em risco.
- Migração v14 → v15 cria receita secundária vazia sem perder trabalho, inventário ou XP.
- **Ainda falta:** prioridades do Prestígio II, terceira atividade do III e conteúdo exclusivo de Prestígios.

### Entrega I — reforço +2 do GDD §15

- Receita de Forja nível 20: **Reforço de Dún Liath +2**, requer equipamento +1, Lingote de Iarann e **Fragmento de Fairtheoir** (saque de chefe), sem ouro ou falha.
- Reforço +1 mantém a regra histórica. +2 usa um multiplicador provisório de 30% sobre a propriedade-base, sem modificar afixos, raridade ou efeitos únicos.
- A interface oferece o reforço correspondente ao nível atual da instância. Não existe durabilidade.
- O campo `nivelDeReforco` continua na mesma estrutura persistida; aceita agora 0, 1 ou 2, sem migração do save para essa funcionalidade.


### Entregas J–M — cinco frentes do GDD (04/11/2026)

**Prestígio II — prioridades:** o jogador escolhe Equilibrado, Principal ou Secundária. Os dois relógios ajustam cadência e, quando a prioridade é Secundária, ela consome recursos antes da principal. Percentuais 100/50, 125/35 e 80/75 são **provisórios**, não números canônicos. A preferência é registrada na partida e mudanças processam o tempo pendente antes de trocar a configuração.

**Prestígio III — terceiro espaço:** coleta e fabricação receberam relógio terciário, com 33% de velocidade provisória, exigindo PIII e três atividades/receitas diferentes do mesmo Ofício. O motor mantém relógios, saldo parcial, capacidade de inventário e IDs de equipamentos distintos; risco pausa os três. Esquema de save **v16**, migração v15→v16 preserva os dois relógios já gravados.

**Conteúdo exclusivo I–III:** catálogos orientados a dados seguindo os nomes e marcos de níveis 1, 15, 30, 45, 60, 75, 90 do GDD: 84 atividades de coleta, 63 receitas (Metalurgia, Forja, Culinária), 21 equipamentos e 21 consumíveis. Primeiro recurso de cada camada reaproveita o último da anterior. Requisitos de Prestígio são validados no domínio e na interface, inclusive ao iniciar tarefas adicionais. Todas as quantidades, atributos e receitas não expressamente definidas no GDD são **provisórias**; as técnicas especiais e sua variedade ainda podem exigir aprofundamento.

**Minigames dos sete Ofícios:** primeira implementação jogável com um microdesafio temático de três escolhas por Ofício. A janela aparece após 60s de trabalho e aceita uma tentativa por intervalo de 3min; a resposta certa ativa +4 XP por ciclo por tempo limitado, sem efeito retroativo. Resposta errada não retira itens, não reduz produção ou XP-base, nem encerra o trabalho idle. O estado é opcional no save v16 e é criado ao iniciar uma partida nova; jogos antigos continuam legíveis. Esses são microdesafios de escolha, **não minigames profundos de timing ou habilidade** — aprofundamento futuro permanece recomendável.

**Reforço +2:** receita adicional de Forja para elevar somente +1→+2, usando Fragmento de Fairtheoir (chefe de Dún Liath) e Lingote de Iarann. Nunca falha, não exige ouro e mantém afixos/raridade. Bônus-base +30% é provisório. Não foi criado sistema de durabilidade.

**Validação:** matriz de testes `prestigiosAvancados.test.ts`, `conteudoDePrestigios.test.ts`, `minigamesDeOficio.test.ts`, `fabricacao.test.ts` e migrações IndexedDB. A pipeline de TypeScript, lint, testes automatizados e build deve ser verificada pelo SHA de HEAD publicado. Não alegar validação manual de navegador, balanceamento de longo prazo ou segurança econômica Conectada.

### Entrega N — Dún Liath procedural e dificuldades (04/11/2026)

- A primeira expedição Fácil mantém o percurso controlado do GDD. Após concluir Fácil, as novas viagens geram grafo determinístico por semente.
- Cada grafo tem 20 nós e caminhos irreversíveis de 17–20 salas, conservando a decisão do Protetor, o Registro de Suprimentos, Cosantóir, a sala de recuperação, o portão de decisão e Fairtheoir.
- Uma armadilha ambiental sinalizada aplica perda parcial não letal de Vida; um caminho alternativo na muralha leva a sala secreta com Sucata em Bolsa de Expedição, sujeita à perda em derrota.
- O grafo inteiro fica persistido na expedição, não só a semente, e é consultado pelo domínio e pela interface; saves anteriores sem snapshot seguem usando o mapa fixo.
- Desbloqueio progressivo de Fácil, Normal, Difícil e Impossível, com parâmetros de força de inimigos provisórios para cada dificuldade.
- Primeiras conclusões: Guarda Instintiva (Fácil, já existente), receita Reforço do Vigia (Normal), Escudo do Último Vigia (Difícil) e Lacre do Comandante (Impossível). Escudo e Lacre são concedidos uma única vez, com checagem de capacidade antes da extração.
- A receita Normal requer Sucata, Cruach e Fragmento de Fairtheoir. O Lacre é um item de história, não uma Relíquia ou material consumível.
- Testes por múltiplas sementes, caminho garantido, irreversibilidade, efeitos de sala, bônus sem repetição, desbloqueios, recompensas e receita de Forja.
- **Escopo parcial:** as quatro dificuldades ainda usam escalonamento numérico no combate (não todos os kits próprios do GDD §33). A variedade de eventos, o Arquivo Selado e a Incursão Automática permanecem para próximos ciclos.

## Dependências e riscos não encerrados

1. **Níveis 1–99 não significam conteúdo 1–99 completo**: faltam desbloqueios, receitas, equipamentos e simulações de balanceamento.
2. **Prestígio histórico:** saves de jogadores que já prestigiaram no nível 10 mantêm seu Prestígio. Essa compatibilidade não deve ser confundida com elegibilidade nova; na regra nova o limiar é 99.
3. **Ferramentas básicas** usam slots opcionais do mapa persistente e não exigem migração estrutural. **Atividades paralelas** ainda exigem mudança de modelo persistido, migradores e interface; não tentar encaixar múltiplos trabalhos no campo antigo `atividadeAtiva`.
4. **Relíquias e modo Conectado** exigem novos modelos, autoridade, integridade econômica e infraestrutura ausente.
5. **Segunda Masmorra, valores finais e Cidade Viva** possuem decisões canônicas não resolvidas; não inventar confirmação.
6. **Jogabilidade visual:** CI cobre testes de código, não valida a experiência em browser nem a diversão com usuários.

## Próxima sequência recomendada

1. Expandir ferramentas para efeitos de velocidade, rendimento e raridade procedural, com testes e balanceamento.
2. Faixas 20–99 e cadeias de produção, acompanhadas de simulações de economia/tempo.
3. Prestígio de Ofício com 2/3 atividades e prioridades determinísticas.
4. Reforço +2 e equipamento procedural avançado.
5. Dún Liath procedural e suas quatro dificuldades.
6. Grupo, Mira e conteúdo dependente da segunda Masmorra.
7. Relíquias, narrativa, finais e eventual modo Conectado sob decisões aprovadas.

**Não declarar o GDD integralmente implementado antes de completar e verificar cada requisito.**
