import { useRelogioDaInterface, lerHorarioCivil } from './useRelogioDaInterface'
/** Estado de apresentação e envio de comandos de expedição; as transições ficam nos casos de uso. */
import { useEffect, useMemo, useRef, useState } from 'react'
import { consultarResultadoDaIncursaoAutomatica, obterDificuldadesDesbloqueadasDaMasmorra, retomarTrabalhoAposRisco,
  type PartidaLocal, type DificuldadeDaMasmorra, type PresetDeIncursao, type ResultadoDeCombate } from '@paralaxe/dominio'
import { aceitarContrato, iniciarExpedicao, resolverSala, seguirCaminho, decidirProtetor, extrairExpedicao,
  iniciarIncursao, finalizarIncursao, cancelarIncursao, mapaDaMasmorra, type AcaoDaMasmorra, type ResultadoDaAcaoDaMasmorra } from '@/services/acoesDaMasmorra'
import type { PersistirAlteracaoDaPartida } from '@/services/alteracoesDaPartida'
export interface PropriedadesDaMasmorra {
  partida: PartidaLocal
  prepararRisco: () => Promise<PartidaLocal>
  aoAlterarPartida: PersistirAlteracaoDaPartida
  aoAlterarEstadoDeRisco?: (ativo: boolean) => void
  aoAlterarEstadoDePreparacao?: (ativo: boolean) => void
  aoRetorno?: () => void
}
export const nomesDasDificuldades: Record<DificuldadeDaMasmorra, string> = { facil: 'Fácil', normal: 'Normal', dificil: 'Difícil', impossivel: 'Impossível' }
export function useMasmorra({ partida, prepararRisco, aoAlterarPartida, aoAlterarEstadoDeRisco, aoAlterarEstadoDePreparacao, aoRetorno }: PropriedadesDaMasmorra) {
  const [mensagem, definirMensagem] = useState<string | null>(null)
  const [resultadoDeCombate, definirCombateResultado] = useState<ResultadoDeCombate | null>(null)
  const [ocupado, definirOcupado] = useState(false)
  const pendente = useRef(false)
  const [falhaAoRetomar, definirFalhaAoRetomar] = useState(false)
  const [dificuldadeSelecionada, definirDificuldadeSelecionada] = useState<DificuldadeDaMasmorra>('facil')
  const [preparando, definirPreparando] = useState(false)
  const [presetDeIncursao, definirPresetDeIncursao] = useState<PresetDeIncursao>('cautelosa')
  const execucao = partida.masmorra.expedicaoAtiva
  const incursaoAtiva = partida.masmorra.incursaoAutomaticaAtiva ?? null
  const relogioIncursao = useRelogioDaInterface(Boolean(incursaoAtiva), 1000, lerHorarioCivil)
  const resultadoDaIncursao = incursaoAtiva ? consultarResultadoDaIncursaoAutomatica(incursaoAtiva, new Date(relogioIncursao).toISOString()) : null
  const progressoDaIncursao = incursaoAtiva ? Math.max(0, Math.min(100, 100 * (relogioIncursao - Date.parse(incursaoAtiva.iniciadaEm)) / Math.max(1, Date.parse(incursaoAtiva.terminaEm) - Date.parse(incursaoAtiva.iniciadaEm)))) : 0
  const nomesDosPresets: Record<PresetDeIncursao, string> = { cautelosa: 'Cautelosa', equilibrada: 'Equilibrada', ousada: 'Ousada' }
  const dificuldadesDisponiveis = obterDificuldadesDesbloqueadasDaMasmorra(partida.masmorra)
  const mapaDaExpedicao = mapaDaMasmorra(partida)
  const atualSala = useMemo(() => execucao ? mapaDaExpedicao.salas.find(s => s.id === execucao.idDaSalaAtual) ?? null : null, [execucao, mapaDaExpedicao])
  const salaResolvido = Boolean(atualSala && execucao?.idsDasSalasResolvidas.includes(atualSala.id))
  useEffect(() => { aoAlterarEstadoDeRisco?.(Boolean(execucao || incursaoAtiva || falhaAoRetomar)) }, [aoAlterarEstadoDeRisco, execucao, incursaoAtiva, falhaAoRetomar])
  useEffect(() => () => aoAlterarEstadoDeRisco?.(false), [aoAlterarEstadoDeRisco])
  useEffect(() => { aoAlterarEstadoDePreparacao?.(preparando) }, [aoAlterarEstadoDePreparacao, preparando])
  useEffect(() => () => aoAlterarEstadoDePreparacao?.(false), [aoAlterarEstadoDePreparacao])

  async function retomarTrabalho() {
    if (pendente.current) return
    pendente.current = true
    definirOcupado(true)
    try {
      const recuperada = await aoAlterarPartida(atual => atual.masmorra.expedicaoAtiva || atual.masmorra.incursaoAutomaticaAtiva ? atual : retomarTrabalhoAposRisco(atual, new Date().toISOString()))
      definirFalhaAoRetomar(false)
      aoAlterarEstadoDeRisco?.(Boolean(recuperada.masmorra.expedicaoAtiva || recuperada.masmorra.incursaoAutomaticaAtiva))
    } catch {
      definirFalhaAoRetomar(true)
      definirMensagem('Não foi possível gravar a retomada do trabalho. Tente novamente antes de sair.')
      aoAlterarEstadoDeRisco?.(true)
    } finally { pendente.current = false; definirOcupado(false) }
  }

  async function executar(acao: AcaoDaMasmorra, entrarEmRisco = false, apos?: () => void) {
    if (pendente.current) return
    pendente.current = true
    definirOcupado(true)
    try {
      if (entrarEmRisco) await prepararRisco()
      let resposta: ResultadoDaAcaoDaMasmorra | undefined
      const salva = await aoAlterarPartida(atual => {
        resposta = acao(atual, new Date().toISOString())
        return resposta.partida
      }, () => resposta?.mensagem)
      definirMensagem(resposta?.mensagem ?? null)
      definirCombateResultado(resposta?.combate ?? null)
      aoAlterarEstadoDeRisco?.(Boolean(salva.masmorra.expedicaoAtiva || salva.masmorra.incursaoAutomaticaAtiva))
      apos?.()
    } catch (erro) {
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível salvar a ação da expedição.')
      if (entrarEmRisco) {
        pendente.current = false
        await retomarTrabalho()
      }
    } finally { pendente.current = false; definirOcupado(false) }
  }
  const tratarAceitarContrato = () => executar(aceitarContrato)
  const tratarIniciar = () => executar(iniciarExpedicao(dificuldadeSelecionada, Date.now() >>> 0), true, () => definirPreparando(false))
  const tratarResolver = () => executar(resolverSala)
  const tratarCaminho = (id: string) => executar(seguirCaminho(id))
  const tratarProtetor = (decisao: 'morto' | 'poupado') => executar(decidirProtetor(decisao))
  const tratarExtrair = () => executar(extrairExpedicao, false, () => { definirPreparando(false); aoRetorno?.() })
  const tratarIniciarIncursao = () => executar(iniciarIncursao(presetDeIncursao, Date.now() >>> 0), true)
  const tratarFinalizarIncursao = () => executar(finalizarIncursao)
  const tratarCancelarIncursao = () => executar(cancelarIncursao)
  return { mensagem, resultadoDeCombate, ocupado, falhaAoRetomar, retomarTrabalho, dificuldadeSelecionada, definirDificuldadeSelecionada,
    preparando, definirPreparando, presetDeIncursao, definirPresetDeIncursao, execucao, incursaoAtiva, resultadoDaIncursao,
    progressoDaIncursao, relogioIncursao, nomesDosPresets, dificuldadesDisponiveis, mapaDaExpedicao, atualSala, salaResolvido,
    tratarAceitarContrato, tratarIniciar, tratarResolver, tratarCaminho, tratarProtetor, tratarExtrair,
    tratarIniciarIncursao, tratarFinalizarIncursao, tratarCancelarIncursao }
}
