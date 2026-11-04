/**
 * @file Geração reproduzível da Fortaleza Cinzenta após a primeira conclusão.
 * Mantém a identidade narrativa, salas canônicas e caminho garantido até Fairtheoir.
 * Varia armadilhas, indícios e a passagem opcional; nenhuma condição bloqueia o chefe.
 */
import type { DefinicaoDeMasmorra, DefinicaoDeSalaDaMasmorra } from './masmorra'

/** PRNG inteiro fixo: não depende de Math.random, data ou ambiente. */
function geradorDeSemente(semente: number) {
  let estado = (semente >>> 0) || 0x6d2b79f5
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0
    return estado / 0x1_0000_0000
  }
}

const ARMADILHAS = [
  {
    nome: 'Galeria de Pedras Soltas',
    descricao: 'Blocos antigos cedem sob a chuva. As marcas no chão mostram onde o teto já caiu.',
    pista: 'Poeira de pedra cai de uma fenda no teto e desaparece no corredor.',
  },
  {
    nome: 'Corredor do Piso Instável',
    descricao: 'Tábuas e lajotas estão desalinhadas. O corredor conserva sinais de reparo humano antigo.',
    pista: 'O piso escurece entre as vigas, com pequenas marcas de deslocamento.',
  },
  {
    nome: 'Dispositivo Militar Abandonado',
    descricao: 'Uma lança de guarnição ainda protege uma passagem antiga. O mecanismo denuncia a origem humana.',
    pista: 'Marcas de graxa, ferrugem e metal exposto surgem junto ao batente.',
  },
  {
    nome: 'Barricada Improvisada',
    descricao: 'Madeira mais recente foi erguida para deter invasores vindos da entrada, não para atacar quem mora aqui.',
    pista: 'Fitas de tecido fresco e madeiras reaproveitadas cruzam o acesso.',
  },
] as const

const SEGREDOS = [
  {
    nome: 'Vão Atrás da Muralha',
    descricao: 'Uma câmara pequena guarda restos de abastecimento e sinais de uso após o abandono.',
    pista: 'Uma corrente fria atravessa a fenda entre pedras mais recentes.',
  },
  {
    nome: 'Escada do Vigia Antigo',
    descricao: 'O acesso esquecido preserva uma peça de sucata e marcas de turnos da guarnição.',
    pista: 'Passos antigos desaparecem sob uma escada parcialmente soterrada.',
  },
  {
    nome: 'Nicho dos Reparos',
    descricao: 'A parede guarda sucata recuperável entre ferrugem, pó de sal e inscrições gastas.',
    pista: 'O eco vem de trás de uma parede cujo reboco não acompanha a pedra.',
  },
] as const

const ID_ARMADILHA = 'sala.procedural.armadilha'
const ID_SEGREDO = 'sala.procedural.segredo'

/**
 * Todas as variantes têm 20 nós, mas cada caminho solo percorre apenas 18–20,
 * incluindo uma decisão irreversível. O segredo não integra a rota obrigatória.
 *
 * Nunca muta o catálogo-base: o chamador persiste o resultado em ExpedicaoNaMasmorra.
 */
export function gerarDunLiathProcedural(base: DefinicaoDeMasmorra, semente: number): DefinicaoDeMasmorra {
  if (!Number.isSafeInteger(semente)) throw new Error('A semente da Masmorra deve ser um inteiro seguro.')
  if (!base.id.startsWith('masmorra.dun-liath.')) throw new Error('A geração requer uma definição de Dún Liath.')
  const aleatorio = geradorDeSemente(semente)
  const armadilha = ARMADILHAS[Math.floor(aleatorio() * ARMADILHAS.length)] ?? ARMADILHAS[0]
  const segredo = SEGREDOS[Math.floor(aleatorio() * SEGREDOS.length)] ?? SEGREDOS[0]
  const posicao: readonly [string, string] = aleatorio() < 0.5
    ? ['sala.depositos', 'sala.crubach']
    : ['sala.inferior-salao', 'sala.muralha']
  const ordemRamos = aleatorio() < 0.5
    ? ['sala.passagem', ID_SEGREDO]
    : [ID_SEGREDO, 'sala.passagem']

  const grafo = base.salas.map((sala): DefinicaoDeSalaDaMasmorra => {
    if (sala.id === posicao[0]) return {
      ...sala, idsDasProximasSalas: sala.idsDasProximasSalas.map(id => id === posicao[1] ? ID_ARMADILHA : id),
      pistasDasSaidas: { ...sala.pistasDasSaidas, [ID_ARMADILHA]: armadilha.pista },
    }
    if (sala.id === 'sala.muralha') return {
      ...sala, idsDasProximasSalas: ordemRamos,
      pistasDasSaidas: {
        'sala.passagem': 'O eco de passos militares atravessa a passagem central.',
        [ID_SEGREDO]: segredo.pista,
      },
    }
    return { ...sala, idsDasProximasSalas: [...sala.idsDasProximasSalas] }
  })
  const adicionais: DefinicaoDeSalaDaMasmorra[] = [
    {
      id: ID_ARMADILHA, nome: armadilha.nome, tipo: 'armadilha',
      descricao: armadilha.descricao, fracaoDeDanoDaArmadilha: 0.06 + aleatorio() * 0.04,
      idsDasProximasSalas: [posicao[1]],
    },
    {
      id: ID_SEGREDO, nome: segredo.nome, tipo: 'secreta',
      descricao: segredo.descricao, idsDasProximasSalas: ['sala.passagem'],
    },
  ]
  // A ordem é determinística. A sala secreta só está acessível pela escolha na muralha.
  return { ...base, procedural: true, salas: [...grafo, ...adicionais] }
}
