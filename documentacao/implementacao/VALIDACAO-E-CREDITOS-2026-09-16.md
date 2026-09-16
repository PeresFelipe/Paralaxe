# Validação e revisão de créditos — 16/09/2026

Revisão sobre a `main` publicada em `61013b7b86f4ab690ec47b0182d579806a536109`.

## Resultado das verificações locais

| Verificação | Resultado |
| --- | --- |
| TypeScript e análise de código | Aprovados no jogo e nos quatro pacotes |
| Testes de domínio | 50 aprovados |
| Testes de conteúdo | 35 aprovados |
| Testes de persistência | 14 aprovados |
| Compilação de produção | Aprovada, incluindo geração do service worker |
| Inventário de atribuições | 95 recursos visuais, 9 contribuições e 11 avisos locais |
| Distribuição dos avisos | Os 11 avisos existem na saída compilada e constam do manifesto de cache |
| Documentação | Links locais de README e CREDITOS conferidos |

As verificações locais usaram diretamente os executáveis instalados de TypeScript, Oxlint, Vitest e Vite, equivalentes às etapas dos scripts dos pacotes. O verificador de créditos foi executado com `node ferramentas/verificarCreditos.mjs`. A automação do repositório executa `pnpm verificar` e `pnpm compilar` ao publicar na `main`.

## Fluxos exercitados na compilação atual

Em DOM e IndexedDB simulados: criação de personagem; navegação; início, continuidade e parada da coleta; inventário e filtros; escolha de meta; coleta → fabricação → equipamento; recarga da partida; recompensa sem conexão sem duplicação; lembrança da escolha narrativa.

Nos créditos: abertura na criação e durante a partida; acionadores das disposições ampla e compacta; nove contribuições; nomes e descrições acessíveis; fechamento pelo botão, evento de cancelamento e clique externo; retorno do foco; consulta das licenças de software; continuidade da coleta durante a consulta. Não foram registrados erros de console nesses fluxos.

O verificador também foi exercitado em uma cópia temporária: recusou um recurso visual sem registro e um aviso ausente.

## Alterações entregues

- Janela de créditos com agrupamento por contribuição, autor, licença, origem e adaptações.
- Catálogo único consumido pela interface e pelo verificador de recursos públicos.
- Registros locais para personagens, interface e produção visual do projeto; avisos das bibliotecas distribuídas ao navegador.
- Aviso original do pacote Shikashi v2 preservado byte a byte. Licenças originais do Guerreiro e Dark Ages UI e aviso da fonte mantidos.
- Avisos incluídos no cache de produção, inclusive a licença do Guerreiro que antes não era coberta pelos padrões de arquivos de texto.
- Documentação de atribuições em [CREDITOS.md](../../CREDITOS.md) e instruções para acrescentar recursos.

## Limites e pendências

O navegador deste ambiente bloqueou a prévia local com `ERR_BLOCKED_BY_CLIENT`. Não foi possível validar aparência, medidas, navegação nativa com Tab, leitor de tela ou funcionamento real do cache sem conexão. A presença dos avisos no manifesto de cache foi conferida; isso não substitui o teste de instalação e uso sem conexão em navegador.

O pacote Shikashi cita desenhos-base de game-icons.net, mas não fornece o vínculo entre os recortes usados e os autores individuais. Essa atribuição permanece pendente conforme [CREDITOS.md](../../CREDITOS.md#desenhos-base-do-game-iconsnet). Os nomes não foram presumidos. A verificação automatizada comprova cobertura e consistência do catálogo, sem certificar autoria ou licença.

Os resultados acima não garantem ausência de todos os defeitos; delimitam os componentes, fluxos e artefatos verificados nesta revisão.
