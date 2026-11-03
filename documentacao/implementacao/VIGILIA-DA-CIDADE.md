# Vigília da Cidade — foco e reconstrução (versão inicial)

Implementação planejada para a branch `codex/codice-desafios-prestigio`, após o pacote de Códice/Desafios/Prestígio e sem alterar o balanceamento do RPG.

## Propósito

A cada sessão de concentração concluída, o jogador recebe **Brasas da Vigília** para restaurar distritos da Cidade Livre. É um sistema optativo: não bloqueia combate, exploração, fabricação, coleta, Códice, Desafios nem Prestígio.

## Regras

- Duração: 10–120 min em minutos inteiros; atalhos 15, 25, 45 e 60 min.
- Conclusão após o horário esperado, mediante confirmação explícita: `floor(duracaoMinutos / 5)` Brasas.
- Cancelamento: nenhuma Brasa, mas registro no histórico.
- Uma sessão por partida; as transições são identificadas por ID para evitar pagamento duplicado.
- Horários ISO ficam no save; o intervalo visual de um segundo não participa do cálculo da recompensa.
- Após fechar ou recarregar, a sessão continua persistida. Conclusões atrasadas não são creditadas automaticamente.
- Histórico com os últimos 120 registros e contadores permanentes de sessões/minutos/total de Brasas.
- Não há penalidade aplicada ao RPG por abandonar uma Vigília.
- Aplicativo totalmente offline não pode demonstrar se o jogador realmente se concentrou; manipulações de relógio não podem ser completamente prevenidas.

## Cidade

Oito distritos tipados: Praça, Taverna, Ferreiro, Mercado, Armazém, Relicário, Biblioteca e Muralhas. Cada distrito possui nível 0–4, com até quatro investimentos. Custos e textos pertencem ao pacote `conteudo`.

A soma dos níveis dos distritos determina o estágio global:

| Estágio | Nome | Melhorias necessárias |
|---|---|---:|
| 0 | Cinzas da Fundação | 0 |
| 1 | Primeiras Chamas | 3 |
| 2 | Vila Desperta | 8 |
| 3 | Bastião da Esperança | 15 |
| 4 | Cidade Reerguida | 24 |

As melhorias são visuais e narrativas nesta etapa. Não concedem bônus de ouro, XP, dano, inventário ou crafting.

## Estrutura técnica

- `pacotes/dominio/fonte/vigiliaDaCidade.ts`: estado, validações, sessões, recompensas, estágios e compras (funções puras).
- `pacotes/conteudo/fonte/cidadeEvolutiva.ts`: catálogo de distritos, custos, textos e manifesto de assets.
- `aplicativos/jogo/fonte/hooks/useAplicativoDaPartida.ts`: aplica intenções na fila da partida, nunca via snapshots enviados pelas telas; a compra no Mercado também passa a usar comandos com o estado mais recente.
- `aplicativos/jogo/fonte/features/cidade/VigiliaDaCidade/`: cena vetorial, tela de sessão, resumo, melhorias e CSS Module.
- `pacotes/persistencia/fonte/repositorioDePartidasIndexedDb.ts`: migração do esquema 11 para 12 e estado inicial vazio para versões ainda mais antigas.

## Manifesto gráfico

O componente mantém uma cena SVG própria e leve até a arte final estar disponível. Os recursos finais serão ativados por `CENAS_DA_CIDADE` em `pacotes/conteudo/fonte/cidadeEvolutiva.ts`.

- Cenas completas em proporção 16:9: `/arte/cidade/cidade-estagio-0.webp` até `/arte/cidade/cidade-estagio-4.webp`.
- Camadas com transparência: `/arte/cidade/camadas/<id-do-distrito>.webp`.
- Camadas devem compartilhar enquadramento e tamanho da arte-base.
- `disponivel: false` impede requisições de arquivos ausentes. Ativar uma camada apenas depois de conferir a existência e a licença de uso do arquivo.
- O manifesto, o PWA e o catálogo de créditos precisam ser atualizados ao distribuir os assets definitivos.

## Compatibilidade e confiabilidade

O esquema passa de 11 para 12, sem alterar o nome do banco `greywake`, o object store `saves` ou sua chave `saveId`. Ao migrar, não se inventam sessões históricas. O conteúdo da partida e as informações da Jornada, Códice, Desafios e Prestígio são mantidos.

A fila de comandos protege **uma única instância da aplicação**. O IndexedDB atual não implementa bloqueio transacional entre múltiplas abas para o agregado inteiro. Jogar duas abas com a mesma partida simultaneamente pode produzir conflitos; isso precisa de trabalho e testes adicionais antes de anunciar suporte multitab.

A migração é progressiva. Saves já regravados em esquema 12 não são garantidamente legíveis por versões anteriores do app. Recomenda-se fazer cópia de segurança antes de voltar à versão 11.

## Validação necessária no clone real

1. `pnpm verificar` (análise arquitetural, tipos, testes e créditos).
2. `pnpm compilar` (geração PWA).
3. Navegador: iniciar, interromper, recarregar, fechar e retomar sessões; conferir concessão única de Brasas.
4. Migração: testes com partidas 10 e 11, incluindo expedições ativas, equipamentos, Códice e Desafios.
5. Gameplay: trabalhar Idle, comprar no Mercado e realizar melhorias da Cidade rapidamente, comparando saves antes e depois.
6. Experiência: navegador desktop e mobile, teclado, redução de movimento e funcionamento offline via HTTPS.
7. Performance: medir renderizações do cronômetro e gravações IndexedDB, sem presumir ganhos de hardware.

Ainda não foram executadas verificações completas de `pnpm` contra a árvore privada do projeto neste ambiente de preparação da entrega.
