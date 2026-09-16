# M6 — Versão 0.1 validável

## Estado

**✅ FECHADO**

O M6 foi concluído após a validação integrada da Versão 0.1 local. A matriz estrutural `6 classes × 4 rotas` está em **24/24**, a suíte de domínio/content/persistência passa e o compilação de produção conclui com sucesso.

O fechamento não foi obtido mascarando o caso crítico conhecido. `Mago × Mineração → Cosantóir` foi corrigido no motor de decisão automática: Técnicas cuja única função relevante é restaurar recursos não são escolhidas quando não restaurariam nada.

## Correção da automação — Mago × Mineração

O caso conhecido era:

```text
Mago × Mineração → Cosantóir
```

O loadout pré-Dún Liath do Mago inclui `Fôlego de Combate`. Em Vida baixa, a Técnica podia ser priorizada por seu perfil defensivo mesmo com Fôlego cheia. Isso consumia uma ação sem efeito e reduzia artificialmente a capacidade da rota de Mineração.

A correção foi feita no motor de seleção de Técnicas, sem nerfar Cosantóir e sem alterar os números da rota de Mineração.

Regra aplicada:

> Uma Técnica cuja única função relevante seja restaurar recursos não deve ser selecionada se nenhum dos recursos que ela restaura estiver abaixo do máximo.

Resultado:

```text
Matriz 6 classes × 4 rotas    ✅ 24/24
```

## Banco e armazenamento

O Banco foi integrado conforme o escopo da Versão 0.1:

- Inventário base: 24 espaços distintos;
- Banco: 80 espaços distintos;
- materiais: até 9.999 por pilha;
- consumíveis/comida: até 99 por pilha;
- moedas não ocupam espaço;
- acesso ao Banco pela Cidade Livre;
- depósito e retirada sem custo;
- pilhas podem ser transferidas parcialmente ou por completo;
- equipamento desequipado preserva a mesma instância ao entrar/sair do Banco;
- equipamento equipado precisa ser desequipado antes do depósito.

As mesmas regras de capacidade agora são aplicadas aos demais caminhos de aquisição da Versão 0.1:

- Coleta;
- Produção;
- Mercado PNJ;
- entrega dos Preparados de Campo ao aceitar o contrato de Dún Liath;
- retirada/extração da Masmorra.

Produção é atômica em relação à capacidade: se o resultado de um ciclo não couber, os ingredientes daquele ciclo não são consumidos. Coleta e Produção interrompidas por falta de capacidade comunicam explicitamente o motivo ao jogador.

## Integridade de combate e equipamento

A auditoria final também fechou os gaps encontrados durante o M6:

- **Anel do Viajante** é equipamento real e aplica `+8 Vida`, `+5 Mana` e `+8 Stamina`;
- partidas antigos com o presente são normalizados pela migração;
- afixos procedurais de equipamento afetam os atributos/estatísticas correspondentes no combate;
- recursos derivados corretos seguem para a entrada e continuidade da Masmorra;
- derrota fora de Masmorra aplica a penalidade monetária prevista;
- derrota dentro de Masmorra não adiciona essa penalidade externa;
- recompensa extra do primeiro Serviço permanece idempotente e só é concedida no primeiro conclusão.

## Comunicação de progresso Ocioso

A decisão de UX aprovada durante a validação também foi integrada ao execução:

- ciclo atual perceptível em Coleta e Produção;
- barra de progresso e tempo restante;
- próxima conclusão/recompensa;
- progresso da Profissão;
- indicador compacto da atividade na camada global de continuidade;
- estados de pausa/interrupção sem ambiguidade;
- falta de materiais ou de capacidade é explicada em vez de aparecer como barra congelada.

## Persistência

Esquema atual:

```text
save_schema_version = 8
```

Principais migrações relevantes ao fechamento:

- v7 introduziu o estado persistente do Banco;
- v8 normaliza o Anel do Viajante como instância de equipamento e preserva compatibilidade com partidas anteriores.

## Validação final

O workflow de fechamento da capacidade de Inventário executou sobre o código final:

```text
pnpm verificar       ✅
pnpm compilar       ✅
```

A suíte inclui testes cruzados para impedir overflow por Coleta, Produção, Mercado, contrato e extração de Masmorra, além dos testes anteriores de Banco, combate, continuidade Ocioso, progressão, persistência e matriz de conteúdo.

O CI normal do repositório deve permanecer verde no commit documental de fechamento; ele é a fonte final de verdade para o estado do `main`.

## Critério de saída

O M6 é considerado concluído porque a Versão 0.1 possui:

- partida Sem conexão versionado e migrável;
- criação/carregamento de personagem;
- sete Profissões e progressão progresso automático durante a ausência;
- fabricação e equipamento;
- Mercado e Banco funcionais no recorte aprovado;
- combate automático determinístico;
- primeiro Serviço;
- Dún Liath — Fácil completa e persistível;
- continuidade Ocioso entre estados seguros e de risco;
- armazenamento protegido contra overflow nos fluxos implementados;
- matriz estrutural 24/24;
- análise estática, verificação de tipos, testes e compilação de produção passando.

Um teste com jogadores humano independente continua recomendado para avaliação qualitativa de ritmo, clareza e sensação de jogo, mas não é contabilizado aqui como teste já executado.
