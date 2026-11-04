import { describe, expect, it } from 'vitest'
import { criarPartidaLocal, type DefinicaoDeClasseDoPersonagem, type DefinicaoDePresente } from './personagem'
import { simularCombateEmGrupo, type DefinicaoDeParceiroDeCombate } from './combateEmGrupo'
import type { CatalogoDeConteudoDeCombate, DefinicaoDeInimigo } from './combate'
import type { DefinicaoDeEquipamento } from './equipamento'

const classe: DefinicaoDeClasseDoPersonagem = {
  id: 'errante', nome: 'Errante', resumo: 'Equilibrado.',
  atributos: { vitalidade: 5, mente: 5, vigor: 5, forca: 5, destreza: 5, inteligencia: 5, fe: 5 },
  equipamentosIniciais: { maoPrincipal: 'arma.viagem-lanca' },
  idDaHabilidadeInicial: 'habilidade.abertura',
}
const presente: DefinicaoDePresente = { id: 'nenhum', nome: 'Nenhum', resumo: 'Nenhum.', concessoes: [] }
const arma: DefinicaoDeEquipamento = {
  id: 'arma.viagem-lanca', nome: 'Lança', espaco: 'maoPrincipal',
  estatisticaPrincipal: { tipo: 'ataque', valor: 12 },
  combateDaArma: { tipoDeDano: 'perfuracao', intervaloDeAcaoEmSegundos: 1.8, escalonamento: { forca: 'B' } },
}
const crubach: DefinicaoDeInimigo = {
  id: 'inimigo.test-grupo', nome: 'Sentinela', nivelDeCombate: 3, vidaMaxima: 160,
  defesa: 8, evasao: 100, precisao: 115, poder: 16, intervaloDeAcaoEmSegundos: 1.5,
  tipoDeDanoBasico: 'corte', recompensaDeXp: 50,
  habilidades: [{ id: 'inimigo.golpe', nome: 'Golpe Lento', segundosDeRecarga: 8,
    atrasoInicialEmSegundos: 4, segundosDeAvisoDeAtaque: 1.5, multiplicadorDeDano: 1.3 }],
}
const catalogo: CatalogoDeConteudoDeCombate = {
  obterDefinicaoDeEquipamento: id => id === arma.id ? arma : null,
  obterDefinicaoDeInimigo: id => id === crubach.id ? crubach : null,
  obterDefinicaoDeHabilidade: () => null,
}
const mira: DefinicaoDeParceiroDeCombate = {
  id: 'parceira.mira', nome: 'Mira', papel: 'arqueira',
  vidaMaxima: 120, defesa: 6, evasao: 110, precisao: 115,
  poder: 17, intervaloDeAcaoEmSegundos: 2, chanceDeCritico: 0.12,
  bonusDeCriticoParaGrupo: 0.05,
}
const guardiao: DefinicaoDeParceiroDeCombate = {
  id: 'parceiro.guardiao-teste', nome: 'Guardião de Teste', papel: 'guardiao',
  vidaMaxima: 180, defesa: 25, evasao: 95, precisao: 100, poder: 5,
  intervaloDeAcaoEmSegundos: 2, chanceDeCritico: 0.01,
}
function partidaComMira() {
  const p = criarPartidaLocal({ idDaPartida: 'teste-combate-grupo', criadoEm: '2026-11-04T12:00:00Z',
    versaoDoConteudo: 'test', nomeDoPersonagem: 'Ailith', classeDoPersonagem: classe, presente })
  return { ...p, grupo: { ...p.grupo, marcoDeMira: 'recrutavel' as const,
    idsDosParceirosAtivos: ['parceira.mira'],
    parceiros: { ...p.grupo.parceiros, 'parceira.mira': { recrutado: true, vinculo: 'aliado' as const } } } }
}
describe('combate automático em Grupo', () => {
  it('usa turnos separados, ataque básico, telegraph e uma semente determinística', () => {
    const p = partidaComMira()
    const a = simularCombateEmGrupo(p, catalogo, crubach.id, [mira], 445, 100)
    const b = simularCombateEmGrupo(p, catalogo, crubach.id, [mira], 445, 100)
    expect(a).toEqual(b)
    expect(a.registro.some(l => l.tipo === 'aviso')).toBe(true)
    expect(a.registro.some(l => l.tipo === 'foco')).toBe(true)
    expect(a.registro.some(l => l.mensagem.startsWith('Mira causa'))).toBe(true)
    expect(a.combatentes).toHaveLength(2)
    expect(p.combate.ultimaExpedicao).toBeNull()
    expect(p.personagem.xp).toBe(0)
  })
  it('Olho de Caçadora concede +5 p.p. para ambos, sem custo de ação', () => {
    const comMira = simularCombateEmGrupo(partidaComMira(), catalogo, crubach.id, [mira], 9)
    const semMira = simularCombateEmGrupo(partidaComMira(), catalogo, crubach.id, [], 9, 100, true)
    expect(comMira.bonusOlhoDeCacadora).toBe(0.05)
    expect(comMira.combatentes[0]!.chanceDeCriticoEfetiva - semMira.combatentes[0]!.chanceDeCriticoEfetiva)
      .toBeCloseTo(0.05)
    expect(comMira.combatentes[1]!.chanceDeCriticoEfetiva).toBeCloseTo(0.17)
  })
  it('Provocação redireciona o inimigo durante o encontro', () => {
    const p = partidaComMira()
    const result = simularCombateEmGrupo(p, catalogo, crubach.id, [guardiao], 111, 30, true)
    expect(result.registro.some(l => l.tipo === 'provocacao')).toBe(true)
    expect(result.registro.some(l => l.tipo === 'foco' && l.alvoId === guardiao.id)).toBe(true)
  })
  it('não permite parceiro inexistente ou outro perfil fora da formação persistida', () => {
    const p = partidaComMira()
    expect(() => simularCombateEmGrupo(p, catalogo, crubach.id, [guardiao], 5)).toThrow('formação')
    expect(() => simularCombateEmGrupo(p, catalogo, crubach.id, [mira, mira], 5, 100, true))
      .toThrow('três parceiros distintos')
    expect(() => simularCombateEmGrupo(p, catalogo, crubach.id, [mira], -1)).toThrow('Semente')
    expect(() => simularCombateEmGrupo(p, catalogo, crubach.id, [mira], 1, 0)).toThrow('Duração')
  })
})
