/** @file Mira, parceira única; parâmetros temporários até o balanceamento do GDD §22. */
import type { DefinicaoDeParceiroDeCombate } from '@paralaxe/dominio'

export const MIRA = {
  id: 'parceira.mira',
  nome: 'Mira',
  papel: 'arqueira',
  vidaMaxima: 125,
  defesa: 8,
  evasao: 110,
  precisao: 122,
  poder: 16,
  intervaloDeAcaoEmSegundos: 2.05,
  chanceDeCritico: 0.12,
  bonusDeCriticoParaGrupo: 0.05,
} as const satisfies DefinicaoDeParceiroDeCombate

export const PARCEIROS = [MIRA] as const
export function obterDefinicaoDeParceiro(id: string): DefinicaoDeParceiroDeCombate | null {
  return PARCEIROS.find(p => p.id === id) ?? null
}
