from pathlib import Path
import re

ux_path = Path('docs/UX-GDD.md')
ux = ux_path.read_text(encoding='utf-8')

visual = r'''---

# 36. Direção Visual 0.1

A Direção Visual 0.1 é a baseline aprovada para prototipagem de alta fidelidade. Ela concretiza os princípios de UX sem transformar valores de protótipo em regras imutáveis.

> **A estrutura permanece limpa e previsível; a atmosfera Dark Fantasy vem de arte, superfícies, tipografia de destaque, som e microinterações sem sacrificar legibilidade.**

## Paleta-base de protótipo

Papéis semânticos iniciais:

| Papel | Referência 0.1 | Uso principal |
|---|---|---|
| Fundo profundo | `#101315` | fundo geral |
| Superfície | `#171C1F` | painéis e cards |
| Superfície elevada | `#20262A` | seleção e overlays |
| Borda | `#343B3F` | separação |
| Texto principal | `#E5E1D8` | leitura principal |
| Texto secundário | `#A9AAA5` | informação auxiliar |
| Ferro claro | `#C4C7C5` | detalhe neutro |
| Bronze envelhecido | `#A98555` | ação importante e destaque |
| Azul frio | `#718C95` | Mana/contextos frios |
| Verde dessaturado | `#788A72` | estado positivo |
| Âmbar | `#B99255` | atenção |
| Carmesim | `#9E5550` | perigo e dano |

Esses valores são baseline de protótipo. Contraste, acessibilidade e playtest podem exigir ajuste sem reabrir a arquitetura visual.

Bronze envelhecido funciona como acento principal de interface para evitar aparência tecnológica genérica. Raridade, perigo, sucesso e outros estados continuam usando texto, forma e/ou ícone além de cor.

## Tipografia

A interface separa duas funções:

```text
DISPLAY / MUNDO
→ personalidade em nomes de lugares, Bosses e títulos especiais

INTERFACE / DADOS
→ máxima legibilidade em números, menus, requisitos e estados
```

Referências iniciais para protótipo:

- **Spectral** para display/mundo;
- **Inter** para interface/dados.

Essas famílias são candidatas 0.1 e podem ser substituídas após avaliação visual, desde que a separação funcional permaneça.

Fontes ornamentais ou góticas não devem comprometer leitura de dados operacionais.

## Formas e superfícies

A linguagem evita cards excessivamente arredondados de aplicativo moderno e também evita molduras medievais pesadas em todos os controles.

Referência inicial:

- cantos discretos, aproximadamente 4–8 px no protótipo;
- superfícies escuras, frias e pouco saturadas;
- bordas legíveis;
- ornamentação concentrada em títulos, divisores, estados especiais e momentos narrativos;
- textura sutil quando não interfere em texto ou affordance.

Botões principais podem usar bronze escuro/envelhecido com contraste claro. Botões secundários usam superfície neutra e borda. Ações terciárias podem usar texto/ícone.

A tela não deve virar uma coleção de botões preenchidos de igual peso.

## Hierarquia tipográfica e de informação

Quatro níveis devem ser reconhecíveis rapidamente:

```text
TÍTULO DO CONTEXTO
DÚN LIATH

SEÇÃO
TÉCNICAS

ELEMENTO
Golpe Calculado

METADADO
Cooldown 4,0 s
```

A diferença pode combinar família tipográfica, tamanho, peso, espaçamento e posição, sem depender apenas de cor.

## Espaçamento

Escala inicial de protótipo:

```text
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64
```

É uma régua de consistência, não contrato rígido de pixel.

> **Denso quando necessário, nunca apertado.**

Telas operacionais podem ter maior densidade interna, preservando separação clara entre grupos funcionais.

## Ícones

Ícones operacionais usam:

- silhueta clara;
- desenho simples;
- peso visual consistente;
- poucos detalhes internos;
- significado reconhecível em tamanhos pequenos.

Vida, Mana, Stamina e status devem possuir sinais próprios. Itens, recursos e Técnicas usam suas artes/thumbnails 1:1 e não dependem de ícones operacionais minúsculos para identidade.

## Uso da arte na interface

A arte é a principal fonte de atmosfera, mas dados importantes permanecem em superfícies legíveis da interface.

Gradientes ou overlays podem melhorar contraste quando texto realmente precisar coexistir com a imagem, sem cobrir toda a arte com escurecimento pesado.

A intensidade visual acompanha a frequência de uso:

```text
primeiro contato / momento narrativo
→ arte pode dominar mais espaço

uso recorrente / tela operacional
→ arte pode reduzir presença
```

Essa redução preserva a identidade visual do contexto.

## Assinatura visual por estado

Estados principais devem ser perceptivelmente diferentes sem exigir uma nova linguagem a cada tela:

```text
SAFE
→ estrutura estável e neutra

PREPARAÇÃO
→ foco crescente, contraste e acento de compromisso

DUNGEON
→ localização, estado e risco persistentes

COMBATE
→ molduras administrativas recuam; ação e ameaça dominam

BOSS / MOMENTO NARRATIVO
→ ruptura visual breve antes de retornar à gramática funcional
```

O jogador deve sentir visualmente a diferença entre navegar, preparar-se e assumir risco.

## Telegraphs

Telegraphs são uma assinatura visual importante de Greywake.

Um telegraph perigoso combina, quando aplicável:

- nome da ação;
- tempo restante;
- progresso temporal;
- efeito/tipo conhecido;
- forma/ícone relevante;
- movimento ou pulso complementar.

Reduzir movimento não pode reduzir a informação disponível.

## Escala de feedback

A apresentação acompanha a importância:

```text
loot/recurso comum
→ feedback mínimo

Skill / desbloqueio
→ feedback contextual

Relíquia / Boss / Dungeon concluída
→ momento dedicado
```

Eventos repetitivos não competem com eventos raros.

## Tela de referência para alta fidelidade

A primeira tela recomendada para protótipo visual é **Atividades → Mineração**, porque combina:

- shell seguro;
- navegação principal;
- arte contextual 16:9;
- recurso/item 1:1;
- nível e XP;
- atividade Idle ativa;
- seleção de recurso;
- informação decisional e detalhes avançados;
- acesso rápido a Inventário e Jornada.

Validar essa tela primeiro permite derivar grande parte da linguagem visual de Atividades e dos estados seguros antes de avançar para telas especiais.

---

# 37. Decisões ainda em aberto

A arquitetura de informação, os estados principais, a relação safe/risk, a organização de Personagem/Atividades/Aventura/Cidade/Jornada, a continuidade Idle, a gramática de Preparação/Combate/Dungeon, a base responsiva, o sistema de mídia e a Direção Visual 0.1 estão aprovados como fundação.

Permanecem deliberadamente abertos para protótipo de alta fidelidade e playtest:

- ajuste final da paleta a partir de contraste e leitura real;
- confirmação ou substituição das famílias tipográficas de referência;
- dimensões finais de componentes e espaçamentos específicos por viewport;
- estilo final do set de ícones;
- intensidade concreta de texturas, bordas e ornamentação;
- comportamento exato das artes reduzidas após familiaridade;
- animações concretas e suas durações finais;
- paisagem sonora e efeitos concretos;
- refinamentos de posição, densidade e hierarquia revelados pelo protótipo/playtest;
- detalhes de acessibilidade dependentes dos componentes e tecnologia escolhidos.

Esses refinamentos podem alterar a aparência concreta sem reabrir os princípios e a arquitetura aprovados, salvo evidência de problema estrutural.
'''

pattern = r'---\n\n# 36\. Decisões ainda em aberto\n.*\Z'
ux2, count = re.subn(pattern, visual, ux, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'UX-GDD: expected final section match once, got {count}')
ux_path.write_text(ux2, encoding='utf-8')

m_path = Path('docs/implementation/M5.5-UX-FOUNDATION.md')
m = m_path.read_text(encoding='utf-8')

status = '''# M5.5 — UX Foundation

## Status atual

```text
Fase 1 — UX canônica                         ✅
Fase 2 — UX aplicada / wireframes            ✅
Fase 2.5 — Direção Visual 0.1                ✅
Fase 2.5 — Protótipo alta fidelidade         ⏳
Fase 2.5 — Playtest de UX                    ⏳
Fase 3 — Implementação da UX                 ⏳
```

A fundação de arquitetura de informação, estados, fluxos, responsividade, mídia e direção visual 0.1 está **congelada para prototipagem**. Isso não encerra o M5.5: protótipo, playtest e implementação continuam pendentes.

Alterações estruturais só devem reabrir decisões congeladas quando protótipo ou teste fornecer evidência concreta de problema.
'''
m = m.replace('# M5.5 — UX Foundation\n', status, 1)
m = m.replace('## Constituição provisória de UX', '## Constituição aprovada de UX', 1)

approved_nav = r'''## Fundação de navegação aprovada

### Uma tela principal por vez

O jogador não vê Mercado, combate, Dungeon e crafting empilhados na mesma página. O shell apresenta uma experiência principal por vez.

### Arquitetura mental

```text
GREYWAKE

NAVEGAÇÃO PRINCIPAL
├── Personagem
├── Atividades
├── Aventura
└── Cidade

CAMADA GLOBAL DE CONTINUIDADE
└── Jornada
```

Jornada não é um quinto destino equivalente. Ela recupera atividade, objetivo/contexto, descobertas e acontecimentos recentes sem destruir o contexto atual.

### Personagem

```text
Personagem
├── Visão Geral
├── Atributos
├── Equipamento
├── Técnicas
└── Inventário
```

Inventário pertence conceitualmente a Personagem e possui também acesso rápido global ao mesmo estado.

### Atividades

```text
Atividades
├── Coleta
│   ├── Mineração
│   ├── Lenhador
│   ├── Pesca
│   └── Herbologia
└── Produção
    ├── Metalurgia
    ├── Forja
    └── Culinária
```

A atividade Idle continua enquanto o jogador navega por contextos seguros.

### Aventura

```text
Aventura
├── Serviços
└── Dungeons
```

Combate não é destino permanente; é estado contextual.

### Cidade Livre

```text
Cidade
├── Taverna
├── Mercado
├── Ferreiro
├── Banco
└── Relicário
```

A Cidade é contexto forte de mundo e serviços, mas não é hub world-first obrigatório para acessar Skills.

**Forja** é Skill do jogador; **Ferreiro** é serviço/NPC da Cidade.

### Shell seguro

O shell seguro mantém identidade do personagem, Vida/Mana/Stamina, moeda secundária, navegação principal, atividade Idle atual de forma compacta, Inventário rápido, Jornada e Configurações.

> **Global não significa permanentemente chamativo.**

### Estados especiais

```text
SAFE
↓
PREPARAÇÃO
↓ confirmar
COMBATE / DUNGEON
↓ concluir / retirar / morrer
SAFE
```

Idle continua em Safe e Preparação, pausa em Combate/Dungeon e retoma automaticamente ao voltar à segurança.

Combate e Dungeon assumem foco e reduzem a navegação global. Preparação preserva possibilidade de retorno ao contexto de origem.

### Workbenches são internos

Componentes técnicos podem sobreviver em rota/dev mode separado, mas não compõem a experiência normal do jogador.

---

'''
pattern_nav = r'## Princípios de navegação ainda provisórios\n.*?(?=## Preparação contextual)'
m2, count = re.subn(pattern_nav, approved_nav, m, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'M5.5 nav: expected one match, got {count}')
m = m2

m = m.replace('Navegar enquanto atividade continua, se essa hipótese for aprovada', 'Navegar enquanto atividade continua', 1)

visual_m = r'''## Direção Visual 0.1 aprovada

A baseline de protótipo combina:

```text
ESTRUTURA
limpa, previsível e legível

SUPERFÍCIE
Dark Fantasy fria e dessaturada

ACENTO
bronze envelhecido

ARTE
autoral e contextual

TIPOGRAFIA
personalidade em display, máxima legibilidade em dados

MOVIMENTO
contido e informativo
```

Referências iniciais de protótipo:

- fundo profundo `#101315`;
- superfície `#171C1F`;
- superfície elevada `#20262A`;
- texto principal `#E5E1D8`;
- texto secundário `#A9AAA5`;
- bronze envelhecido `#A98555` como acento principal;
- Spectral como referência de display;
- Inter como referência de interface/dados;
- escala de espaçamento `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`;
- cantos discretos como referência inicial, aproximadamente `4–8 px` no protótipo.

Esses valores não são regras finais de produção. Podem ser refinados por contraste, acessibilidade e playtest sem reabrir a arquitetura visual.

A primeira tela recomendada para alta fidelidade é **Atividades → Mineração**.

---

'''
marker = '## Método de validação de UX\n'
if marker not in m:
    raise SystemExit('M5.5: validation marker not found')
m = m.replace(marker, visual_m + marker, 1)

entregaveis = r'''## Entregáveis do M5.5

### Fase 1 — UX canônica ✅

Concluída:

1. princípios permanentes de UX incorporados ao GDD;
2. modelo mental desejado;
3. arquitetura de informação aprovada;
4. relação Cidade / sistemas / Skills / combate / Dungeon;
5. política de informação persistente × contextual;
6. continuidade Idle;
7. experiência de retorno;
8. onboarding;
9. acessibilidade estrutural.

### Fase 2 — UX aplicada / wireframes ✅

Concluída em nível de fundação:

10. mapa de navegação;
11. shell seguro;
12. estratégia desktop/mobile;
13. fluxos de Personagem, Atividades, Aventura, Cidade e Jornada;
14. fluxo Serviço/Combate;
15. Preparação e Dungeon;
16. estados de loading, vazio, sucesso e erro;
17. wireframes conceituais dos fluxos principais.

### Fase 2.5 — Visual Design e protótipo 🟡

Concluído:

18. Direção Visual 0.1;
19. sistema de mídia 16:9 / 4:5 / 1:1;
20. hierarquia visual, superfícies, acento, tipografia funcional e escala inicial de espaçamento.

Pendente:

21. protótipo de alta fidelidade começando por Atividades → Mineração;
22. derivação das demais telas principais;
23. playtest dos cenários críticos;
24. refinamentos visuais e de interação a partir de evidência.

### Fase 3 — implementação ⏳

Pendente:

25. migração dos workbenches para views normais ou rota interna de desenvolvimento;
26. implementação do shell e navegação;
27. implementação dos estados/fluxos aprovados;
28. validação manual do fluxo completo sem depender de conhecimento técnico.

---

'''
pattern_ent = r'## Entregáveis do M5\.5\n.*?(?=## Critérios de aceite)'
m2, count = re.subn(pattern_ent, entregaveis, m, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'M5.5 deliverables: expected one match, got {count}')
m = m2

m_path.write_text(m, encoding='utf-8')
