# Auditoria heurística — Hi-Fi v0.1

Esta auditoria registra uma revisão estática/heurística do protótipo `greywake-hifi-flow-v0.1.html` contra o `docs/UX-GDD.md` e o roteiro `PLAYTEST-HIFI-V0.1.md`.

> Esta revisão **não substitui playtest com jogadores**. Ela serve apenas para remover inconsistências claras antes de expor o protótipo a participantes.

## Resultado

A arquitetura visual geral sobreviveu à revisão. Foram identificados quatro problemas claros a corrigir antes do playtest e alguns refinamentos menores.

## P1 — Recursos vitais desapareciam no mobile

**Severidade:** alta

Na largura reduzida, a regra CSS do v0.1 escondia Mana e Stamina, apesar de o UX-GDD exigir Vida, Mana e Stamina globalmente visíveis no shell seguro.

**Correção v0.2:** manter os três recursos vitais visíveis em viewport estreito; moeda pode perder destaque antes deles.

## P2 — Vida/Mana/Stamina dependiam demais de cor

**Severidade:** alta

Os três recursos usavam a mesma forma geométrica e principalmente mudança de cor para diferenciação.

Isso conflita com a regra de sinais redundantes e com a exigência de não depender exclusivamente de cor.

**Correção v0.2:** combinar símbolo/texto curto + valor + cor. A forma visual não é a única pista.

## P3 — Inventário rápido não podia ser testado

**Severidade:** média

O shell apresentava `Inventário`, mas o controle não abria uma superfície real no fluxo hi-fi.

Isso impedia validar a distinção:

```text
consulta rápida
≠
gestão completa
```

**Correção v0.2:** adicionar sheet funcional de Inventário rápido, preservando contexto.

## P4 — Troca de atividade não estava funcional

**Severidade:** alta para playtest

O cenário de teste Cloch → Stán exigia inferir um comportamento que o protótipo ainda não permitia executar.

**Correção v0.2:** recurso disponível pode ser selecionado; a tela mostra explicitamente que a atividade atual será substituída; a confirmação atualiza o indicador global do protótipo.

## Refinamentos adicionais v0.2

- recursos bloqueados usam texto/símbolo de bloqueio além de estilo visual;
- `aria-label`, `aria-live`, foco visível e Escape em sheets são adicionados onde cabível;
- `prefers-reduced-motion` remove transições não essenciais;
- Preparação mantém navegação e atividade Idle visíveis, porém reduzidas;
- Combate e Dungeon recolhem navegação global e indicador Idle;
- Retorno offline permanece em foco temporário, sem parecer tela segura comum;
- a barra inferior segura no mobile preserva relação clara com a navegação principal;
- controles de protótipo são explicitamente separados da UI ficcional.

## O que continua dependendo de playtest

A auditoria não determina:

- se o bronze possui peso visual correto;
- se a arte 16:9 ocupa espaço demais ou de menos;
- se a repetição da atividade atual é útil ou redundante;
- se Jornada é encontrada naturalmente;
- se o telegraph ganha atenção cedo o suficiente;
- se a Bolsa de Expedição é percebida como risco real;
- se o shell parece Dark Fantasy suficiente sem arte final;
- se a densidade de Personagem/Técnicas funciona para jogadores novos;
- se a hierarquia mobile é compreendida sem explicação.

Esses pontos permanecem perguntas de observação no playtest.
