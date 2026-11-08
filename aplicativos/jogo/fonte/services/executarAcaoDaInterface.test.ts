import { describe, expect, it, vi } from 'vitest'
import { criarExecutorDeAcao, type EstadoDaAcao } from './executarAcaoDaInterface'

describe('contrato assíncrono da interface', () => {
  it('bloqueia duplo envio e só informa sucesso depois da confirmação', async () => {
    const estados: EstadoDaAcao[] = []
    const executar = criarExecutorDeAcao(estado => estados.push(estado))
    let concluir!: () => void
    const pendente = executar(() => new Promise<void>(resolve => { concluir = resolve }), 'Salvo')
    const duplicada = vi.fn()
    expect(await executar(duplicada)).toBe(false)
    expect(duplicada).not.toHaveBeenCalled()
    expect(estados).toEqual([{ fase: 'executando', mensagem: null }])
    concluir()
    expect(await pendente).toBe(true)
    expect(estados.at(-1)).toEqual({ fase: 'concluido', mensagem: 'Salvo' })
  })
  it('mantém a falha visível e permite tentar novamente sem rejeição não tratada', async () => {
    const estados: EstadoDaAcao[] = []
    const executar = criarExecutorDeAcao(estado => estados.push(estado))
    expect(await executar(() => Promise.reject(new Error('Disco cheio')), 'Salvo')).toBe(false)
    expect(estados.at(-1)).toEqual({ fase: 'falhou', mensagem: 'Disco cheio' })
    expect(await executar(async () => {})).toBe(true)
  })
})
