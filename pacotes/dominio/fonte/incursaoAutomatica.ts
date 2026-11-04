/**
 * @file Núcleo puro da Incursão Automática de Dún Liath (GDD §23).
 * Não executa a expedição manual, não concede itens por si só e não altera saves.
 * A aplicação deverá persistir o início e liquidar o resultado uma única vez.
 */
export type PresetDeIncursao = 'cautelosa' | 'equilibrada' | 'ousada'

export interface PlanoDeIncursaoAutomatica {
  preset: PresetDeIncursao
  iniciadaEm: string
  terminaEm: string
  semente: number
  chanceDeSucesso: number
  recompensaPossivel: ReadonlyArray<{ idDaDefinicao: string; quantidade: number }>
}

export interface ResultadoDeIncursaoAutomatica {
  concluida: boolean
  sucesso: boolean | null
  recompensa: ReadonlyArray<{ idDaDefinicao: string; quantidade: number }>
}

const PRESETS: Record<PresetDeIncursao, { minutos: number; chanceBase: number; vigas: number }> = {
  cautelosa: { minutos: 15, chanceBase: 0.82, vigas: 1 },
  equilibrada: { minutos: 30, chanceBase: 0.67, vigas: 2 },
  ousada: { minutos: 60, chanceBase: 0.52, vigas: 3 },
}

/** Uma recompensa comum; documentos, Relíquias e espólios exclusivos do Chefe não entram no modo. */
const RECURSO_COMUM = 'item.dun-liath.viga'

function instanteValido(valor: string): number {
  const instante = Date.parse(valor)
  if (!Number.isFinite(instante)) throw new Error('Horário inválido para a incursão.')
  return instante
}

/** A força é um índice não negativo definido pelo serviço chamador, nunca uma probabilidade livre. */
export function planejarIncursaoAutomatica(
  preset: PresetDeIncursao,
  poder: number,
  semente: number,
  iniciadaEm: string,
  dunLiathFacilConquistado: boolean,
): PlanoDeIncursaoAutomatica {
  if (!dunLiathFacilConquistado) throw new Error('Conclua Dún Liath Fácil antes da Incursão Automática.')
  const configuracao = PRESETS[preset]
  if (!configuracao) throw new Error('Preset de incursão desconhecido.')
  if (!Number.isFinite(poder) || poder < 0) throw new Error('Poder de incursão inválido.')
  if (!Number.isSafeInteger(semente) || semente < 0 || semente > 0xffffffff) {
    throw new Error('Semente de incursão inválida.')
  }
  const inicio = instanteValido(iniciadaEm)
  // Balanceamento provisório: bônus limitado a 12 p.p. para não garantir sucesso.
  const chanceDeSucesso = Math.min(0.94, configuracao.chanceBase + Math.min(0.12, poder / 1000))
  return {
    preset,
    iniciadaEm: new Date(inicio).toISOString(),
    terminaEm: new Date(inicio + configuracao.minutos * 60_000).toISOString(),
    semente,
    chanceDeSucesso,
    recompensaPossivel: [{ idDaDefinicao: RECURSO_COMUM, quantidade: configuracao.vigas }],
  }
}

/** Sorteio puro: a mesma semente e o mesmo plano sempre geram o mesmo resultado. */
export function consultarResultadoDaIncursaoAutomatica(
  plano: PlanoDeIncursaoAutomatica,
  agora: string,
): ResultadoDeIncursaoAutomatica {
  if (instanteValido(agora) < instanteValido(plano.terminaEm)) {
    return { concluida: false, sucesso: null, recompensa: [] }
  }
  // Multiplicação inteira definida: estável entre sessões e plataformas JS.
  let estado = (plano.semente ^ 0x9e3779b9) >>> 0
  estado ^= estado >>> 16
  estado = Math.imul(estado, 0x7feb352d)
  estado ^= estado >>> 15
  estado = Math.imul(estado, 0x846ca68b)
  estado ^= estado >>> 16
  const sucesso = (estado >>> 0) / 0x100000000 < plano.chanceDeSucesso
  return { concluida: true, sucesso, recompensa: sucesso ? plano.recompensaPossivel.map(item => ({ ...item })) : [] }
}
