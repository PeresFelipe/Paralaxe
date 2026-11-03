/**
 * Vigília da Cidade: regras puras de sessões de foco e reconstrução.
 * Não importa React, temporizadores, catálogos concretos nem IndexedDB.
 */
import type { PartidaLocal } from './personagem'

export const IDS_DOS_DISTRITOS = [
  'praca', 'taverna', 'ferreiro', 'mercado',
  'banco', 'relicario', 'codice', 'muralhas',
] as const

export type IdDoDistrito = (typeof IDS_DOS_DISTRITOS)[number]
export const NIVEL_MAXIMO_DO_DISTRITO = 4
export const DURACAO_MINIMA_DA_VIGILIA = 10
export const DURACAO_MAXIMA_DA_VIGILIA = 120
export const LIMITE_DO_HISTORICO_DA_VIGILIA = 120
/** Quantidade acumulada de melhorias exigida por estágio visual (0..4). */
export const LIMIARES_DOS_ESTAGIOS = [0, 3, 8, 15, 24] as const

export interface SessaoDeVigilia {
  id: string
  nome: string
  inicioEm: string
  terminoPrevistoEm: string
  duracaoMinutos: number
}

export interface RegistroDeVigilia extends SessaoDeVigilia {
  encerradaEm: string
  resultado: 'concluida' | 'cancelada'
  brasasRecebidas: number
}

export interface EstadoDaVigilia {
  sessaoAtiva: SessaoDeVigilia | null
  saldoBrasas: number
  brasasAcumuladas: number
  sessoesConcluidas: number
  minutosDeFoco: number
  distritos: Record<IdDoDistrito, number>
  /** Últimas 120 sessões; totais agregados não são descartados. */
  historico: RegistroDeVigilia[]
}

export interface DefinicaoDoDistrito {
  id: IdDoDistrito
  nome: string
  descricao: string
  /** Custo de atingir cada nível: 1, 2, 3, 4. */
  custosPorNivel: readonly [number, number, number, number]
  requisitos?: ReadonlyArray<{ id: IdDoDistrito; nivelMinimo: number }>
}

export function criarEstadoInicialDaVigilia(): EstadoDaVigilia {
  return {
    sessaoAtiva: null,
    saldoBrasas: 0,
    brasasAcumuladas: 0,
    sessoesConcluidas: 0,
    minutosDeFoco: 0,
    distritos: Object.fromEntries(IDS_DOS_DISTRITOS.map(id => [id, 0])) as Record<IdDoDistrito, number>,
    historico: [],
  }
}

function instanteValido(iso: string): number {
  const tempo = Date.parse(iso)
  if (!Number.isFinite(tempo)) throw new Error('Horário inválido na Vigília.')
  return tempo
}

function minutosValidos(duracao: number): boolean {
  return Number.isInteger(duracao) && duracao >= DURACAO_MINIMA_DA_VIGILIA && duracao <= DURACAO_MAXIMA_DA_VIGILIA
}

export function calcularBrasasDaVigilia(duracaoMinutos: number): number {
  if (!minutosValidos(duracaoMinutos)) throw new Error('A Vigília deve durar de 10 a 120 minutos.')
  return Math.floor(duracaoMinutos / 5)
}

export function segundosRestantesDaVigilia(sessao: SessaoDeVigilia, agoraMs: number): number {
  if (!Number.isFinite(agoraMs)) throw new Error('Horário de consulta inválido.')
  return Math.max(0, Math.ceil((instanteValido(sessao.terminoPrevistoEm) - agoraMs) / 1000))
}

/** O tempo é medido por horários, sem dependência de intervalos do navegador. */
export function iniciarVigilia(
  partida: PartidaLocal,
  entrada: { id: string; nome: string; duracaoMinutos: number },
  agora: string,
): PartidaLocal {
  if (partida.vigilia.sessaoAtiva) throw new Error('Já existe uma Vigília em andamento.')
  if (!minutosValidos(entrada.duracaoMinutos)) throw new Error('Escolha entre 10 e 120 minutos.')
  if (!entrada.id.trim()) throw new Error('A sessão precisa de um identificador.')
  if (partida.vigilia.historico.some(item => item.id === entrada.id)) throw new Error('Identificador da sessão já utilizado.')
  const inicioMs = instanteValido(agora)
  const sessao: SessaoDeVigilia = {
    id: entrada.id,
    nome: entrada.nome.trim().slice(0, 80) || 'Vigília da Cidade',
    inicioEm: agora,
    terminoPrevistoEm: new Date(inicioMs + entrada.duracaoMinutos * 60_000).toISOString(),
    duracaoMinutos: entrada.duracaoMinutos,
  }
  return { ...partida, atualizadoEm: agora, vigilia: { ...partida.vigilia, sessaoAtiva: sessao } }
}

function adicionarRegistro(estado: EstadoDaVigilia, registro: RegistroDeVigilia): RegistroDeVigilia[] {
  return [...estado.historico, registro].slice(-LIMITE_DO_HISTORICO_DA_VIGILIA)
}

/** Conclusão exige confirmação; duas solicitações com o mesmo ID não duplicam as Brasas. */
export function concluirVigilia(partida: PartidaLocal, idDaSessao: string, agora: string): PartidaLocal {
  const estado = partida.vigilia
  if (estado.historico.some(item => item.id === idDaSessao && item.resultado === 'concluida')) return partida
  const sessao = estado.sessaoAtiva
  if (!sessao || sessao.id !== idDaSessao) throw new Error('Essa Vigília não está ativa.')
  const agoraMs = instanteValido(agora)
  if (agoraMs < instanteValido(sessao.inicioEm)) throw new Error('O relógio do dispositivo está anterior ao início da sessão.')
  if (agoraMs < instanteValido(sessao.terminoPrevistoEm)) throw new Error('O período de foco ainda não terminou.')
  const brasas = calcularBrasasDaVigilia(sessao.duracaoMinutos)
  const registro: RegistroDeVigilia = { ...sessao, encerradaEm: agora, resultado: 'concluida', brasasRecebidas: brasas }
  return {
    ...partida,
    atualizadoEm: agora,
    vigilia: {
      ...estado,
      sessaoAtiva: null,
      saldoBrasas: estado.saldoBrasas + brasas,
      brasasAcumuladas: estado.brasasAcumuladas + brasas,
      sessoesConcluidas: estado.sessoesConcluidas + 1,
      minutosDeFoco: estado.minutosDeFoco + sessao.duracaoMinutos,
      historico: adicionarRegistro(estado, registro),
    },
  }
}

/** Cancelar não concede recursos e não modifica a coleta ou fabricação em andamento. */
export function cancelarVigilia(partida: PartidaLocal, idDaSessao: string, agora: string): PartidaLocal {
  const estado = partida.vigilia
  if (estado.historico.some(item => item.id === idDaSessao)) return partida
  const sessao = estado.sessaoAtiva
  if (!sessao || sessao.id !== idDaSessao) throw new Error('Essa Vigília não está ativa.')
  if (instanteValido(agora) < instanteValido(sessao.inicioEm)) throw new Error('Relógio do dispositivo inconsistente.')
  const registro: RegistroDeVigilia = { ...sessao, encerradaEm: agora, resultado: 'cancelada', brasasRecebidas: 0 }
  return {
    ...partida,
    atualizadoEm: agora,
    vigilia: { ...estado, sessaoAtiva: null, historico: adicionarRegistro(estado, registro) },
  }
}

export function obterTotalDeMelhorias(estado: EstadoDaVigilia): number {
  return IDS_DOS_DISTRITOS.reduce((soma, id) => soma + estado.distritos[id], 0)
}

export function obterEstagioDaCidade(estado: EstadoDaVigilia): 0 | 1 | 2 | 3 | 4 {
  const melhorias = obterTotalDeMelhorias(estado)
  for (let indice = LIMIARES_DOS_ESTAGIOS.length - 1; indice >= 0; indice--) {
    if (melhorias >= LIMIARES_DOS_ESTAGIOS[indice]!) return indice as 0 | 1 | 2 | 3 | 4
  }
  return 0
}

export function consultarMelhoria(estado: EstadoDaVigilia, definicao: DefinicaoDoDistrito) {
  const nivelAtual = estado.distritos[definicao.id]
  if (!Number.isInteger(nivelAtual) || nivelAtual < 0 || nivelAtual > NIVEL_MAXIMO_DO_DISTRITO) {
    throw new Error('Nível de distrito inválido.')
  }
  if (nivelAtual === NIVEL_MAXIMO_DO_DISTRITO) return { nivelAtual, custo: null, permitido: false, motivo: 'Nível máximo atingido.' }
  const custo = definicao.custosPorNivel[nivelAtual]
  if (custo === undefined || !Number.isSafeInteger(custo) || custo <= 0) throw new Error('Custo de distrito inválido.')
  const requisito = definicao.requisitos?.find(r => estado.distritos[r.id] < r.nivelMinimo)
  if (requisito) return { nivelAtual, custo, permitido: false, motivo: 'Restaure primeiro os distritos exigidos.' }
  if (estado.saldoBrasas < custo) return { nivelAtual, custo, permitido: false, motivo: 'Brasas insuficientes.' }
  return { nivelAtual, custo, permitido: true, motivo: null }
}

export function melhorarDistrito(partida: PartidaLocal, definicao: DefinicaoDoDistrito, agora: string): PartidaLocal {
  instanteValido(agora)
  const avaliacao = consultarMelhoria(partida.vigilia, definicao)
  if (!avaliacao.permitido || typeof avaliacao.custo !== 'number') throw new Error(avaliacao.motivo ?? 'Melhoria indisponível.')
  return {
    ...partida,
    atualizadoEm: agora,
    vigilia: {
      ...partida.vigilia,
      saldoBrasas: partida.vigilia.saldoBrasas - avaliacao.custo,
      distritos: { ...partida.vigilia.distritos, [definicao.id]: avaliacao.nivelAtual + 1 },
    },
  }
}

/** Validação limitada aos dados da Vigília para não mascarar saves v12 quebrados. */
export function validarEstadoDaVigilia(valor: unknown): asserts valor is EstadoDaVigilia {
  if (!valor || typeof valor !== 'object') throw new Error('Save sem estado válido da Vigília.')
  const estado = valor as Partial<EstadoDaVigilia>
  for (const campo of ['saldoBrasas', 'brasasAcumuladas', 'sessoesConcluidas', 'minutosDeFoco'] as const) {
    if (!Number.isSafeInteger(estado[campo]) || estado[campo]! < 0) throw new Error(`Save inválido: ${campo}.`)
  }
  if (!estado.distritos || typeof estado.distritos !== 'object') throw new Error('Distritos inválidos no save.')
  for (const id of IDS_DOS_DISTRITOS) {
    const nivel = estado.distritos[id]
    if (!Number.isInteger(nivel) || nivel < 0 || nivel > NIVEL_MAXIMO_DO_DISTRITO) throw new Error(`Distrito inválido: ${id}.`)
  }
  if (estado.saldoBrasas! > estado.brasasAcumuladas!) throw new Error('Saldo de Brasas maior que a quantidade obtida.')
  if (!Array.isArray(estado.historico) || estado.historico.length > LIMITE_DO_HISTORICO_DA_VIGILIA) throw new Error('Histórico de Vigília inválido.')
  const idsRegistrados = new Set<string>()
  for (const registro of estado.historico) {
    if (!registro || typeof registro.id !== 'string' || !registro.id.trim() || idsRegistrados.has(registro.id)) throw new Error('Registro de Vigília duplicado ou inválido.')
    if (typeof registro.nome !== 'string' || !minutosValidos(registro.duracaoMinutos) || !['concluida', 'cancelada'].includes(registro.resultado)) throw new Error('Registro de Vigília malformado.')
    if (!Number.isSafeInteger(registro.brasasRecebidas) || registro.brasasRecebidas < 0) throw new Error('Recompensa de Vigília inválida.')
    if (registro.resultado === 'cancelada' && registro.brasasRecebidas !== 0) throw new Error('Uma sessão cancelada não pode conceder Brasas.')
    instanteValido(registro.inicioEm)
    instanteValido(registro.terminoPrevistoEm)
    instanteValido(registro.encerradaEm)
    idsRegistrados.add(registro.id)
  }
  if (estado.sessaoAtiva !== null) {
    if (!estado.sessaoAtiva || typeof estado.sessaoAtiva.id !== 'string' || !estado.sessaoAtiva.id.trim() || idsRegistrados.has(estado.sessaoAtiva.id) || typeof estado.sessaoAtiva.nome !== 'string' || !minutosValidos(estado.sessaoAtiva.duracaoMinutos)) {
      throw new Error('Sessão de Vigília inválida no save.')
    }
    instanteValido(estado.sessaoAtiva.inicioEm)
    instanteValido(estado.sessaoAtiva.terminoPrevistoEm)
  }
}
