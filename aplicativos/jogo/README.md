# Aplicativo do jogo

Aplicação React/Vite da versão 0.1. Apresenta o estado, recebe as ações do jogador e chama as operações do domínio.

- Fontes da aplicação: `fonte/`.
- Recursos estáticos: `publico/`.
- Entrada: `fonte/principal.tsx`.
- Criação de personagem e animações das classes: `fonte/Aplicativo.tsx`, constante `GIFS_DAS_CLASSES`.
- Créditos exibidos: `fonte/components/jogo/CreditosDosRecursos/`.

Para adicionar uma animação de classe, coloque o arquivo em `publico/arte/classes/<classe>/<autor>/` e use a URL `/arte/classes/<classe>/<autor>/<arquivo>.gif` no mapa de classes. As chaves são `guerreiro`, `mago`, `cacador`, `acolito`, `ladino` e `errante`.

Execute `pnpm desenvolver` na raiz do repositório.
