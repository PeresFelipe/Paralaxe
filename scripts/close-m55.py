from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'anchor not found: {label}')
    return text.replace(old, new, 1)


m55_path = Path('docs/implementation/M5.5-UX-FOUNDATION.md')
m55 = m55_path.read_text()
m55 = replace_once(
    m55,
    """Fase 1 — UX canônica                         ✅
Fase 2 — UX aplicada / wireframes            ✅
Fase 2.5 — Direção Visual 0.1                ✅
Fase 2.5 — Protótipo alta fidelidade         ✅
Fase 2.5 — Playtest de UX                    ⏳
Fase 3 — Implementação da UX                 🟡 EM IMPLEMENTAÇÃO
""",
    """Fase 1 — UX canônica                         ✅
Fase 2 — UX aplicada / wireframes            ✅
Fase 2.5 — Direção Visual 0.1                ✅
Fase 2.5 — Protótipo alta fidelidade         ✅
Fase 2.5 — Revisão heurística / hi-fi        ✅
Fase 3 — Implementação da UX                 ✅
M5.5 — UX Foundation                         ✅ FECHADO
""",
    'M5.5 status table',
)
m55 = replace_once(
    m55,
    """A fundação de arquitetura de informação, estados, fluxos, responsividade, mídia e direção visual 0.1 está **congelada**. O protótipo hi-fi navegável v0.2 permanece como referência de validação e a **Fase 3 já começou na build real**. Isso não encerra o M5.5: playtest humano, refinamentos e conclusão da migração continuam pendentes.

Alterações estruturais só devem reabrir decisões congeladas quando protótipo ou teste fornecer evidência concreta de problema.
""",
    """A fundação de arquitetura de informação, estados, fluxos, responsividade, mídia e direção visual 0.1 está **congelada e implementada na build real**. O protótipo hi-fi navegável v0.2 permanece como referência histórica da migração.

O M5.5 é encerrado por atendimento dos critérios estruturais, revisão heurística, aprovação iterativa do fluxo e validação técnica da implementação. Um playtest humano independente continua recomendado como validação contínua, mas não bloqueia mais o marco e **não é registrado como concluído sem evidência externa**.

Alterações estruturais só devem reabrir decisões congeladas quando uso real, protótipo ou teste fornecer evidência concreta de problema.
""",
    'M5.5 closure paragraph',
)
m55 = replace_once(
    m55,
    """Pendente:

24. playtest dos cenários críticos;
25. refinamentos visuais e de interação a partir de evidência.

### Fase 3 — implementação 🟡

Pendente:

26. migração dos workbenches para views normais ou rota interna de desenvolvimento;
27. implementação do shell e navegação;
28. implementação dos estados/fluxos aprovados;
29. validação manual do fluxo completo sem depender de conhecimento técnico.
""",
    """Validação contínua, não bloqueante:

24. playtest humano independente dos cenários críticos;
25. refinamentos visuais e de interação quando houver evidência observada.

### Fase 3 — implementação ✅

Concluída:

26. workbenches removidos da raiz e integrados como views controladas pelo save ativo;
27. `GameShell` e navegação canônica implementados no runtime;
28. estados e fluxos aprovados integrados, incluindo Preparação, Combate, Dungeon, retorno offline e continuidade Idle;
29. fluxo novo save → Dún Liath integrado sem exigir abertura de ferramentas técnicas;
30. distribuição de pontos de Atributo ligada ao domínio, com pré-visualização e confirmação antes da persistência;
31. lint e typecheck sem erros; testes de domínio e persistência passando; build de produção validada separadamente.

O playtest humano independente permanece recomendado, mas qualquer resultado futuro é evidência para refinamento contínuo e não impede o fechamento estrutural do M5.5.
""",
    'M5.5 Phase 3 deliverables',
)
m55_path.write_text(m55)

status_path = Path('docs/implementation/CURRENT-STATUS.md')
status = status_path.read_text()
status = replace_once(
    status,
    """**M5.5 — UX Foundation**.

O M6 — Build 0.1 validável permanece temporariamente pausado enquanto concluímos o M5.5. A arquitetura de UX já foi aprovada e a **Fase 3 está em implementação na build real**: o shell canônico substituiu a raiz de workbenches empilhados e os sistemas estão sendo migrados para um único fluxo de jogo.
""",
    """**M6 — Build 0.1 validável**.

O **M5.5 — UX Foundation está fechado**. A navegação canônica, o `GameShell`, os estados de risco, a continuidade Idle, o retorno offline, o visual runtime e a estratégia responsiva foram integrados à build real. O M6 é retomado com o balanceamento/validação 23/24 como bloqueio conhecido.
""",
    'CURRENT milestone',
)
status = replace_once(
    status,
    """1. definir arquitetura de informação e menu;
2. definir `GameShell`;
3. usar a Cidade Livre como contexto/hub principal;
4. separar navegação de atividade Idle;
5. dar foco próprio a combate e Dungeon;
6. migrar os workbenches atuais para views normais ou ferramentas internas;
7. encaixar o onboarding completo na navegação;
8. definir estratégia desktop e mobile;
9. validar o fluxo novo save → Dún Liath sem depender de ferramentas técnicas.
""",
    """1. resolver o caso `Mago × Mineração → Cosantóir` sem mascarar o balanceamento;
2. restaurar a matriz automatizada 6 classes × 4 rotas para 24/24;
3. validar o fluxo real novo save → Dún Liath sobre o `GameShell` integrado;
4. corrigir regressões funcionais encontradas na validação da Build 0.1;
5. manter Banco, Ferreiro e Relicário como destinos da Cidade sem inventar regras de domínio ainda não aprovadas.
""",
    'CURRENT priorities',
)
status = replace_once(
    status,
    """M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      🟡 EM IMPLEMENTAÇÃO
M6 — Build 0.1 validável                  ⏸ PAUSADO
""",
    """M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      ✅
M6 — Build 0.1 validável                  🟡 EM VALIDAÇÃO
""",
    'CURRENT ladder',
)
status = replace_once(
    status,
    """## Migração de UX — Fase 3

A raiz antiga com `App`, `MarketWorkbench`, `CombatWorkbench` e `DungeonWorkbench` empilhados foi removida. O runtime agora renderiza apenas `App`, que controla um único save ativo e apresenta o `GameShell`.
""",
    """## Migração de UX — Fase 3 ✅

A Fase 3 do M5.5 está concluída. A raiz antiga com `App`, `MarketWorkbench`, `CombatWorkbench` e `DungeonWorkbench` empilhados foi removida. O runtime agora renderiza apenas `App`, que controla um único save ativo e apresenta o `GameShell`.
""",
    'CURRENT Phase 3 heading',
)
status = replace_once(
    status,
    """Esse balanceamento não será mascarado durante o M5.5. A investigação volta depois que a experiência estiver navegável e o fluxo real de preparação puder ser testado corretamente.
""",
    """Esse balanceamento não foi mascarado durante o M5.5 e agora volta a ser o bloqueio principal do **M6**. A validação final do M5.5 confirmou lint e typecheck sem erros, 34/34 testes de domínio passando, persistência passando e build de produção concluída com sucesso; o CI normal permanece vermelho exclusivamente porque a matriz ainda está em 23/24.
""",
    'CURRENT M6 blocker paragraph',
)
status_path.write_text(status)

readme_path = Path('README.md')
readme = readme_path.read_text()
readme = replace_once(
    readme,
    """```text
M5.5 — UX Foundation
```

O M6 — Build 0.1 validável está temporariamente pausado após um playtest manual revelar um problema de arquitetura de experiência: os sistemas foram implementados e validados incrementalmente através de workbenches técnicos, mas ainda não existe uma navegação de jogo coerente.

O M5.5 entra formalmente entre M5 e M6:
""",
    """```text
M6 — Build 0.1 validável
```

O **M5.5 — UX Foundation foi concluído**. A build real agora usa o `GameShell` canônico, uma única view principal por vez, continuidade Idle, estados focados de risco e a arquitetura `Personagem / Atividades / Aventura / Cidade`.

O M5.5 permanece formalmente entre M5 e M6:
""",
    'README milestone intro',
)
readme = replace_once(
    readme,
    """M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      🟡
M6 — Build 0.1 validável                  ⏸
""",
    """M5 — Dún Liath completa                   ✅
M5.5 — UX Foundation                      ✅
M6 — Build 0.1 validável                  🟡
""",
    'README ladder',
)
readme = replace_once(
    readme,
    """O objetivo do M5.5 é transformar os sistemas existentes em uma experiência navegável: `GameShell`, menu, Cidade Livre como contexto central, atividade Idle persistente durante navegação, telas focadas de combate/Dungeon e estratégia explícita para desktop/mobile.
""",
    """O M5.5 consolidou os sistemas existentes em uma experiência navegável: `GameShell`, navegação canônica, continuidade Idle durante áreas seguras/Preparação, estados focados de Combate/Dungeon e estratégia explícita para desktop/mobile. O M6 retoma a validação da Build 0.1 com o caso conhecido `Mago × Mineração → Cosantóir` ainda em 23/24.
""",
    'README M5.5 summary',
)
readme_path.write_text(readme)
