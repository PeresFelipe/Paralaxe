# Paralaxe — Legado da Cidade Livre (Cidade Viva)

## Resumo

Sistema de reconstrução baseada exclusivamente nas conquistas do RPG e na escolha dos projetos. Não exige cronômetro, tarefas reais, conexão online, nova moeda permanente ou esperas artificiais.

> **Estado de entrega:** arquivos de implementação para aplicação controlada sobre a branch `codex/vigilia-cidade-artes-completas-2026-11-03`. Esta documentação acompanha o pacote local e não afirma publicação, testes do monorepo nem QA visual ainda não realizados.

## Loop do jogador

1. Jogar normalmente: coletar, fabricar, combater, explorar, concluir Desafios, aumentar profissões e descobrir itens do Códice.
2. O projeto de um distrito é liberado quando seus requisitos persistentes são atendidos.
3. O jogador reúne os materiais e o ouro. Quantidades disponíveis consideram **inventário e banco**; na conclusão, são retirados primeiro do inventário, depois do banco.
4. Com todos os requisitos atendidos, confirma **Restaurar construção**.
5. A transação de domínio valida tudo sobre a partida mais recente, consome recursos, aumenta o nível do distrito e registra um histórico curto.
6. O visual muda quando se atinge um dos cinco limiares de melhoria (0, 3, 8, 15, 24); a interface dos distritos responde individualmente ao nível mesmo entre estágios.

## Conteúdo disponível

- 8 distritos: Praça, Taverna, Ferreiro, Mercado, Banco/Armazém, Relicário, Biblioteca/Códice e Muralhas.
- 4 níveis por distrito, 32 projetos tipados; IDs como `cidade.ferreiro.nivel-1` são independentes do texto exibido.
- Os projetos usam exclusivamente os recursos básicos presentes no catálogo atual: Cloch, Giúis, Scadán e Neantóg, ouro e marcos persistentes de profissões, combate, Jornada, Códice, Desafios e Dún Liath.
- Os valores de custos e marcos são uma **primeira proposta de balanceamento implementada**, não conteúdo aprovado definitivo. Nenhuma melhoria oferece bônus de combate, ouro, XP ou capacidade de banco.
- Simulação automatizada prevista para concluir as 32 melhorias com uma partida sintética de conquistas e recursos disponíveis.

## Salvamento 12 → 13

O campo `legado` armazena o estado canônico da nova Cidade: níveis dos oito distritos, créditos de transição remanescentes e histórico de construções. O campo `vigilia` continua no agregado **apenas como arquivo de compatibilidade histórica** da versão 12 (incluindo sessões concluídas e eventual sessão ativa). Não pode gerar novas Brasas nem continuar sessões.

Ao migrar do esquema 12:
- Copiar os níveis dos oito distritos exatamente para `legado.distritos`.
- Manter o campo histórico `vigilia` sem descarte de seus dados.
- Converter saldo de Brasas disponível para `legado.creditosDeTransicao` na primeira migração; não converter total já gasto nem recriar recompensas.
- Cada crédito oferece desconto de 2 moedas de ouro, limitado a 50% do custo nominal de cada novo projeto. Não substitui material ou conquista; não é produzido após a migração.
- Considerar automaticamente concluídos os níveis já obtidos: a situação é derivada de `distritos`, não há cobrança retroativa.
- Não premiar uma sessão histórica ainda ativa; seus dados ficam arquivados e a interface informa a mudança.
- Migrar saves anteriores usando o adaptador de vocabulário já existente, preservando IndexedDB `paralaxe`, store `saves`, chave `saveId`.

**Compatibilidade reversa:** uma partida regravada em esquema 13 não é garantidamente legível por versões anteriores. Fazer backup antes de alternar entre branches. O mecanismo atual de fila garante ordem por uma instância do navegador, não concorrência multitab.

## Imagens e responsividade

Mantidos os cinco panoramas 16:9 WebP `cidade-estagio-{0..4}.webp`, versões menores `mobile/cidade-estagio-{0..4}-mobile.webp` e ícones em `/arte/cidade/interface/`. Não gerar ou ativar camadas de construção com recortes desalinhados. Uma falha de carregamento usa uma reserva visual acessível.

- Cena com proporção fixa, evitando mudança de layout.
- Desktop: catálogo em duas colunas; mobile até 720px: uma coluna, filtros quebráveis e resumo condensado.
- Texto de requisitos e custos visível; estados não dependem somente de cores.
- Botões compartilham a biblioteca UI; feedback de conclusão e mudança de estágio é não bloqueante.
- CSS usa os tokens do projeto, com suporte a `prefers-reduced-motion`.
- Não há intervalos de tempo, loops de UI ou gravações artificiais periódicas do Legado. Apenas imagem do estágio atual deve ser carregada.

## Arquitetura

- `pacotes/dominio/fonte/legadoDaCidade.ts`: regras puras de projeto, validação, custos, economia, idempotência e estágio visual.
- `pacotes/conteudo/fonte/projetosDaCidade.ts`: dados dos 32 projetos e consulta por ID.
- `aplicativos/jogo/fonte/features/cidade/LegadoDaCidade/`: cena WebP com fallback, resumo, listagem responsiva e feedback de conquistas.
- `aplicativos/jogo/fonte/hooks/useAplicativoDaPartida.ts`: recebe intenção `idDoProjeto` e executa o comando na fila de gravação existente.
- `pacotes/persistencia/fonte/repositorioDePartidasIndexedDb.ts`: migração e validação de schema 13.

`vigiliaDaCidade.ts` permanece como implementação histórica para os contratos de compatibilidade anteriores; sua API deixa de ser exposta à aplicação. O diretório de UI `VigiliaDaCidade` é retirado quando aplicado o pacote.

## Limites conhecidos e validação restante

- As cenas são panoramas globais; melhorias isoladas só mudam os cards, não um sprite de construção independente. Para 32 transformações de cenário independentes, será necessária direção de arte adicional.
- A tipagem e testes de domínio isolados neste pacote não substituem `pnpm verificar` e `pnpm compilar` no clone do monorepo.
- Validar histórico de saves reais v1–v12, especialmente saves com expedição ativa e Vigília pendente.
- Realizar QA manual da navegação em 320, 360, 390, 430, 768, 1024 e 1440px, toque, teclado, redução de movimento e modo offline.
- Conferir visualmente o desenho de projetos em um browser antes de aprovar a experiência.
- Testar concorrência, alternância rápida entre atividades e consumo de materiais no banco.
- Medir performance real e reavaliar ritmo, custos e qualidade dos primeiros 30–60 minutos de jogo.
