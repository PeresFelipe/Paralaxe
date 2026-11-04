/**
 * @file Mapa declarativo de Dún Liath na dificuldade fácil.
 * As saídas por ID formam o grafo de avanço; os efeitos dos eventos, saques e decisões
 * são executados em dominio/masmorra.ts quando a sala é resolvida.
 */
import type { DefinicaoDeMasmorra } from '@paralaxe/dominio'

/** Define entrada, ramificação inicial, convergência, recuperação e chefe. A sala final não possui próximas saídas. */
export const DUN_LIATH_FACIL = {
  id: "masmorra.dun-liath.facil",
  nome: 'Dún Liath — A Fortaleza Cinzenta',
  dificuldade: "facil",
  idDaSalaInicial: "sala.entrada",
  salas: [
    { id: "sala.entrada", nome: 'Portão Quebrado', tipo: "entrada", idsDasProximasSalas: ["sala.patio"] },
    { id: "sala.patio", nome: 'Pátio Afundado', tipo: "evento", idsDasProximasSalas: ["sala.alojamentos", "sala.administracao"] },
    { id: "sala.alojamentos", nome: 'Alojamentos em Ruínas', tipo: "combate", idDaDefinicaoDoInimigo: "inimigo.crubach", idsDasProximasSalas: ["sala.depositos"] },
    { id: "sala.administracao", nome: 'Ala Administrativa', tipo: "evento", idsDasProximasSalas: ["sala.tratado"] },
    { id: "sala.tratado", nome: 'Arquivo Partido', tipo: "tesouro", idsDasProximasSalas: ["sala.depositos"] },
    { id: "sala.depositos", nome: 'Depósito Vazio', tipo: "evento", idsDasProximasSalas: ["sala.crubach"] },
    { id: "sala.crubach", nome: 'Galeria de Pedra', tipo: "combate", idDaDefinicaoDoInimigo: "inimigo.crubach", idsDasProximasSalas: ["sala.protetor"] },
    { id: "sala.protetor", nome: 'Abrigo Improvisado', tipo: "evento", idsDasProximasSalas: ["sala.tromghiallach"] },
    { id: "sala.tromghiallach", nome: 'Salão Partido', tipo: 'elite', idDaDefinicaoDoInimigo: "inimigo.tromghiallach", idsDasProximasSalas: ["sala.arsenal"] },
    { id: "sala.arsenal", nome: 'Arsenal Abandonado', tipo: "tesouro", idsDasProximasSalas: ["sala.registroDeDados"] },
    { id: "sala.registroDeDados", nome: 'Intendência', tipo: "tesouro", idsDasProximasSalas: ["sala.inferior-salao"] },
    { id: "sala.inferior-salao", nome: 'Salão Inferior', tipo: "evento", idsDasProximasSalas: ["sala.muralha"] },
    { id: "sala.muralha", nome: 'Muralha Interna', tipo: "evento", idsDasProximasSalas: ["sala.passagem"] },
    { id: "sala.passagem", nome: 'Passagem do Bastião', tipo: "evento", idsDasProximasSalas: ["sala.cosantoir"] },
    { id: "sala.cosantoir", nome: 'Porta do Guardião', tipo: 'elite', idDaDefinicaoDoInimigo: "inimigo.cosantoir", idsDasProximasSalas: ["sala.recuperacao"] },
    { id: "sala.recuperacao", nome: 'Capela Silenciosa', tipo: "recuperacao", idsDasProximasSalas: ["sala.chefe-portao"] },
    { id: "sala.chefe-portao", nome: 'Porta do Último Vigia', tipo: "evento", idsDasProximasSalas: ["sala.fairtheoir"] },
    { id: "sala.fairtheoir", nome: 'Salão do Último Vigia', tipo: "chefe", idDaDefinicaoDoInimigo: "inimigo.fairtheoir-fase1", idsDasProximasSalas: [] },
  ],
} as const satisfies DefinicaoDeMasmorra

export const MASMORRAS = [DUN_LIATH_FACIL] as const

/** Localiza o mapa usado pela expedição persistida; IDs desconhecidos retornam null. */
export function obterDefinicaoDeMasmorra(masmorraId: string) {
  return MASMORRAS.find((masmorra) => masmorra.id === masmorraId) ?? null
}
