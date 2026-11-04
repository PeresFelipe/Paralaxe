import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import { ID_DE_MIRA, MARCOS_DE_MIRA, criarEstadoInicialDoGrupo, registrarMarcoDeMira,
  recrutarMira, configurarFormacaoDoGrupo, avancarVinculoDoParceiro } from './grupo'
const classe: DefinicaoDeClasseDoPersonagem = {
  id: 'errante', nome: 'Errante', resumo: 'Equilibrado.',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' }, idDaHabilidadeInicial: 'habilidade.abertura',
}
const presente: DefinicaoDePresente = { id: 'nenhum', nome: 'Nenhum', resumo: 'Sem bônus.', concessoes: [] }
const agora = '2026-11-04T12:00:00.000Z'
function partida(concluiu = true) {
  const p = criarPartidaLocal({ idDaPartida: 'grupo', criadoEm: agora, versaoDoConteudo: 'test',
    nomeDoPersonagem: 'Ailith', classeDoPersonagem: classe, presente })
  return { ...p, masmorra: { ...p.masmorra, dunLiathFacilConquistado: concluiu } }
}
describe('Grupo e Mira — GDD §§21–22', () => {
  it('começa sem parceiros e impede encontros antes de Dún Liath', () => {
    expect(criarEstadoInicialDoGrupo().idsDosParceirosAtivos).toEqual([])
    expect(() => registrarMarcoDeMira(partida(false), 'rastros-na-segunda-masmorra', agora))
      .toThrow('depois de Dún Liath')
    expect(() => recrutarMira(partida(), agora)).toThrow('não está recrutável')
  })
  it('segue cada marco: cooperação, discordância, Chefe, Taverna e recrutamento explícito', () => {
    let p = partida()
    expect(() => registrarMarcoDeMira(p, 'cooperacao-temporaria', agora)).toThrow('ordem')
    for (const marco of MARCOS_DE_MIRA.slice(1)) {
      if (marco === 'desconhecida') continue
      p = registrarMarcoDeMira(p, marco, agora)
      if (marco === 'cooperacao-temporaria' || marco === 'divergencia-sobre-monstros' || marco === 'chefe-em-dupla') {
        expect(p.grupo.idsDosParceirosAtivos).toContain(ID_DE_MIRA)
        expect(p.grupo.parceiros[ID_DE_MIRA]?.recrutado).toBe(false)
      }
    }
    expect(p.grupo.idsDosParceirosAtivos).toEqual([])
    p = recrutarMira(p, agora)
    expect(p.grupo.parceiros[ID_DE_MIRA]).toEqual({ recrutado: true, vinculo: 'aliado' })
    p = configurarFormacaoDoGrupo(p, [ID_DE_MIRA], agora)
    expect(p.grupo.idsDosParceirosAtivos).toEqual([ID_DE_MIRA])
    expect(recrutarMira(p, agora)).toBe(p)
    expect(configurarFormacaoDoGrupo(p, [], agora).grupo.idsDosParceirosAtivos).toEqual([])
    expect(avancarVinculoDoParceiro(p, ID_DE_MIRA, agora).grupo.parceiros[ID_DE_MIRA]?.vinculo).toBe('companheiro')
  })
  it('recusa duplicatas, não recrutados e mais de três parceiros', () => {
    const p = partida()
    expect(() => configurarFormacaoDoGrupo(p, [ID_DE_MIRA], agora)).toThrow('não recrutado')
    expect(() => configurarFormacaoDoGrupo(p, ['x','x'], agora)).toThrow('três parceiros distintos')
    expect(() => configurarFormacaoDoGrupo(p, ['a','b','c','d'], agora)).toThrow('três parceiros distintos')
    expect(() => avancarVinculoDoParceiro(p, ID_DE_MIRA, agora)).toThrow('não recrutado')
  })
})
