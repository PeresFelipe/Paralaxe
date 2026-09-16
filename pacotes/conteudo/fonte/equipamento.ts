/**
 * @file Definições dos equipamentos iniciais, fabricáveis, compráveis e obtidos na masmorra.
 * Este catálogo descreve o modelo; reforço, raridade e afixos pertencem às instâncias
 * do jogador. Os valores aqui alimentam a derivação de estatísticas no domínio.
 */
import type { DefinicaoDeEquipamento } from '@greywake/dominio'

/** Armas definem dano, cadência e escalonamento; armaduras fornecem defesa e acessórios podem aumentar recursos. */
export const DEFINICOES_DE_EQUIPAMENTO = [
  { id: "arma.milicia-espada", nome: 'Espada de Milícia', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 14 }, combateDaArma: { tipoDeDano: "corte", intervaloDeAcaoEmSegundos: 2.1, escalonamento: { forca: 'B', destreza: 'C' } } },
  { id: "escudo.milicia-escudo", nome: 'Escudo de Milícia', espaco: "maoSecundaria", estatisticaPrincipal: { tipo: "defesa", valor: 8 } },
  { id: "armadura.milicia-peitoral", nome: 'Peitoral de Milícia', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 18 } },
  { id: "arma.simples-cajado", nome: 'Cajado Simples', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 9 }, combateDaArma: { tipoDeDano: "arcano", intervaloDeAcaoEmSegundos: 2.4, escalonamento: { inteligencia: 'C' } } },
  { id: "armadura.simples-vestes", nome: 'Vestes Simples', espaco: "peitoral", estatisticaPrincipal: { tipo: "defesa", valor: 6 } },
  { id: "arma.curto-arco", nome: 'Arco Curto', espaco: "maoPrincipal", estatisticaPrincipal: { tipo: "ataque", valor: 12 }, combateDaArma: { tipoDeDano: "perfuracao", intervaloDeAcaoEmSegundos: 2.3, escalonamento: { forca: 'D', destreza: 'A' } } },
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
