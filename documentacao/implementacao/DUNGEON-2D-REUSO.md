# Dún Liath: cena 2D e reaproveitamento de código

Implementação em 8/11/2026. A cena substitui o espaço reservado de arte da sala ativa. O jogador vê seu aventureiro, o encontro ou ponto de exploração e a sala concluída. Os desenhos SVG são representações esquemáticas próprias, não sprites extraídos de For the King. O combate continua sendo a simulação existente; não há combate tático por turnos nem equipe de três personagens nesta entrega.

## Primeira versão em SVG

### Código copiado

| Origem e versão auditada | Trecho utilizado | Adaptação |
|---|---|---|
| JohnVonDrashek/dungeon-crawler-now, c64ee3c6247eafd9f0efa09403b111a6925232c7 | src/systems/DungeonGenerator.ts | Arquivo copiado para fonte/terceiros; configuração da quantidade de salas, dimensões validadas, tipos compatíveis com TypeScript estrito, reinicialização determinística e embaralhamento Fisher–Yates. |
| Mesmo projeto | Estados UNVISITED, ACTIVE, CLEARED de src/systems/RoomManager.ts | Constantes extraídas e estado derivado da expedição; gerenciamento Phaser não importado. |
| itajaja/hb, fe97718def25736a4000e93efca6894530ba0c86 | src/ui/stageView/iso.ts | Fórmulas projectHex e hexCorner, constantes e vértices; tipos estruturais substituem dependências antigas. |

Ambos têm licença MIT, que permite distribuição comercial com preservação dos avisos. As licenças integrais estão junto ao código e em publico/creditos; o catálogo de créditos do jogo inclui os dois projetos. Nenhum asset desses repositórios foi incorporado. Outros motores pesquisados não são dependências desta implementação.

### Fluxo e responsabilidades

O domínio continua proprietário das conexões, encontros, recompensas, recursos, decisões narrativas e extração. visualizacaoDaMasmorra.ts utiliza a semente persistida para gerar posições estáveis para as salas existentes. Os corredores e tipos de sala do gerador importado não substituem os do Paralaxe. A interface revela apenas salas visitadas e saídas da sala atual; saídas não exploradas não exibem nomes. A navegação ocorre pelos botões existentes, respeitando resolução e restrições do domínio. Recarregar reconstitui a mesma geometria sem novo campo de save.

CenaDaMasmorra usa projeção hexagonal para o piso e um mapa expansível para reduzir ruído visual. Legendas e descrição SVG dão contexto sem depender só da cor. Não há animação automática nem novas bibliotecas de renderização.

### Verificação

Testes verificam 100 sementes, cobertura de todas as salas, posições distintas, limites, determinismo, repetição do gerador, domínio imutável, revelação parcial e validação de dimensões. Executar pnpm verificar e pnpm compilar. Para inspeção manual: iniciar uma expedição, resolver sala, escolher saída, abrir mapa, recarregar e testar extração. O gerador é apenas visual: não transforma a dungeon existente numa cópia completa de For the King.

## Revisão da cena original

A cena esquemática em SVG foi substituída pela renderização Phaser. O mapa explorado continua separado e as ações de combate e de rota são executadas pelo domínio do Paralaxe.

| Origem | Código reaproveitado | Situação |
|---|---|---|
| Dungeon Crawler Now, c64ee3c6247eafd9f0efa09403b111a6925232c7, MIT | Métodos de src/systems/AssetGenerator.ts para aventureiro, piso, paredes, inimigos e objetos. Ramo de tiles simples de src/scenes/game/GameSceneInit.ts. | Ativo. Os comandos que desenham as texturas são os originais. O laço de tiles usa os limites da sala atual. |
| Hexa Battle, fe97718def25736a4000e93efca6894530ba0c86, MIT | Projeção de src/ui/stageView/iso.ts da primeira cena. Cópias de src/ui/stageView/store.ts e src/engine/actions/action.ts para estudar a seleção de ações. | Referência em fonte/terceiros e documentacao/terceiros/hexa-battle. |
| ROT.js, 46782e248c2db9d379a5e4f13bb8323f18dff04b, BSD-3-Clause | src/rng.ts com cabeçalho de Alea e licença do repositório. | Cópia para referência em documentacao/terceiros/rot.js. |

O novo palco gera texturas com o código upstream e o motor Phaser. Phaser e EventEmitter3 são distribuídos com seus avisos MIT em publico/creditos. As escolhas de rota e eventos continuam usando a implementação existente.
