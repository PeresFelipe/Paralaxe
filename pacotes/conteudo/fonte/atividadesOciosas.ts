/**
 * @file Catálogo de coleta: os quatro recursos iniciais e os marcos de progressão adicionados.
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
  // Primeiro desbloqueio além do recurso inicial: Stán entra no nível 10 da Mineração.
  {
    id: "coletar.mineracao.stan",
    idDaProfissao: "mineracao",
    nome: 'Extrair Stán',
    idDaDefinicaoDoItemProduzido: 'material.stan',
    nomeDoResultado: 'Stán',
    nivelExigidoDaProfissao: 10,
    segundosPorAcao: 8,
    xpDeProfissaoPorAcao: 16,
  },
  // GDD §11: desbloqueios normais dos níveis 20 e 30; cadência e XP provisórios.
  {
    id: 'coletar.mineracao.copar',
    idDaProfissao: 'mineracao',
    nome: 'Extrair Copar',
    idDaDefinicaoDoItemProduzido: 'material.copar',
    nomeDoResultado: 'Copar',
    nivelExigidoDaProfissao: 20,
    segundosPorAcao: 10,
    xpDeProfissaoPorAcao: 21,
  },
  {
    id: 'coletar.mineracao.iarann',
    idDaProfissao: 'mineracao',
    nome: 'Extrair Iarann',
    idDaDefinicaoDoItemProduzido: 'material.iarann',
    nomeDoResultado: 'Iarann',
    nivelExigidoDaProfissao: 30,
    segundosPorAcao: 12,
    xpDeProfissaoPorAcao: 26,
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
    id: "coletar.lenhador.beith",
    idDaProfissao: "lenhador",
    nome: 'Cortar Beith',
    idDaDefinicaoDoItemProduzido: 'material.beith',
    nomeDoResultado: 'Beith',
    nivelExigidoDaProfissao: 10,
    segundosPorAcao: 8,
    xpDeProfissaoPorAcao: 16,
  },
  // GDD §11: desbloqueios normais dos níveis 20 e 30; cadência e XP provisórios.
  {
    id: 'coletar.lenhador.fearn',
    idDaProfissao: 'lenhador',
    nome: 'Cortar Fearn',
    idDaDefinicaoDoItemProduzido: 'material.fearn',
    nomeDoResultado: 'Fearn',
    nivelExigidoDaProfissao: 20,
    segundosPorAcao: 10,
    xpDeProfissaoPorAcao: 21,
  },
  {
    id: 'coletar.lenhador.saileach',
    idDaProfissao: 'lenhador',
    nome: 'Cortar Saileach',
    idDaDefinicaoDoItemProduzido: 'material.saileach',
    nomeDoResultado: 'Saileach',
    nivelExigidoDaProfissao: 30,
    segundosPorAcao: 12,
    xpDeProfissaoPorAcao: 26,
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
    id: "coletar.pesca.breac",
    idDaProfissao: "pesca",
    nome: 'Pescar Breac',
    idDaDefinicaoDoItemProduzido: 'material.breac',
    nomeDoResultado: 'Breac',
    nivelExigidoDaProfissao: 10,
    segundosPorAcao: 9,
    xpDeProfissaoPorAcao: 18,
  },
  // GDD §11: desbloqueios normais dos níveis 20 e 30; cadência e XP provisórios.
  {
    id: 'coletar.pesca.sairdin',
    idDaProfissao: 'pesca',
    nome: 'Pescar Sairdín',
    idDaDefinicaoDoItemProduzido: 'material.sairdin',
    nomeDoResultado: 'Sairdín',
    nivelExigidoDaProfissao: 20,
    segundosPorAcao: 11,
    xpDeProfissaoPorAcao: 23,
  },
  {
    id: 'coletar.pesca.ronnach',
    idDaProfissao: 'pesca',
    nome: 'Pescar Ronnach',
    idDaDefinicaoDoItemProduzido: 'material.ronnach',
    nomeDoResultado: 'Ronnach',
    nivelExigidoDaProfissao: 30,
    segundosPorAcao: 13,
    xpDeProfissaoPorAcao: 28,
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
  {
    id: "coletar.herbologia.seamair",
    idDaProfissao: "herbologia",
    nome: 'Colher Seamair',
    idDaDefinicaoDoItemProduzido: 'material.seamair',
    nomeDoResultado: 'Seamair',
    nivelExigidoDaProfissao: 10,
    segundosPorAcao: 8,
    xpDeProfissaoPorAcao: 16,
  },
  // GDD §11: desbloqueios normais dos níveis 20 e 30; cadência e XP provisórios.
  {
    id: 'coletar.herbologia.caisearbhan',
    idDaProfissao: 'herbologia',
    nome: 'Colher Caisearbhán',
    idDaDefinicaoDoItemProduzido: 'material.caisearbhan',
    nomeDoResultado: 'Caisearbhán',
    nivelExigidoDaProfissao: 20,
    segundosPorAcao: 10,
    xpDeProfissaoPorAcao: 21,
  },
  {
    id: 'coletar.herbologia.fraoch',
    idDaProfissao: 'herbologia',
    nome: 'Colher Fraoch',
    idDaDefinicaoDoItemProduzido: 'material.fraoch',
    nomeDoResultado: 'Fraoch',
    nivelExigidoDaProfissao: 30,
    segundosPorAcao: 12,
    xpDeProfissaoPorAcao: 26,
  },
] as const satisfies readonly DefinicaoDeAtividadeOciosa[]

/** Resolve o ID persistido da atividade; null permite ao chamador tratar referências fora do catálogo atual. */
export function obterDefinicaoDeAtividadeOciosa(idDaDefinicaoDaAtividade: string) {
  return ATIVIDADES_OCIOSAS_INICIAIS.find((atividade) => atividade.id === idDaDefinicaoDaAtividade) ?? null
}
