# Padrões de CSS e HTML — Paralaxe

## Objetivo
Evitar regressões por conflito entre CSS global, CSS Modules e componentes React.
A identidade dark fantasy e os sprites existentes são preservados, assim como as
mecânicas e os dados de partidas.

## Fonte de verdade
- `styles/tokens.css` define cores, tipografia, espaços, tamanhos, sombras, movimento
  e camadas. Não criar tokens numerados quando um nome semântico descreve a função.
- Componentes novos devem preferir `.module.css`, com classes locais aplicadas
  diretamente pelo TSX. Não selecionar nomes CSS gerados (`[class*="..."]`).
- Classes globais são reservadas para o shell, legados ou estados compartilhados.
  Ao migrar uma classe legada para um módulo, remover regras globais **depois**
  de confirmar que nenhum outro componente depende delas.
- Os elementos `<dt>` e `<dd>` do HUD representam rótulos e valores;
  o menu é irmão da lista (`dl`), não seu descendente.
- Para personalizar uma parte interna do componente `Button`, usar
  `[data-ui-slot="label"]` e um ancestral claramente definido.
- Para seletores de opções e diálogos, preservar controle por teclado, rótulo
  acessível, foco visível, Esc e fechamento ao clicar fora quando aplicável.

## Cascata existente
A ordem em `principal.tsx` é: tokens, base, arte, compacto, tipografia,
tema, jornada, interface, responsivo, tema claro.
Essa ordem é parte do contrato atual. Não introduzir `@layer` global de uma só vez
sem testes de screenshot, porque altera a prioridade de regras já publicadas.
Para migrar por etapas, tratar uma área de cada vez e comparar tema claro/escuro.

## Responsividade e tipografia
- Componentes que compartilham largura devem usar `min-width: 0` e `minmax(0,1fr)`.
- Avisos de até 230 px no desktop usam duas linhas internas (ícone/fechar e texto).
- Textos legíveis: valores e estados importantes preferencialmente 12 px ou mais;
  texto corrente, 14 px ou mais. A fonte Antiquity Print é ornamental,
  não deve ser aplicada a descrições longas ou controles de formulário.
- O tema claro utiliza os mesmos componentes e tokens semânticos do escuro.
- Para animações, respeitar `prefers-reduced-motion`.

## Verificação
Executar na raiz do workspace, quando as dependências estiverem disponíveis:
```sh
pnpm verificar
pnpm compilar
pnpm --filter @paralaxe/jogo testar
```

O ambiente de inspeção visual em desenvolvimento fica em `/ui-kit`. Ele contém
os controles, a navegação por teclado e o menu com a alternância de tema.

### Matriz de conferência no navegador
1. Larguras: 320, 375, 768, 1024, 1100 e 1440 px.
2. Tema escuro e claro em cada largura; recarregar após escolher o tema.
3. Testar zoom de 200%, viewport baixa e aumento de fonte do navegador.
4. Abrir o menu, percorrer com Tab/setas, fechar com Esc e clique fora.
5. Conferir criação de personagem, Atividades, Inventário, Jornada, Aventura
   e diálogos de combate; verificar overflow horizontal e sobreposição de textos.
6. Conferir avisos com mensagens longas e fechar; testar dispositivos com
   preferência por movimento reduzido.
7. Confirmar que a escolha de personagem mantém a partida salva.

Os testes Vitest verificam contratos de renderização e CSS; **não substituem**
capturas de tela comparativas nem um teste visual com navegador.

## Tokens semânticos do seletor de ofícios
A paleta do seletor Radix está em `styles/tokens.css` com o prefixo
`--ui-oficio-seletor-*`. Os nomes indicam **função**, não ordem numérica.
Como o menu Radix é renderizado em um portal, esses valores são definidos em
`:root`, não somente no ancestral local do seletor. Qualquer alteração de tema
pode sobrescrever as mesmas variáveis na raiz sem duplicar regras do componente.

Os tokens antigos de outras partes dos ofícios ainda existem e devem ser migrados
somente após conferir seus consumidores. Não renomear tokens em massa às cegas.

## Proteções automatizadas
- `pnpm analisar` executa `ferramentas/verificarCssModules.mjs` para bloquear
  acessos estáticos como `estilos.layout` quando a classe não existe no CSS Module.
  O script não resolve nomes dinâmicos (`styles[variant]`), que exigem testes próprios.
- `styles/ContrasteDeTemas.test.ts` exige contraste mínimo de 4,5:1 para
  as cores principais de texto, legenda, aviso e ação sobre a superfície nos dois temas.
- Estas verificações estáticas não garantem ausência de sobreposição; validar
  também no navegador conforme a matriz anterior.
