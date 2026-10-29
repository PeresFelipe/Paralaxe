# Greywake — arquitetura da interface

Este documento define as regras permanentes para a interface do jogo. Toda nova alteração deve seguir estas convenções.

## Princípios

- Telas montam componentes e conectam eventos; não definem estilos de controles nem implementam regras do jogo.
- Todo botão de interface usa `Button` de `aplicativos/jogo/fonte/components/ui`. É proibido usar `<button>` diretamente em telas ou adicionar estilos de botão nelas.
- Cores, tipografia, espaçamentos, raios, sombras e transições vêm de `aplicativos/jogo/fonte/styles/tokens.css`. Não adicionar valores visuais hardcoded em telas ou componentes.
- Componentes de `components/ui` são genéricos e não conhecem regras, estados ou vocabulário do jogo.
- Estado, regras, operações e loop do jogo ficam em hooks, serviços e pacotes de domínio; componentes visuais só exibem dados e encaminham eventos tipados.
- TypeScript é estrito: não usar `any`; todas as props precisam de tipos explícitos.
- Cada componente reutilizável tem sua própria pasta com `Nome.tsx`, `Nome.module.css` e `index.ts`. Os componentes de UI também são exportados por `components/ui/index.ts`.
- Não alterar lógica ou comportamento do jogo durante uma migração visual.

## Estrutura de referência

```text
aplicativos/jogo/fonte/
  components/
    ui/
      Button/
        Button.tsx
        Button.module.css
        index.ts
      Card/
        Card.tsx
        Card.module.css
        index.ts
      Modal/
        Modal.tsx
        Modal.module.css
        index.ts
      index.ts
    jogo/                 # componentes visuais específicos de Greywake
      IconeDoJogo/
        IconeDoJogo.tsx
        IconeDoJogo.module.css
        index.ts
      ComparacaoDeEquipamento/
        ComparacaoDeEquipamento.tsx
        ComparacaoDeEquipamento.module.css
        index.ts
      CreditosDosRecursos/
        CreditosDosRecursos.tsx
        CreditosDosRecursos.module.css
        index.ts
  features/               # composição das áreas/telas do jogo
    aplicativo-web/
      EstadoDoJogoWeb/
        EstadoDoJogoWeb.tsx
        EstadoDoJogoWeb.module.css
        index.ts
    jornada/
      MetaDaJornada/
        MetaDaJornada.tsx
        MetaDaJornada.module.css
        index.ts
    personagem/
      PainelDeAtributos/
        PainelDeAtributos.tsx
        PainelDeAtributos.module.css
        index.ts
      PainelDePrestigio/
        PainelDePrestigio.tsx
        PainelDePrestigio.module.css
        index.ts
    cidade/
      BancadaDoMercado/
        BancadaDoMercado.tsx
        BancadaDoMercado.module.css
        index.ts
      PainelDoBanco/
        PainelDoBanco.tsx
        PainelDoBanco.module.css
        index.ts
    aventura/
      BancadaDaMasmorra/
        BancadaDaMasmorra.tsx
        BancadaDaMasmorra.module.css
        index.ts
      BancadaDeCombate/
        BancadaDeCombate.tsx
        BancadaDeCombate.module.css
        index.ts
    atividades/
      TelaDeAtividades/
        TelaDeAtividades.tsx
        TelaDeAtividades.module.css
        index.ts
      IndicadorDeProgressoOcioso/
        IndicadorDeProgressoOcioso.tsx
        IndicadorDeProgressoOcioso.module.css
        index.ts
    inventario/
      GradeDoInventario/
        GradeDoInventario.tsx
        GradeDoInventario.module.css
        index.ts
    navegacao/
      PainelRapido/
        PainelRapido.tsx
        PainelRapido.module.css
        index.ts
  hooks/                  # estado local de tela e prévias derivadas
    useAplicativoDaPartida.ts
    useDistribuicaoDeAtributos.ts
  services/               # operações de aplicação, como serviços de partida
    partida.ts
  styles/
    tokens.css
  estilos.css            # reset e estilos-base da aplicação
  arte-gerada.css        # integração global dos recursos de arte
  disposicao-compacta.css # ajustes responsivos da estrutura
  tipografia.css         # tipografia compartilhada
  tema-do-jogo.css       # tema transversal e estrutura do jogo
  jornada.css            # composição visual compartilhada da Jornada
  interface-do-jogo.css  # apresentação e navegação da aplicação
```

Os diretórios podem crescer conforme novas áreas forem adicionadas; não criar pastas ou componentes sem uso real. A organização atual do monorepo permanece: `aplicativos/jogo` contém a aplicação web, e `pacotes/` contém pacotes compartilhados de domínio, conteúdo, persistência e interface.

`principal.tsx` importa as folhas globais na ordem necessária para o reset, tokens, tipografia, tema e estrutura transversal da aplicação. Estilos locais de componentes ficam em CSS Modules junto de cada componente. Regras globais são apropriadas para o shell, responsividade compartilhada e efeitos que atravessam features; novas regras específicas de um componente devem ficar no seu módulo.

`services/` reúne operações da aplicação que coordenam conteúdo e domínio. Regras canônicas permanecem em `pacotes/dominio`; componentes de tela recebem o resultado do serviço e encaminham ações.

## Migração visual

1. Manter os tokens como fonte única dos valores visuais compartilhados.
2. Compor telas com os componentes de UI, classificando ações principais, secundárias, destrutivas e discretas.
3. Extrair um componente somente quando houver reutilização real; variantes específicas do jogo devem ser oficiais e documentadas.
4. Remover regras antigas sem uso ao alterar uma área da interface.
5. Preservar funções, estado, navegação, regras e conteúdo do jogo durante todo o trabalho visual.
