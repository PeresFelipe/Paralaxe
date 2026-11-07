# Auditoria dos assets da seleção de personagens

Data da revisão: 07/11/2026  
Repositório: [PeresFelipe/Paralaxe](https://github.com/PeresFelipe/Paralaxe), branch `develop`  
Commit auditado: `20a7f937ec99e5a0c9e8eaa2b1ff7050a43a5782`

## Escopo e método

A auditoria leu o GDD e o UX-GDD, a documentação de arquitetura e conformidade, o fluxo de criação em `Aplicativo.tsx`, os dados das classes, os estilos de seleção e o catálogo e avisos de créditos. A criação atual tem cinco etapas e oferece Guerreiro, Mago e Caçador. A classe é apresentada como início da partida; nenhuma regra de classe, save ou progressão foi alterada.

As permissões foram verificadas nas páginas originais do itch.io e comparadas aos arquivos locais. O material de terceiros permanece embutido no projeto/jogo; nenhum pacote de recursos foi republicado isoladamente. Para os candidatos pagos não foi iniciado download e os arquivos internos de licença ainda precisam ser conferidos após aquisição.

## Classes e recursos existentes

| Classe | Recurso, autoria e origem | Arquivos e dimensões observados | Animações descritas pelo autor | Decisão |
| --- | --- | --- | --- | --- |
| Guerreiro | **FREE - Knight 2D Pixel Art**, Mattz Art — [itch.io](https://xzany.itch.io/free-knight-2d-pixel-art) | GIF de seleção 96 × 84 px, 3.390 bytes; folhas PNG com contorno e sem contorno. | Idle (3 quadros), Walk, Run, Jump, Defend, Hurt, Death e três ataques; dez animações no pacote. | Manter. A licença permite uso em jogos pessoais e comerciais e modificações; proíbe revenda ou redistribuição como asset isolado. |
| Mago | **Wizard Pack**, LuizMelo — [itch.io](https://luizmelo.itch.io/wizard-pack) | GIF de seleção 231 × 190 px, 8.388 bytes; folhas PNG para oito animações. | Idle (4), Run (8), Jump (2), Fall (2), Attack1 (8), Attack2 (8), Hit (4) e Death (7). | Manter. A página declara CC0 1.0 e uso comercial. O crédito do jogo identifica que é atribuição voluntária, não exigência da licença. |
| Caçador | **Free Medieval NPC's: Witch And Swordswoman — Joanna Idle**, Otsoga — [itch.io](https://otsoga.itch.io/free-medieval-npcs-witch-and-swordswoman) | PNG 448 × 64 px, 2.843 bytes: sete células de 64 × 64, com seis quadros da animação e repetição do primeiro para fechar o loop. | Idle (6 quadros) no pacote gratuito. Animações adicionais são recursos separados e não são necessárias para a escolha inicial. | Manter a animação Idle. O autor permite projetos pessoais/comerciais e modificações; veda revenda. O arquivo local também registra a vedação de redistribuição. A arte é usada integrada à tela do jogo, sem oferta como asset avulso. |

As folhas de personagem têm escala e paleta próprias, mas compartilham pixel art de fantasia em vista lateral e são legíveis nos cartões. O Guerreiro e o Mago têm várias animações de jogo; o Caçador oferece apenas Idle neste pacote, o que é suficiente para a função atual de retrato animado durante a seleção. Não foi encontrada uma falta funcional de animação que justificasse adquirir um pacote adicional.

## Seleção de personagens e responsividade

Os cartões já são botões com `aria-pressed`, texto de nome e resumo, estados visíveis de foco, hover e seleção. A grade reduz para uma coluna em telas de até 720 px; abaixo de 30 rem o retrato ganha 100 px. A animação do Caçador usa spritesheet CSS com pixels preservados e respeita `prefers-reduced-motion`.

A correção nesta revisão adiciona `object-fit: contain` e `image-rendering: pixelated` às imagens GIF de Guerreiro e Mago. Isso conserva as proporções distintas (96 × 84 e 231 × 190) dentro dos quadros quadrados da interface, sem alterar as animações ou a lógica. Os cartões continuam com área fixa, para que a arte não desloque o texto nem os controles.

A validação visual real em 320, 375, 768, 1024 e 1440 px e nos dois temas não pôde ser executada neste ambiente: o checkout do repositório privado não está montado e a tentativa de clone HTTPS não obteve credenciais. Há evidências históricas desktop em `documentacao/implementacao/evidencias-ux/`, mas elas não validam esta alteração.

## Pesquisa de alternativas no itch.io

A página [Game assets tagged Idle](https://itch.io/game-assets/tag-idle) foi usada como ponto de partida e a pesquisa foi ampliada para RPG, dark fantasy, pixel art e sprites animados.

| Candidato consultado | Evidência publicada na página | Resultado |
| --- | --- | --- |
| **Dark Fantasy Heroes Vol. 1**, NightCat Works — [itch.io](https://nightcatworks.itch.io/dark-fantasy-heroes-vol-1) | US$ 9,99; sete personagens do mesmo estilo, incluindo Arcane Mage, Iron Knight e Moon Huntress; nove animações por personagem, 336 quadros no total, PNG, folhas, JSON e GIF; quadros de 210 × 180 px. A página autoriza uso e modificação comercial, pede crédito opcional e proíbe revenda/redistribuição dos arquivos isolados. | Melhor candidato consultado para unificar as três silhuetas, sujeito à compra e à revisão do `LICENSE.txt` e do aviso de uso de IA dentro do pacote. Não adquirido nem integrado. |
| **Dark Fantasy HD: Knights & Heroes**, Leckie Pixel Studio — [itch.io](https://leckie1989.itch.io/dark-fantasy-hd-knights-heroes) | US$ 7,99; oito personagens de 64 × 64 px, cinco estados (Idle, Walk, Attack, Hurt, Death), 24 quadros por personagem e folhas PNG transparentes. A página autoriza uso comercial e modificação, proíbe revenda/redistribuição dos arquivos isolados e diz que o crédito é opcional. | Alternativa coerente em tamanho e temática; requer compra e validação do `LICENSE.txt` incluído. Não adquirido nem integrado. |

Os candidatos pagos parecem promissores como substituição coordenada, mas não foram importados sem aquisição. Seus arquivos internos de licença, imagens em escala de cartão e peso total ainda precisam ser avaliados. Os recursos atualmente integrados permanecem, com suas atribuições e avisos.

## Alterações realizadas nesta revisão

- Ajuste de proporção para os GIFs nos cartões de classe, com renderização pixelada.
- Inclusão do URL original da animação do Caçador no catálogo de créditos e em seu aviso local.
- Atualização da data de revisão em `CREDITOS.md`.
- Nenhum arquivo de arte adicionado ou removido; nenhuma classe, regra, habilidade, progressão ou save foi alterado.

## Verificações

O catálogo, as páginas itch.io, os caminhos e os tamanhos dos arquivos registrados foram conferidos pela API do GitHub. Não foi possível executar `pnpm verificar`, testes, análise, tipos, build ou capturas responsivas sem um checkout local e sem dependências instaladas. O commit desta documentação deve ser validado por esses comandos no ambiente do repositório antes de uma publicação comercial.
