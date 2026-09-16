# Tradução do repositório para português brasileiro

Base: `main` em `3a251bf138232f8c0c11e6871bf8f5d299daa7f3`, incluindo os GIFs de Guerreiro e Mago adicionados pelo autor do projeto.

Cópia de segurança: `backup/main-antes-ptbr-2026-09-15-3a251bf`.

## Convenções

Arquivos, pastas, tipos, funções, variáveis, propriedades próprias, classes CSS e comentários usam português brasileiro. Identificadores usam palavras sem acentos; textos para pessoas preservam os acentos. Nomes próprios como Greywake, Brann e Dún Liath são mantidos.

| Antes | Agora |
| --- | --- |
| `apps/game/src/App.tsx` | `aplicativos/jogo/fonte/Aplicativo.tsx` |
| `apps/game/public/art/classes` | `aplicativos/jogo/publico/arte/classes` |
| `packages/domain` | `pacotes/dominio` |
| `packages/content` | `pacotes/conteudo` |
| `packages/persistence` | `pacotes/persistencia` |
| `packages/ui` | `pacotes/interface` |
| `docs` | `documentacao` |
| `CharacterClassId` | `IdDaClasseDoPersonagem` |
| `OfflineGameSave` | `PartidaLocal` |
| `CLASS_GIFS` | `GIFS_DAS_CLASSES` |
| `warrior`, `mage` | `guerreiro`, `mago` |
| `pnpm dev` | `pnpm desenvolver` |
| `pnpm check` | `pnpm verificar` |
| `pnpm build` | `pnpm compilar` |

Os nomes exigidos por ferramentas e bibliotecas continuam seguindo seus contratos: `package.json`, `tsconfig`, `index.html`, `.test.ts`, configurações de Vite, propriedades HTML/ARIA/CSS, APIs de JavaScript, React, IndexedDB e dependências. Os textos legais e os arquivos originais distribuídos pelos autores dos pacotes de arte conservam seus nomes e conteúdo.

## Compatibilidade das partidas

`pacotes/persistencia/fonte/formatoLegado.ts` converte o vocabulário na entrada e na saída da persistência. O banco `greywake`, o armazenamento `saves`, a chave `saveId`, a versão do banco e o esquema 10 são mantidos. A versão anterior consegue ler as gravações novas.

O adaptador preserva nomes livres do jogador, identificadores de partidas e de instâncias, horários, saldos, quantidades, atributos, equipamentos, progresso, escolhas narrativas e sementes. Uma leitura não regrava o banco. A migração de versões anteriores continua passando pelas regras existentes.

A amostra de regressão foi produzida pela API anterior à tradução e contém um personagem chamado `warrior`, banco, prestígio, meta, fabricação registrada, atividade selecionada e uma masmorra ativa. O teste exige igualdade completa após leitura e regravação e cobre as seis classes.

## Recursos visuais

Os GIFs permanecem organizados por autor:

- `aplicativos/jogo/publico/arte/classes/guerreiro/MattzArt/guerreiro.gif`.
- `aplicativos/jogo/publico/arte/classes/mago/LuizMelo/mago.gif`.

As URLs no aplicativo começam em `/arte/`. Os créditos continuam em `aplicativos/jogo/fonte/CreditosDosRecursos.tsx`. Os arquivos binários de arte são preservados; os caminhos próprios e suas referências foram atualizados.

## Verificação

Execute `pnpm verificar` e `pnpm compilar`. A tradução precisa manter os testes de regras, a matriz de classes e rotas, a leitura de partidas anteriores, os recursos visuais e os fluxos de criação e navegação.

### Resultado da revisão de 16/09/2026

- Análise estática e verificação de tipos aprovadas nos cinco pacotes.
- 99 testes aprovados: 50 de domínio, 35 de conteúdo e 14 de persistência.
- Compilação de produção com manifesto e serviço de cache gerados.
- Criação, navegação, coleta, inventário, fabricação, equipamento, reabertura e progresso durante a ausência verificados com a compilação real em DOM e IndexedDB simulados, sem erros de console. Esta revisão não inclui inspeção visual em navegador gráfico.
- 98 arquivos binários e avisos de licença preservados integralmente; 41 ícones conferidos. As 3.001 declarações CSS preservam valores e recursos, com atualização dos nomes e seletores.
- Protótipos navegáveis conferidos após a tradução dos seletores.

A revisão também restaurou os botões Voltar e Continuar na escolha de classe: eles já estavam ausentes na base `3a251bf`, impedindo concluir a criação do personagem.
