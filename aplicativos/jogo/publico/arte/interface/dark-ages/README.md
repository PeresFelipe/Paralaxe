# Dark Ages UI — recortes integrados ao Paralaxe

- Autor: Hypnobius.
- Origem: https://hypnobius.itch.io/dark-ages-ui
- Versão: DarkAgesUi_v1.0, obtida gratuitamente em 14/09/2026.
- Arquivo de origem: `32x32-Tilesheet.png`, 384 × 352 px.
- SHA-256 do tilesheet: `dfa3c1127feb17e7625c3a5826bf12ec75f9525c5da0d0ba7c22997b70435850`.
- [Licença original](LICENSE.txt), copiada integralmente do download.

A licença permite uso gratuito em projetos pessoais e comerciais e modificações. Crédito é opcional; o jogo o inclui. Ela proíbe redistribuir/revender o pacote de assets, incluir os tiles em outros pacotes para download, NFTs, blockchain e datasets de treinamento de IA. O próprio autor distingue esses arquivos de jogos/projetos que os implementam. Estes recortes são componentes da interface do Paralaxe; não formam um pacote de assets para redistribuição separada.

Extração mecânica em RGBA, sem recoloração, redesenho ou alteração dos pixels. Coordenadas no formato Pillow `(esquerda, topo, direita exclusiva, base exclusiva)`:

| Arquivo | Retângulo | Uso |
| --- | --- | --- |
| frame-gold.png | (0, 0, 96, 96) | Moldura principal e emblema |
| frame-dark.png | (208, 16, 272, 80) | Painéis secundários |
| slot-iron.png | (192, 96, 224, 128) | Inventário e equipamentos |
| flourish-gold.png | (192, 128, 288, 160) | Ornamento da marca |

A interface aplica os recortes por `border-image` e background CSS. A comparação dos pixels decodificados com os retângulos da origem passou para os quatro arquivos.
