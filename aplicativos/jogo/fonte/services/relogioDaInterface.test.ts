import { afterEach, describe, expect, it, vi } from 'vitest'
import { observarRelogioDaInterface } from './relogioDaInterface'

afterEach(() => vi.useRealTimers())
describe('relógio de apresentação', () => {
  it('recupera o tempo real após timer atrasado e ao retornar à aba; remove assinaturas ao sair', () => {
    vi.useFakeTimers()
    let agora = 0
    const janela = new EventTarget(), documento = new EventTarget()
    const atualizar = vi.fn()
    const encerrar = observarRelogioDaInterface(() => agora, atualizar, 100, janela, documento)
    expect(atualizar).toHaveBeenLastCalledWith(0)
    agora = 8500
    vi.advanceTimersByTime(100)
    expect(atualizar).toHaveBeenLastCalledWith(8500)
    agora = 12000
    documento.dispatchEvent(new Event('visibilitychange'))
    expect(atualizar).toHaveBeenLastCalledWith(12000)
    agora = 15000
    janela.dispatchEvent(new Event('focus'))
    expect(atualizar).toHaveBeenLastCalledWith(15000)
    encerrar()
    atualizar.mockClear()
    vi.advanceTimersByTime(1000)
    janela.dispatchEvent(new Event('focus'))
    documento.dispatchEvent(new Event('visibilitychange'))
    expect(atualizar).not.toHaveBeenCalled()
  })
})
