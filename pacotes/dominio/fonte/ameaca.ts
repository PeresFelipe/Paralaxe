/** @file Foco de alvo e geração de Ameaça para combate em Grupo (GDD §21). */
export type OrigemDeAmeaca = 'dano' | 'cura' | 'suporte' | 'habilidade'
export interface EstadoDeAmeaca {
  porCombatente: Record<string, number>
  alvoAnterior: string | null
  provocacao: { id: string; ateSegundo: number } | null
  resistenciaAProvocacaoAte: number
}
export interface AlvoDaAmeaca {
  id: string | null
  mudouFoco: boolean
  motivo: 'ameaca' | 'provocacao' | 'ignorada' | 'sem-alvo'
}
const PESOS: Record<OrigemDeAmeaca, number> = { dano: 1, cura: 0.65, suporte: 0.35, habilidade: 1.2 }
export function criarEstadoDeAmeaca(ids: readonly string[]): EstadoDeAmeaca {
  if (new Set(ids).size !== ids.length || ids.some(id => !id)) throw new Error('IDs de combatente inválidos.')
  return { porCombatente: Object.fromEntries(ids.map(id => [id, 0])), alvoAnterior: null, provocacao: null, resistenciaAProvocacaoAte: 0 }
}
export function registrarAmeaca(estado: EstadoDeAmeaca, id: string, origem: OrigemDeAmeaca, quantidade: number): EstadoDeAmeaca {
  if (!Object.hasOwn(estado.porCombatente, id)) throw new Error('Combatente fora do Grupo.')
  if (!Number.isFinite(quantidade) || quantidade < 0) throw new Error('Valor de Ameaça inválido.')
  return { ...estado, porCombatente: { ...estado.porCombatente,
    [id]: Math.min(1e9, estado.porCombatente[id]! + quantidade * PESOS[origem]) } }
}
export function reduzirAmeaca(estado: EstadoDeAmeaca, id: string, fracao: number): EstadoDeAmeaca {
  if (!Object.hasOwn(estado.porCombatente, id)) throw new Error('Combatente fora do Grupo.')
  if (!Number.isFinite(fracao) || fracao < 0 || fracao > 1) throw new Error('Redução de Ameaça inválida.')
  return { ...estado, porCombatente: { ...estado.porCombatente, [id]: estado.porCombatente[id]! * (1 - fracao) } }
}
/** Provocação temporária; Chefes resistem a repetições dentro de dez segundos. */
export function provocarInimigo(estado: EstadoDeAmeaca, id: string, segundo: number, ehChefe: boolean) {
  if (!Object.hasOwn(estado.porCombatente, id)) throw new Error('Combatente fora do Grupo.')
  if (!Number.isFinite(segundo) || segundo < 0) throw new Error('Tempo inválido.')
  if (ehChefe && segundo < estado.resistenciaAProvocacaoAte) return { estado, resistiu: true }
  const max = Math.max(0, ...Object.values(estado.porCombatente))
  return { estado: { ...estado,
    porCombatente: { ...estado.porCombatente, [id]: Math.max(estado.porCombatente[id]!, max + 1) },
    provocacao: { id, ateSegundo: segundo + 3 },
    resistenciaAProvocacaoAte: ehChefe ? segundo + 10 : estado.resistenciaAProvocacaoAte,
  } satisfies EstadoDeAmeaca, resistiu: false }
}
/** Empate respeita formação; inimigos com habilidade especial podem ignorar Ameaça. */
export function escolherAlvoDaAmeaca(estado: EstadoDeAmeaca, vivos: readonly string[], segundo: number, ignorarAmeaca = false) {
  if (!Number.isFinite(segundo) || segundo < 0) throw new Error('Tempo inválido.')
  const candidatos = vivos.filter(id => Object.hasOwn(estado.porCombatente, id))
  const forcado = !ignorarAmeaca && estado.provocacao && estado.provocacao.ateSegundo > segundo &&
    candidatos.includes(estado.provocacao.id) ? estado.provocacao.id : null
  const id: string | null = forcado ?? (ignorarAmeaca ? candidatos[0] ?? null :
    candidatos.reduce<string | null>((melhor, candidato) =>
      melhor === null || estado.porCombatente[candidato]! > estado.porCombatente[melhor]! ? candidato : melhor, null))
  const motivo: AlvoDaAmeaca['motivo'] = !id ? 'sem-alvo'
    : ignorarAmeaca ? 'ignorada' : forcado ? 'provocacao' : 'ameaca'
  return { estado: { ...estado, alvoAnterior: id },
    alvo: { id, mudouFoco: id !== estado.alvoAnterior, motivo } satisfies AlvoDaAmeaca }
}
