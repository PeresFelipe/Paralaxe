# M6 — Build 0.1 validável

## Estado

O M6 foi retomado após o fechamento do M5.5.

A matriz estrutural `6 classes × 4 rotas` chegou a **24/24** após corrigir uma decisão inválida da automação de combate: Técnicas de restauração não são mais escolhidas quando não restaurariam nenhum recurso.

## Causa do bloqueio anterior

O caso conhecido era:

```text
Mago × Mineração → Cosantóir
```

O loadout pré-Dún Liath do Mago inclui `Fôlego de Combate`. Em Vida baixa, a Técnica podia ser priorizada por seu perfil defensivo mesmo com Stamina cheia. Isso consumia uma ação sem produzir efeito, reduzindo desnecessariamente a capacidade de concluir a rota de Mineração, que não possui sustain adicional como Pesca/Herbologia.

A correção foi feita no motor de seleção de Técnicas, não nos números do Cosantóir e não nos valores da rota de Mineração.

Regra agora aplicada:

> Uma Técnica cuja única função relevante seja restaurar recursos não deve ser selecionada se nenhum dos recursos que ela restaura estiver abaixo do máximo.

## Cobertura adicionada

Foi adicionado teste de domínio garantindo que `Fôlego de Combate` seja ignorado quando a Stamina já está cheia e que a automação avance para uma ação válida.

Validação isolada após a correção:

```text
Domain tests     ✅
Content matrix   ✅ 24/24
```

A validação completa do repositório (`lint + typecheck + tests + production build`) deve permanecer verde antes do fechamento formal do M6.
