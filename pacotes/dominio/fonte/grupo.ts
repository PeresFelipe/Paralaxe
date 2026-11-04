/** @file Formação e jornada de Mira, seguindo GDD §§21–22. */
import type { PartidaLocal } from './personagem'

export const ID_DE_MIRA = 'parceira.mira' as const
export const VINCULOS = ['desconhecido','conhecido','aliado','companheiro','leal'] as const
export type Vinculo = typeof VINCULOS[number]
export const MARCOS_DE_MIRA = [
  'desconhecida','rastros-na-segunda-masmorra','encontro-em-combate','cooperacao-temporaria',
  'divergencia-sobre-monstros','chefe-em-dupla','reencontro-na-taverna','recrutavel',
] as const
export type MarcoDeMira = typeof MARCOS_DE_MIRA[number]
export interface EstadoDoParceiro { vinculo: Vinculo; recrutado: boolean }
export interface EstadoDoGrupo {
  idsDosParceirosAtivos: string[]
  parceiros: Record<string, EstadoDoParceiro>
  marcoDeMira: MarcoDeMira
}
export function criarEstadoInicialDoGrupo(): EstadoDoGrupo {
  return { idsDosParceirosAtivos: [], marcoDeMira: 'desconhecida',
    parceiros: { [ID_DE_MIRA]: { vinculo: 'desconhecido', recrutado: false } } }
}
/** Eventos pertencem à segunda Masmorra ainda não detalhada; Dún Liath não os aciona. */
export function registrarMarcoDeMira(partida: PartidaLocal, proximo: Exclude<MarcoDeMira,'desconhecida'>, agora: string): PartidaLocal {
  if (!partida.masmorra.dunLiathFacilConquistado) throw new Error('Mira aparece depois de Dún Liath.')
  if (partida.masmorra.expedicaoAtiva?.idDaDefinicaoDaMasmorra.startsWith('masmorra.dun-liath.')) {
    throw new Error('Mira não aparece em Dún Liath.')
  }
  const grupo = partida.grupo
  if (MARCOS_DE_MIRA.indexOf(proximo) !== MARCOS_DE_MIRA.indexOf(grupo.marcoDeMira) + 1) {
    throw new Error('A jornada de Mira deve seguir os eventos na ordem do GDD.')
  }
  const mora = grupo.parceiros[ID_DE_MIRA] ?? { vinculo: 'desconhecido', recrutado: false }
  const ativos = proximo === 'cooperacao-temporaria'
    ? [...grupo.idsDosParceirosAtivos, ID_DE_MIRA]
    : proximo === 'reencontro-na-taverna'
      ? grupo.idsDosParceirosAtivos.filter(id => id !== ID_DE_MIRA)
      : grupo.idsDosParceirosAtivos
  if (ativos.length > 3 || new Set(ativos).size !== ativos.length) throw new Error('Grupo admite até três parceiros.')
  return { ...partida, atualizadoEm: agora, grupo: { ...grupo, marcoDeMira: proximo,
    idsDosParceirosAtivos: ativos, parceiros: { ...grupo.parceiros,
      [ID_DE_MIRA]: { ...mora, vinculo: proximo === 'encontro-em-combate' ? 'conhecido' : mora.vinculo } } } }
}
export function recrutarMira(partida: PartidaLocal, agora: string): PartidaLocal {
  if (partida.grupo.marcoDeMira !== 'recrutavel') throw new Error('Mira ainda não está recrutável.')
  if (partida.grupo.parceiros[ID_DE_MIRA]?.recrutado) return partida
  return { ...partida, atualizadoEm: agora, grupo: { ...partida.grupo,
    parceiros: { ...partida.grupo.parceiros, [ID_DE_MIRA]: { vinculo: 'aliado', recrutado: true } } } }
}
export function configurarFormacaoDoGrupo(partida: PartidaLocal, ids: readonly string[], agora: string): PartidaLocal {
  if (ids.length > 3 || new Set(ids).size !== ids.length) throw new Error('Grupo admite até três parceiros distintos.')
  if (ids.some(id => !partida.grupo.parceiros[id]?.recrutado)) throw new Error('Parceiro não recrutado.')
  if (['cooperacao-temporaria','divergencia-sobre-monstros','chefe-em-dupla'].includes(partida.grupo.marcoDeMira)) {
    throw new Error('A formação temporária pertence à segunda Masmorra.')
  }
  return { ...partida, atualizadoEm: agora, grupo: { ...partida.grupo, idsDosParceirosAtivos: [...ids] } }
}
export function avancarVinculoDoParceiro(partida: PartidaLocal, id: string, agora: string): PartidaLocal {
  const parceiro = partida.grupo.parceiros[id]
  if (!parceiro?.recrutado) throw new Error('Parceiro não recrutado.')
  const i = VINCULOS.indexOf(parceiro.vinculo)
  if (i === VINCULOS.length - 1) return partida
  return { ...partida, atualizadoEm: agora, grupo: { ...partida.grupo,
    parceiros: { ...partida.grupo.parceiros, [id]: { ...parceiro, vinculo: VINCULOS[i + 1]! } } } }
}
