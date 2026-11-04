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
- Matriz detalhada em `CONFORMIDADE-INTEGRAL-GDD.md`.

## Regras de continuidade
- Ler o HEAD remoto antes de cada alteração e criar commits de fast-forward (sem force-push).
- Manter `main` intocada.
- Preservar todos os saves e IDs; criar migração para qualquer campo persistido novo.
- Não afirmar que um sistema está completo apenas porque o catálogo ou a interface existe.
- Usar CI para registrar testes reais; não equiparar isso a testes visuais com navegador.
- Manter valores provisórios separados das regras canônicas.

## Ainda falta
- Expansão das ferramentas profissionais para raridades/afixos procedurais e efeitos adicionais; slots básicos existentes.
- Profissões: recursos e cadeias produtivas dos níveis 75 e 90, expansão de receitas/efeitos até 99 e todo o Prestígio I–III, incluindo 2–3 atividades.
- Minigames opcionais.
- Reforços +2, novos itens especiais, raridade procedural completa.
- Dún Liath procedural, dificuldades, segredos, recompensas e automação.
- Grupo, Ameaça, Mira, segunda Masmorra.
- Relíquias e Relicário.
- Missões, narrativa e finais.
- Arquitetura e implementação segura do modo Conectado.
- Decisões pendentes no GDD e testes visuais/jogabilidade de longo prazo.

## Estado da conclusão
**Parcial.** Progressão até 99 e cadeias produtivas normais até nível 60 começaram a funcionar, mas a profundidade do conteúdo ainda é limitada. O restante do GDD exige trabalho adicional e decisões canônicas explícitas.
