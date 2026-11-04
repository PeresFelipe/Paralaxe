/** @file Contratos que ficam entre a aplicação e seus adaptadores. */
import type { PartidaLocal } from '@paralaxe/dominio'

export const DIRECAO_DA_INTERFACE = "web-prioritaria-2d-centrada-na-interface" as const

/** Porta de armazenamento usada pelos casos de aplicação, sem acoplamento a IndexedDB. */
export interface RepositorioDePartidasLocais {
  listar(): Promise<PartidaLocal[]>
  obter(idDaPartida: string): Promise<PartidaLocal | null>
  salvar(partida: PartidaLocal): Promise<void>
}
