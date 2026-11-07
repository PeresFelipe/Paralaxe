import { describe, expect, it } from 'vitest'
import { MODOS_DE_LARGURA, proximoModoDeLargura, rotuloDoModoDeLargura } from './modosDeLargura'

describe('perfis de largura adaptados de Skill Issue Chronicles (MIT)', () => {
  it('cobre os três perfis sem expor medidas ou classes arbitrárias ao usuário', () => {
    expect(MODOS_DE_LARGURA).toEqual(['compacta', 'normal', 'ampla'])
    expect(Object.values(rotuloDoModoDeLargura)).toEqual(['Foco', 'Confortável', 'Ampla'])
  })
  it('percorre as larguras ciclicamente', () => {
    expect(proximoModoDeLargura('normal')).toBe('ampla')
    expect(proximoModoDeLargura('ampla')).toBe('compacta')
    expect(proximoModoDeLargura('compacta')).toBe('normal')
  })
})
