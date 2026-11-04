/**
 * @file Simulação tática determinística multiagente com Ameaça (GDD §§18, 21).
 * Não concede XP, itens ou alterações ao save: aplicação econômica será da Masmorra em Grupo.
 * O modo demonstração é explicitamente não narrativo, sem convocar ou recrutar PNJs.
 */
import type { PartidaLocal } from './personagem'
import { derivarEstatisticasDeCombateDoJogador, type CatalogoDeConteudoDeCombate, type DefinicaoDeHabilidadeDoInimigo } from './combate'
import { criarEstadoDeAmeaca, escolherAlvoDaAmeaca, provocarInimigo, registrarAmeaca,
  type EstadoDeAmeaca, type AlvoDaAmeaca } from './ameaca'

export type PapelDoParceiro = 'arqueira' | 'guardiao' | 'curandeiro'
export interface DefinicaoDeParceiroDeCombate {
  id: string
  nome: string
  papel: PapelDoParceiro
  vidaMaxima: number
  defesa: number
  evasao: number
  precisao: number
  poder: number
  intervaloDeAcaoEmSegundos: number
  chanceDeCritico: number
  /** Olho de Caçadora é passiva exclusiva de Mira; não custa ação. */
  bonusDeCriticoParaGrupo?: number
}
export interface EstadoDeCombatenteDeGrupo {
  id: string
  nome: string
  vida: number
  vidaMaxima: number
  chanceDeCriticoEfetiva: number
}
export interface RegistroDeCombateEmGrupo {
  segundo: number
  tipo: 'ataque' | 'cura' | 'provocacao' | 'aviso' | 'foco' | 'resultado'
  mensagem: string
  alvoId?: string
}
export interface ResultadoDeCombateEmGrupo {
  desfecho: 'vitoria' | 'derrota' | 'tempoEsgotado'
  duracaoEmSegundos: number
  vidaDoInimigo: number
  combatentes: EstadoDeCombatenteDeGrupo[]
  ameaca: EstadoDeAmeaca
  registro: RegistroDeCombateEmGrupo[]
  bonusOlhoDeCacadora: number
  semente: number
}
interface Ator extends EstadoDeCombatenteDeGrupo {
  defesa: number
  evasao: number
  precisao: number
  poder: number
  intervalo: number
  papel: PapelDoParceiro | 'jogador'
  proximaAcao: number
  proximaProvocacao: number
}
function gerador(semente: number) {
  let x = semente >>> 0
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5
    return (x >>> 0) / 0x100000000
  }
}
/** Mantém ação e ataque básico exclusivos de cada ciclo do respectivo combatente. */
export function simularCombateEmGrupo(
  partida: PartidaLocal,
  catalogo: CatalogoDeConteudoDeCombate,
  inimigoId: string,
  parceiros: readonly DefinicaoDeParceiroDeCombate[],
  semente: number,
  maximoSegundos = 120,
  demonstracao = false,
): ResultadoDeCombateEmGrupo {
  if (!Number.isSafeInteger(semente) || semente < 0 || semente > 0xffffffff) throw new Error('Semente inválida.')
  if (!Number.isFinite(maximoSegundos) || maximoSegundos < 1 || maximoSegundos > 600) throw new Error('Duração inválida.')
  if (parceiros.length > 3 || new Set(parceiros.map(p => p.id)).size !== parceiros.length ||
      parceiros.some(p => !p.id || p.id === 'jogador')) throw new Error('Grupo admite até três parceiros distintos.')
  if (!demonstracao) {
    const ativos = partida.grupo.idsDosParceirosAtivos
    if (parceiros.length !== ativos.length || parceiros.some((p, i) => p.id !== ativos[i])) {
      throw new Error('A formação enviada não corresponde ao Grupo ativo.')
    }
    if (parceiros.some(p => !partida.grupo.parceiros[p.id]?.recrutado &&
       !(p.id === 'parceira.mira' && ['cooperacao-temporaria','divergencia-sobre-monstros','chefe-em-dupla'].includes(partida.grupo.marcoDeMira)))) {
      throw new Error('Parceiro indisponível no contexto atual.')
    }
  }
  const inimigo = catalogo.obterDefinicaoDeInimigo(inimigoId)
  if (!inimigo) throw new Error('Inimigo ausente do catálogo.')
  const stats = derivarEstatisticasDeCombateDoJogador(partida, catalogo)
  const bonusOlhoDeCacadora = parceiros.reduce((n, p) => n + (p.id === 'parceira.mira' ? p.bonusDeCriticoParaGrupo ?? 0 : 0), 0)
  const jogador: Ator = { id: 'jogador', nome: partida.personagem.nome, vida: stats.vidaMaxima,
    vidaMaxima: stats.vidaMaxima, defesa: stats.defesa, evasao: stats.evasao,
    precisao: stats.precisao, poder: stats.poderDoAtaqueBasico + stats.atributos.forca * 0.6,
    chanceDeCriticoEfetiva: Math.min(0.95, stats.chanceDeCritico + bonusOlhoDeCacadora),
    intervalo: stats.intervaloDeAcaoEmSegundos, proximaAcao: stats.intervaloDeAcaoEmSegundos,
    proximaProvocacao: Number.POSITIVE_INFINITY, papel: 'jogador' }
  const atores: Ator[] = [jogador, ...parceiros.map(p => ({
    id: p.id, nome: p.nome, vida: p.vidaMaxima, vidaMaxima: p.vidaMaxima,
    defesa: p.defesa, evasao: p.evasao, precisao: p.precisao,
    poder: p.poder, chanceDeCriticoEfetiva: Math.min(0.95, p.chanceDeCritico + bonusOlhoDeCacadora),
    intervalo: p.intervaloDeAcaoEmSegundos, proximaAcao: p.intervaloDeAcaoEmSegundos,
    proximaProvocacao: 0, papel: p.papel,
  }))]
  if (atores.some(a => !Number.isFinite(a.vidaMaxima) || a.vidaMaxima <= 0 ||
      !Number.isFinite(a.poder) || a.poder < 0 || !Number.isFinite(a.intervalo) || a.intervalo < 0.25 ||
      !Number.isFinite(a.chanceDeCriticoEfetiva) || a.chanceDeCriticoEfetiva < 0 ||
      !Number.isFinite(a.precisao) || !Number.isFinite(a.evasao) || !Number.isFinite(a.defesa))) {
    throw new Error('Parâmetros do combatente inválidos.')
  }
  if (!Number.isFinite(inimigo.intervaloDeAcaoEmSegundos) || inimigo.intervaloDeAcaoEmSegundos < 0.25) {
    throw new Error('Intervalo do inimigo inválido.')
  }
  const aleatorio = gerador(semente)
  const registro: RegistroDeCombateEmGrupo[] = []
  let ameaca = criarEstadoDeAmeaca(atores.map(a => a.id))
  let segundo = 0
  let inimigoVida = inimigo.vidaMaxima
  let proximoAtaqueInimigo = inimigo.intervaloDeAcaoEmSegundos
  const recargasInimigo = new Map(inimigo.habilidades.map(h => [h.id, h.atrasoInicialEmSegundos ?? 0]))
  const aviso = { habilidade: null as DefinicaoDeHabilidadeDoInimigo | null }
  // O máximo de eventos impede loop infinito inclusive com dados inesperados.
  for (let evento = 0; evento < 6000 && inimigoVida > 0 && atores.some(a => a.vida > 0); evento++) {
    const proximoAliado = Math.min(...atores.filter(a => a.vida > 0).map(a => a.proximaAcao))
    const tempo = Math.min(proximoAliado, proximoAtaqueInimigo, maximoSegundos)
    if (tempo > maximoSegundos || tempo < segundo) break
    segundo = tempo
    // Em empate, o Grupo age primeiro de forma estável (ordem da formação).
    for (const ator of atores) {
      if (ator.vida <= 0 || ator.proximaAcao > segundo + 1e-7 || inimigoVida <= 0) continue
      const precisao = Math.max(0.05, Math.min(0.98, 0.85 + (ator.precisao - inimigo.evasao) * 0.005))
      const menor = atores.filter(a => a.vida > 0).reduce<Ator>((prev, atual) =>
        atual.vida / atual.vidaMaxima < prev.vida / prev.vidaMaxima ? atual : prev, atores.find(a => a.vida > 0)!)
      if (ator.papel === 'curandeiro' && menor.vida < menor.vidaMaxima * 0.65) {
        const cura = Math.min(menor.vidaMaxima - menor.vida, Math.max(1, Math.round(ator.poder * 1.5)))
        menor.vida += cura
        ameaca = registrarAmeaca(ameaca, ator.id, 'cura', cura)
        registro.push({ segundo, tipo: 'cura', alvoId: menor.id, mensagem: ator.nome + ' cura ' + menor.nome + ' em ' + cura + '.' })
      } else if (ator.papel === 'guardiao' && segundo >= ator.proximaProvocacao) {
        const resultado = provocarInimigo(ameaca, ator.id, segundo, Boolean(inimigo.ehChefe))
        ameaca = resultado.estado
        ator.proximaProvocacao = segundo + 8
        registro.push({ segundo, tipo: 'provocacao',
          mensagem: resultado.resistiu ? inimigo.nome + ' resiste à Provocação.' : ator.nome + ' provoca ' + inimigo.nome + '.' })
      } else {
        const acerto = aleatorio() < precisao
        const critico = acerto && aleatorio() < ator.chanceDeCriticoEfetiva
        const bruto = acerto ? ator.poder * (critico ? 1.5 : 1) : 0
        const dano = acerto ? Math.max(1, Math.round(bruto * 100 / (100 + Math.max(0, inimigo.defesa)))) : 0
        inimigoVida = Math.max(0, inimigoVida - dano)
        ameaca = registrarAmeaca(ameaca, ator.id, 'dano', dano)
        registro.push({ segundo, tipo: 'ataque', mensagem: ator.nome + (acerto
          ? ' causa ' + dano + (critico ? ' de dano crítico.' : ' de dano.')
          : ' erra o ataque.') })
      }
      ator.proximaAcao = segundo + ator.intervalo
    }
    if (inimigoVida <= 0) break
    if (proximoAtaqueInimigo <= segundo + 1e-7) {
      const habilidade: DefinicaoDeHabilidadeDoInimigo | undefined = aviso.habilidade ??
        inimigo.habilidades.find(h => (recargasInimigo.get(h.id) ?? 0) <= segundo + 1e-7)
      if (!aviso.habilidade && habilidade?.segundosDeAvisoDeAtaque && habilidade.segundosDeAvisoDeAtaque > 0) {
        aviso.habilidade = habilidade
        proximoAtaqueInimigo = segundo + habilidade.segundosDeAvisoDeAtaque
        registro.push({ segundo, tipo: 'aviso', mensagem: inimigo.nome + ' prepara ' + habilidade.nome + '.' })
      } else {
        aviso.habilidade = null
        if (habilidade) recargasInimigo.set(habilidade.id, segundo + habilidade.segundosDeRecarga)
        const vivos = atores.filter(a => a.vida > 0).map(a => a.id)
        const foco = escolherAlvoDaAmeaca(ameaca, vivos, segundo, Boolean(habilidade?.ignorarAmeaca))
        ameaca = foco.estado
        if (foco.alvo.mudouFoco) registro.push({ segundo, tipo: 'foco', ...(foco.alvo.id ? { alvoId: foco.alvo.id } : {}),
          mensagem: inimigo.nome + ' muda o alvo para ' + (atores.find(a => a.id === foco.alvo.id)?.nome ?? 'ninguém') + '.' })
        const alvo = atores.find(a => a.id === foco.alvo.id)
        if (alvo && aleatorio() < Math.max(0.05, Math.min(0.98, 0.85 + (inimigo.precisao - alvo.evasao) * 0.005))) {
          const dano = Math.max(1, Math.round(inimigo.poder * (habilidade?.multiplicadorDeDano ?? 1)
            * 100 / (100 + Math.max(0, alvo.defesa))))
          alvo.vida = Math.max(0, alvo.vida - dano)
          registro.push({ segundo, tipo: 'ataque', alvoId: alvo.id,
            mensagem: inimigo.nome + ' atinge ' + alvo.nome + ' em ' + dano + '.' })
        } else if (alvo) {
          registro.push({ segundo, tipo: 'ataque', alvoId: alvo.id, mensagem: inimigo.nome + ' erra ' + alvo.nome + '.' })
        }
        proximoAtaqueInimigo = segundo + inimigo.intervaloDeAcaoEmSegundos
      }
    }
    if (segundo >= maximoSegundos - 1e-7) break
  }
  const desfecho: ResultadoDeCombateEmGrupo['desfecho'] = inimigoVida <= 0 ? 'vitoria'
    : atores.every(a => a.vida <= 0) ? 'derrota' : 'tempoEsgotado'
  registro.push({ segundo, tipo: 'resultado', mensagem: desfecho === 'vitoria'
    ? 'Vitória de Grupo na simulação.' : desfecho === 'derrota' ? 'Todos os combatentes caíram.' : 'Limite de simulação alcançado.' })
  return { desfecho, duracaoEmSegundos: Number(segundo.toFixed(3)), vidaDoInimigo: inimigoVida,
    combatentes: atores.map(({ id, nome, vida, vidaMaxima, chanceDeCriticoEfetiva }) =>
      ({ id, nome, vida, vidaMaxima, chanceDeCriticoEfetiva })),
    ameaca, registro, bonusOlhoDeCacadora, semente }
}
