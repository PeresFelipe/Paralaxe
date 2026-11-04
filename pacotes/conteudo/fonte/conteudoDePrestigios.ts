/**
 * @file Recursos, ligas, peças e preparações exclusivos dos Prestígios I–III.
 * Nomes das linhas e recursos vêm do GDD §§11–14; tempos, custos, bônus e peças são
 * parâmetros provisórios. Definições declarativas geram IDs estáveis sem uso de RNG.
 */
import type {
  DefinicaoDeAtividadeOciosa, DefinicaoDeReceitaDeFabricacao,
  DefinicaoDeEquipamento, DefinicaoDeConsumivelDeCombate,
} from '@paralaxe/dominio'

const NIVEIS = [1, 15, 30, 45, 60, 75, 90] as const
const COLETAS = ['mineracao', 'lenhador', 'pesca', 'herbologia'] as const

const RECURSOS: Record<(typeof COLETAS)[number], [string[], string[], string[]]> = {
  mineracao: [
    ['Grianchloch','Scáth','Gealach','Fuil','Cuimhne','Anam','Réalta'],
    ['Réalta','Cath','Luaith','Mionn','Créacht','Fothrach','Cogadh'],
    ['Cogadh','Brigid','Nuada','Goibniu','Lugh','Mórrigan','Dagda'],
  ],
  lenhador: [
    ['Iúr','Ceo','Oíche','Draíocht','Aisling','Spiorad','Síoraí'],
    ['Síoraí','Treibh','Dún','Ríocht','Ríshliocht','Oidhreacht','Seanchas'],
    ['Seanchas','Bile','Eó Mugna','Bile Tortan','Eó Rossa','Craeb Dáithí','Craeb Uisnig'],
  ],
  pesca: [
    ['Doingean','Tonn','Solas','Taibhse','Lasair','Stoirm','Doimhneacht'],
    ['Doimhneacht','Ancaire','Cabhlach','Ruathar','Raic','Báite','Uaigh'],
    ['Uaigh','Each Uisce','Dobhar-chú','Murúch','Tarbh Uisce','Ollphéist','Muirdris'],
  ],
  herbologia: [
    ['Marós','Drúcht','Suan','Cogar','Rún','Beatha','Bás'],
    ['Bás','Mosi','Þoka','Ís','Aska','Hraun','Eldur'],
    ['Eldur','Seiður','Völva','Urðr','Verðandi','Skuld','Örlög'],
  ],
}

const LIGAS = [
  ['Grianchloch Refinado','Liga de Scáth','Liga de Gealach','Liga de Fuil','Cuimhne Estabilizado','Liga de Anam','Liga de Réalta'],
  ['Liga de Réalta','Liga de Cath','Vidro de Luaith','Liga de Mionn','Liga de Créacht','Fothrach Reforçado','Liga de Cogadh'],
  ['Liga de Cogadh','Liga de Brigid','Liga de Nuada','Liga de Goibniu','Liga de Lugh','Liga de Mórrigan','Liga de Dagda'],
]
const FORJAS = [
  ['Reforço Sobrenatural','Vinculação','Condução','Têmpera Reativa','Estrutura Híbrida','Forja Espiritual','Obra-Prima Sobrenatural'],
  ['Forja de Campanha','Reforço Militar','Têmpera de Cinzas','Construção de Juramento','Lâmina de Ferida','Reconstrução Antiga','Obra-Prima de Guerra'],
  ['Forja Ancestral','Obra Sagrada','Precisão Absoluta','Forja Magistral','Obra Híbrida Superior','Forja de Lenda','Obra-Prima Absoluta'],
]
const PREPAROS = [
  ['Preparo Sobrenatural','Infusão Superior','Concentração Arcana','Neutralização','Preparo Híbrido','Elixir Espiritual','Grande Preparo Sobrenatural'],
  ['Ração de Campanha','Conservação Extrema','Tônico de Marcha','Medicina de Campo','Refeição de Companhia','Preparo de Cerco','Banquete de Guerra'],
  ['Preparo Ancestral','Mesa dos Povos','Essência Perfeita','Preparo Condicional','Grande Banquete','Receita Perdida','Banquete de Lenda'],
]

/** IDs ASCII previsíveis inclusive para Þ, ð, caracteres compostos e espaços. */
export function slugDeRecurso(nome: string): string {
  return nome.toLowerCase().replaceAll('þ','th').replaceAll('ð','d')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const ultimoNormal: Record<(typeof COLETAS)[number], string> = {
  mineracao: 'material.grianchloch',
  lenhador: 'material.iur', pesca: 'material.doingean', herbologia: 'material.maros',
}

/** Último recurso de uma camada é a primeira matéria da camada seguinte. */
export function idDoRecursoDePrestigio(
  profissao: (typeof COLETAS)[number], prestigio: 1 | 2 | 3, indice: number,
): string {
  if (indice === 0) {
    if (prestigio === 1) return ultimoNormal[profissao]
    return idDoRecursoDePrestigio(profissao, (prestigio - 1) as 1 | 2, 6)
  }
  return `material.prestigio.${profissao}.${slugDeRecurso(RECURSOS[profissao][prestigio-1] ?? [])[indice] ?? '')}`
}

function idDaLiga(prestigio: 1 | 2 | 3, indice: number): string {
  if (indice === 0) {
    if (prestigio === 1) return 'material.grianchloch-refinado'
    return idDaLiga((prestigio - 1) as 1 | 2, 6)
  }
  return `material.prestigio.metalurgia.${slugDeRecurso((LIGAS[prestigio-1] ?? [])[indice] ?? '')}`
}

export const ATIVIDADES_DE_PRESTIGIO: readonly DefinicaoDeAtividadeOciosa[] =
  COLETAS.flatMap(profissao => ([1, 2, 3] as const).flatMap(prestigio =>
    NIVEIS.map((nivel, indice): DefinicaoDeAtividadeOciosa => ({
      id: `coletar.${profissao}.p${prestigio}.${slugDeRecurso(RECURSOS[profissao][prestigio-1] ?? [])[indice] ?? '')}`,
      idDaProfissao: profissao,
      nome: `Coletar ${(RECURSOS[profissao][prestigio-1] ?? [])[indice] ?? ''} · Prestígio ${prestigio}`,
      idDaDefinicaoDoItemProduzido: idDoRecursoDePrestigio(profissao, prestigio, indice),
      nomeDoResultado: (RECURSOS[profissao][prestigio-1] ?? [])[indice] ?? '',
      nivelExigidoDaProfissao: nivel, prestigioExigido: prestigio,
      segundosPorAcao: 10 + prestigio*3 + indice*3,
      xpDeProfissaoPorAcao: 18 + prestigio*10 + indice*9,
    })),
  ))

export const RECEITAS_DE_PRESTIGIO: readonly DefinicaoDeReceitaDeFabricacao[] =
  ([1, 2, 3] as const).flatMap(prestigio => NIVEIS.flatMap((nivel, indice): DefinicaoDeReceitaDeFabricacao[] => {
    const metal = idDaLiga(prestigio, indice)
    const madeira = idDoRecursoDePrestigio('lenhador', prestigio, indice)
    const peixe = idDoRecursoDePrestigio('pesca', prestigio, indice)
    const erva = idDoRecursoDePrestigio('herbologia', prestigio, indice)
    const comida = `item.consumivel.p${prestigio}.${slugDeRecurso((PREPAROS[prestigio-1] ?? [])[indice] ?? '')}`
    const arma = `arma.p${prestigio}.${slugDeRecurso((FORJAS[prestigio-1] ?? [])[indice] ?? '')}`
    return [
      { id: `receita.metalurgia.p${prestigio}.${slugDeRecurso((LIGAS[prestigio-1] ?? [])[indice] ?? '')}`,
        idDaProfissao: 'metalurgia', nome: (LIGAS[prestigio-1] ?? [])[indice] ?? '',
        prestigioExigido: prestigio, nivelExigidoDaProfissao: nivel,
        segundosPorAcao: 15 + prestigio*5 + indice*4, xpDeProfissaoPorAcao: 25 + prestigio*12 + indice*9,
        ingredientes: [{ idDaDefinicao: idDoRecursoDePrestigio('mineracao', prestigio, indice), quantidade: 3 }],
        saida: { tipo: 'item', idDaDefinicao: metal, nome: (LIGAS[prestigio-1] ?? [])[indice] ?? '', quantidade: 1 },
      },
      { id: `receita.forja.p${prestigio}.${slugDeRecurso((FORJAS[prestigio-1] ?? [])[indice] ?? '')}`,
        idDaProfissao: 'forja', nome: `Peça de ${(FORJAS[prestigio-1] ?? [])[indice] ?? ''}`,
        prestigioExigido: prestigio, nivelExigidoDaProfissao: nivel,
        segundosPorAcao: 25 + prestigio*6 + indice*5, xpDeProfissaoPorAcao: 40 + prestigio*15 + indice*11,
        ingredientes: [{ idDaDefinicao: metal, quantidade: 2 }, { idDaDefinicao: madeira, quantidade: 3 }],
        saida: { tipo: 'equipamento', idDaDefinicao: arma, nome: `Peça de ${(FORJAS[prestigio-1] ?? [])[indice] ?? ''}` },
      },
      { id: `receita.culinaria.p${prestigio}.${slugDeRecurso((PREPAROS[prestigio-1] ?? [])[indice] ?? '')}`,
        idDaProfissao: 'culinaria', nome: (PREPAROS[prestigio-1] ?? [])[indice] ?? '',
        prestigioExigido: prestigio, nivelExigidoDaProfissao: nivel,
        segundosPorAcao: 18 + prestigio*5 + indice*3, xpDeProfissaoPorAcao: 28 + prestigio*12 + indice*9,
        ingredientes: [{ idDaDefinicao: peixe, quantidade: 2 }, { idDaDefinicao: erva, quantidade: 2 }],
        saida: { tipo: 'item', idDaDefinicao: comida, nome: (PREPAROS[prestigio-1] ?? [])[indice] ?? '', quantidade: 1 },
      },
    ]
  }))

export const EQUIPAMENTOS_DE_PRESTIGIO: readonly DefinicaoDeEquipamento[] =
  ([1,2,3] as const).flatMap(prestigio => NIVEIS.map((_, indice): DefinicaoDeEquipamento => ({
    id: `arma.p${prestigio}.${slugDeRecurso((FORJAS[prestigio-1] ?? [])[indice] ?? '')}`,
    nome: `Peça de ${(FORJAS[prestigio-1] ?? [])[indice] ?? ''}`,
    espaco: 'maoPrincipal', estatisticaPrincipal: { tipo: 'ataque', valor: 20 + prestigio*12 + indice*5 },
    combateDaArma: { tipoDeDano: 'corte', intervaloDeAcaoEmSegundos: 2.2, escalonamento: { forca: 'B', destreza: 'C' } },
  })))

export const CONSUMIVEIS_DE_PRESTIGIO: readonly DefinicaoDeConsumivelDeCombate[] =
  ([1,2,3] as const).flatMap(prestigio => NIVEIS.map((_,indice): DefinicaoDeConsumivelDeCombate => ({
    id: `item.consumivel.p${prestigio}.${slugDeRecurso((PREPAROS[prestigio-1] ?? [])[indice] ?? '')}`,
    nome: (PREPAROS[prestigio-1] ?? [])[indice] ?? '',
    restaurar: { vida: 35 + prestigio*35 + indice*12, mana: 15 + prestigio*18 + indice*7,
      folego: 20 + prestigio*20 + indice*8 },
  })))
