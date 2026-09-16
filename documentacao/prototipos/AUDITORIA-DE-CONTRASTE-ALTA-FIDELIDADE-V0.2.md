# Auditoria de contraste — Alta fidelidade v0.2

Esta checagem usa a paleta-base da Direção Visual 0.1 e as superfícies do protótipo hi-fi v0.2.

Ela não substitui testes de acessibilidade completos, mas identifica usos inseguros antes do teste com jogadores.

## Contrastes aproximados

Sobre `#171C1F` (superfície principal):

| Token | Cor | Contraste aproximado |
|---|---:|---:|
| Texto principal | `#E5E1D8` | 13.17:1 |
| Texto secundário | `#A9AAA5` | 7.35:1 |
| Bronze envelhecido | `#A98555` | 5.05:1 |
| Mana / azul frio | `#718C95` | 4.82:1 |
| Verde dessaturado | `#788A72` | 4.64:1 |
| Âmbar | `#B99255` | 5.98:1 |
| Carmesim-base | `#9E5550` | 3.17:1 |

Outros usos relevantes no protótipo:

| Uso | Cor | Contraste aproximado sobre `#171C1F` |
|---|---:|---:|
| Texto de perigo claro | `#D0A09B` | 7.51:1 |
| Aviso de ataque secundário | `#C98983` | 6.05:1 |
| Símbolo de Vida | `#B57A75` | 4.91:1 |

## Conclusão

A base escura suporta bem o texto principal e secundário e os principais acentos de interface.

O token carmesim `#9E5550` **não deve ser usado como texto pequeno normal** sobre superfícies escuras. Ele funciona melhor como:

- borda;
- preenchimento translúcido;
- indicador gráfico;
- elemento grande/decorativo;
- base semântica a partir da qual se deriva um tom textual mais claro.

Para texto de perigo, o protótipo já usa tons mais claros como `#D0A09B` e `#C98983`.

## Regra para o protótipo

> **Cor semântica e cor de texto não precisam ser o mesmo valor. O papel semântico pode manter o carmesim-base enquanto o texto correspondente usa uma variante que preserve contraste.**

Essa regra também vale para futuros tokens de raridade, situação e facções: identidade cromática não justifica texto ilegível.

## Pendências reais

- testar contraste sobre artes reais 16:9;
- avaliar estados de hover/focus/disabled;
- verificar escala de texto em celular;
- testar daltonismo e diferenciação redundante com iconografia final;
- validar componentes reais quando a Fase 3 começar.
