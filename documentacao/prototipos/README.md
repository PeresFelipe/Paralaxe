# Protótipos de UX — Greywake

Esta pasta contém protótipos isolados usados durante o **M5.5 — Fundamentos de UX**.

Eles não fazem parte do execução do jogo e não devem ser tratados como implementação de produção. O objetivo é validar composição, hierarquia, densidade, responsividade e a Direção Visual 0.1 antes da migração dos workbenches.

## Candidato atual para teste com jogadores

### `greywake-fluxo-alta-fidelidade-v0.2.html`

É o fluxo hi-fi navegável atual e substitui o v0.1 como referência de teste.

Inclui:

```text
Mineração
↓
Produção
↓
Personagem
↓
Cidade / Taverna
↓
Aventura
↓
Preparação
↓
Combate
↓
Masmorra
↓
Retorno sem conexão
```

O protótipo contém um seletor marcado `PROTÓTIPO` apenas para posicionar o avaliador nas telas. Ele não pertence à Interface de produção.

A v0.2 adiciona interações suficientes para testar diretamente:

- troca Cloch → Stán com consequência explícita;
- substituição de Mineração por Metalurgia;
- atualização da atividade automática global;
- Jornada como folha;
- Inventário rápido como folha e acesso ao Inventário completo;
- abas de Personagem e prioridade das Técnicas;
- Cidade → Taverna → contrato;
- Preparação com navegação reduzida e Ocioso ainda ativo;
- Combate com aviso de ataque e explicação de Técnica não utilizada;
- Masmorra com sala, Bolsa e rotas;
- retorno sem conexão como reconciliação de estado;
- adaptação responsiva para celular.

## Documentos de validação

- `AUDITORIA-ALTA-FIDELIDADE-V0.1.md` — revisão heurística que identificou inconsistências claras antes do teste com jogadores;
- `PRONTIDAO-ALTA-FIDELIDADE-V0.2.md` — lista de verificação de testabilidade dos 12 cenários;
- `TESTE-COM-JOGADORES-ALTA-FIDELIDADE-V0.2.md` — roteiro atual para observação com jogadores.

O `TESTE-COM-JOGADORES-ALTA-FIDELIDADE-V0.1.md` é preservado como histórico da primeira rodada de definição do teste.

## Protótipos anteriores

### `mineracao-alta-fidelidade-v0.1.html`

Primeiro estudo focado em **Atividades → Mineração**, usado para estabelecer a linguagem visual inicial.

### `greywake-fluxo-alta-fidelidade-v0.1.html`

Primeira derivação navegável das telas principais. Foi preservada para comparação, mas não é mais o candidato principal de teste com jogadores.

## Referência inicial visual aplicada

Os protótipos partem da Direção Visual 0.1 registrada no `documentacao/UX-GDD.md`:

- fundo profundo `#101315`;
- superfície `#171C1F`;
- superfície elevada `#20262A`;
- texto principal `#E5E1D8`;
- texto secundário `#A9AAA5`;
- bronze envelhecido `#A98555` como acento principal;
- função display inspirada em Spectral/serif;
- função operacional inspirada em Inter/sans;
- cantos discretos;
- ornamentação contida;
- informação crítica nunca dependente apenas de cor.

As fontes concretas não são incorporadas aos protótipos; são usados fallbacks locais para manter os arquivos autocontidos. A decisão final de famílias tipográficas continua dependente de avaliação visual.

## O que o hi-fi ainda não valida sozinho

- arte final;
- iconografia final;
- animações e áudio finais;
- conteúdo/balanceamento definitivo;
- persistência real;
- integração com estado real do jogo;
- acessibilidade de produção completa;
- compreensão real por jogadores.

A última linha é importante: uma revisão heurística pode remover contradições, mas não comprova modelo mental.

## Estado desta etapa

```text
Direção Visual 0.1                  ✅
Wireframes conceituais              ✅
Hi-Fi navegável v0.2                ✅ pronto para teste
Auditoria heurística                ✅
Teste com jogadores com jogadores              ⏳
Refinamento pós-playtest            ⏳
Fase 3 — implementação              ⏳
```

A Fase 3 não deve começar como migração completa enquanto existirem problemas bloqueadores de UX não avaliados nos temas críticos definidos em `TESTE-COM-JOGADORES-ALTA-FIDELIDADE-V0.2.md`.
