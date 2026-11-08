# Continuação da revisão de arquitetura — 8 de novembro de 2026

Base remota: `develop`, `38d25abba3e5c75f1218f4d78b145b10d4621878`.

## Alterações

- Comandos de personagem, cidade e ofícios foram extraídos do hook de coordenação. Executam sobre o estado corrente da fila e propagam falhas ao consumidor. Horário e estado de risco são dependências explícitas.
- `useAcaoAssincrona` centraliza o estado transitório das ações de atributos, equipamentos, prestígio, banco e ofícios. Seu executor bloqueia envios repetidos inclusive antes da próxima renderização. Confirmações só são fechadas depois do sucesso; falhas permanecem visíveis para nova tentativa.
- A reprodução do combate mede tempo monotônico decorrido, evitando atraso acumulado de timers. A incursão continua usando horário civil e timestamps persistidos, necessários para progresso fora do navegador. Ambas compartilham assinatura de atualização, recuperação de foco/visibilidade e limpeza de listeners.
- `LimiteDeErroDaTela` captura falhas de renderização e rejeições das importações lazy dentro do conteúdo. A coordenação da partida e a estrutura externa permanecem montadas. O botão de recuperação reabre a aplicação, pois uma importação lazy rejeitada fica em cache na instância React.
- A integridade de saves também verifica plano de incursão (preset, semente, chance e datas), dados de expedição, reforço/raridade, estado dos parceiros, referências da formação e meta da jornada. A validação não consulta o catálogo e não repara, remove ou sobrescreve o dado recusado. O esquema e as migrações continuam iguais.

## Verificação

- `pnpm verificar`: lint, arquitetura, CSS Modules, TypeScript, 385 testes e créditos aprovados.
- `pnpm compilar`: build e geração do service worker aprovados.
- Chromium: criação de personagem e navegação entre Atividades, Cidade e Personagem aprovadas, sem erros de página.
- Chromium: rejeição deliberada de uma importação lazy capturada pelo limite de erro, com botão de recuperação e estrutura externa preservada.
- Novos testes cobrem falha de gravação sem confirmação em memória, nova tentativa, mudança de risco entre solicitação e execução, duplo envio, timers atrasados, foco/visibilidade e saves corrompidos sem mutação.

## Limites

A verificação de navegador foi funcional em desktop, sem auditoria visual completa, leitor de tela ou campanha prolongada de jogo. A cópia local herdada contém dois PNGs vazios (`cena-aventura.png` e `retrato-guerreiro.png`); esses arquivos não fazem parte da alteração publicada e os blobs remotos originais são preservados. A validação de integridade continua estrutural, sem tentar certificar todas as regras narrativas ou relações do grafo procedural.
