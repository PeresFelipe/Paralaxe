# Auditoria corrigida e integração de personagens — 07/11/2026

A auditoria anterior estava incorreta ao declarar três classes. O catálogo real possui seis: Guerreiro, Mago, Caçador, Acólito, Ladino e Errante. Os três últimos não tinham arte vinculada em Aplicativo.tsx. Esta revisão corrige o inventário e integra apenas os Idle necessários.

## Recursos existentes mantidos

Guerreiro: Mattz Art, FREE Knight, licença comercial própria preservada. Mago: LuizMelo, Wizard Pack, CC0. Caçador: Otsoga, Joanna Idle, licença comercial própria preservada. Não foram substituídos.

## Recursos gratuitos incorporados

### acolito — Village Starter FREE — Cleric

Autor: Tattuattor. Origem: https://tattuattor.itch.io/village-starter-free

A licença original dentro do ZIP autoriza jogos comerciais e edição, redimensionamento e combinação. Proíbe redistribuição avulsa ou em pacotes, templates e kits. Crédito opcional. Arte criada com PixelLab e editada pelo autor.

Originais: Village_Starter_FREE/characters/cleric/idle/east/frame_000.png a frame_003.png. ZIP SHA-256: f0b5fb5522c39a75978c56e4e859d970f41726e195a7e932a24464db2e843429.

Adaptação: quatro quadros Idle/east de 68 × 68 em faixa 340 × 68, com o primeiro repetido para fechar o loop. Pixels originais preservados. Arquivo distribuído: /arte/classes/acolito/tattuattor/acolito-idle.png. Registro comercial: /creditos/acolito.txt.

### ladino — FREE Rogue Character 2D PixelArt

Autor: SpriteForge e Tiago Patrício. Origem: https://spriteforge.itch.io/2d-pixelart-rogue-character

A seção License da página original autoriza jogos comerciais e modificações, permite distribuição integrada ao projeto e proíbe redistribuição como asset avulso e NFTs. Crédito opcional. O ZIP gratuito não contém arquivo de licença separado.

Originais: CharacterFree/Animations/Idle/IdleFrame_1.png e IdleFrame_2.png. ZIP SHA-256: 3480782e4622d755c0dc8c7b000247a5e9da6415057c28bc9d3882d6a748d7ff.

Adaptação: dois quadros Idle de 85 × 64 em faixa 255 × 64, com o primeiro repetido para fechar o loop. Pixels originais preservados. Arquivo distribuído: /arte/classes/ladino/SpriteForge/ladino-idle.png. Registro comercial: /creditos/ladino.txt.

### errante — Animated Pixel Adventurer

Autor: rvros. Origem: https://rvros.itch.io/animated-pixel-hero

A seção License Permissions da página original autoriza uso comercial e modificações. Proíbe revenda/redistribuição do asset em si; utilização integrada ao jogo. Crédito opcional. O ZIP examinado não contém arquivo separado de licença.

Originais: Individual Sprites/adventurer-idle-00.png a adventurer-idle-03.png (Adventurer-1.5.zip). ZIP SHA-256: 0bf3f9253fcf77f6bf23af2ebb83c7776490414223b3e37ae798d6135e134a7c.

Adaptação: quatro quadros Idle de 50 × 37 em faixa 250 × 37, com o primeiro repetido para fechar o loop. Pixels originais preservados. Arquivo distribuído: /arte/classes/errante/rvros/errante-idle.png. Registro comercial: /creditos/errante.txt.

## Integração e desempenho

O mecanismo CSS de spritesheets existente foi reutilizado. Cada faixa usa a quantidade correta de passos; background-size com altura automática preserva a proporção. O quadro permanece em 80 × 80 px, sem deslocar texto ou controles. prefers-reduced-motion mostra um quadro estático. Sem bibliotecas adicionais, GIFs novos ou arquivos duplicados. Somente Idle foi incorporado; Walk/Attack são opcionais para esta tela e ficaram fora da distribuição. PNGs novos: 5.001 bytes antes dos avisos de licença.

Sprites inspecionados visualmente como faixas, com quatro, dois e quatro quadros distintos. Acólito usa vestes claras de clérigo; Ladino tem traje leve; Errante tem aparência de viajante. As três classes conservam suas regras e equipamentos originais; a representação visual não concede itens.

## Créditos e validação

Catálogo consumido por Créditos e licenças, CREDITOS.md e índice de avisos atualizados. Licença original de Tattuattor preservada byte a byte. Os ZIPs de SpriteForge e rvros não incluem licença separada; os registros locais identificam a página original e a evidência comercial, sem se passarem por licença fornecida no pacote.

Não há checkout completo autenticado neste ambiente. Testes do workspace, tipos, lint, build de produção, teste offline/PWA e capturas da aplicação em 320/375/768/1024/1440 px permanecem não executados. Inspeção dos PNGs não equivale a teste visual da aplicação.

Verificação de metadados contra a árvore Git: 135 recursos visuais com exatamente um registro de crédito cada, 21 contribuições, caminhos locais de licença/avisos existentes e três novos vínculos em Aplicativo.tsx. A checagem não substitui a execução de pnpm verificar:creditos. Dimensões dos PNGs confirmadas por ImageMagick e licença Tattuattor comparada byte a byte com o ZIP original.
