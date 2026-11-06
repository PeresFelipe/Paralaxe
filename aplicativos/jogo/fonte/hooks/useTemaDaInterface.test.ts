import { describe, expect, it } from 'vitest'
import { CHAVE_DO_TEMA, lerTemaDaInterface, normalizarTemaDaInterface } from './useTemaDaInterface'

describe('preferência de tema', () => {
  it('mantém o tema escuro como padrão e rejeita dados desconhecidos', () => {
    expect(normalizarTemaDaInterface(null)).toBe('escuro')
    expect(normalizarTemaDaInterface('desconhecido')).toBe('escuro')
    expect(normalizarTemaDaInterface('claro')).toBe('claro')
  })

  it('restaura a preferência do navegador sem depender da partida', () => {
    expect(lerTemaDaInterface({ getItem: (chave) => chave === CHAVE_DO_TEMA ? 'claro' : null })).toBe('claro')
    expect(lerTemaDaInterface({ getItem: () => 'escuro' })).toBe('escuro')
  })

  it('falhas no armazenamento não impedem a renderização', () => {
    expect(lerTemaDaInterface({ getItem: () => { throw new Error('sem acesso') } })).toBe('escuro')
    expect(lerTemaDaInterface(null)).toBe('escuro')
  })
})
