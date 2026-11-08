import { describe, expect, it } from 'vitest'
import {
  CLASSES_DE_PERSONAGEM, PRESENTES_INICIAIS, DEFINICOES_DE_EQUIPAMENTO,
  ATIVIDADES_OCIOSAS_INICIAIS, RECEITAS_INICIAIS_DE_FABRICACAO, PROJETOS_DA_CIDADE,
} from '@paralaxe/conteudo'
import {
  criarPartidaLocal, obterPilhaLimite, type DefinicaoDeClasseDoPersonagem, obterLimiteDeEspacosDoInventario,
  obterLimiteDeEspacosDoBanco, obterUsoDeEspacosDoInventario,
  obterEspacoParaPilhaNoInventario, obterUsoDeEspacosDoBanco,
  obterDificuldadesDesbloqueadasDaMasmorra, derivarEstatisticasDeCombateDoJogador,
} from '@paralaxe/dominio'
import { criarPartidaDeDebug, ATRIBUTO_DE_DEBUG, OURO_DE_DEBUG } from './partidaDeDebug'
import { catalogoDeCombate } from './combateDaEstrada'

const agora = '2026-11-08T18:00:00.000Z'
function original(classe: DefinicaoDeClasseDoPersonagem = CLASSES_DE_PERSONAGEM[0]!) {
  return criarPartidaLocal({ idDaPartida: 'original', criadoEm: agora, versaoDoConteudo: 'teste',
    nomeDoPersonagem: 'Aedan', classeDoPersonagem: classe, presente: PRESENTES_INICIAIS.find(p => p.id === 'nenhum')! })
}

describe('preset de debug isolado', () => {
  it.each(CLASSES_DE_PERSONAGEM)('prepara $nome com progressão máxima sem mutar o original', classe => {
    const base = original(classe), copia = structuredClone(base)
    const debug = criarPartidaDeDebug(base, 'debug-teste', agora)
    expect(base).toEqual(copia)
    expect(debug.idDaPartida).not.toBe(base.idDaPartida)
    expect(debug.depuracao?.idDaPartidaOriginal).toBe(base.idDaPartida)
    expect(debug.personagem.nome).toBe('[DEBUG] Aedan')
    expect(debug.personagem.nivel).toBe(99)
    expect(debug.personagem.ouro).toBe(OURO_DE_DEBUG)
    expect(Object.values(debug.personagem.atributos).every(v => v === ATRIBUTO_DE_DEBUG)).toBe(true)
    expect(Object.values(debug.profissoes).every(p => p.nivel === 99 && p.prestigio === 3 && p.xp === 0)).toBe(true)
    expect(debug.personagem.prestigio.nivel).toBe(3)
    expect(debug.personagem.prestigio.idsDosNosDesbloqueados).toHaveLength(32)
    expect(debug.personagem.espacosDeHabilidadesAtivas).toHaveLength(4)
    expect(debug.personagem.espacosDeHabilidadesAtivas.every(id => debug.personagem.idsDasHabilidadesConhecidas.includes(id!))).toBe(true)
    expect(obterDificuldadesDesbloqueadasDaMasmorra(debug.masmorra)).toHaveLength(4)
    expect(debug.legado.historico).toHaveLength(PROJETOS_DA_CIDADE.length)
    expect(Object.values(debug.legado.distritos).every(n => n === 4)).toBe(true)
    expect(debug.grupo.parceiros['parceira.mira']).toEqual({ recrutado: true, vinculo: 'leal' })
    const estatisticas = derivarEstatisticasDeCombateDoJogador(debug, catalogoDeCombate)
    expect(estatisticas.vidaMaxima).toBeGreaterThan(0)
    expect(Number.isFinite(estatisticas.poderDoAtaqueBasico)).toBe(true)
  })
  it('entrega todos os modelos e recursos sem duplicar IDs; conserva margem para loot', () => {
    const debug = criarPartidaDeDebug(original(), 'debug-teste', agora)
    const equipamentos = [...debug.personagem.itensDeEquipamento, ...debug.personagem.banco.itensDeEquipamento]
    expect(new Set(equipamentos.map(e => e.idDaDefinicao))).toEqual(new Set(DEFINICOES_DE_EQUIPAMENTO.map(e => e.id)))
    expect(new Set(equipamentos.map(e => e.idDaInstancia)).size).toBe(equipamentos.length)
    expect(equipamentos.every(e => e.nivelDeReforco === 2 && e.raridade === 'raro')).toBe(true)
    const itens = new Map(debug.personagem.inventario.map(p => [p.idDaDefinicao, p.quantidade]))
    expect(itens.size).toBe(debug.personagem.inventario.length)
    for (const atividade of ATIVIDADES_OCIOSAS_INICIAIS) expect(itens.get(atividade.idDaDefinicaoDoItemProduzido)).toBe(obterPilhaLimite(atividade.idDaDefinicaoDoItemProduzido))
    for (const receita of RECEITAS_INICIAIS_DE_FABRICACAO) for (const ingrediente of receita.ingredientes) expect(itens.get(ingrediente.idDaDefinicao)).toBeGreaterThanOrEqual(ingrediente.quantidade)
    expect(obterUsoDeEspacosDoInventario(debug)).toBeLessThan(obterLimiteDeEspacosDoInventario(debug))
    expect(obterUsoDeEspacosDoBanco(debug)).toBeLessThan(obterLimiteDeEspacosDoBanco(debug))
    for (const pilha of debug.personagem.inventario) expect(obterEspacoParaPilhaNoInventario(debug, pilha.idDaDefinicao)).toBeGreaterThan(0)
  })
  it('repõe o mesmo debug, mantém sua origem e não acumula nomes ou instâncias', () => {
    const debug = criarPartidaDeDebug(original(), 'debug-teste', agora)
    debug.personagem.ouro = 0
    debug.personagem.inventario = []
    const nova = criarPartidaDeDebug(debug, debug.idDaPartida, '2026-11-08T19:00:00.000Z')
    expect(nova.idDaPartida).toBe(debug.idDaPartida)
    expect(nova.depuracao?.idDaPartidaOriginal).toBe('original')
    expect(nova.personagem.nome).toBe('[DEBUG] Aedan')
    expect(nova.personagem.ouro).toBe(OURO_DE_DEBUG)
    expect(nova.personagem.inventario.length).toBeGreaterThan(0)
    expect(nova.masmorra.expedicaoAtiva).toBeNull()
    expect(nova.ocioso.atividadeAtiva).toBeNull()
  })
  it('não permite usar o ID original e mantém limites normais nos saves comuns', () => {
    const base = original()
    expect(() => criarPartidaDeDebug(base, base.idDaPartida, agora)).toThrow('ID separado')
    expect(obterLimiteDeEspacosDoInventario(base)).toBe(24)
    expect(obterLimiteDeEspacosDoBanco(base)).toBe(80)
    expect(obterPilhaLimite('material.cloch', base)).toBe(9999)
  })
})
