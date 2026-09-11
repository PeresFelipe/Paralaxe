# Avaliação dos packs Shikashi e Mana Seed para Greywake

Data: 11/09/2026. Base do código: `aa8e7f146938889525aa78048cac29d0e165dd04`.

**Recomendação: começar pelos ícones transparentes do Shikashi v2. O Mana Seed não é compatível com o desenvolvimento atual do Greywake sob a licença fornecida.** Esta entrega é uma análise e um catálogo de candidatos; as artes ainda não foram integradas ao jogo.

## O que foi examinado

Foram inventariados os três ZIPs enviados: **442 arquivos**, sendo 426 PNGs, quatro GIFs, duas fontes TTF e dez documentos TXT. Os PNGs foram decodificados, os quadros dos GIFs foram lidos, as fontes foram inspecionadas e os documentos foram lidos. A inspeção visual incluiu as duas folhas completas de ícones, todas as versões de fundo, as variantes de personagem, composições representativas das folhas e os demais objetos/cenários. Isso não equivale a testar todas as animações dentro do jogo.

O [inventário completo](asset-packs-inventory-2026-09-11.tsv) registra caminho, formato, dimensões, tamanho e SHA-256 de cada arquivo. O [mapa de candidatos](shikashi-greywake-candidates.json) relaciona coordenadas da folha aos IDs atuais do jogo, distinguindo usos diretos, adaptações e lacunas.

| Arquivo enviado | Conteúdo real | Resultado |
| --- | --- | --- |
| Shikashi's Fantasy Icons Pack.zip | 17 PNGs de 512×640 e um TXT; 245 ícones de 32×32 na folha transparente | Versão anterior; guardar como referência |
| Shikashi's Fantasy Icons Pack v2.zip | 17 PNGs de 512×867 e um TXT; 284 ícones de 32×32 na folha transparente | Fonte preferida para os ícones do jogo |
| 25.07 - Free Mana Seed RPG Starter Pack.zip | 392 PNGs, quatro GIFs, duas fontes e oito TXT | Conteúdo catalogado; uso incompatível com os termos atuais |

As 17 folhas de cada Shikashi repetem o conjunto de ícones com transparência, sombra ou fundos alternativos. Não representam 17 conjuntos diferentes. Na v2 há 39 posições adicionais e quatro ícones anteriores com pixels alterados: coluna/linha, começando em zero, `(1,8)`, `(5,8)`, `(4,15)` e `(8,16)`. Os outros 241 ícones anteriores permanecem idênticos. O texto interno da v2 mantém o total antigo no início, mas lista os 39 adicionais; a contagem efetiva é 284.

## Licenças e créditos

### Shikashi

A [página do autor](https://shikashipx.itch.io/shikashis-fantasy-icons-pack) publica o pack sob **CC BY 4.0**, permite edição e uso comercial e pede crédito a **Matt Firth (shikashipx)** e **game-icons.net**. A tag que informa ausência de IA na criação não é, por si só, uma proibição de uso em projetos assistidos por IA.

Ao integrar, incluir nome do pack, autores, origem, link da licença e registro das modificações. Conservar também o TXT original. A [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br) permite adaptação e redistribuição com atribuição, sem restrições adicionais sobre o material licenciado.

Há uma diferença de proveniência a preservar: os TXT antigos citam desenhos do game-icons.net sob CC BY 3.0, e o [próprio site](https://game-icons.net/about.html) ainda informa essa versão e pede os autores originais. A integração deve manter essa referência; para desenhos derivados identificados, registrar também o autor e a página de origem, sem afirmar que a licença subjacente desapareceu.

Crédito do pack a incluir na futura integração: Shikashi's Fantasy Icons Pack, por Matt Firth (shikashipx), com desenhos base de game-icons.net; links das fontes, CC BY 4.0 e referência original CC BY 3.0. Acrescentar a descrição concreta dos recortes ou alterações realizados.

### Mana Seed

É gratuito, mas usa licença própria, não uma licença aberta equivalente à CC BY. A [licença do autor](https://selieltheshaper.weebly.com/user-license.html) permite uso comercial e edição, dispensa crédito obrigatório e exclui os assets gratuitos do limite de um produto. Proíbe redistribuir os arquivos para terceiros criarem outros produtos e usar as artes junto de conteúdo gerado por IA, incluindo código.

O ZIP confirma a restrição em `NO AI, NO EXCEPTIONS.txt`. Como Greywake já usa código e artes gerados com IA, a conclusão para este projeto é **não integrar o pack sob esses termos**. Trocar apenas os GIFs não resolveria a restrição ao código.

## Onde o Shikashi pode entrar

O GDD enviado define uma interface minimalista com atmosfera Dark Fantasy. O [UX-GDD](../UX-GDD.md) reserva imagens 1:1 para itens, recursos, equipamentos e Técnicas; os ícones complementam rótulos, e telas operacionais priorizam informação. Isso favorece a aplicação do Shikashi nas listas e slots existentes.

| Área do Greywake | Ícones encontrados | Aplicação recomendada |
| --- | --- | --- |
| Materiais de Atividades | Pedra/minério, madeira, peixes, ervas, ferramentas | Identificar resultado, ingrediente e quantidade junto do texto |
| Inventário e Banco | Mochila, baú, materiais, comidas, chaves, livros, pergaminhos | Melhorar reconhecimento dos itens nas listas atuais |
| Equipamento | Espadas, adagas, arcos, cajados, escudos, capacetes, peitorais, luvas, botas e anéis | Usar miniaturas nos itens e nos slots preenchidos |
| Consumíveis e preparação | Poções com formatos distintos, peixe assado, recipientes | Identificar preparado, alimento e frasco sem depender só da cor |
| Sete Skills | Picareta, machado, vara, ervas, barra, bigorna e caldeirão | Complementar os nomes da seleção vertical |
| Estado do personagem | Coração, pulmões, orbes e moedas | Candidatos para Vida, Stamina, Mana e Moeda, preservando rótulos |
| Combate | Efeitos de estado, setas, golpes, guarda e cura | Segunda etapa, somente para estados e Técnicas realmente implementados |
| Cidade | Baú, bolsa de moedas, ferramentas, livros e itens | Sinais pequenos nos serviços; não substituem a ilustração do local |

### Exemplos ligados ao conteúdo existente

Coordenadas abaixo são **coluna, linha**, começando em zero, na folha transparente v2. Cada célula mede 32×32.

| Conteúdo existente | Ícone candidato | Célula | Observação |
| --- | --- | --- | --- |
| `material.cloch` | Pedra | 1,17 | Uso direto como material bruto |
| `material.giuis` | Madeira | 0,17 | Uso direto |
| `material.scadan` | Peixe | 3,16 | Representação genérica; não comprova a espécie Scadán |
| `material.neantog` | Erva | 13,11 | Representação genérica; não comprova a espécie Neantóg |
| `material.treated-cloch` | Barra metálica | 3,17 | A barra é dourada; adaptar para não sugerir ouro |
| `item.food.roasted-scadan` | Peixe assado | 4,15 | Uso direto |
| `item.consumable.neantog-preparation` | Poção verde | 2,9 | Manter nome e efeito legíveis |
| `item.consumable.field-preparation` | Poção vermelha | 0,9 | Distinguir pelo formato e pelo rótulo |
| `item.consumable.crimson-flask` | Frasco vermelho elaborado | 8,9 | Silhueta diferente da poção básica |
| `weapon.militia-sword` | Espada longa | 1,5 | Uso direto como ilustração genérica |
| `weapon.short-bow` | Arco | 3,6 | Uso direto |
| `item.equipment.traveller-ring` | Anel | 4,8 | Uso direto |
| `item.key.rusted` | Chave | 9,11 | A chave é de metal amarelo; adaptar aparência enferrujada |
| `item.garrison-supply-register` | Livro aberto | 8,13 | Adequado ao registro |

O JSON cobre os 28 equipamentos, os outros 14 IDs de itens em `gameLabels.ts`, as sete Skills e quatro indicadores do personagem. A classificação é uma recomendação visual, não uma alteração no catálogo do jogo.

### Lacunas e escolhas de estilo

- Não há lança adequada para `weapon.travel-spear` e `weapon.watch-spear`. Uma espada não deve ocupar esse lugar por conveniência.
- Maças, vestes longas, perneiras de armadura e as Braçadeiras de Giúis têm apenas aproximações. Exigem ajuste ou arte própria para representar o objeto corretamente.
- Fragmento do Tratado, Fragmento de Fairtheoir e Pedra Sem Nome precisam preservar identidade narrativa. Um pergaminho ou runa genérica pode servir à triagem, mas não resolve a arte definitiva de Relíquias.
- O pack não oferece retratos 4:5, os inimigos da Build 0.1, cenas 16:9 ou animações de trabalho. Não substitui os GIFs das Skills nem as artes de Cidade e Dungeon.
- A paleta é mais viva que a do Greywake. Começar com transparência sobre as superfícies escuras existentes e avaliar a leitura; evitar aplicar filtros globais que confundam poções, raridades e status.
- Os arquivos chamados `Background` e `BG` são fundos de slots repetidos na folha. Não são paisagens ou mapas.

## Conteúdo do Mana Seed, mesmo sem integração

| Grupo do ZIP | Arquivos | O que contém | Correspondência visual possível, condicionada a outros termos de uso |
| --- | ---: | --- | --- |
| `character_base` | 354 | 334 folhas de camadas/variantes, referências, guias e exemplos GIF | Personagem pequeno com corpo, roupa, cabelo, chapéu, arma e escudo sincronizados |
| `fonts` | 4 | Duas fontes TTF e dois PNGs de balão de diálogo | Texto e balões; sem necessidade de substituir a Antiquity Print já integrada |
| `icons & objects` | 14 | Móveis, vasos quebráveis, baús, armas, escudos e efeitos | Interiores de Taverna/Banco, tesouros e apresentação de combate |
| `monsters` | 3 | Folha de slime e dois exemplos GIF | Um monstro animado; não corresponde aos inimigos atuais de Dún Liath |
| `npcs` | 12 | Dois modelos de NPC, variantes de paleta e guia | Habitantes genéricos; não são retratos narrativos |
| `tilesets` | 16 | Florestas de quatro estações, água, cachoeiras, sombras, escadas, casas e interiores | Composição manual de ambientes, não telas prontas |
| Documentos na raiz | 3 | Apresentação, origem e restrição sobre IA | Regras de uso e escopo da amostra |

O número de folhas de personagem não é o número de personagens únicos: são páginas de animação, camadas e trocas de cor. O material fornecido traz a página de movimento `p1` e três páginas de combate de uma mão (`pONE1`, `pONE2`, `pONE3`). O guia genérico menciona pesca, agricultura, mineração e outras páginas, mas **essas páginas de trabalho não estão neste ZIP**. Portanto, mesmo sem o impedimento da licença, este starter pack não forneceria os sete loops de atividades do Greywake.

As peças ambientais precisam ser montadas em cenas coerentes. A aparência é de RPG com vista de cima, mais colorida e acolhedora que a direção Dark Fantasy atual. Isso seria uma mudança artística e de composição, não uma simples troca de arquivo. A licença verificada impede adotar também essas peças isoladas no projeto atual.

## Sequência proposta para integração

1. Integrar uma seleção de ícones do **Shikashi v2** em Inventário, Banco, Equipamento e materiais de Atividades, junto dos créditos e avisos de origem.
2. Usar 32×32 em slots existentes, com nome e quantidade ao lado. Separar tamanho da imagem de área clicável; evitar aumentar todos os cartões. Em ampliações, preservar a grade de pixels.
3. Centralizar o vínculo por `definitionId`/`SkillId`, com fallback para itens sem arte. Preservar o tamanho real da folha: ela tem 512×867 e espaço vazio inferior; não presumir uma grade quadrada ou deformá-la para 512×512.
4. Incluir apenas os assets usados e respectivos créditos no cache offline. As 17 versões de fundo não precisam ir ao bundle.
5. Completar as lacunas com arte própria ou material de licença compatível; depois tratar os ícones de combate e indicadores globais.

Nesta análise foram adicionados somente documentos e metadados ao repositório. Não foram importados ZIPs, fontes ou imagens dos packs para os arquivos públicos do jogo.
