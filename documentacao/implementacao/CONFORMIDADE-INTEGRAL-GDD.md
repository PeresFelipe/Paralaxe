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
| 7–9 | Sete Ofícios 1–99, Prestígios, ferramentas e minigames | Parcial | `ocioso.ts`, `ocioso.test.ts`, `equipamento.ts`, `ferramentasDeColeta.test.ts` | Ferramentas base implementadas com XP; faltam gradações/raridade procedural, conteúdo 11–99, 2/3 trabalhos simultâneos, prioridades e minigames |
| 10–14 | Convenções, coleta/Metalurgia/Forja/Culinária | Parcial | `atividadesOciosas.ts`, `receitasDeFabricacao.ts` | Recursos, receitas e caminhos dos Prestígios I–III; etapas avançadas das profissões |
| 15 | Reforços sem falha +0 → +2 | Parcial | `fabricacao.ts`, `equipamento.ts` | Reforço +2 com componente especial, ferramentas e raridades de fabricação |
| 16–17 | Prestígio do personagem e ausência | Parcial | `prestigio.ts`, `ocioso.ts` | Integração do conteúdo e balanceamento amplo para 99 níveis |
| 18–20 | Combate, estados, resistências e chefes | Parcial | `combate.ts` domínio/conteúdo | Conteúdo completo, estratégias e mecânicas de níveis avançados |
| 21–22 | Grupo, Ameaça e Mira | Pendente | Sem agregado funcional de Grupo | Até 3 parceiros, IA multiagente, aggro e introdução narrativa |
| 23–33 | Masmorras e Dún Liath | Parcial | `masmorra.ts` domínio/conteúdo | Procedural reproduzível, armadilhas/segredos, quatro dificuldades, Incursão Automática |
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
