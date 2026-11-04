/**
 * @file Catálogo das quatro coletas iniciais: Mineração, Lenhador, Pesca e Herbologia.
 * Define produto, nível exigido, duração em segundos e XP por ação; o domínio transforma
 * esses dados em progresso, sem que este arquivo execute ou salve a coleta.
 */
import type { DefinicaoDeAtividadeOciosa } from '@paralaxe/dominio'

/** Cada ação completa entrega uma unidade do recurso; o tempo e a experiência variam por atividade. */
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

/** Resolve o ID persistido da atividade; null permite ao chamador tratar referências fora do catálogo atual. */
export function obterDefinicaoDeAtividadeOciosa(idDaDefinicaoDaAtividade: string) {
  return ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.id === idDaDefinicaoDaAtividade) ?? null
}
