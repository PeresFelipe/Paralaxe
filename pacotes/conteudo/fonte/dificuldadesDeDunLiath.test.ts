/**
 * @file GDD §§23,29,33: desbloqueio sequencial e recompensas únicas de Dún Liath.
 */
import { describe, expect, it } from 'vitest'
import {
  criarPartidaLocal, iniciarMasmorra, extrairExpedicaoDaMasmorra,
  obterDificuldadesDesbloqueadasDaMasmorra, gerarDunLiathProcedural,
  iniciarReceitaDeFabricacao, type DificuldadeDaMasmorra,
  type PartidaLocal,
} from '@paralaxe/dominio'
import { DUN_LIATH_FACIL, DUN_LIATH_NORMAL, DUN_LIATH_DIFICIL,
  DUN_LIATH_IMPOSSIVEL, obterDefinicaoDeMasmorra } from './masmorra'
import { obterDefinicaoDeReceitaDeFabricacao } from './receitasDeFabricacao'
import { obterDefinicaoDeEquipamento } from './equipamento'
import { CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS } from './criacaoDePersonagem'

const agora = '2026-11-04T15:00:00.000Z'
const classe = CLASSES_DE_PERSONAGEM.find(x => x.id === 'errante')!
const presente = PRESENTES_INICIAIS.find(x => x.id === 'nenhum')!
function novaPartida(): PartidaLocal {
  const partida = criarPartidaLocal({
    idDaPartida: 'dificuldades-teste', criadoEm: agora, versaoDoConteudo: 'test',
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente,
  })
  return { ...partida, masmorra: { ...partida.masmorra, contratoAceito: true } }
}
function comConclusoes(p: PartidaLocal, concluidas: DificuldadeDaMasmorra[]) {
  return { ...p, masmorra: { ...p.masmorra,
    dificuldadesConcluidas: concluidas,
    dunLiathFacilConquistado: concluidas.includes('facil'),
  } }
}
function simularConclusao(p: PartidaLocal, dificuldade: DificuldadeDaMasmorra) {
  const mapa = obterDefinicaoDeMasmorra(`masmorra.dun-liath.${dificuldade}`)
  if (!mapa) throw new Error('Mapa não encontrado')
  const gerado = dificuldade === 'facil' && !p.masmorra.dunLiathFacilConquistado
    ? mapa : gerarDunLiathProcedural(mapa, 78)
  const iniciado = iniciarMasmorra(p, gerado, 78, agora)
  const expedicao = iniciado.masmorra.expedicaoAtiva
  if (!expedicao) throw new Error('Expedição não iniciada')
  return extrairExpedicaoDaMasmorra({
    ...iniciado, masmorra: { ...iniciado.masmorra,
      expedicaoAtiva: { ...expedicao, concluido: true },
    },
  }, agora)
}
describe('Dún Liath com quatro dificuldades', () => {
  it('cataloga quatro dificuldades preservando IDs e chefe de Dún Liath', () => {
    expect([DUN_LIATH_FACIL, DUN_LIATH_NORMAL, DUN_LIATH_DIFICIL, DUN_LIATH_IMPOSSIVEL]
      .map(m => m.dificuldade)).toEqual(['facil','normal','dificil','impossivel'])
    for (const dificuldade of ['facil','normal','dificil','impossivel'] as const) {
      const mapa = obterDefinicaoDeMasmorra(`masmorra.dun-liath.${dificuldade}`)
      expect(mapa).toBeTruthy()
      expect(mapa?.salas.at(-1)?.id).toBe('sala.fairtheoir')
      expect(gerarDunLiathProcedural(mapa!, 22).dificuldade).toBe(dificuldade)
    }
  })

  it('desbloqueia Fácil → Normal → Difícil → Impossível somente após conclusão segura', () => {
    let p = novaPartida()
    expect(obterDificuldadesDesbloqueadasDaMasmorra(p.masmorra)).toEqual(['facil'])
    expect(() => iniciarMasmorra(p, DUN_LIATH_NORMAL, 1, agora)).toThrow('anterior')
    p = simularConclusao(p, 'facil')
    expect(obterDificuldadesDesbloqueadasDaMasmorra(p.masmorra)).toEqual(['facil','normal'])
    expect(() => iniciarMasmorra(p, DUN_LIATH_DIFICIL, 1, agora)).toThrow('anterior')
    p = simularConclusao(p, 'normal')
    expect(obterDificuldadesDesbloqueadasDaMasmorra(p.masmorra)).toEqual(['facil','normal','dificil'])
    expect(() => iniciarMasmorra(p, DUN_LIATH_IMPOSSIVEL, 1, agora)).toThrow('anterior')
    p = simularConclusao(p, 'dificil')
    expect(obterDificuldadesDesbloqueadasDaMasmorra(p.masmorra))
      .toEqual(['facil','normal','dificil','impossivel'])
    p = simularConclusao(p, 'impossivel')
    expect(p.masmorra.dificuldadesConcluidas).toEqual(['facil','normal','dificil','impossivel'])
  })

  it('a primeira conclusão Difícil entrega um Escudo do Último Vigia uma única vez', () => {
    const base = comConclusoes(novaPartida(), ['facil','normal'])
    const primeira = simularConclusao(base, 'dificil')
    const escudos = primeira.personagem.itensDeEquipamento.filter(x => x.idDaDefinicao === 'escudo.ultimo-vigia')
    expect(escudos).toHaveLength(1)
    expect(obterDefinicaoDeEquipamento(escudos[0]!.idDaDefinicao)?.nome).toBe('Escudo do Último Vigia')
    expect(escudos[0]?.idsDosAfixos).toEqual(['afixo.defesa-2'])
    const repetida = simularConclusao(primeira, 'dificil')
    expect(repetida.personagem.itensDeEquipamento.filter(x => x.idDaDefinicao === 'escudo.ultimo-vigia')).toHaveLength(1)
    expect(repetida.personagem.proximaSequenciaDeEquipamento).toBe(primeira.personagem.proximaSequenciaDeEquipamento)
  })

  it('primeira conclusão Impossível entrega Lacre, sem duplicar e sem criar Relíquia', () => {
    const base = comConclusoes(novaPartida(), ['facil','normal','dificil'])
    const primeira = simularConclusao(base, 'impossivel')
    expect(primeira.personagem.inventario)
      .toContainEqual({ idDaDefinicao: 'item.dun-liath.lacre-comandante', quantidade: 1 })
    const repetida = simularConclusao(primeira, 'impossivel')
    expect(repetida.personagem.inventario.find(i => i.idDaDefinicao === 'item.dun-liath.lacre-comandante')?.quantidade).toBe(1)
  })

  it('conclusão Normal libera o Reforço do Vigia, exigindo materiais e fragmento de chefe', () => {
    const receita = obterDefinicaoDeReceitaDeFabricacao('receita.forja.reforco-do-vigia')
    if (!receita) throw new Error('Receita não cadastrada')
    expect('dificuldadeRequerida' in receita ? receita.dificuldadeRequerida : null).toBe('normal')
    expect(receita.ingredientes.map(i => i.idDaDefinicao))
      .toContain('item.fairtheoir-fragmento')
    const original = novaPartida()
    const materiais = receita.ingredientes.map(i => ({
      idDaDefinicao: i.idDaDefinicao, quantidade: i.quantidade,
    }))
    const preparado: PartidaLocal = { ...original,
      profissoes: { ...original.profissoes, forja: { nivel: 30, xp: 0, prestigio: 0 } },
      personagem: { ...original.personagem, inventario: materiais },
    }
    const alvo = preparado.personagem.equipamento.maoPrincipal!
    expect(() => iniciarReceitaDeFabricacao(preparado, receita, agora, alvo)).toThrow('Dún Liath')
    const liberado = { ...preparado, masmorra: { ...preparado.masmorra,
      dificuldadesConcluidas: ['facil', 'normal'] as DificuldadeDaMasmorra[],
    }, personagem: { ...preparado.personagem,
      itensDeEquipamento: preparado.personagem.itensDeEquipamento.map(i => i.idDaInstancia === alvo
        ? { ...i, nivelDeReforco: 1 as const } : i),
    } }
    const iniciado = iniciarReceitaDeFabricacao(liberado, receita, agora, alvo)
    expect(iniciado.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita).toBe(receita.id)
  })

  it('saves legados sem o campo novo continuam identificando a conclusão Fácil', () => {
    const inicial = novaPartida()
    expect(inicial.masmorra.dificuldadesConcluidas).toBeUndefined()
    const legado = { ...inicial, masmorra: {
      ...inicial.masmorra, dunLiathFacilConquistado: true,
    } }
    expect(obterDificuldadesDesbloqueadasDaMasmorra(legado.masmorra)).toEqual(['facil','normal'])
  })
})
