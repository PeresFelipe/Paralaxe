/**
 * @file Contrato assíncrono de armazenamento de partidas.
 * A aplicação depende desta interface; a implementação concreta pode usar IndexedDB
 * sem expor transações ou detalhes do formato salvo para os componentes.
 */
import type { PartidaLocal } from '@greywake/dominio'

/** listar e obter devolvem o modelo atual; salvar só conclui sua Promise após a confirmação da gravação. */
export interface RepositorioDePartidasLocais {
  listar(): Promise<PartidaLocal[]>
  obter(idDaPartida: string): Promise<PartidaLocal | null>
  salvar(partida: PartidaLocal): Promise<void>
}
