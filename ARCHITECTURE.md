# Paralaxe — arquitetura da interface

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
- Breakpoints de `@media` e `@container` permanecem literais: o CSS não permite resolver custom properties nessas condições. As medidas usadas dentro das regras continuam vindo dos tokens.

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
    jogo/                 # componentes visuais específicos de Paralaxe
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

## Camadas e fluxo de dependências

```text
aplicativos/jogo (features, hooks e composição React)
  ├── pacotes/interface (contratos/portas de entrada e saída)
  ├── pacotes/conteudo (catálogos imutáveis do jogo)
  ├── pacotes/dominio (tipos e regras sem dependência de React)
  └── pacotes/persistencia (adaptadores de armazenamento)
```

- `pacotes/dominio` não importa React, navegador ou persistência.
- `pacotes/interface` declara contratos usados pela aplicação, como o repositório de partidas locais; não contém componentes React.
- `pacotes/persistencia` implementa esses contratos. `principal.tsx` é o composition root: instancia o adaptador IndexedDB e o injeta na aplicação. Hooks/serviços recebem a porta por parâmetro e não constroem adaptadores.
- `pacotes/conteudo` guarda dados e catálogos de conteúdo; os serviços de aplicação podem consultar esses catálogos e chamar regras do domínio. Não duplicar dados canônicos em componentes.
- Dependências entre pacotes devem formar um grafo acíclico. O verificador automatizado confere isso junto das fronteiras de importação.

## Decisões e guia de implementação

- Aplicamos Atomic Design de forma pragmática: `components/ui` contém controles visuais reutilizáveis; `components/jogo` contém peças específicas do universo Paralaxe; `features` compõe essas peças em fluxos completos. Não criamos átomos/moléculas sem reutilização concreta.
- Clean Architecture é aplicada nas fronteiras que existem no projeto: regras em domínio, serviços coordenando casos de uso, adaptadores em persistência e composição no ponto de entrada. Evite criar camadas vazias ou transferir lógica para componentes.
- As variantes adicionais de `Button` formalizam padrões visuais já usados pelo jogo (HUD, inventário, navegação, profissão e outros). Elas só recebem estado e eventos tipados; não consultam estado, conteúdo nem regras do jogo.
- Para nova ação, use `primary` para a ação principal, `secondary`/`ghost` para voltar ou cancelar e `danger` para ações destrutivas. Use uma variante oficial específica somente se o padrão se repetir e diferir visualmente. Ícones são passados pela prop `icon`; mantenha texto acessível no botão.
- Para texto, número ou seleção, use `TextField`/`SelectField` com rótulo e estado de erro/ajuda; não monte controles nativos nas telas. Use `ProgressBar` para progresso linear e `Modal`/`Card` quando o padrão corresponder ao componente existente.
- `@/` aponta para `aplicativos/jogo/fonte`; use-o em imports internos longos. Imports entre pacotes usam os nomes `@paralaxe/*` definidos nos manifestos.
- `rotulosDaInterface.ts` centraliza rótulos e mensagens técnicas repetidos. Textos narrativos e conteúdo exclusivo de um recurso permanecem junto ao catálogo/feature correspondente; não extraia frases únicas para um catálogo global.
- `/ui-kit` é uma vitrine de desenvolvimento dos componentes e estados. O ponto de entrada só a monta em `DEV`; ela não é uma tela de jogo nem parte do build de produção.
- Não foi criado um componente de layout genérico separado (Stack/Row/Grid): as composições atuais usam poucos padrões distintos, e o shell/responsividade já são compartilhados nas folhas globais. Extraia um quando a mesma composição concreta surgir em áreas independentes.
- Estado transitório de interação (seleção, confirmação, envio pendente e erro visível) pertence ao hook/feature que executa a ação. O domínio continua puro; telas capturam falhas na fronteira assíncrona e mostram mensagens com `role="alert"` ou `role="status"`. Mensagens técnicas realmente repetidas ficam em `rotulosDaInterface.ts`; mensagens de regras continuam vindo do domínio.
- Números de balanceamento e definições do jogo pertencem a `pacotes/conteudo` e regras canônicas a `pacotes/dominio`, não a CSS/UI. A camada visual não cria cópias editáveis desses valores.
- Recursos distribuídos são associados a uma atribuição em `catalogoDeCreditos.json`; `pnpm verificar:creditos` confere cobertura, avisos locais e links em HTTPS. Os dois PNGs de ambientação e a URL segura do perfil do autor foram incluídos na correção desta revisão.
- O projeto não distribui áudio hoje. Não há serviço, estado ou controles de áudio em uso para extrair; quando um recurso sonoro for adicionado, mantenha a reprodução em um adaptador de infraestrutura e prefira eventos/estado acessíveis a controles dentro de regras de domínio.

## Verificações

Na raiz, `pnpm analisar` roda `ferramentas/verificarArquitetura.mjs` e os linters dos pacotes. O verificador impede controles nativos fora de `components/ui`, imports proibidos da persistência, React no domínio, ciclos de dependência entre pacotes e ciclos de importação runtime entre módulos locais, além de medidas/cores/tipografia/camadas/durações literais nas folhas CSS. Importações apenas de tipos são apagadas pelo compilador e não criam ciclo runtime. Breakpoints em `@media` e `@container`, e a declaração da fonte no bloco `@font-face`, são exceções técnicas explícitas.

Comandos da raiz:

```sh
pnpm desenvolver
pnpm compilar
pnpm analisar
pnpm verificar:tipos
pnpm testar
pnpm verificar
```

`pnpm verificar` também valida atribuições e licenças dos recursos. Ao acrescentar uma dependência, atualize o manifesto e o lockfile; não faça uma instalação só para alterar a organização do código.

## Migração visual

1. Manter os tokens como fonte única dos valores visuais compartilhados.
2. Compor telas com os componentes de UI, classificando ações principais, secundárias, destrutivas e discretas.
3. Extrair um componente somente quando houver reutilização real; variantes específicas do jogo devem ser oficiais e documentadas.
4. Remover regras antigas sem uso ao alterar uma área da interface.
5. Preservar funções, estado, navegação, regras e conteúdo do jogo durante todo o trabalho visual.
