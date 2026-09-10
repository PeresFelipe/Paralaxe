from pathlib import Path
import re

path = Path('docs/implementation/M5.5-UX-FOUNDATION.md')
text = path.read_text(encoding='utf-8')

replacement = r'''## Decisões ainda pendentes

As decisões estruturais de UX não estão mais em aberto. Permanecem apenas decisões de protótipo, playtest e implementação que não exigem reabrir a arquitetura aprovada por padrão:

1. confirmar ou ajustar a paleta 0.1 após teste real de contraste e leitura;
2. confirmar Spectral/Inter ou substituir por famílias equivalentes preservando as funções display × dados;
3. definir dimensões finais de componentes por viewport;
4. fechar o set final de ícones operacionais;
5. calibrar textura, ornamentação, bordas e intensidade das artes em telas frequentes;
6. definir animações concretas e suas durações;
7. definir paisagem sonora e efeitos concretos;
8. construir o protótipo de alta fidelidade começando por Atividades → Mineração;
9. derivar as demais telas principais a partir da linguagem validada;
10. executar playtest dos cenários críticos e registrar problemas observados;
11. aplicar refinamentos de posição, densidade, hierarquia e acessibilidade derivados de evidência;
12. migrar os workbenches para a experiência final aprovada durante a Fase 3.

Qualquer retorno a decisões como navegação principal, organização de Personagem/Atividades/Aventura/Cidade/Jornada, continuidade Idle, estados de risco ou padrões de mídia exige evidência concreta de problema no protótipo ou playtest.

---

'''

pattern = r'## Decisões que ainda precisamos tomar\n.*?(?=## Regra de trabalho durante o M5\.5)'
updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'expected one stale decisions block, got {count}')
path.write_text(updated, encoding='utf-8')
