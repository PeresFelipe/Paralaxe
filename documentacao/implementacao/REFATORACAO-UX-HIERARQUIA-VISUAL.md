# Paralaxe — auditoria e refatoração de hierarquia visual

> Escopo: apresentação e interação da versão 0.1. Branch: `develop`. Nenhum estado persistido ou regra de domínio deve ser modificado.

## Critérios adotados

- **Essencial**: objetivo, estado e ação que o jogador precisa reconhecer imediatamente.
- **Contextual**: dados de avaliação e progressão que complementam uma decisão.
- **Avançado**: custos detalhados, cálculos, registros e comparações consultados ocasionalmente.
- **Redundante**: texto ou decoração repetidos sem acrescentar contexto.

A direção visual segue **revelação progressiva**, **hierarquia**, **proximidade/agrupamento** e **interface contextual de jogo**. A ação principal deve continuar visível; não se criam níveis adicionais de navegação sem propósito. A tipografia medieval Antiquity Print permanece nos títulos de tela e nos elementos narrativos, enquanto números e controles frequentes usam tipografia de leitura.

## Diagnóstico por sistema e decisões aplicadas

| Área | Antes: ruído visual principal | Essencial, visível de imediato | Contextual ou avançado | Modificação | Funcionalidade preservada |
| --- | --- | --- | --- | --- | --- |
| Navegação global | Recursos exibidos em caixas fortes, duas barras fixas e apresentação decorativa repetida | Destino, recursos e atividade em curso | Jornada completa e bolsa em acesso rápido | Contornos suavizados, barra de navegação com sombra discreta e resumo de Jornada compacto | Navegação e ações rápidas |
| Ofícios | Títulos e cartões de receita competiam com a cena, materiais e comparação sempre abertos | Ofício, progresso, receita e ação de coletar/fabricar | Materiais e comparação em `details` por receita | Cenas existentes e seletor premium preservados; cartões discretos e detalhes recolhíveis | Produção, coleta, prestígio, acompanhamento de meta e trabalho em segundo plano |
| Personagem | Atributos dispostos em uma grade de pequenos cartões com bordas | Nome, nível, pontos e controles | Histórico e prestígio | Linhas de atributos sem contorno individual, cabeçalhos de cartões em fonte de leitura | Distribuição, equipamentos, técnicas e prestígio |
| Inventário | Slots vazios tão contrastantes quanto itens; texto da inspeção em bloco forte | Itens, quantidades e equipamento selecionado | Inspeção contextual, filtragem | Slots vazios atenuados e inspeção com superfície neutra | Filtros, inspeção, equipar e limite de capacidade |
| Combate | Valores dos recursos dentro de caixas repetidas e cartões com sombras concorrentes | Vida, ameaça, progresso, decisões e alertas | Log já consultável por comando próprio | Linhas de dados sem bordas individuais; cartão de inimigo mantém distinção de risco | Técnicas, consumíveis, combate automático e resultado |
| Masmorras | Cada métrica de recurso e escolha narrativa com contorno | Sala, encontros, consequências e escolhas | Histórico de percurso e informações complementares | Recursos com divisórias sutis e escolhas narrativas com faixa discreta | Expedição, preparação, recompensas e decisões |
| Mercado | Cada oferta apresentava título de seção repetido e cartões destacados demais | Nome do item, preço, disponibilidade e compra | Descrições e condições | Removida etiqueta repetida, superfícies suavizadas | Compra, saldo e validação de capacidade |
| Banco | Linhas, cartões e informações de capacidade todos destacados | Estoque, quantidade e depositar/retirar | Detalhes da capacidade | Lista com separação sutil e menos sombras | Depósitos e retiradas |
| Jornada | Objetivo repetido no resumo e no modal; cabeçalhos medievais para detalhes extensos | Próximo objetivo, progresso e atalhos | Ingredientes, registros e escolha de meta | Removido bloco duplicado de objetivo no diálogo; corpo em fonte de leitura | Escolher, trocar, dispensar e concluir metas |
| Cidade Viva | Projetos expunham requisitos, materiais, barras, custos e ações simultaneamente | Nome, situação, descrição e ação de restaurar | Requisitos e materiais no painel expansível | Cartões discretos e `details` para consulta de custos | Progresso, filtros, consumo, confirmação e reconstrução |

## Padrões de implementação

1. `Card` aceita `appearance="default" | "soft" | "plain"`. Aplicar `soft` em coleções de cartões secundários e `plain` apenas quando um grupo já estiver visualmente delimitado.
2. `details` nativo exibe custos e comparações quando o jogador solicita. Informações de indisponibilidade, ações e alertas permanecem fora do painel recolhido.
3. Contrastes, bordas, espaçamentos e tamanhos utilizam tokens da folha `styles/tokens.css`.
4. A fonte Antiquity Print continua carregada localmente. Estilos de cartões informativos usam a fonte de leitura, sem modificar os títulos narrativos principais.
5. Nenhuma alteração deve remover estados de foco, `aria-label`, `aria-busy`, estados desabilitados ou contraste semântico dos alertas.

## Verificação

A automação `Validar versão 0.1` na branch `develop` executa:
- verificação arquitetural de tokens e componentes;
- `oxlint`, TypeScript e testes de domínio/interface;
- conferência do catálogo de créditos e das versões derivadas de GIFs;
- build do Vite.

**Limitação:** o CI automatizado não substitui navegação e inspeção visual real. Permanecem pendentes testes manuais de viewport 320, 375, 768, 1024, 1440 e 1920 px e zoom 125%/150%, com foco em seletor de ofícios, requisitos dos projetos, barras fixas e comparação de equipamentos.

## Critérios de aceitação na revisão visual

- Cabeçalhos decorativos devem identificar uma seção, não repetir o nome de cada item.
- Uma ação principal deve ser reconhecível sem precisar expandir detalhes.
- Indicadores de risco, falta de materiais e progresso devem aparecer sem depender exclusivamente de cor.
- Superfícies aninhadas não devem adicionar uma nova borda e sombra a cada nível.
- Detalhes expansíveis devem ser acessíveis por teclado e oferecer rótulo que explique seu conteúdo.
- Todas as receitas, projetos, filtros e atalhos continuam acessíveis; a lógica e os saves permanecem intactos.
