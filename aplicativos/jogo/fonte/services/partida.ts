import {
  obterDefinicaoDeAtividadeOciosa,
  obterDefinicaoDeReceitaDeFabricacao,
  obterDefinicaoDeEquipamento,
} from '@paralaxe/conteudo'
import {
  processarProgressoDeFabricacao,
  processarProgressoOcioso,
  processarProgressoDaAtividadeSecundaria,
  type PartidaLocal,
} from '@paralaxe/dominio'

/** Substitui uma partida pelo mesmo ID na lista, sem criar duplicatas. */
export function atualizarPartidaNaLista(
  partidas: PartidaLocal[],
  partida: PartidaLocal,
): PartidaLocal[] {
  return partidas.map((atual) =>
    atual.idDaPartida === partida.idDaPartida ? partida : atual,
  )
}

/** Prefere UUID e mantém um identificador utilizável em navegadores sem essa API. */
export function criarIdDaPartida(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `partida-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Converte o tempo ausente em um resumo legível. */
export function formatarAusencia(milissegundos: number): string {
  const segundos = Math.max(0, Math.floor(milissegundos / 1000))
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  if (horas > 0) return `${horas}h ${minutos}min`
  if (minutos > 0) return `${minutos}min`
  return `${segundos}s`
}

/** Aplica o progresso pendente do trabalho e prepara a mensagem apresentada pela aplicação. */
export function processarTrabalhoAtual(
  partida: PartidaLocal,
  agora: string,
): { partida: PartidaLocal; textoExibido: string | null } {
  // A expedição ativa pausa o acúmulo sem apagar a referência do trabalho ocioso.
  if (partida.masmorra.expedicaoAtiva) return { partida, textoExibido: null }

  const ativoOciosoId = partida.ocioso.atividadeAtiva?.idDaDefinicaoDaAtividade
  if (ativoOciosoId) {
    const atividade = obterDefinicaoDeAtividadeOciosa(ativoOciosoId)
    if (atividade) {
      const resultado = processarProgressoOcioso(partida, atividade, agora, obterDefinicaoDeEquipamento)
      const secundariaId = resultado.partida.ocioso.atividadeSecundaria?.idDaDefinicaoDaAtividade
      const secundaria = secundariaId ? obterDefinicaoDeAtividadeOciosa(secundariaId) : null
      const adicional = secundaria
        ? processarProgressoDaAtividadeSecundaria(resultado.partida, secundaria, agora, obterDefinicaoDeEquipamento)
        : null
      const processada = adicional?.partida ?? resultado.partida
      // Quando a principal para por capacidade, credita primeiro o tempo secundário;
      // em seguida encerra o segundo espaço para não deixar atividade órfã.
      const proxima = !processada.ocioso.atividadeAtiva && processada.ocioso.atividadeSecundaria
        ? { ...processada, ocioso: { ...processada.ocioso, atividadeSecundaria: null } }
        : processada
      const relatoSecundario = adicional && adicional.acoesConcluidas > 0
        ? ` · Secundária +${adicional.itensConcedidos} ${secundaria?.nomeDoResultado} (+${adicional.xpDeProfissaoConcedido} XP)`
        : adicional?.interrompidoPorCapacidade
          ? ' · Coleta secundária interrompida por capacidade'
          : ''
      const nivelTextoExibido =
        resultado.niveisDeProfissaoGanhos > 0
          ? ` · +${resultado.niveisDeProfissaoGanhos} nível(is) de Profissão`
          : ''
      const limitadoTextoExibido =
        resultado.segundosLimitados > 0 ? ' · limite sem conexão atingido' : ''
      const capacidadeTextoExibido = resultado.interrompidoPorCapacidade
        ? ' · Inventário sem capacidade; coleta interrompida'
        : ''
      return {
        partida: proxima,
        textoExibido:
          resultado.acoesConcluidas > 0
            ? `+${resultado.acoesConcluidas} ${atividade.nomeDoResultado} · +${resultado.xpDeProfissaoConcedido} XP de Profissão${nivelTextoExibido}${limitadoTextoExibido}${capacidadeTextoExibido}${relatoSecundario}`
            : resultado.interrompidoPorCapacidade
              ? `${atividade.nome} foi interrompida: Inventário sem capacidade.`
              : relatoSecundario || null,
      }
    }
  }

  const ativoReceitaId = partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita
  if (ativoReceitaId) {
    const receita = obterDefinicaoDeReceitaDeFabricacao(ativoReceitaId)
    if (receita) {
      const resultado = processarProgressoDeFabricacao(partida, receita, agora)
      const totalSaida =
        resultado.itensProduzidos +
        resultado.equipamentosProduzidos +
        resultado.equipamentosReforcados
      const interrompidoTextoExibido = resultado.interrompidoPorMateriais
        ? ' · produção interrompida por materiais insuficientes'
        : ''
      const capacidadeTextoExibido = resultado.interrompidoPorCapacidade
        ? ' · produção interrompida por Inventário sem capacidade'
        : ''
      return {
        partida: resultado.partida,
        textoExibido:
          resultado.acoesConcluidas > 0
            ? `${receita.nome}: ${totalSaida || resultado.acoesConcluidas} concluído(s) · +${resultado.xpDeProfissaoConcedido} XP de Profissão${interrompidoTextoExibido}${capacidadeTextoExibido}`
            : resultado.interrompidoPorMateriais
              ? `${receita.nome} foi interrompida por materiais insuficientes.`
              : resultado.interrompidoPorCapacidade
                ? `${receita.nome} foi interrompida: Inventário sem capacidade.`
                : null,
      }
    }
  }

  return { partida, textoExibido: null }
}
