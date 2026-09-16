# Experimento de disposição compacto — Versão 0.1

## Objetivo

Este passe testa uma leitura mais enxuta para as superfícies operacionais da Versão 0.1. A referência de interação é a densidade de jogos Ocioso como Idle Iktah: navegação persistente, ambiente reconhecível em uma área contida e dados próximos da decisão.

O experimento preserva a arquitetura do UX-GDD: os quatro destinos continuam sendo `Personagem`, `Atividades`, `Aventura` e `Cidade`; `Jornada` e `Inventário` continuam como camadas rápidas; Combate e Masmorra continuam estados próprios.

## O que mudou

- títulos, cabeçalho, navegação e rodapé de continuidade ocupam menos altura;
- painéis operacionais usam padding e sombras menores, com leitura por grupos;
- o progresso Ocioso fica em uma única superfície contínua, sem o cartão externo duplicar a moldura;
- as sete Profissões continuam agrupadas em Coleta e Produção, agora numa trilho vertical que libera altura para o trabalho atual;
- a arte de Profissão mantém 16:9, com largura de até 300 px na composição computador, ao lado do trabalho atual;
- opções de coleta e receitas aparecem em linhas verticais; o celular usa um seletor nativo para consultar as sete habilidades;
- arte de Cidade e Aventura mantém 16:9, mas deixa de funcionar como banner dominante;
- Cidade e Aventura passam a colocar a cena ao lado das opções, reduzindo a altura total dos hubs;
- retratos e cartões de equipamento reduzem escala sem retirar contexto, valores ou ações;
- o modo celular reorganiza as colunas e mantém alvos de toque e navegação inferior;
- a criação de partida usa um identificador alternativo quando o navegador não expõe `crypto.randomUUID`, permitindo validar a versão em ambientes web mais antigos.

A compactação é seletiva: superfícies frequentes e operacionais ficam densas, enquanto Taverna, cenas de risco e estados narrativos continuam com espaço suficiente para leitura e atmosfera.

## Reversão

O disposição anterior foi preservado antes deste experimento na ramificação:

```text
backup/layout-0.1-740e1c5
```

O estilo compacto fica em `aplicativos/jogo/fonte/disposicao-compacta.css`, importado por último em `principal.tsx`, mas a estrutura dos componentes também evoluiu. Para restaurar uma versão inteira, use a branch/commit correspondente; remover apenas o import não restaura o disposição anterior. A versão imediatamente anterior ao passe de usabilidade web está em `backup/web-usability-453dbba` (`453dbba1d67c095edf28d8640e5ff77b78749d5b`).

## Verificação qualitativa

No preview da Versão 0.1 foram conferidos:

- criação e carregamento de personagem;
- Personagem com retrato, fatos e progressão;
- Atividades com as sete Profissões, seleção de Pesca e arte GIF/alternativa;
- início de Pesca, progresso de ciclo e continuidade no rodapé;
- navegação segura até Aventura e Cidade;
- camada rápida de Inventário;
- ausência de overflow horizontal no área visível computador de 1363 px.

Na composição vertical da tela de Atividades, o área visível computador de 1363 × 936 px apresentou 18 px de rolagem total para Pesca, com a arte 16:9, progresso de Profissão e ação do recurso no mesmo fluxo visível.

Também foram executados o compilação de produção e o análise estática do workspace.

## Revisão de usabilidade web

A pesquisa e os critérios técnicos estão em [USABILIDADE-DE-JOGO-WEB-2026-09.md](../pesquisa/USABILIDADE-DE-JOGO-WEB-2026-09.md). A revisão aumenta a leitura dos textos pequenos, mantém alvos de 44 px nas ações principais, separa mensagens de comando de resultados recorrentes e expõe a origem de materiais faltantes. A compactação passa a depender principalmente da estrutura, mantendo a identidade visual.
