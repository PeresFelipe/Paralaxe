import { describe, expect, it } from 'vitest'
import { criarEstadoDeAmeaca, registrarAmeaca, reduzirAmeaca, provocarInimigo,
  escolherAlvoDaAmeaca } from './ameaca'
describe('Ameaça e foco de inimigos — GDD §21', () => {
  it('gera Ameaça de dano, cura, suporte e habilidade; escolhe o maior', () => {
    let s = criarEstadoDeAmeaca(['jogador','mira'])
    s = registrarAmeaca(s, 'jogador', 'dano', 10)
    s = registrarAmeaca(s, 'mira', 'cura', 20)
    expect(s.porCombatente).toEqual({ jogador: 10, mira: 13 })
    expect(escolherAlvoDaAmeaca(s, ['jogador','mira'], 1).alvo.id).toBe('mira')
    s = registrarAmeaca(s, 'jogador', 'habilidade', 5)
    s = registrarAmeaca(s, 'mira', 'suporte', 4)
    expect(s.porCombatente.mira).toBeCloseTo(14.4)
    expect(s.porCombatente.jogador).toBe(16)
    expect(escolherAlvoDaAmeaca(s, ['jogador','mira'], 2).alvo.id).toBe('jogador')
    s = reduzirAmeaca(s, 'jogador', 0.5)
    expect(escolherAlvoDaAmeaca(s, ['jogador','mira'], 3).alvo.id).toBe('mira')
  })
  it('Provocar força alvo e Chefe resiste a repetição temporária', () => {
    let s = registrarAmeaca(criarEstadoDeAmeaca(['jogador','mira']), 'jogador', 'dano', 25)
    const primeira = provocarInimigo(s, 'mira', 0, true)
    expect(primeira.resistiu).toBe(false)
    s = primeira.estado
    expect(escolherAlvoDaAmeaca(s, ['jogador','mira'], 1).alvo.motivo).toBe('provocacao')
    expect(provocarInimigo(s, 'jogador', 2, true).resistiu).toBe(true)
    expect(provocarInimigo(s, 'jogador', 10, true).resistiu).toBe(false)
    expect(escolherAlvoDaAmeaca(s, ['jogador'], 1).alvo.id).toBe('jogador')
  })
  it('ignorar Ameaça seleciona primeiro vivo; mortos não são alvos', () => {
    const s = registrarAmeaca(criarEstadoDeAmeaca(['jogador','mira']), 'mira', 'dano', 100)
    expect(escolherAlvoDaAmeaca(s, ['jogador','mira'], 2, true).alvo.id).toBe('jogador')
    expect(escolherAlvoDaAmeaca(s, ['jogador'], 2).alvo.id).toBe('jogador')
    expect(escolherAlvoDaAmeaca(s, [], 2).alvo.motivo).toBe('sem-alvo')
  })
  it('rejeita parâmetros não finitos, repetidos e alvos desconhecidos', () => {
    expect(() => criarEstadoDeAmeaca(['x','x'])).toThrow()
    const s = criarEstadoDeAmeaca(['x'])
    expect(() => registrarAmeaca(s,'x','dano',Number.NaN)).toThrow()
    expect(() => registrarAmeaca(s,'y','cura',2)).toThrow()
    expect(() => reduzirAmeaca(s,'x',2)).toThrow()
    expect(() => provocarInimigo(s,'x',-1,false)).toThrow()
  })
})
