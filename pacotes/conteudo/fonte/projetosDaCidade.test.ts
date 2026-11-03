import { describe, expect, it } from 'vitest'
import { PROJETOS_DA_CIDADE, obterProjetoDaCidade } from './projetosDaCidade'
import { IDS_DOS_DISTRITOS, criarLegadoInicial, concluirProjeto, consultarProjeto, estagioDoLegado, type PartidaLocal } from '@greywake/dominio'

function partidaConquistadora(): PartidaLocal {
  const ids = ['material.cloch', 'material.giuis', 'material.scadan', 'material.neantog']
  const receitas = ['receita.metalurgia.tratada-cloch', 'receita.forja.giuis-bracadeiras', 'receita.culinaria.assado-scadan']
  return {
    legado: criarLegadoInicial(),
    personagem: { nivel: 20, ouro: 100000, inventario: ids.map(id => ({ idDaDefinicao: id, quantidade: 9999 })),
      banco: { inventario: [], itensDeEquipamento: [] } },
    combate: { loboDerrotado: true }, masmorra: { contratoConcluido: true },
    jornada: { idsDasReceitasFabricadas: receitas },
    desafios: { idsConcluidos: ['desafio.primeira-receita', 'desafio.primeira-vitoria', 'desafio.contrato-dun-liath', 'desafio.codice-10'] },
    codice: { idsDescobertos: [...ids, ...Array.from({ length: 25 }, (_, i) => `descoberta-${i}`)] },
    profissoes: Object.fromEntries(['mineracao','lenhador','pesca','herbologia','metalurgia','forja','culinaria'].map(id => [id, { nivel: 10, prestigio: 1 }])) ,
  } as unknown as PartidaLocal
}
describe('Catálogo da Cidade Viva', () => {
  it('define 32 projetos únicos com quatro etapas por distrito', () => {
    expect(PROJETOS_DA_CIDADE).toHaveLength(32)
    expect(new Set(PROJETOS_DA_CIDADE.map(projeto => projeto.id)).size).toBe(32)
    for (const id of IDS_DOS_DISTRITOS) expect(PROJETOS_DA_CIDADE.filter(p => p.distrito === id).map(p => p.nivel)).toEqual([1,2,3,4])
  })
  it('usa apenas os materiais básicos disponíveis no conteúdo inicial', () => {
    const materiais = new Set(['material.cloch', 'material.giuis', 'material.scadan', 'material.neantog'])
    for (const projeto of PROJETOS_DA_CIDADE) {
      expect(projeto.materiais.every(m => materiais.has(m.idDaDefinicao) && m.quantidade > 0)).toBe(true)
      expect(obterProjetoDaCidade(projeto.id)).toBe(projeto)
      expect(projeto.ouro).toBeGreaterThanOrEqual(0)
    }
  })
  it('permite completar todos os 32 projetos sem dependências circulares', () => {
    let partida = partidaConquistadora()
    for (const projeto of PROJETOS_DA_CIDADE) {
      const status = consultarProjeto(partida, projeto)
      expect(status.situacao, projeto.id).toBe('pronto')
      partida = concluirProjeto(partida, projeto, '2026-11-03T12:00:00.000Z')
    }
    expect(estagioDoLegado(partida.legado)).toBe(4)
    expect(partida.legado.historico).toHaveLength(32)
  })
})
