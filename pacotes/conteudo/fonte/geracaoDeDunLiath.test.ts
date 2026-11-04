/**
 * @file Regressão GDD §§23, 24, 32 e 55: geração reproduzível, escolhas e snapshot da expedição.
 */
import { describe, expect, it } from 'vitest'
import {
  gerarDunLiathProcedural, iniciarMasmorra, criarPartidaLocal,
  escolherCaminhoNaMasmorra, resolverSalaDaMasmorra,
  type DefinicaoDeMasmorra, type DefinicaoDeSalaDaMasmorra,
} from '@paralaxe/dominio'
import { DUN_LIATH_FACIL } from './masmorra'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'

const agora = '2026-11-04T13:00:00.000Z'
const classe = CLASSES_DE_PERSONAGEM.find(x => x.id === 'errante')!
const presente = PRESENTES_INICIAIS.find(x => x.id === 'nenhum')!
function partida() {
  const original = criarPartidaLocal({
    idDaPartida: 'teste-procedural', criadoEm: agora, versaoDoConteudo: 'test',
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente,
  })
  return { ...original, masmorra: { ...original.masmorra, contratoAceito: true, dunLiathFacilConquistado: true } }
}
const catalogo = {
  obterDefinicaoDeMasmorra: () => DUN_LIATH_FACIL,
  obterDefinicaoDeEquipamento: () => null,
  obterDefinicaoDeHabilidade: () => null,
  obterDefinicaoDeInimigo: () => null,
}
function rotasAteChefe(mapa: DefinicaoDeMasmorra): string[][] {
  const salas = new Map(mapa.salas.map(s => [s.id, s]))
  const rotas: string[][] = []
  function seguir(id: string, rota: string[]) {
    if (rota.includes(id)) throw new Error(`Ciclo procedural: ${id}`)
    const sala = salas.get(id)
    if (!sala) throw new Error(`Destino inexistente: ${id}`)
    const proximaRota = [...rota, id]
    if (sala.idsDasProximasSalas.length === 0) {
      expect(id).toBe('sala.fairtheoir')
      rotas.push(proximaRota)
      return
    }
    for (const proximo of sala.idsDasProximasSalas) seguir(proximo, proximaRota)
  }
  seguir(mapa.idDaSalaInicial, [])
  return rotas
}
function sala(mapa: DefinicaoDeMasmorra, id: string): DefinicaoDeSalaDaMasmorra {
  const result = mapa.salas.find(s => s.id === id)
  if (!result) throw new Error(`Sala ausente: ${id}`)
  return result
}

describe('Dún Liath — geração procedural de repetição', () => {
  it('preserva o mapa tutorial e cria grafo de 20 nós reproduzível sem mutações', () => {
    const baseAntes = JSON.stringify(DUN_LIATH_FACIL)
    for (const seed of [0,1,2,3,7,11,42,100,1000,23941,2147483647]) {
      const a = gerarDunLiathProcedural(DUN_LIATH_FACIL, seed)
      const b = gerarDunLiathProcedural(DUN_LIATH_FACIL, seed)
      expect(a).toEqual(b)
      expect(a.procedural).toBe(true)
      expect(a.salas).toHaveLength(20)
      expect(new Set(a.salas.map(s => s.id)).size).toBe(20)
      expect(sala(a, 'sala.protetor').tipo).toBe('evento')
      expect(sala(a, 'sala.registroDeDados').tipo).toBe('tesouro')
      expect(sala(a, 'sala.fairtheoir').tipo).toBe('chefe')
      expect(sala(a, 'sala.procedural.armadilha').tipo).toBe('armadilha')
      expect(sala(a, 'sala.procedural.segredo').tipo).toBe('secreta')
    }
    expect(JSON.stringify(DUN_LIATH_FACIL)).toBe(baseAntes)
    expect(DUN_LIATH_FACIL.salas).toHaveLength(18)
  })

  it('todas as rotas de 128 sementes levam ao chefe em 15–20 salas, mesmo sem segredos', () => {
    const variantes = new Set<string>()
    for (let seed = 0; seed < 128; seed++) {
      const mapa = gerarDunLiathProcedural(DUN_LIATH_FACIL, seed)
      const rotas = rotasAteChefe(mapa)
      expect(rotas.length).toBeGreaterThanOrEqual(4)
      for (const rota of rotas) {
        expect(rota.length).toBeGreaterThanOrEqual(15)
        expect(rota.length).toBeLessThanOrEqual(20)
        expect(rota).toContain('sala.recuperacao')
        expect(rota).toContain('sala.chefe-portao')
        expect(rota).toContain('sala.procedural.armadilha')
        expect(rota[0]).toBe('sala.entrada')
        expect(rota.at(-1)).toBe('sala.fairtheoir')
      }
      expect(rotas.some(rota => rota.includes('sala.procedural.segredo'))).toBe(true)
      expect(rotas.some(rota => !rota.includes('sala.procedural.segredo'))).toBe(true)
      expect(sala(mapa, 'sala.muralha').idsDasProximasSalas).toHaveLength(2)
      for (const destino of sala(mapa, 'sala.muralha').idsDasProximasSalas) {
        expect(sala(mapa, 'sala.muralha').pistasDasSaidas?.[destino]).toBeTruthy()
      }
      variantes.add(JSON.stringify(mapa.salas.filter(s => s.id.startsWith('sala.procedural.'))))
    }
    expect(variantes.size).toBeGreaterThan(3)
  })

  it('persiste o snapshot, ignora a definição externa durante a resolução e impede recompensa repetida', () => {
    const mapa = gerarDunLiathProcedural(DUN_LIATH_FACIL, 17)
    const iniciado = iniciarMasmorra(partida(), mapa, 17, agora)
    const ativo = iniciado.masmorra.expedicaoAtiva
    expect(ativo?.grafoGerado).toEqual(mapa)
    expect(ativo?.semente).toBe(17)
    if (!ativo) throw new Error('Expedição não iniciada.')
    const nova = {
      ...iniciado, masmorra: { ...iniciado.masmorra,
        expedicaoAtiva: { ...ativo,
          idDaSalaAtual: 'sala.procedural.segredo',
          idsDasSalasVisitadas: [...ativo.idsDasSalasVisitadas, 'sala.procedural.segredo'],
        },
      },
    }
    // Passar catálogo fixo não deve apagar sala de um grafo já gravado.
    const resolvida = resolverSalaDaMasmorra(nova, DUN_LIATH_FACIL, catalogo, agora).partida
    expect(resolvida.masmorra.expedicaoAtiva?.bolsaDaExpedicao)
      .toContainEqual({ idDaDefinicao: 'item.dun-liath.sucata', quantidade: 1 })
    expect(() => resolverSalaDaMasmorra(resolvida, DUN_LIATH_FACIL, catalogo, agora))
      .toThrow('já foi resolvida')
    const saida = escolherCaminhoNaMasmorra(resolvida, DUN_LIATH_FACIL, 'sala.passagem', agora)
    expect(saida.masmorra.expedicaoAtiva?.idDaSalaAtual).toBe('sala.passagem')
    expect(saida.masmorra.expedicaoAtiva?.grafoGerado).toEqual(mapa)
  })

  it('armadilha aplica dano limitado e não mata instantaneamente', () => {
    const mapa = gerarDunLiathProcedural(DUN_LIATH_FACIL, 88)
    const iniciado = iniciarMasmorra(partida(), mapa, 88, agora)
    const ativo = iniciado.masmorra.expedicaoAtiva
    if (!ativo) throw new Error('Expedição não iniciada')
    const vida = ativo.recursos.vida
    const teste = { ...iniciado, masmorra: { ...iniciado.masmorra,
      expedicaoAtiva: { ...ativo,
        idDaSalaAtual: 'sala.procedural.armadilha',
        idsDasSalasVisitadas: [...ativo.idsDasSalasVisitadas, 'sala.procedural.armadilha'],
      },
    } }
    const resolvida = resolverSalaDaMasmorra(teste, DUN_LIATH_FACIL, catalogo, agora).partida
    const apos = resolvida.masmorra.expedicaoAtiva?.recursos.vida
    expect(apos).toBeGreaterThanOrEqual(1)
    expect(apos).toBeLessThan(vida)
    const quaseMorta = { ...teste, masmorra: { ...teste.masmorra,
      expedicaoAtiva: { ...teste.masmorra.expedicaoAtiva!, recursos: { ...ativo.recursos, vida: 1 } },
    } }
    expect(resolverSalaDaMasmorra(quaseMorta, DUN_LIATH_FACIL, catalogo, agora)
      .partida.masmorra.expedicaoAtiva?.recursos.vida).toBe(1)
  })
})
