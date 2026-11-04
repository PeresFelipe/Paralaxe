# Paralaxe — Cidade Viva + Refatoração de UI Responsiva

## Escopo

Este pacote complementa a implementação local **Legado da Cidade Livre** e refatora **todo o frontend** nas seguintes áreas:

- Base de layout, telas principais e imagens (CSS transversal importado por último).
- Componente compartilhado de botões (`Button`) e cartões (`Card`).
- Inventário (grade flexível sem largura mínima artificial).
- Aventura: combate e masmorra.
- Atividades e profissões.
- Personagem: atributos e Prestígio.
- Cidade: Banco, Mercado e painel de projetos da Cidade Viva.
- Painel lateral de navegação e modais.

São ajustes de CSS e importação de estilos: **a lógica do RPG, os saves e as imagens originais não são alterados**. O pacote completo inclui a implementação de Cidade Viva do ZIP anterior, que **possui mudanças de gameplay e migração do save**; estes não são causados pela refatoração visual.

## Pré-requisitos

- Clone Git válido do repositório `PeresFelipe/teste`.
- Base em `codex/vigilia-cidade-artes-completas-2026-11-03` contendo o commit `83cbf32`.
- Árvore de trabalho limpa; dependências pnpm instaladas para validação.

## Instalação completa (Cidade Viva + frontend inteiro)

Na raiz do clone:

```bash
# Confirme a branch de artes e o estado do clone.
git switch codex/vigilia-cidade-artes-completas-2026-11-03
git status --short
python3 /CAMINHO/paralaxe-refatoracao-ui-completa/aplicar_completo.py /CAMINHO/DO/CLONE
pnpm verificar
pnpm compilar
```

O script cria a branch **local** `codex/legado-cidade-viva`; a branch remota de mesmo nome permanece intacta até autorização para publicar. Ele não faz commit nem push.

## Caso a Cidade Viva já tenha sido aplicada no clone

Na branch local `codex/legado-cidade-viva`:

```bash
python3 /CAMINHO/paralaxe-refatoracao-ui-completa/refatoracao-ui/aplicar_ui_responsiva.py /CAMINHO/DO/CLONE
pnpm verificar
pnpm compilar
```

O refinamento é identificado por marcadores para evitar aplicação repetida.

## Critérios de conferência em navegador

| Tela | Larguras a verificar | Observações |
|---|---|---|
| Criação / login local | 320, 390, 768, 1440px | Campos e botões sem corte |
| Personagem / Prestígio | 320, 360, 768, 1024px | Números, nós e confirmação legíveis |
| Inventário | 320, 360, 430, 768px | Grades 4 / 6 colunas sem overflow |
| Atividades | 320, 390, 768, 1440px | Cards e seletor de profissão |
| Aventura / Masmorra | 320, 390, 768, 1024px | Colunas, aviso de combate, log |
| Cidade / Banco / Mercado | 320, 390, 768px | Ações e recursos sem sobreposição |
| Cidade Viva | 320, 390, 768, 1440px | Cena WebP 16:9, cards, filtros e botões |
| Navegação e modais | 320, 390, 768px | Safe area, foco, scroll vertical |

Também verificar zoom do navegador a 200%, teclado, `prefers-reduced-motion`, landscape mobile e PWA offline. **Sem um clone executável e navegador integrado neste ambiente, não há homologação visual real.**

## Natureza das mudanças

- Botões comuns agora são do tamanho do conteúdo por padrão, com largura total **apenas** quando intencional (`fullWidth`). Variantes especiais, como `navigation`, `inventory` e `saveCard`, mantêm seu comportamento específico.
- Imagens, vídeos e panoramas são limitados pelo contexto; o panorama utiliza `object-fit: contain` e mantém as variantes WebP mobile já existentes.
- Grades de inventário, combate, atributos e projetos evitam larguras mínimas rígidas que causavam vazamento para fora do container.
- Flex/Grid podem quebrar linha com menos risco, sem adicionar JS ou bibliotecas.
- Fonte, cores, espaçamento e controles continuam herdando `--ui-*` de `styles/tokens.css`.
- Novas regras respeitam redução de movimento e não alteram a funcionalidade dos componentes.

## Situação Git

**Nenhum commit, push, merge ou deploy executado.** A `main` e os arquivos remotos permanecem intactos. O código entregue é um pacote local para inspeção, aplicação e testes integrados antes de autorizar publicação.
