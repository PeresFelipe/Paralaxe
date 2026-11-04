/**
 * @file GDD §33: progressão de kits sem mutar o catálogo Fácil e sem RNG oculto.
 */
import { describe, expect, it } from 'vitest'
import { adaptarInimigoParaDificuldade, simularCombate } from '@paralaxe/dominio'
import { criarPartidaLocal } from '@paralaxe/dominio'
import { INIMIGOS, obterDefinicaoDeInimigo, obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeConsumivelDeCombate } from './combate'
import { obterDefinicaoDeEquipamento } from './equipamento'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'

const ids = [
  'inimigo.crubach',
  'inimigo.tromghiallach',
  'inimigo.cosantoir',
  'inimigo.fairtheoir-fase1',
  'inimigo.fairtheoir-fase2',
] as const
const nomes = [
  ['Cerco', 'Ferida Aberta', 'Caçada Coordenada'],
  ['Cobertura Pesada', 'Golpe Concussivo', 'Muralha Viva'],
  ['Interposição', 'Formação Defensiva', 'Última Linha'],
  ['Contra-Impacto', 'Ruptura', 'Linha Intransponível'],
  ['Destroços', 'Desespero Absoluto', 'Até o Último'],
] as const
const catalogo = {
  obterDefinicaoDeInimigo,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
}

describe('kits próprios de Dún Liath: Normal, Difícil e Impossível', () => {
  it('conserva o catálogo original e retorna exatamente o mesmo objeto em Fácil', () => {
    const original = JSON.stringify(INIMIGOS)
    for (const id of ids) {
      const enemy = obterDefinicaoDeInimigo(id)!
      expect(adaptarInimigoParaDificuldade(enemy, 'facil')).toBe(enemy)
      expect(adaptarInimigoParaDificuldade(enemy, 'normal')).not.toBe(enemy)
    }
    expect(JSON.stringify(INIMIGOS)).toBe(original)
  })

  it('cadastra cada técnica canônica em sua dificuldade, sem duplicar IDs', () => {
    ids.forEach((id, indice) => {
      const base = obterDefinicaoDeInimigo(id)!
      const normal = adaptarInimigoParaDificuldade(base, 'normal')
      const dificil = adaptarInimigoParaDificuldade(base, 'dificil')
      const impossivel = adaptarInimigoParaDificuldade(base, 'impossivel')
      expect(normal.habilidades.map(h => h.nome)).toContain(nomes[indice]![0])
      expect(dificil.habilidades.map(h => h.nome)).toContain(nomes[indice]![1])
      expect(impossivel.habilidades.map(h => h.nome)).toContain(nomes[indice]![2])
      expect(normal.habilidades.length).toBeGreaterThan(base.habilidades.length)
      expect(dificil.habilidades.length).toBeGreaterThan(normal.habilidades.length)
      expect(impossivel.habilidades.length).toBeGreaterThan(dificil.habilidades.length)
      for (const v of [normal, dificil, impossivel]) {
        expect(new Set(v.habilidades.map(h => h.id)).size).toBe(v.habilidades.length)
        expect(v.vidaMaxima).toBeGreaterThan(base.vidaMaxima)
        expect(v.poder).toBeGreaterThanOrEqual(base.poder)
      }
      expect(dificil.vidaMaxima).toBeGreaterThan(normal.vidaMaxima)
      expect(impossivel.vidaMaxima).toBeGreaterThan(dificil.vidaMaxima)
    })
  })

  it('reserva Até o Último para Vida menor ou igual a 20%, antes das habilidades-base', () => {
    const base = obterDefinicaoDeInimigo('inimigo.fairtheoir-fase2')!
    const impossivel = adaptarInimigoParaDificuldade(base, 'impossivel')
    const habilidade = impossivel.habilidades.find(h => h.nome === 'Até o Último')
    expect(habilidade?.ativarQuandoVidaAte).toBe(0.2)
    expect(impossivel.habilidades[0]?.id).toBe(habilidade?.id)
    const normal = adaptarInimigoParaDificuldade(base, 'normal')
    expect(normal.habilidades.some(h => h.nome === 'Até o Último')).toBe(false)
  })

  it('simula combate reproduzível com perfis avançados e mantém entrada sem mutação', () => {
    const classe = CLASSES_DE_PERSONAGEM.find(c => c.id === 'errante')!
    const presente = PRESENTES_INICIAIS.find(p => p.id === 'nenhum')!
    const partida = criarPartidaLocal({
      idDaPartida: 'combate-kits', criadoEm: '2026-11-04T15:00:00.000Z',
      versaoDoConteudo: 'test', nomeDoPersonagem: 'Aedan',
      classeDoPersonagem: classe, presente,
    })
    const antes = JSON.stringify(partida)
    for (const dificuldade of ['normal', 'dificil', 'impossivel'] as const) {
      const perfil = adaptarInimigoParaDificuldade(obterDefinicaoDeInimigo('inimigo.crubach')!, dificuldade)
      const catalogoDaLuta = {
        ...catalogo, obterDefinicaoDeInimigo: (id: string) => id === perfil.id ? perfil : null,
      }
      const primeira = simularCombate(partida, catalogoDaLuta, perfil.id, 44, 120)
      const repetida = simularCombate(partida, catalogoDaLuta, perfil.id, 44, 120)
      expect(primeira).toEqual(repetida)
      expect(primeira.registro.length).toBeGreaterThan(0)
    }
    expect(JSON.stringify(partida)).toBe(antes)
  })
})
