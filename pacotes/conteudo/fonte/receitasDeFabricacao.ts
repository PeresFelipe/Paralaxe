import type { DefinicaoDeReceitaDeFabricacao } from '@greywake/dominio'

export const RECEITAS_INICIAIS_DE_FABRICACAO = [
  {
    id: "receita.metalurgia.tratada-cloch",
    idDaProfissao: "metalurgia",
    nome: 'Cloch Tratada',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 6,
    xpDeProfissaoPorAcao: 12,
    ingredientes: [{ idDaDefinicao: 'material.cloch', quantidade: 3 }],
    saida: { tipo: 'item', idDaDefinicao: "material.tratada-cloch", nome: 'Cloch Tratada', quantidade: 1 },
  },
  {
    id: "receita.forja.giuis-bracadeiras",
    idDaProfissao: "forja",
    nome: 'Braçadeiras de Giúis',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 12,
    xpDeProfissaoPorAcao: 24,
    ingredientes: [{ idDaDefinicao: 'material.giuis', quantidade: 6 }],
    saida: { tipo: "equipamento", idDaDefinicao: "armadura.giuis-bracadeiras", nome: 'Braçadeiras de Giúis' },
  },
  {
    id: "receita.culinaria.assado-scadan",
    idDaProfissao: "culinaria",
    nome: 'Scadán Assado',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 8,
    xpDeProfissaoPorAcao: 16,
    ingredientes: [{ idDaDefinicao: 'material.scadan', quantidade: 2 }],
    saida: { tipo: 'item', idDaDefinicao: "item.comida.assado-scadan", nome: 'Scadán Assado', quantidade: 1 },
  },
  {
    id: "receita.culinaria.neantog-preparacao",
    idDaProfissao: "culinaria",
    nome: 'Preparado de Neantóg',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 8,
    xpDeProfissaoPorAcao: 16,
    ingredientes: [{ idDaDefinicao: 'material.neantog', quantidade: 2 }],
    saida: { tipo: 'item', idDaDefinicao: "item.consumivel.neantog-preparacao", nome: 'Preparado de Neantóg', quantidade: 1 },
  },
  {
    id: "receita.forja.simples-reforco-1",
    idDaProfissao: "forja",
    nome: 'Reforço Simples +1',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 15,
    xpDeProfissaoPorAcao: 30,
    ingredientes: [{ idDaDefinicao: "material.tratada-cloch", quantidade: 2 }],
    saida: { tipo: "equipamento-reforco", nome: 'Reforço Simples +1' },
  },
] as const satisfies readonly DefinicaoDeReceitaDeFabricacao[]

export function obterDefinicaoDeReceitaDeFabricacao(idDaDefinicaoDaReceita: string) {
  return RECEITAS_INICIAIS_DE_FABRICACAO.find((receita) => receita.id === idDaDefinicaoDaReceita) ?? null
}
