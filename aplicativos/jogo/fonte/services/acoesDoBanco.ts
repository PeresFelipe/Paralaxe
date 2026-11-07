/** Adaptadores de comandos do banco. Estoque e capacidade continuam sendo regras do domínio. */
import { depositarEquipamentoNoBanco, depositarPilhaDoInventarioNoBanco,
  retirarEquipamentoDoBanco, retirarPilhaDoBancoParaInventario } from '@paralaxe/dominio'
import type { PersistirAlteracaoDaPartida, AlteracaoDaPartida } from './alteracoesDaPartida'

export function criarAcoesDoBanco(persistir: PersistirAlteracaoDaPartida, informarErro: (mensagem: string) => void) {
  async function executar(alterar: AlteracaoDaPartida, mensagem: string) {
    try { await persistir(alterar, mensagem) }
    catch (erro) {
      informarErro(erro instanceof Error ? erro.message : 'Não foi possível salvar a transferência.')
      // O componente precisa conhecer a falha para não apresentar sucesso local.
      throw erro
    }
  }
  return {
    tratarDepositarBancoPilha: (id: string, quantidade: number) => executar(
      atual => depositarPilhaDoInventarioNoBanco(atual, id, quantidade, new Date().toISOString()), `Depósito realizado: ${quantidade} item(ns).`),
    tratarRetirarBancoPilha: (id: string, quantidade: number) => executar(
      atual => retirarPilhaDoBancoParaInventario(atual, id, quantidade, new Date().toISOString()), `Retirada realizada: ${quantidade} item(ns).`),
    tratarDepositarBancoEquipamento: (id: string) => executar(
      atual => depositarEquipamentoNoBanco(atual, id, new Date().toISOString()), 'Equipamento depositado no Banco.'),
    tratarRetirarBancoEquipamento: (id: string) => executar(
      atual => retirarEquipamentoDoBanco(atual, id, new Date().toISOString()), 'Equipamento retirado do Banco.'),
  }
}
