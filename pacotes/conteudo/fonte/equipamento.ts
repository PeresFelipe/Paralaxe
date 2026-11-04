/**
 * @file Definições dos equipamentos iniciais, fabricáveis, compráveis e obtidos na masmorra.
 * Este catálogo descreve o modelo; reforço, raridade e afixos pertencem às instâncias
 * do jogador. Os valores aqui alimentam a derivação de estatísticas no domínio.
 */
import type { DefinicaoDeEquipamento } from '@paralaxe/dominio'

/** Armas definem dano, cadência e escalonamento; armaduras fornecem defesa e acessórios podem aumentar recursos. */
export const DEFINICOES_DE_EQUIPAMENTO = [
  { id: 'ferramenta.mineracao.picareta', nome: 'Picareta de Campo', espaco: 'ferramentaMineracao', bonusDeColeta: { idDaProfissao: 'mineracao', xpAdicionalPorAcao: 2 } },
  { id: 'ferramenta.lenhador.machado-corte', nome: 'Machado de Corte', espaco: 'ferramentaLenhador', bonusDeColeta: { idDaProfissao: 'lenhador', xpAdicionalPorAcao: 2 } },
  { id: 'ferramenta.pesca.equipamento-pesca', nome: 'Equipamento de Pesca', espaco: 'ferramentaPesca', bonusDeColeta: { idDaProfissao: 'pesca', xpAdicionalPorAcao: 3 } },
  { id: 'ferramenta.herbologia.kit-herbologia', nome: 'Kit de Herbologia', espaco: 'ferramentaHerbologia', bonusDeColeta: { idDaProfissao: 'herbologia', xpAdicionalPorAcao: 2 } },
  // Progressão normal de Forja (níveis 20 e 30). Não são Relíquias.
  { id: 'escudo.fearn-broquel', nome: 'Broquel Trançado de Fearn', espaco: 'maoSecundaria', estatisticaPrincipal: { tipo: 'defesa', valor: 14 } },
  { id: 'armadura.iarann-couraca', nome: 'Couraça de Iarann', espaco: 'peitoral', estatisticaPrincipal: { tipo: 'defesa', valor: 26 } },
  { id: 'arma.saileach-arco', nome: 'Arco de Saileach', espaco: 'maoPrincipal', estatisticaPrincipal: { tipo: 'ataque', valor: 22 }, combateDaArma: { tipoDeDano: 'perfuracao', intervaloDeAcaoEmSegundos: 2.25, escalonamento: { forca: 'D', destreza: 'A' } } },
  // Proteções, arma e joia de níveis 45–60; não são Relíquias.
  { id: 'armadura.fundicao-pesada-peitoral', nome: 'Peitoral de Fundição Pesada', espaco: 'peitoral', estatisticaPrincipal: { tipo: 'defesa', valor: 36 } },
  { id: 'arma.fuinseog-arco', nome: 'Arco de Fuinseog', espaco: 'maoPrincipal', estatisticaPrincipal: { tipo: 'ataque', valor: 29 }, combateDaArma: { tipoDeDano: 'perfuracao', intervaloDeAcaoEmSegundos: 2.25, escalonamento: { forca: 'D', destreza: 'A' } } },
  { id: 'item.equipamento.airgead-anel', nome: 'Anel de Airgead', espaco: 'anel1', bonusDeRecursos: { vidaMaxima: 20, manaMaxima: 20, folegoMaximo: 15 } },
  // Ofícios 75/90: equipamento normal fabricado; o GDD reserva Relíquias para descoberta.
  { id: 'armadura.dair-peitoral-hibrido', nome: 'Peitoral Híbrido de Dair', espaco: 'peitoral', estatisticaPrincipal: { tipo: 'defesa', valor: 46 } },
  { id: 'arma.iur-arco-grianchloch', nome: 'Arco de Iúr e Grianchloch', espaco: 'maoPrincipal', estatisticaPrincipal: { tipo: 'ataque', valor: 38 }, combateDaArma: { tipoDeDano: 'perfuracao', intervaloDeAcaoEmSegundos: 2.2, escalonamento: { forca: 'D', destreza: 'A' } } },
  { id: 'arma.grianchloch-cajado', nome: 'Cajado de Grianchloch', espaco: 'maoPrincipal', estatisticaPrincipal: { tipo: 'ataque', valor: 36 }, combateDaArma: { tipoDeDano: 'arcano', intervaloDeAcaoEmSegundos: 2.4, escalonamento: { inteligencia: 'A' } } },
  { id: "arma.milicia-espada", nome: 'Espada de Milícia', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 14 }, combateDaArma: { tipoDeDano: "corte", intervaloDeAcaoEmSegundos: 2.1, escalonamento: { forca: 'B', destreza: 'C' } } },
  { id: "escudo.milicia-escudo", nome: 'Escudo de Milícia', espaco: "maoSecundaria", estatisticaPrincipal: { tipo: "defesa", valor: 8 } },
  { id: "armadura.milicia-peitoral", nome: 'Peitoral de Milícia', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 18 } },
  { id: "arma.simples-cajado", nome: 'Cajado Simples', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 9 }, combateDaArma: { tipoDeDano: "arcano", intervaloDeAcaoEmSegundos: 2.4, escalonamento: { inteligencia: 'C' } } },
  { id: "armadura.simples-vestes", nome: 'Vestes Simples', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 6 } },
  { id: "arma.curto-arco", nome: 'Arco Curto', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 12 }, combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 2.3, escalonamento: { forca: 'D', destreza: 'A' } } },
  { id: "arma.beith-arco", nome: 'Arco de Beith', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 15 }, combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 2.3, escalonamento: { forca: 'D', destreza: 'A' } } },
  { id: "armadura.caca-gibao", nome: 'Gibão de Caça', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 10 } },
  { id: "arma.simples-maca", nome: 'Maça Simples', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 14 }, combateDaArma: { tipoDeDano: "impacto", intervaloDeAcaoEmSegundos: 2.3, escalonamento: { forca: 'C', destreza: 'D' } } },
  { id: "catalisador.simples", nome: 'Catalisador Simples', espaco: "maoSecundaria" },
  { id: "armadura.acolito-vestes", nome: 'Vestes do Acólito', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 8 } },
  { id: "arma.caca-adaga", nome: 'Adaga de Caça', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 7 }, combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 1.45, escalonamento: { forca: 'D', destreza: 'B' } } },
  { id: "armadura.leve-traje", nome: 'Traje Leve', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 9 } },
  { id: "arma.viagem-lanca", nome: 'Lança de Viagem', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 13 }, combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 2.1, escalonamento: { forca: 'B', destreza: 'C' } } },
  { id: "armadura.viagem-protecao", nome: 'Proteção de Viagem', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 12 } },
  { id: "armadura.simples-luvas", nome: 'Luvas Simples', espaco: "luvas", estatisticaPrincipal: { tipo: "defesa", valor: 4 } },
  { id: "armadura.simples-botas", nome: 'Botas Simples', espaco: "botas", estatisticaPrincipal: { tipo: "defesa", valor: 4 } },
  { id: "armadura.giuis-bracadeiras", nome: 'Braçadeiras de Giúis', espaco: "luvas", estatisticaPrincipal: { tipo: "defesa", valor: 6 } },
  { id: "armadura.stan-bracadeiras-rebitadas", nome: 'Braçadeiras Rebitadas de Stán', espaco: "luvas", estatisticaPrincipal: { tipo: "defesa", valor: 9 } },
  { id: "item.equipamento.viajante-anel", nome: 'Anel do Viajante', espaco: "anel1", bonusDeRecursos: { vidaMaxima: 8, manaMaxima: 5, folegoMaximo: 8 } },

  // A partir daqui ficam as peças dos conjuntos de saque de Dún Liath, referenciadas pelo motor da masmorra.
  { id: "armadura.guarnicao-elmo", nome: 'Capacete da Guarnição', espaco: "cabeca", estatisticaPrincipal: { tipo: "defesa", valor: 7 } },
  { id: "armadura.guarnicao-luvas", nome: 'Luvas da Guarnição', espaco: "luvas", estatisticaPrincipal: { tipo: "defesa", valor: 7 } },
  { id: "armadura.guarnicao-perneiras", nome: 'Perneiras da Guarnição', espaco: 'pernas', estatisticaPrincipal: { tipo: "defesa", valor: 10 } },
  { id: "armadura.guarnicao-botas", nome: 'Botas da Guarnição', espaco: "botas", estatisticaPrincipal: { tipo: "defesa", valor: 7 } },
  { id: "arma.guarnicao-espada", nome: 'Espada da Guarnição', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 16 }, combateDaArma: { tipoDeDano: "corte", intervaloDeAcaoEmSegundos: 2.1, escalonamento: { forca: 'B', destreza: 'C' } } },
  { id: "arma.bastiao-maca", nome: 'Maça do Bastião', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 16 }, combateDaArma: { tipoDeDano: "impacto", intervaloDeAcaoEmSegundos: 2.4, escalonamento: { forca: 'B', destreza: 'D' } } },
  { id: "arma.vigia-lanca", nome: 'Lança do Vigia', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 15 }, combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 2.15, escalonamento: { forca: 'B', destreza: 'B' } } },
  { id: "arma.patrulha-arco", nome: 'Arco de Patrulha', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 13 }, combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 2.25, escalonamento: { forca: 'D', destreza: 'A' } } },
  { id: "arma.campanha-cajado", nome: 'Cajado de Campanha', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 11 }, combateDaArma: { tipoDeDano: "arcano", intervaloDeAcaoEmSegundos: 2.4, escalonamento: { inteligencia: 'B' } } },
  { id: "escudo.vigia-escudo", nome: 'Escudo do Vigia', espaco: "maoSecundaria", estatisticaPrincipal: { tipo: "defesa", valor: 11 } },
] as const satisfies readonly DefinicaoDeEquipamento[]

/** Retorna a definição compartilhada ou null; os consumidores não devem mutar os dados do catálogo. */
export function obterDefinicaoDeEquipamento(idDaDefinicao: string): DefinicaoDeEquipamento | null {
  return DEFINICOES_DE_EQUIPAMENTO.find((definicao) => definicao.id === idDaDefinicao) ?? null
}
