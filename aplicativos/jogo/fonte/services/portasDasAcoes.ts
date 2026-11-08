import type { PersistirAlteracaoDaPartida } from './alteracoesDaPartida'

/** Dependências dos comandos: fila transacional, horário e estado transitório de risco. */
export interface PortasDasAcoes {
  persistir: PersistirAlteracaoDaPartida
  agora: () => string
  estaEmRisco: () => boolean
}
