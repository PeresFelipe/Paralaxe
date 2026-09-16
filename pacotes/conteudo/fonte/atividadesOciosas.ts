import type { DefinicaoDeAtividadeOciosa } from '@greywake/dominio'

export const ATIVIDADES_OCIOSAS_INICIAIS = [
  {
    id: "coletar.mineracao.cloch",
    idDaProfissao: "mineracao",
    nome: 'Extrair Cloch',
    idDaDefinicaoDoItemProduzido: 'material.cloch',
    nomeDoResultado: 'Cloch',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 4,
    xpDeProfissaoPorAcao: 8,
  },
  {
    id: "coletar.lenhador.giuis",
    idDaProfissao: "lenhador",
    nome: 'Cortar Giúis',
    idDaDefinicaoDoItemProduzido: 'material.giuis',
    nomeDoResultado: 'Giúis',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 4,
    xpDeProfissaoPorAcao: 8,
  },
  {
    id: "coletar.pesca.scadan",
    idDaProfissao: "pesca",
    nome: 'Pescar Scadán',
    idDaDefinicaoDoItemProduzido: 'material.scadan',
    nomeDoResultado: 'Scadán',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 5,
    xpDeProfissaoPorAcao: 10,
  },
  {
    id: "coletar.herbologia.neantog",
    idDaProfissao: "herbologia",
    nome: 'Colher Neantóg',
    idDaDefinicaoDoItemProduzido: 'material.neantog',
    nomeDoResultado: 'Neantóg',
    nivelExigidoDaProfissao: 1,
    segundosPorAcao: 4,
    xpDeProfissaoPorAcao: 8,
  },
] as const satisfies readonly DefinicaoDeAtividadeOciosa[]

export function obterDefinicaoDeAtividadeOciosa(idDaDefinicaoDaAtividade: string) {
  return ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.id === idDaDefinicaoDaAtividade) ?? null
}
