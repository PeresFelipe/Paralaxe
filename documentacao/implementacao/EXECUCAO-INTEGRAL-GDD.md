# Diário de execução do GDD — novembro de 2026

## Contexto
Branch exclusiva `develop`, documentação canônica `documentacao/GDD.md`. O pedido é de execução integral, mas os requisitos ultrapassam uma única entrega e incluem pontos explicitamente abertos na seção 46. Este arquivo serve para recuperação segura sem confundir entregas parciais com produto final.

## Concluído e enviado
- `d9dc509` (entrega anterior): Stán → Lingote de Stán → Braçadeiras Rebitadas.
- `a96e097`: fundação dos níveis gerais e dos sete Ofícios de 1 a 99, Prestígio de profissão condicionado ao nível 99, testes para curva e limites.
- `0c1e3f2`: Beith, Breac e Seamair no nível 10, respectivamente Arco de Beith, Breac Assado e Infusão de Seamair, rótulos/ícones, catálogo de combate e testes integrados.
- `ad53e5a`: catálogo e motor das quatro ferramentas com slots profissionais; XP adicional de coleta, fabricação, ícones e serviço de processamento.
- Integração de troca de ferramenta, interface e testes complementares no commit seguinte.
- Expansão dos marcos normais dos níveis 20 e 30: Copar/Iarann, Fearn/Saileach, Sairdín/Ronnach, Caisearbhán/Fraoch; novos lingotes, Cré-Umha, fabricação de equipamentos e receitas de Culinária.
- Faixas 45–60 implementadas nesta etapa: oito recursos, quatro receitas de Metalurgia, três de Forja e três de Culinária, com testes próprios (GDD §§11–14).
- Faixas normais 75/90 implementadas: 8 recursos, 3 transformações de Metalurgia, 3 equipamentos de Forja e 3 consumíveis de Culinária, com testes de integração específicos (GDD §§11–14).
- Matriz detalhada em `CONFORMIDADE-INTEGRAL-GDD.md`.

- Prestígio I: segunda coleta do mesmo Ofício com eficiência provisória de 50% e esquema de save v14, mantendo a atividade anterior no primeiro espaço.
- Prestígio I: segunda linha de fabricação (Metalurgia, Forja e Culinária); esquema v15, inventário e IDs partilhados, pausa durante risco, interface e testes.
- Prestígio II: três prioridades configuráveis no motor e na interface, com cadências provisórias; processa pendências antes de alterar a preferência.
- Prestígio III: terceiro trabalho de coleta ou fabricação e save v16, migração de dados antigos sem perder relógios ou prioridades.
- Prestígios I–III: catálogos exclusivos de 84 coletas, 63 receitas, 21 equipamentos e 21 consumíveis (parâmetros provisórios).
- Sete microdesafios opcionais de Ofício com janela temporária; sucesso dá XP adicional por ciclo e erro não penaliza idle.

- Dún Liath: primeira Fácil mantém tutorial; depois da conquista, viagens geram grafos determinísticos e persistidos com armadilhas e segredos opcionais.
- Dificuldades Fácil → Normal → Difícil → Impossível desbloqueiam sequencialmente. O escalonamento de combate é provisório; recompensas únicas: Guarda Instintiva, Reforço do Vigia, Escudo do Último Vigia e Lacre do Comandante.
- Testes: `geracaoDeDunLiath.test.ts` e `dificuldadesDeDunLiath.test.ts`. Sem validação visual no navegador nesta etapa.
- Reforço +2: exige fragmento do chefe Fairtheoir, +1 anterior, ausência de falha e de ouro.

## Regras de continuidade
- Ler o HEAD remoto antes de cada alteração e criar commits de fast-forward (sem force-push).
- Manter `main` intocada.
- Preservar todos os saves e IDs; criar migração para qualquer campo persistido novo.
- Não afirmar que um sistema está completo apenas porque o catálogo ou a interface existe.
- Usar CI para registrar testes reais; não equiparar isso a testes visuais com navegador.
- Manter valores provisórios separados das regras canônicas.

## Ainda falta
- Expansão das ferramentas profissionais para raridades/afixos procedurais e efeitos adicionais; slots básicos existentes.
- Profissões: os marcos normais de coleta e linhas de Prestígios I–III foram cadastrados; faltam aprofundamentos, variantes de habilidades e balanceamento até o nível 99.
- Aprofundar os sete microdesafios temáticos (atualmente escolhas rápidas) para interações ricas de habilidade, sem prejudicar a automação.
- Ampliar os materiais especiais de reforço e as raridades/afixos procedurais além do reforço +2 básico.
- Dún Liath: grafo procedural e snapshot por semente, armadilha/sala secreta, quatro dificuldades e recompensas iniciais adicionados; faltam kits específicos de cada dificuldade, profundidade de eventos, Arquivo Selado e Incursão Automática.
- Grupo, Ameaça, Mira, segunda Masmorra.
- Relíquias e Relicário.
- Missões, narrativa e finais.
- Arquitetura e implementação segura do modo Conectado.
- Decisões pendentes no GDD e testes visuais/jogabilidade de longo prazo.

## Estado da conclusão
**Parcial.** Base de Prestígios I–III (incluindo prioridades e três trabalhos), catálogos exclusivos e reforço +2 implantados; profundidade das técnicas, minigames e balanceamento ainda pendem refinamento. O restante do GDD exige trabalho adicional e decisões canônicas explícitas.

## Revisão incremental de integridade dos minigames
- As sete oportunidades opcionais permanecem sem penalidade no Ocioso.
- A janela resolvida funciona como marca d'água por profissão: atrasar o relógio local não reabre desafios antigos nem recria bônus de XP.
- Teste de regressão reproduz resposta futura seguida de retorno a janela anterior.
