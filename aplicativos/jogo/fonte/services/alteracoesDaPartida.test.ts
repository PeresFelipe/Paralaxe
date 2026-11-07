import { describe, expect, it, vi } from 'vitest'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from '@paralaxe/conteudo'
import { criarPartidaLocal, simularCombate, type PartidaLocal } from '@paralaxe/dominio'
import { criarFilaDeAlteracoesDaPartida, type PersistirAlteracaoDaPartida } from './alteracoesDaPartida'
import { catalogoDeCombate, criarConfirmacaoDoCombate } from './combateDaEstrada'
import { aceitarContrato } from './acoesDaMasmorra'
import { criarAcoesDoBanco } from './acoesDoBanco'

const agora = '2026-11-07T00:00:00.000Z'
function partida(id = 'teste') {
  return criarPartidaLocal({ idDaPartida: id, criadoEm: agora, versaoDoConteudo: 'teste', nomeDoPersonagem: 'Aedan',
    classeDoPersonagem: CLASSES_DE_PERSONAGEM[0]!, presente: PRESENTES_INICIAIS.find(p => p.id === 'nenhum')! })
}
function portas() {
  let atual: PartidaLocal | null = partida()
  const salvar = vi.fn(async (_partida: PartidaLocal) => {})
  const confirmar = vi.fn((nova: PartidaLocal) => { atual = nova })
  const fila = criarFilaDeAlteracoesDaPartida({ obterAtual: () => atual, salvar, confirmar })
  const persistir: PersistirAlteracaoDaPartida = alterar => fila.aplicar(alterar)
  return { fila, persistir, salvar, confirmar, obter: () => atual!, trocar: (nova: PartidaLocal | null) => { atual = nova } }
}
const somar = (quantidade: number) => (atual: PartidaLocal): PartidaLocal => ({ ...atual, personagem: { ...atual.personagem, ouro: atual.personagem.ouro + quantidade } })

describe('fila transacional de alterações', () => {
  it('avalia comandos sobre o último estado confirmado e só avança depois de gravar', async () => {
    const p = portas()
    let liberar!: () => void
    p.salvar.mockImplementationOnce(() => new Promise<void>(resolve => { liberar = resolve }))
    const a = p.fila.aplicar(somar(10))
    const b = p.fila.aplicar(somar(5))
    await Promise.resolve()
    expect(p.obter().personagem.ouro).toBe(0)
    expect(p.salvar).toHaveBeenCalledTimes(1)
    liberar()
    await Promise.all([a, b])
    expect(p.obter().personagem.ouro).toBe(15)
    expect(p.salvar.mock.calls[1]?.[0].personagem.ouro).toBe(15)
  })
  it('mantém memória intacta na falha e permite comandos seguintes', async () => {
    const p = portas()
    p.salvar.mockRejectedValueOnce(new Error('disco cheio'))
    await expect(p.fila.aplicar(somar(10))).rejects.toThrow('disco cheio')
    expect(p.confirmar).not.toHaveBeenCalled()
    await p.fila.aplicar(somar(3))
    expect(p.obter().personagem.ouro).toBe(3)
  })
  it('não transforma uma falha de notificação em falha de gravação', async () => {
    const p = portas()
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      await expect(p.fila.aplicar(somar(4), () => { throw new Error('aviso inválido') })).resolves.toMatchObject({ personagem: { ouro: 4 } })
      expect(p.obter().personagem.ouro).toBe(4)
      expect(p.salvar).toHaveBeenCalledTimes(1)
      expect(log).toHaveBeenCalledTimes(1)
    } finally { log.mockRestore() }
  })
  it('rejeita comandos enfileirados de outro personagem e IDs trocados pelo comando', async () => {
    const p = portas()
    const tarefa = p.fila.aplicar(somar(1))
    p.trocar(partida('outro'))
    await expect(tarefa).rejects.toThrow('personagem ativo mudou')
    await expect(p.fila.aplicar(atual => ({ ...atual, idDaPartida: 'terceiro' }))).rejects.toThrow('não pode trocar')
    expect(p.salvar).not.toHaveBeenCalled()
  })
  it('não confirma a gravação de um personagem na memória de outro', async () => {
    const p = portas()
    let liberar!: () => void
    p.salvar.mockImplementationOnce(() => new Promise<void>(resolve => { liberar = resolve }))
    const tarefa = p.fila.aplicar(somar(1))
    await Promise.resolve()
    p.trocar(partida('outro')); liberar(); await tarefa
    expect(p.obter().idDaPartida).toBe('outro')
    expect(p.confirmar).not.toHaveBeenCalled()
  })
})
describe('confirmação de combate e comandos de tela', () => {
  it('retenta o resultado após falha sem duplicar recompensas em confirmações repetidas', async () => {
    const p = portas()
    const forte = p.obter()
    p.trocar({ ...forte, personagem: { ...forte.personagem, atributos: { ...forte.personagem.atributos, forca: 999, vitalidade: 999 } } })
    const resultado = simularCombate(p.obter(), catalogoDeCombate, 'inimigo.estrada-lobo', 42, 180)
    expect(resultado.desfecho).toBe('vitoria')
    const confirmacao = criarConfirmacaoDoCombate(resultado)
    p.salvar.mockRejectedValueOnce(new Error('quota'))
    await expect(confirmacao.confirmar(p.persistir, agora)).rejects.toThrow('quota')
    expect(p.obter().combate.loboDerrotado).toBe(false)
    await p.fila.aplicar(somar(7))
    const [a, b] = await Promise.all([confirmacao.confirmar(p.persistir, agora), confirmacao.confirmar(p.persistir, agora)])
    expect(a).toBe(b)
    expect(p.obter().personagem.ouro).toBe(47)
    await confirmacao.confirmar(p.persistir, agora)
    expect(p.obter().personagem.ouro).toBe(47)
    expect(p.obter().personagem.xp).toBe(60)
  })
  it('verifica requisitos do contrato sobre a partida recebida na execução', () => {
    const atual = partida()
    expect(() => aceitarContrato(atual, agora)).toThrow('Estrada Baixa')
    const resultado = aceitarContrato({ ...atual, combate: { ...atual.combate, loboDerrotado: true } }, agora)
    expect(resultado.partida.masmorra.contratoAceito).toBe(true)
  })
  it('propaga a falha da transferência para a tela e informa o erro global', async () => {
    const p = portas(); const informar = vi.fn()
    p.salvar.mockRejectedValueOnce(new Error('quota'))
    const base = p.obter()
    p.trocar({ ...base, personagem: { ...base.personagem, inventario: [{ idDaDefinicao: 'material.cloch', quantidade: 3 }] } })
    const banco = criarAcoesDoBanco(p.persistir, informar)
    await expect(banco.tratarDepositarBancoPilha('material.cloch', 1)).rejects.toThrow('quota')
    expect(informar).toHaveBeenCalledWith('quota')
    expect(p.obter().personagem.inventario[0]?.quantidade).toBe(3)
    expect(p.obter().personagem.banco.inventario).toEqual([])
  })
})
