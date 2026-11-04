# Auditoria incremental de conformidade com o GDD — 04/11/2026

**Base:** `documentacao/GDD.md`, código da branch `develop` e testes existentes. O GDD continua sendo a especificação canônica; este documento registra o estado de implementação sem mudar regras do jogo.

## Matriz de conformidade por sistema

| Sistema | Requisito canônico | Verificado no código | Principal lacuna / dependência | Prioridade |
| --- | --- | --- | --- | --- |
| Profissões e coleta (§7, §11) | Sete Ofícios, níveis 1–99 e materiais por faixa/Prestígio | Sete Ofícios, nível limitado a 10, quatro recursos iniciais | Desbloqueios dos níveis superiores, recursos das demais faixas, balanceamento da curva | Alta |
| Produção (§12–14) | Linhas graduais de Metalurgia, Forja e Culinária | Motor de fabricação e receitas iniciais | Expansão de receitas úteis e interligação real com outros sistemas | Alta |
| Ferramentas de coleta (§7) | Quatro ferramentas equipáveis separadas do combate | Sem catálogo de ferramentas equipáveis | Contrato, slots e migração de save necessários | Alta, próxima fatia |
| Prestígio de Profissão (§9) | 2 atividades no P1, prioridades no P2 e 3 no P3 | Reinício e Prestígios I–III | Motor de múltiplas atividades com economia determinística e migrações | Alta, após progressão |
| Minigames (§7) | Oportunidades temáticas opcionais, nunca penalizando o idle | Nenhum minigame de profissão | Mecânicas opcionais após base estável | Média |
| Equipamentos e reforço (§15, §34–35) | Equipamentos procedurais e reforços +0 → +1 → +2 | Equipamentos individuais, +0 e +1 e atributos iniciais | +2, materiais especiais e expansão das definições | Alta |
| Combate (§18–20) | Habilidades, estilos, telegraphs, estados e inimigos variados | Motor de combate solo com conteúdo inicial | Ampliar mecânicas das dificuldades, preparar Grupo | Média/alta |
| Grupo e Mira (§21–22) | Até três parceiros, Ameaça e segunda Masmorra | Sem sistema de parceiros ou Ameaça | Novo agregado de Grupo, combate multiagente, segundo cenário | Após Dún Liath |
| Dún Liath (§23–33) | Caminhos procedurais, segredos, 4 dificuldades, automação separada | Dún Liath Fácil com sequência inicial e decisões persistidas | Geração reproduzível, recompensas, fases e dificuldades | Alta |
| Relíquias (§31, §35–36) | Relicário funcional, Relíquia local e certificação conectada | Interface informativa, sem Relíquias operacionais | Definições, instâncias e fluxo de descoberta local | Após Dún Liath |
| Narrativa e missões (§39–43) | Missões de vários tipos, PNJs reativos e finais | Prólogo, Jornada e primeiro contrato | Campanha, ramificações, estados e dois finais | Médio/longo prazo |
| Modo Conectado (§62–75) | Servidor autoritativo, certificação, risco, mercado de Relíquias | Modo local | Arquitetura e decisões ainda em aberto; não iniciar nesta etapa | Futuro |
| Cidade Livre (§38) | Cidade sem evolução própria no conceito original | Cidade Viva com projetos e estágios | **Divergência canônica:** requer decisão explícita antes de editar o GDD | Decisão pendente |

## Primeira entrega incremental: Mineração → Metalurgia → Forja

**Fatia vertical implementada no catálogo:**

1. Mineração, nível 10: **Stán**, obtenção determinística e XP de profissão.
2. Metalurgia, nível 10: **Lingote de Stán**, fabricado usando Stán.
3. Forja, nível 10: **Braçadeiras Rebitadas de Stán**, criadas com lingotes e Giúis.
4. Equipar a peça no espaço de luvas altera a Defesa derivada por meio do motor de combate existente.
5. Catálogo/ícones, Códice, comparação de equipamentos e seleção de Ofícios reutilizam as integrações já existentes.

Os parâmetros abaixo são **provisórios e exclusivos de balanceamento**, não novas regras permanentes do GDD:

| Atividade ou receita | Requisito | Custo | Tempo | XP por ciclo | Resultado |
| --- | --- | --- | --- | --- | --- |
| Extrair Stán | Mineração nível 10 | — | 8 s | 16 | 1 Stán |
| Lingote de Stán | Metalurgia nível 10 | 3 Stán | 12 s | 24 | 1 lingote |
| Braçadeiras Rebitadas de Stán | Forja nível 10 | 2 lingotes + 4 Giúis | 20 s | 40 | Luvas, Defesa-base 9 |

### Critérios de aceitação

- As atividades de nível 10 não iniciam com nível 9.
- O jogo concede somente o recurso escolhido, sem recompensas secundárias aleatórias.
- A produção consome quantidades exatas, respeita espaço de inventário e é determinística com atualizações periódicas e ausentes.
- A peça pode ser equipada e melhora os atributos derivados de combate.
- IDs das novas definições são estáveis; novos recursos surgem no Códice conforme prova de aquisição/execução.
- Trabalho atual, receitas anteriores e progresso existente não são substituídos por consultar o catálogo.

### Persistência

**Nenhuma mudança no esquema do save:** novas atividades, receitas e equipamentos são definições adicionadas ao conteúdo, usando os campos persistidos já existentes. Não é necessária migração para esta entrega. A versão do esquema é preservada; nenhum campo de saves foi reescrito.

### Pendências do GDD

A expansão de níveis 11–99, as curvas finais de XP, todas as linhas de recursos/Prestígio, as ferramentas, os minigames e o trabalho paralelo permanecem fora desta fatia. O modo Conectado continua futuro. Para a próxima entrega, priorizar **ferramentas de coleta**, com modelo persistente, migração e testes, ou a ampliação das faixas 10–20 quando definida a curva.

### Verificação

A pipeline da branch `develop` deve executar: análise arquitetural, lint, TypeScript, testes de domínio/conteúdo/persistência, catálogo de créditos e build. A nova cadeia recebe teste de integração direto, incluindo equipamento, bloqueios de nível e inventário cheio. Sem navegador disponível, os testes visuais e de jogabilidade real permanecem pendentes e não podem ser declarados concluídos.
