# M6 — Build 0.1 validável

## Estado

O M6 foi retomado após o fechamento do M5.5.

A matriz estrutural `6 classes × 4 rotas` chegou a **24/24** após corrigir uma decisão inválida da automação de combate: Técnicas de restauração não são mais escolhidas quando não restaurariam nenhum recurso.

A auditoria dos requisitos da Build 0.1 também identificou o Banco como requisito funcional ainda ausente. O Banco foi integrado ao domínio, persistência e UI da Cidade antes do fechamento do marco.

## Correção da automação — Mago × Mineração

O caso conhecido era:

```text
Mago × Mineração → Cosantóir
```

O loadout pré-Dún Liath do Mago inclui `Fôlego de Combate`. Em Vida baixa, a Técnica podia ser priorizada por seu perfil defensivo mesmo com Stamina cheia. Isso consumia uma ação sem produzir efeito, reduzindo desnecessariamente a capacidade de concluir a rota de Mineração, que não possui sustain adicional como Pesca/Herbologia.

A correção foi feita no motor de seleção de Técnicas, não nos números do Cosantóir e não nos valores da rota de Mineração.

Regra agora aplicada:

> Uma Técnica cuja única função relevante seja restaurar recursos não deve ser selecionada se nenhum dos recursos que ela restaura estiver abaixo do máximo.

Foi adicionado teste de domínio garantindo que `Fôlego de Combate` seja ignorado quando a Stamina já está cheia e que a automação avance para uma ação válida.

## Banco da Build 0.1

Implementado conforme o plano de validação:

- Inventário com referência estrutural de 24 slots distintos;
- Banco com 80 slots distintos;
- acesso ao Banco pela Cidade Livre;
- depósito e retirada sem custo;
- transferência de pilhas;
- transferência de equipamento desequipado preservando a mesma instância;
- equipamento atualmente equipado precisa ser desequipado antes de ser depositado;
- retirada respeita espaço disponível no Inventário;
- depósito respeita espaço disponível no Banco;
- UI operacional com capacidade de Inventário/Banco e ações `Depositar 1`, `Tudo`, `Retirar 1` e `Tudo`;
- save schema atualizado para v7;
- saves v6 recebem Banco vazio por migração automática.

## Validação

A correção de automação isolada confirmou:

```text
Domain tests     ✅
Content matrix   ✅ 24/24
```

A integração do Banco confirmou no workflow de implementação:

```text
pnpm check       ✅
pnpm build       ✅
```

A validação normal do repositório deve permanecer verde sobre o commit final antes do fechamento formal do M6.

## Auditoria restante antes do fechamento

Ainda devem ser confrontados com o plano de validação os pontos que já tiveram suspeita registrada durante a implementação:

- efeito do Anel do Viajante;
- penalidade monetária de derrota fora de Dungeon;
- geração/aplicação de afixos de equipamento;
- aplicação consistente das capacidades de armazenamento;
- recompensas e idempotência do primeiro Serviço/onboarding.

Nenhum deles deve ser ignorado apenas porque a matriz estrutural chegou a 24/24.
