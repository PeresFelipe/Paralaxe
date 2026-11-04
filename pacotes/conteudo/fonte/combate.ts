/**
 * @file Dados de habilidades, consumíveis, conjuntos de preparação e inimigos.
 * Poder, custo, recarga e intervalos são parâmetros consumidos pelo simulador; este
 * arquivo não sorteia ataques nem altera partidas. Os IDs também são usados nas partidas salvas.
 */
import type {
  IdDaClasseDoPersonagem,
  DefinicaoDeHabilidadeDeCombate,
  DefinicaoDeConsumivelDeCombate,
  DefinicaoDeInimigo,
} from '@paralaxe/dominio'

/** A ordem de uso vem dos espaços ativos do personagem, não da ordem desta lista de definições. */
export const HABILIDADES_DE_COMBATE = [
  {
    id: "habilidade.forca-golpe",
    nome: 'Golpe de Força',
    perfil: "agressivo",
    segundosDeRecarga: 6,
    recurso: "folego",
    custoDeRecurso: 28,
    podeInterromper: true,
    dano: { tipo: "arma-multiplicador", multiplicador: 1.55, tipoDeDano: "corte" },
  },
  {
    id: "habilidade.arcano-pulso",
    nome: 'Pulso Arcano',
    perfil: "agressivo",
    segundosDeRecarga: 5,
    recurso: 'mana',
    custoDeRecurso: 24,
    podeInterromper: true,
    dano: {
      tipo: "base-escalonamento",
      poderBase: 24,
      tipoDeDano: "arcano",
      escalonamento: { inteligencia: 'A' },
    },
  },
  {
    id: "habilidade.preciso-disparo",
    nome: 'Disparo Preciso',
    perfil: "agressivo",
    segundosDeRecarga: 6,
    recurso: "folego",
    custoDeRecurso: 24,
    podeInterromper: true,
    dano: {
      tipo: "arma-multiplicador",
      multiplicador: 1.5,
      tipoDeDano: "perfuracao",
      bonusDePrecisaoEmPontosPercentuais: 15,
    },
  },
  {
    id: "habilidade.restauradora-prece",
    nome: 'Prece Restauradora',
    perfil: "defensivo",
    segundosDeRecarga: 10,
    recurso: 'mana',
    custoDeRecurso: 36,
    curar: { poderBase: 24, escalonamento: { fe: 'S' } },
  },
  {
    id: "habilidade.oportuno-golpe",
    nome: 'Golpe Oportuno',
    perfil: "agressivo",
    segundosDeRecarga: 5,
    recurso: "folego",
    custoDeRecurso: 20,
    podeInterromper: true,
    dano: {
      tipo: "arma-multiplicador",
      multiplicador: 1.25,
      tipoDeDano: "perfuracao",
      bonusDeCriticoEmPontosPercentuais: 25,
    },
  },
  {
    id: "habilidade.abertura",
    nome: 'Abertura',
    perfil: "agressivo",
    segundosDeRecarga: 7,
    podeInterromper: true,
    dano: {
      tipo: "arma-multiplicador",
      multiplicador: 1.35,
      tipoDeDano: "perfuracao",
      bonusDePrecisaoEmPontosPercentuais: 10,
    },
  },
  {
    id: "habilidade.calculado-ataque",
    nome: 'Ataque Calculado',
    perfil: "agressivo",
    segundosDeRecarga: 4.5,
    recurso: "folego",
    custoDeRecurso: 16,
    podeInterromper: true,
    dano: {
      tipo: "arma-multiplicador",
      multiplicador: 1.2,
      tipoDeDano: "perfuracao",
      bonusDePrecisaoEmPontosPercentuais: 10,
    },
  },
  {
    id: "habilidade.arcano-faisca",
    nome: 'Faísca Arcana',
    perfil: "agressivo",
    segundosDeRecarga: 4,
    recurso: 'mana',
    custoDeRecurso: 16,
    podeInterromper: true,
    dano: {
      tipo: "base-escalonamento",
      poderBase: 17,
      tipoDeDano: "arcano",
      escalonamento: { inteligencia: 'B' },
    },
  },
  {
    id: "habilidade.fe-barreira",
    nome: 'Barreira de Fé',
    perfil: "defensivo",
    segundosDeRecarga: 10,
    recurso: 'mana',
    custoDeRecurso: 24,
    melhoriaDeReducaoDeDano: {
      multiplicador: 0.7,
      duracaoEmSegundos: 4,
    },
  },
  {
    id: "habilidade.recuo",
    nome: 'Recuo',
    perfil: "defensivo",
    segundosDeRecarga: 10,
    acionarAoAvisoDeAtaque: true,
    melhoriaDeEvasao: {
      bonus: 60,
      duracaoEmSegundos: 4,
    },
  },
  {
    id: "habilidade.folego-de-combate",
    nome: 'Fôlego de Combate',
    perfil: "defensivo",
    segundosDeRecarga: 12,
    restaurar: { folego: 24 },
  },
  {
    id: "habilidade.instintiva-guarda",
    nome: 'Guarda Instintiva',
    perfil: "defensivo",
    segundosDeRecarga: 14,
    melhoriaDeReducaoDeDano: {
      multiplicador: 0.5,
      duracaoEmSegundos: 6,
      consumirAoAcertarDiretamente: true,
    },
  },
] as const satisfies readonly DefinicaoDeHabilidadeDeCombate[]

/** Pacote de técnicas oferecido na preparação de cada classe; ensiná-lo e equipá-lo exige uma ação do fluxo. */
export const CONJUNTOS_ANTES_DA_MASMORRA: Record<IdDaClasseDoPersonagem, readonly string[]> = {
  guerreiro: [
    "habilidade.forca-golpe",
    "habilidade.calculado-ataque",
    "habilidade.recuo",
    "habilidade.folego-de-combate",
  ],
  mago: [
    "habilidade.arcano-pulso",
    "habilidade.arcano-faisca",
    "habilidade.recuo",
    "habilidade.folego-de-combate",
  ],
  cacador: [
    "habilidade.preciso-disparo",
    "habilidade.calculado-ataque",
    "habilidade.recuo",
    "habilidade.folego-de-combate",
  ],
  acolito: [
    "habilidade.restauradora-prece",
    "habilidade.fe-barreira",
    "habilidade.calculado-ataque",
    "habilidade.recuo",
  ],
  ladino: [
    "habilidade.oportuno-golpe",
    "habilidade.calculado-ataque",
    "habilidade.recuo",
    "habilidade.folego-de-combate",
  ],
  errante: [
    "habilidade.abertura",
    "habilidade.calculado-ataque",
    "habilidade.recuo",
    "habilidade.folego-de-combate",
  ],
}

/** Retorna os IDs do conjunto da classe para a preparação aplicar pelo domínio. */
export function obterConjuntoDeHabilidadesAntesDaMasmorra(idDaClasse: IdDaClasseDoPersonagem) {
  return CONJUNTOS_ANTES_DA_MASMORRA[idDaClasse]
}

/** Quantidades de restauração por uso. O motor limita a recuperação aos máximos e debita o item consumido. */
export const CONSUMIVEIS_DE_COMBATE = [
  {
    id: "item.consumivel.campo-preparacao",
    nome: 'Preparado de Campo',
    restaurar: { vida: 45 },
  },
  {
    id: "item.consumivel.neantog-preparacao",
    nome: 'Preparado de Neantóg',
    restaurar: { vida: 45 },
  },
  {
    id: "item.comida.assado-scadan",
    nome: 'Scadán Assado',
    restaurar: { vida: 35, folego: 20 },
  },
  {
    id: "item.consumivel.carmesim-frasco",
    nome: 'Frasco Carmesim',
    restaurar: { vida: 70, mana: 25, folego: 25 },
  },
] as const satisfies readonly DefinicaoDeConsumivelDeCombate[]

/** Cada inimigo define cadência e habilidades ordenadas; avisos de ataque criam uma janela de reação no motor. */
export const INIMIGOS = [
  {
    id: "inimigo.estrada-lobo",
    nome: 'Lobo de Estrada',
    nivelDeCombate: 2,
    vidaMaxima: 60,
    defesa: 4,
    evasao: 98,
    precisao: 102,
    poder: 8,
    intervaloDeAcaoEmSegundos: 2.25,
    tipoDeDanoBasico: "corte",
    habilidades: [
      {
        id: "inimigo.estrada-lobo.bote",
        nome: 'Bote',
        segundosDeRecarga: 7,
        atrasoInicialEmSegundos: 2.5,
        multiplicadorDeDano: 1.5,
        segundosDeAvisoDeAtaque: 1.2,
        interrompivel: true,
      },
    ],
    recompensaDeXp: 35,
  },
  {
    id: "inimigo.crubach",
    nome: 'Crúbach',
    nivelDeCombate: 4,
    vidaMaxima: 85,
    defesa: 8,
    evasao: 100,
    precisao: 108,
    poder: 8,
    intervaloDeAcaoEmSegundos: 1.65,
    tipoDeDanoBasico: "corte",
    resistenciasADano: { perfuracao: "fraco" },
    habilidades: [
      {
        id: "inimigo.crubach.corte",
        nome: 'Talho',
        segundosDeRecarga: 5,
        multiplicadorDeDano: 1.35,
        aplicacoesDeEfeito: [{ situacao: "sangramento", acumulo: 50 }],
      },
      {
        id: "inimigo.crubach.curto-salto",
        nome: 'Salto Curto',
        segundosDeRecarga: 8,
        atrasoInicialEmSegundos: 3,
        multiplicadorDeDano: 0.75,
        multiplicadorDoProximoIntervalo: 0.55,
      },
    ],
    recompensaDeXp: 18,
  },
  {
    id: "inimigo.tromghiallach",
    nome: 'Tromghiallach',
    nivelDeCombate: 5,
    vidaMaxima: 130,
    defesa: 18,
    evasao: 95,
    precisao: 100,
    poder: 12,
    intervaloDeAcaoEmSegundos: 2.8,
    tipoDeDanoBasico: "impacto",
    habilidades: [
      {
        id: "inimigo.tromghiallach.pesado",
        nome: 'Golpe Pesado',
        segundosDeRecarga: 7,
        multiplicadorDeDano: 1.65,
        segundosDeAvisoDeAtaque: 1.1,
        interrompivel: true,
        aplicacoesDeEfeito: [{ situacao: "atordoamento", acumulo: 25 }],
      },
      {
        id: "inimigo.tromghiallach.imobilizar",
        nome: 'Firmar Posição',
        segundosDeRecarga: 9,
        multiplicadorDoDanoRecebidoPeloProprio: 0.65,
        duracaoDoEfeitoProprioEmSegundos: 3,
      },
    ],
    recompensaDeXp: 26,
  },
  {
    id: "inimigo.cosantoir",
    nome: 'Cosantóir',
    nivelDeCombate: 6,
    vidaMaxima: 240,
    defesa: 28,
    evasao: 98,
    precisao: 106,
    poder: 15,
    intervaloDeAcaoEmSegundos: 2.35,
    tipoDeDanoBasico: "perfuracao",
    habilidades: [
      { id: "inimigo.cosantoir.estocada", nome: 'Estocada', segundosDeRecarga: 5, multiplicadorDeDano: 1.25 },
      {
        id: "inimigo.cosantoir.escudo",
        nome: 'Golpe de Escudo',
        segundosDeRecarga: 7,
        multiplicadorDeDano: 0.9,
        tipoDeDano: "impacto",
        aplicacoesDeEfeito: [{ situacao: "atordoamento", acumulo: 30 }],
      },
      {
        id: "inimigo.cosantoir.defesa",
        nome: 'Postura de Defesa',
        segundosDeRecarga: 10,
        multiplicadorDoDanoRecebidoPeloProprio: 0.6,
        duracaoDoEfeitoProprioEmSegundos: 3.5,
      },
      {
        id: "inimigo.cosantoir.avancar",
        nome: 'Avanço do Guardião',
        segundosDeRecarga: 12,
        atrasoInicialEmSegundos: 4,
        multiplicadorDeDano: 1.8,
        tipoDeDano: "impacto",
        segundosDeAvisoDeAtaque: 1.8,
        interrompivel: true,
        aplicacoesDeEfeito: [{ situacao: "atordoamento", acumulo: 45 }],
        vulnerabilidadeApos: { multiplicadorDoDanoRecebido: 1.2, duracaoEmSegundos: 2.5 },
      },
    ],
    recompensaDeXp: 70,
  },
  {
    id: "inimigo.fairtheoir-fase1",
    nome: 'Fairtheoir — O Vigia',
    nivelDeCombate: 8,
    vidaMaxima: 206,
    defesa: 35,
    evasao: 95,
    precisao: 110,
    poder: 13,
    intervaloDeAcaoEmSegundos: 2.6,
    tipoDeDanoBasico: "impacto",
    resistenciasADano: { corte: "resistente" },
    resistenciasAEfeitos: { sangramento: "resistente", atordoamento: "muito-resistente" },
    ehChefe: true,
    habilidades: [
      {
        id: "inimigo.fairtheoir.pesado",
        nome: 'Golpe Pesado',
        segundosDeRecarga: 7,
        multiplicadorDeDano: 1.6,
        segundosDeAvisoDeAtaque: 1.4,
        interrompivel: true,
        aplicacoesDeEfeito: [{ situacao: "atordoamento", acumulo: 35 }],
      },
      {
        id: "inimigo.fairtheoir.varredura",
        nome: 'Varredura',
        segundosDeRecarga: 5.5,
        multiplicadorDeDano: 1.05,
      },
      {
        id: "inimigo.fairtheoir.guarda",
        nome: 'Postura de Guarda',
        segundosDeRecarga: 10,
        multiplicadorDoDanoRecebidoPeloProprio: 0.55,
        duracaoDoEfeitoProprioEmSegundos: 3,
      },
    ],
    recompensaDeXp: 0,
  },
  {
    id: "inimigo.fairtheoir-fase2",
    nome: 'Fairtheoir — Desespero',
    nivelDeCombate: 8,
    vidaMaxima: 169,
    defesa: 22,
    evasao: 95,
    precisao: 112,
    poder: 14,
    intervaloDeAcaoEmSegundos: 2.15,
    tipoDeDanoBasico: "impacto",
    resistenciasADano: { corte: "resistente" },
    resistenciasAEfeitos: { sangramento: "resistente", atordoamento: "muito-resistente" },
    ehChefe: true,
    habilidades: [
      {
        id: "inimigo.fairtheoir.ultima-investida",
        nome: 'Última Investida',
        segundosDeRecarga: 13,
        atrasoInicialEmSegundos: 5,
        multiplicadorDeDano: 2.2,
        tipoDeDano: "impacto",
        segundosDeAvisoDeAtaque: 2.4,
        interrompivel: false,
        aplicacoesDeEfeito: [{ situacao: "atordoamento", acumulo: 70 }],
        vulnerabilidadeApos: { multiplicadorDoDanoRecebido: 1.3, duracaoEmSegundos: 3 },
      },
      {
        id: "inimigo.fairtheoir.varredura-fase2",
        nome: 'Varredura Desesperada',
        segundosDeRecarga: 5.5,
        multiplicadorDeDano: 1.05,
      },
    ],
    recompensaDeXp: 120,
  },
] as const satisfies readonly DefinicaoDeInimigo[]

/** Consulta habilidades do jogador; null impede resolver uma técnica cujo conteúdo não está disponível. */
export function obterDefinicaoDeHabilidadeDeCombate(habilidadeId: string): DefinicaoDeHabilidadeDeCombate | null {
  return HABILIDADES_DE_COMBATE.find((habilidade) => habilidade.id === habilidadeId) ?? null
}

/** Consulta o perfil que determina os atributos e comportamentos do encontro simulado. */
export function obterDefinicaoDeInimigo(inimigoId: string): DefinicaoDeInimigo | null {
  return INIMIGOS.find((inimigo) => inimigo.id === inimigoId) ?? null
}

/** Fornece a restauração ao motor de uso manual ou automático dos dois espaços de consumíveis. */
export function obterDefinicaoDeConsumivelDeCombate(
  idDaDefinicao: string,
): DefinicaoDeConsumivelDeCombate | null {
  return CONSUMIVEIS_DE_COMBATE.find((consumivel) => consumivel.id === idDaDefinicao) ?? null
}
