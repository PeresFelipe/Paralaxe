from pathlib import Path

path = Path('apps/game/src/GameShell.tsx')
text = path.read_text()

import_anchor = "import BankPanel from './BankPanel'\n"
if import_anchor not in text:
    raise SystemExit('BankPanel import anchor not found')
text = text.replace(import_anchor, import_anchor + "import IdleProgressIndicator from './IdleProgressIndicator'\n", 1)

current_card = """      <div className=\"activity-current-card\"><span className=\"section-kicker\">Atividade atual</span><strong>{work?.title ?? 'Nenhuma atividade em andamento'}</strong><small>{work?.detail ?? 'Escolha uma coleta ou produção abaixo.'}</small></div>"""
if current_card not in text:
    raise SystemExit('activity current card anchor not found')
text = text.replace(
    current_card,
    """      <div className=\"activity-current-card\"><IdleProgressIndicator save={save} /></div>""",
    1,
)

footer_old = """            <span aria-hidden=\"true\">⌁</span>\n            <span><small>Atividade atual</small><strong>{work?.title ?? 'Nenhuma atividade'}</strong></span>\n            <em>{work?.detail ?? 'Escolha uma atividade em Atividades'}</em>"""
if footer_old not in text:
    raise SystemExit('continuity footer anchor not found')
text = text.replace(
    footer_old,
    """            <span aria-hidden=\"true\">⌁</span>\n            <IdleProgressIndicator save={save} compact />""",
    1,
)

path.write_text(text)
