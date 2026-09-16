import type { PartidaLocal } from '@greywake/dominio'

export interface RepositorioDePartidasLocais {
  listar(): Promise<PartidaLocal[]>
  obter(idDaPartida: string): Promise<PartidaLocal | null>
  salvar(partida: PartidaLocal): Promise<void>
}
