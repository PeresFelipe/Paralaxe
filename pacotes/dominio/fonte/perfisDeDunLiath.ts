/**
 * @file Kits incrementais de combate de Dún Liath conforme GDD §33.
 * Valores provisórios: nomes, papel tático e progressão seguem o GDD;
 * técnicas usam os efeitos que o motor de combate solo consegue resolver.
 * Não altera os inimigos globais nem os arquivos de partidas persistidas.
 */
import type { DefinicaoDeHabilidadeDoInimigo, DefinicaoDeInimigo } from './combate'
import type { DificuldadeDaMasmorra } from './masmorra'

const MULTIPLICADORES: Record<DificuldadeDaMasmorra, number> = {
  facil: 1,
  normal: 1.22,
  dificil: 1.55,
  impossivel: 1.9,
}

type InimigoDeDunLiath =
  | 'inimigo.crubach'
  | 'inimigo.tromghiallach'
  | 'inimigo.cosantoir'
  | 'inimigo.fairtheoir-fase1'
  | 'inimigo.fairtheoir-fase2'
type ReforcosPorInimigo = Partial<Record<InimigoDeDunLiath, readonly DefinicaoDeHabilidadeDoInimigo[]>>

/**
 * Normal: cada unidade ganha uma técnica nova para apoiar a função na fortificação.
 * A batalha atual é solo; Interposição/Cobertura não afetam aliados inexistentes.
 */
const NORMAL: ReforcosPorInimigo = {
  'inimigo.crubach': [{
    id: 'inimigo.crubach.cerco', nome: 'Cerco', segundosDeRecarga: 11,
    multiplicadorDeDano: 1.2, multiplicadorDoProximoIntervalo: 0.65,
    aplicacoesDeEfeito: [{ situacao: 'sangramento', acumulo: 35 }],
  }],
  'inimigo.tromghiallach': [{
    id: 'inimigo.tromghiallach.cobertura-pesada', nome: 'Cobertura Pesada',
    segundosDeRecarga: 12, multiplicadorDoDanoRecebidoPeloProprio: 0.65,
    duracaoDoEfeitoProprioEmSegundos: 4.5,
  }],
  'inimigo.cosantoir': [{
    id: 'inimigo.cosantoir.interposicao', nome: 'Interposição',
    segundosDeRecarga: 13, multiplicadorDoDanoRecebidoPeloProprio: 0.62,
    duracaoDoEfeitoProprioEmSegundos: 4,
  }],
  'inimigo.fairtheoir-fase1': [{
    id: 'inimigo.fairtheoir.contra-impacto', nome: 'Contra-Impacto',
    segundosDeRecarga: 13, multiplicadorDeDano: 1.45, tipoDeDano: 'impacto',
    segundosDeAvisoDeAtaque: 1.6, interrompivel: true,
    aplicacoesDeEfeito: [{ situacao: 'atordoamento', acumulo: 35 }],
  }],
  'inimigo.fairtheoir-fase2': [{
    id: 'inimigo.fairtheoir.destrocos', nome: 'Destroços',
    segundosDeRecarga: 11, multiplicadorDeDano: 1.1, tipoDeDano: 'impacto',
    aplicacoesDeEfeito: [{ situacao: 'atordoamento', acumulo: 30 }],
  }],
}

/** Difícil: pressão de Sangramento, interrupção por Impacto e defesa organizada. */
const DIFICIL: ReforcosPorInimigo = {
  'inimigo.crubach': [{
    id: 'inimigo.crubach.ferida-aberta', nome: 'Ferida Aberta',
    segundosDeRecarga: 9, multiplicadorDeDano: 1.3,
    aplicacoesDeEfeito: [{ situacao: 'sangramento', acumulo: 65 }],
  }],
  'inimigo.tromghiallach': [{
    id: 'inimigo.tromghiallach.golpe-concussivo', nome: 'Golpe Concussivo',
    segundosDeRecarga: 12, multiplicadorDeDano: 1.85, tipoDeDano: 'impacto',
    segundosDeAvisoDeAtaque: 2, interrompivel: true,
    aplicacoesDeEfeito: [{ situacao: 'atordoamento', acumulo: 70 }],
  }],
  'inimigo.cosantoir': [{
    id: 'inimigo.cosantoir.formacao-defensiva', nome: 'Formação Defensiva',
    segundosDeRecarga: 12, multiplicadorDoDanoRecebidoPeloProprio: 0.5,
    duracaoDoEfeitoProprioEmSegundos: 4,
  }],
  'inimigo.fairtheoir-fase1': [{
    id: 'inimigo.fairtheoir.ruptura', nome: 'Ruptura',
    segundosDeRecarga: 12, multiplicadorDeDano: 1.8, tipoDeDano: 'impacto',
    segundosDeAvisoDeAtaque: 1.7, interrompivel: true,
    aplicacoesDeEfeito: [{ situacao: 'atordoamento', acumulo: 60 }],
    vulnerabilidadeApos: { multiplicadorDoDanoRecebido: 1.25, duracaoEmSegundos: 2.5 },
  }],
  'inimigo.fairtheoir-fase2': [{
    id: 'inimigo.fairtheoir.ruptura-crescente', nome: 'Ruptura Crescente',
    segundosDeRecarga: 10, multiplicadorDeDano: 1.6, tipoDeDano: 'impacto',
    segundosDeAvisoDeAtaque: 1.5, interrompivel: true,
    aplicacoesDeEfeito: [{ situacao: 'atordoamento', acumulo: 50 }],
  }],
}

/** Impossível: a defesa se torna extrema; o Chefe mantém janelas claras de reação. */
const IMPOSSIVEL: ReforcosPorInimigo = {
  'inimigo.crubach': [{
    id: 'inimigo.crubach.cacada-coordenada', nome: 'Caçada Coordenada',
    segundosDeRecarga: 8, multiplicadorDeDano: 1.4,
    multiplicadorDoProximoIntervalo: 0.6,
    aplicacoesDeEfeito: [{ situacao: 'sangramento', acumulo: 80 }],
  }],
  'inimigo.tromghiallach': [{
    id: 'inimigo.tromghiallach.muralha-viva', nome: 'Muralha Viva',
    segundosDeRecarga: 13, multiplicadorDoDanoRecebidoPeloProprio: 0.42,
    duracaoDoEfeitoProprioEmSegundos: 5,
  }],
  'inimigo.cosantoir': [{
    id: 'inimigo.cosantoir.ultima-linha', nome: 'Última Linha',
    segundosDeRecarga: 14, multiplicadorDoDanoRecebidoPeloProprio: 0.4,
    duracaoDoEfeitoProprioEmSegundos: 5,
  }],
  'inimigo.fairtheoir-fase1': [{
    id: 'inimigo.fairtheoir.linha-intransponivel', nome: 'Linha Intransponível',
    segundosDeRecarga: 11, multiplicadorDoDanoRecebidoPeloProprio: 0.4,
    duracaoDoEfeitoProprioEmSegundos: 5,
  }],
  'inimigo.fairtheoir-fase2': [
    {
      id: 'inimigo.fairtheoir.desespero-absoluto', nome: 'Desespero Absoluto',
      segundosDeRecarga: 11, multiplicadorDeDano: 2.5, tipoDeDano: 'impacto',
      segundosDeAvisoDeAtaque: 2.5, interrompivel: true,
      vulnerabilidadeApos: { multiplicadorDoDanoRecebido: 1.4, duracaoEmSegundos: 3 },
    },
    {
      id: 'inimigo.fairtheoir.ate-o-ultimo', nome: 'Até o Último',
      segundosDeRecarga: 7, multiplicadorDeDano: 1.9, tipoDeDano: 'impacto',
      ativarQuandoVidaAte: 0.2, multiplicadorDoProximoIntervalo: 0.55,
      aplicacoesDeEfeito: [{ situacao: 'atordoamento', acumulo: 40 }],
    },
  ],
}

/**
 * A dificuldade acumula os kits anteriores para que a evolução seja perceptível.
 * Aplica progressão numérica somente nesta instância do inimigo;
 * o catálogo base e o tutorial Fácil não são alterados.
 */
export function adaptarInimigoParaDificuldade(
  inimigo: DefinicaoDeInimigo, dificuldade: DificuldadeDaMasmorra,
): DefinicaoDeInimigo {
  if (dificuldade === 'facil') return inimigo
  const reforcos: ReforcosPorInimigo[] = dificuldade === 'normal' ? [NORMAL]
    : dificuldade === 'dificil' ? [NORMAL, DIFICIL]
      : [NORMAL, DIFICIL, IMPOSSIVEL]
  const habilidadesAdicionais = reforcos.flatMap(x => x[inimigo.id as InimigoDeDunLiath] ?? [])
  const escala = MULTIPLICADORES[dificuldade]
  // Golpes de fase terminal têm precedência quando a condição de Vida se torna verdadeira.
  // Sem isso, habilidades-base prontas poderiam impedir "Até o Último" de executar.
  const prioritarias = habilidadesAdicionais.filter(h => h.ativarQuandoVidaAte !== undefined)
  const demais = habilidadesAdicionais.filter(h => h.ativarQuandoVidaAte === undefined)
  return {
    ...inimigo,
    vidaMaxima: Math.ceil(inimigo.vidaMaxima * escala),
    defesa: Math.ceil(inimigo.defesa * escala),
    poder: Math.ceil(inimigo.poder * escala),
    nivelDeCombate: Math.ceil(inimigo.nivelDeCombate * escala),
    recompensaDeXp: Math.ceil(inimigo.recompensaDeXp * escala),
    habilidades: [...prioritarias, ...inimigo.habilidades, ...demais],
  }
}
