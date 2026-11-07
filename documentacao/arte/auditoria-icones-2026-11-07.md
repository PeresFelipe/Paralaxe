# Auditoria e integração de ícones — 07/11/2026

Branch: `develop`. Base auditada: `da945d4bf41e1f011dee411b2e65defb4257fc83`.

## Inventário e lacunas reais

Foram examinados o registro central `iconesDosRecursos.ts`, os componentes de imagem/botão/menu, as telas de personagem, atividades, inventário, Banco, Mercado, Cidade e projetos, os catálogos de coleta, receitas, equipamentos e consumíveis, e os créditos existentes. A cópia local foi reconstruída da árvore Git da branch, permitindo execução de validação e build.

Já havia ícones para as sete profissões, Vida/Mana/Fôlego/Ouro, navegação principal, Inventário/Banco/Grupo, produtos do Mercado e grande parte dos itens normais. As lacunas encontradas foram associações de materiais/preparações/armas de Prestígios, duas lanças e o Fragmento do Fairtheoir. No menu de opções havia glifos de texto; as ações de transferência do Banco e os materiais dos projetos não exibiam imagens, mesmo quando a categoria já tinha arte.

| Escopo dos catálogos auditados | IDs | Com ícone antes | Com ícone depois |
| --- | ---: | ---: | ---: |
| Itens: resultados de coleta, ingredientes, produtos de receitas e consumíveis de combate | 172 | 60 | 172 |
| Definições de equipamento | 65 | 42 | 65 |

As 112 associações de itens e 23 de equipamentos foram completadas. Não significa que cada ID tem uma arte exclusiva: materiais de mesma categoria compartilham a imagem adequada, preservando o padrão existente. As associações dos Prestígios são geradas a partir dos catálogos reais; IDs desconhecidos continuam sem associação e não são classificados por prefixos genéricos. Reforçar um equipamento é uma ação, não um novo item com ID de produto.

## Novos PNGs gratuitos e licenças

| Fonte e autor | Originais selecionados | Uso e licença |
| --- | --- | --- |
| [Icons Essential Pack v1.2 — Crusenho Agus Hennihuno](https://crusenho.itch.io/icons-essential-pack-free-icons) | Gear.png, PaintBrush.png, Monitor.png, Upload.png, Download.png | Opções, aparência, largura, depositar e retirar. CC BY 4.0: permite uso comercial, adaptação e redistribuição; exige atribuição, link da licença e indicação de alterações. |
| [Tiny Dungeon 1.0 — Kenney](https://kenney-assets.itch.io/tiny-dungeon) | Tiles/tile_0131.png | Lanças de Viagem e do Vigia. CC0 1.0: uso comercial e adaptação permitidos, atribuição facultativa. |

Seis PNGs de 16 × 16, somando 1.635 bytes. Arquivos apenas renomeados; todos os pixels e proporções originais foram preservados. A inspeção incluiu os PNGs em escala ampliada e os documentos de licença dentro dos ZIPs, além das páginas originais. Nenhum recurso pago foi incorporado.

Os hashes dos ZIPs, os caminhos originais e distribuídos e as condições comerciais constam em `/creditos/icones-crusenho.txt` e `/creditos/icones-kenney.txt`. As licenças originais foram preservadas byte a byte. O aviso antigo do Crusenho tinha recebido um URL inserido pelo projeto; agora o texto original foi restaurado e a origem consta na proveniência separada.

## Integração

- Registro central ampliado para resolver os três fornecedores, sem dependências novas.
- Profissões e recursos existentes preservados; ícones de categoria reaproveitados para os Prestígios.
- Lanças de Viagem e do Vigia recebem imagem de lança; Fragmento do Fairtheoir recebe o símbolo de pedra rúnica já utilizado no jogo.
- Menu: engrenagem no gatilho, pincel para aparência e monitor para largura. Rótulos acessíveis, foco e comportamento continuam definidos pelos componentes existentes.
- Banco: ícones distintos para depositar e retirar, mantendo os nomes das ações e os mesmos callbacks.
- Projetos da Cidade: material e Ouro exibem os símbolos já utilizados no inventário e cabeçalho.
- Botões genéricos de texto, como Voltar e Cancelar, mantêm seus rótulos sem decoração repetitiva. Sua ausência de imagem não representa recurso funcional ausente.
- `IconeDoJogo` conserva proporção, renderização pixelada, tamanho reservado e imagem decorativa quando existe rótulo visível.
- Nenhuma regra, atributo, recompensa, item concedido ou estrutura de save alterada.

## Créditos atuais e anteriores

`CREDITOS.md`, `catalogoDeCreditos.json` e o índice de avisos foram atualizados. O catálogo é o mesmo consumido pela seção Créditos e licenças dentro do jogo. A cobertura automática encontrou 148 recursos visuais, 22 contribuições e 25 avisos locais, sem arquivos visuais sem atribuição ou com registros sobrepostos.

A etapa anterior está creditada: Acólito/Tattuattor, Ladino/SpriteForge e Tiago Patrício, Errante/rvros conservam suas entradas, páginas originais e avisos distribuídos. As atribuições antigas de recursos ainda usados foram mantidas.

## Validação executada

- `pnpm verificar`: aprovado — arquitetura, CSS Modules, lint, tipos, testes e créditos.
- 55 arquivos de teste e 344 testes aprovados: domínio 122, conteúdo 134, persistência 22, aplicação 66.
- Quatro novos testes cobrem coleta, receitas, equipamentos/consumíveis e identidade das lanças. O teste de arquivos existentes também cobre os novos ícones de ação.
- `pnpm compilar`: produção compilada. O Vite informa um bundle acima do aviso de 500 kB; não foram adicionadas bibliotecas.
- Distribuição e manifesto de pré-cache conferidos: os seis PNGs e os novos avisos/licenças estão presentes. PWA gerado com 181 entradas de pré-cache. Isso valida empacotamento, não navegação offline real.
- PNGs e licenças comparados byte a byte com os ZIPs dos autores.

Limitação visual: o Chromium local foi iniciado, mas o ambiente bloqueou a criação de sockets (`Operation not permitted`) antes da abertura da página. Portanto, não foram produzidas capturas reais da aplicação em 320, 375, 768, 1024 ou 1440 px, nem validação interativa nos dois temas ou navegação offline. A inspeção da arte ampliada não foi tratada como equivalente a esses testes.
