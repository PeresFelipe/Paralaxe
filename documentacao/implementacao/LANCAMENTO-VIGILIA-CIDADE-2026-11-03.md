# Vigília da Cidade — entrega em branch (03/11/2026)

Base: `codex/codice-desafios-prestigio` (`2fa0886e`), sem merge na `main`.

## Conteúdo

- Cronômetro de foco 15/25/45/60 min e personalizado, com sessão persistida e conclusão explícita.
- Brasas da Vigília (`⌊minutos/5⌋`) e reconstrução de oito distritos em cinco estágios.
- Migração de save 11 → 12, preservando conteúdo existente.
- Interface SVG de fallback e cinco cenas WebP 1600×900, com alternativas móveis 960×540.
- Arte complementar da cidade registrada em `catalogoDeCreditos.json`, com referências em `documentacao/arte-cidade/`.
- Mercado atualizado para operar sobre o estado mais recente da partida na fila de saves.

## Conferências necessárias antes de unir à main

1. Executar `pnpm verificar` e `pnpm compilar` em clone completo com dependências instaladas.
2. Testar saves 10 e 11 de cópias; o esquema 12 não deve ser aberto por versão anterior do jogo.
3. Testar sessões e suas recompensas, recarregamento, concorrência, compras e trabalho Idle.
4. Conferir funcionamento offline da aplicação web instalável, teclado e responsividade.
5. Os recortes de distritos são apenas estudos artísticos, não overlays alinhados; permanecem desativados.
6. As cenas foram geradas individualmente e podem apresentar variações ao trocar estágio.
7. O bloqueio de ações entre abas diferentes não está resolvido; a fila serializa somente operações na mesma instância.

Não há envio automático para produção. É uma branch de desenvolvimento para revisão e validação.
