/** Coordena reprodução visual e confirmação da luta, mantendo a falha de save recuperável. */
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  configurarEspacoDeConsumivelDeCombate, derivarEstatisticasDeCombateDoJogador,
  simularCombate, retomarTrabalhoAposRisco, type PartidaLocal, type ResultadoDeCombate, type RecursoDoLimiarDeCombate,
} from '@paralaxe/dominio'
import { catalogoDeCombate, criarConfirmacaoDoCombate } from '@/services/combateDaEstrada'
import type { PersistirAlteracaoDaPartida } from '@/services/alteracoesDaPartida'

export interface PropriedadesDoCombateDaEstrada {
  partida: PartidaLocal
  prepararRisco: () => Promise<PartidaLocal>
  aoAlterarPartida: PersistirAlteracaoDaPartida
  aoAlterarEstadoDeRisco?: (ativo: boolean) => void
  aoRetorno?: () => void
}
type Fase = 'ocioso' | 'preparando' | 'reproduzindo' | 'salvando' | 'falhaAoSalvar' | 'falhaAoRetomar' | 'concluido'

export function useCombateDaEstrada({ partida, prepararRisco, aoAlterarPartida, aoAlterarEstadoDeRisco }: PropriedadesDoCombateDaEstrada) {
  const [resultado, definirResultado] = useState<ResultadoDeCombate | null>(null)
  const confirmacao = useMemo(() => resultado ? criarConfirmacaoDoCombate(resultado) : null, [resultado])
  const [fase, definirFase] = useState<Fase>('ocioso')
  const [visivelSegundos, definirVisivelSegundos] = useState(0)
  const [mensagem, definirMensagem] = useState<string | null>(null)
  const [registroAbrir, definirRegistroAbrir] = useState(false)
  const operacaoPendente = useRef(false)
  const executando = fase !== 'ocioso' && fase !== 'concluido'
  const estatisticas = useMemo(() => derivarEstatisticasDeCombateDoJogador(partida, catalogoDeCombate), [partida])
  const visivelRegistro = resultado?.registro.filter(entrada => entrada.instanteEmSegundos <= visivelSegundos + 0.001) ?? []
  const progresso = resultado && resultado.duracaoEmSegundos > 0 ? Math.min(100, visivelSegundos / resultado.duracaoEmSegundos * 100) : 0
  const maisRecenteAvisoDeAtaque = [...visivelRegistro].reverse().find(entrada => entrada.tipo === 'avisoDeAtaque') ?? null

  useEffect(() => {
    if (fase !== 'reproduzindo' || !resultado) return
    const temporizador = window.setInterval(() => definirVisivelSegundos(atual => Math.min(resultado.duracaoEmSegundos, atual + 0.1)), 100)
    return () => window.clearInterval(temporizador)
  }, [fase, resultado])

  async function confirmarResultado() {
    if (!confirmacao || operacaoPendente.current) return
    operacaoPendente.current = true
    definirFase('salvando')
    try {
      const salva = await confirmacao.confirmar(aoAlterarPartida, new Date().toISOString())
      definirMensagem(salva.mensagem)
      definirFase('concluido')
      aoAlterarEstadoDeRisco?.(false)
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível salvar o combate. Tente novamente.')
      definirFase('falhaAoSalvar')
      // O resultado permanece disponível; risco e controles ficam bloqueados até confirmar a gravação.
    } finally {
      operacaoPendente.current = false
    }
  }

  useEffect(() => {
    if (fase === 'reproduzindo' && resultado && visivelSegundos + 0.0001 >= resultado.duracaoEmSegundos) void confirmarResultado()
  }, [fase, resultado, visivelSegundos, aoAlterarPartida, aoAlterarEstadoDeRisco])

  useEffect(() => () => aoAlterarEstadoDeRisco?.(false), [aoAlterarEstadoDeRisco])

  async function atualizarConsumivelEspaco(espacoIndice: 0 | 1, valores: {
    idDaDefinicao?: string | null; recurso?: RecursoDoLimiarDeCombate | null; limiar?: number | null
  }) {
    if (executando || operacaoPendente.current) return
    operacaoPendente.current = true
    try {
      await aoAlterarPartida(atual => {
        const espaco = atual.combate.preferencias.espacosDeConsumiveis[espacoIndice]
        return configurarEspacoDeConsumivelDeCombate(atual, espacoIndice,
          valores.idDaDefinicao === undefined ? espaco.idDaDefinicao : valores.idDaDefinicao,
          valores.recurso === undefined ? espaco.recursoDeUsoAutomatico : valores.recurso,
          valores.limiar === undefined ? espaco.porcentagemDoLimiarDeUsoAutomatico : valores.limiar,
          new Date().toISOString())
      }, `Espaço ${espacoIndice + 1} de consumível atualizado.`)
      definirMensagem(`Espaço ${espacoIndice + 1} de consumível atualizado.`)
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível configurar o consumível.')
    } finally { operacaoPendente.current = false }
  }

  async function retomarTrabalho() {
    if (operacaoPendente.current) return
    operacaoPendente.current = true
    try {
      await aoAlterarPartida(atual => retomarTrabalhoAposRisco(atual, new Date().toISOString()))
      definirFase('ocioso')
      aoAlterarEstadoDeRisco?.(false)
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível retomar o trabalho.')
      definirFase('falhaAoRetomar')
      aoAlterarEstadoDeRisco?.(true)
    } finally { operacaoPendente.current = false }
  }

  async function iniciarLuta(manualEspaco?: 0 | 1, semente = Date.now() >>> 0) {
    if (executando || operacaoPendente.current) return
    operacaoPendente.current = true
    definirFase('preparando')
    try {
      definirMensagem(null)
      const preparada = await prepararRisco()
      const simulado = simularCombate(preparada, catalogoDeCombate, 'inimigo.estrada-lobo', semente, 180, undefined, manualEspaco)
      definirResultado(simulado)
      definirVisivelSegundos(0)
      definirRegistroAbrir(false)
      aoAlterarEstadoDeRisco?.(true)
      definirFase('reproduzindo')
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível iniciar o combate.')
      // Também trata a falha entre pausar o trabalho e produzir a simulação.
      operacaoPendente.current = false
      await retomarTrabalho()
    } finally { operacaoPendente.current = false }
  }

  function repetirSemente() { if (resultado && !executando) void iniciarLuta(undefined, resultado.semente) }
  return { resultado, executando, visivelSegundos, mensagem, registroAbrir, definirRegistroAbrir,
    estatisticas, visivelRegistro, progresso, maisRecenteAvisoDeAtaque, iniciarLuta,
    repetirSemente, atualizarConsumivelEspaco, confirmarResultado, retomarTrabalho, falhaAoRetomar: fase === 'falhaAoRetomar', falhaAoSalvar: fase === 'falhaAoSalvar', salvando: fase === 'salvando' }
}
