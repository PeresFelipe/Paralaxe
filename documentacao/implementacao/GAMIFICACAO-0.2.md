# Versão 0.2 — Códice, Desafios e Prestígio

Pacote local de continuidade de campanha. Os sistemas usam o save existente, não introduzem moeda/recompensa adicional e funcionam sem serviço remoto.

## Códice

- Disponível em Cidade → Códice. Registra a classe inicial, ofícios com progresso, coletas iniciadas, receitas fabricadas, técnicas conhecidas, materiais/equipamentos encontrados, inimigos vencidos e salas vistas/conquistadas.
- IDs descobertos são permanentes. O catálogo apresenta categorias e detalhes conhecidos; entradas ainda não encontradas não são reveladas.
- A descoberta é baseada em registros concretos da partida. Possuir material não registra que ele foi fabricado; classe e equipamentos iniciais são reconhecidos como conhecimento inicial.

## Desafios

- Disponível em Aventura → Desafios, com progresso e conclusão guardada no personagem.
- Marcos acompanham primeira fabricação, vitória de Serviço, contrato de Dún Liath, Prestígio de ofício, 10 entradas descobertas e primeiro Prestígio do personagem.
- Não concedem ouro, XP ou itens. São registros de progresso e apresentação.

## Prestígio

- Ao alcançar o nível máximo de ofício desta implementação (10), é possível reiniciar o ofício no nível 1 para avançar até Prestígio III. O personagem, equipamentos e materiais permanecem intactos.
- Prestígio de personagem continua a exigir Prestígio I nos sete ofícios, mantém os três ciclos de personagem, os 15 pontos máximos e os 32 nós existentes.
- Os nós agora afetam estatísticas derivadas e a simulação: recursos, regeneração, precisão/crítico, defesa, resistência a estados, redução de dano por gatilho, Segundo Fôlego e defesa do Último Bastião em Vida baixa. A aplicação ocorre no motor de combate; descrição e balanceamento permanecem concentrados nos catálogos/regras.
- Novas definições de nível, materiais e simultaneidade de linhas de atividade não foram acrescentadas neste pacote.

## Save e compatibilidade

O esquema passa de 10 para 11, adicionando `codice.idsDescobertos` e `desafios.idsConcluidos`. Saves anteriores preservam a Jornada e recebem a classe atual como conhecimento inicial; o jogo não presume ações históricas que o save antigo não registra. O formato IndexedDB publicado continua usando o mesmo banco, coleção e `saveId`.

## Validação

Executar `pnpm verificar` e `pnpm compilar`. Testes devem cobrir migração v10, registro monotônico de descobertas/desafios, promoção de ofício e efeitos de Prestígio em estatísticas/combate.
