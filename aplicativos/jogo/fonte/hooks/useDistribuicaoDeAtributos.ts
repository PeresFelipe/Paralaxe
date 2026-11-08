import {
  obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
} from '@paralaxe/conteudo'
import {
  CHAVES_DOS_ATRIBUTOS,
  derivarEstatisticasDeCombateDoJogador,
  type ChaveDeAtributo,
  type DistribuicaoDeAtributos,
  type PartidaLocal,
} from '@paralaxe/dominio'
import { useMemo, useState } from 'react'
import { useAcaoAssincrona } from './useAcaoAssincrona'

const catalogoDeCombate = {
  obterDefinicaoDeEquipamento,
  obterDefinicaoDeHabilidade: obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeConsumivel: obterDefinicaoDeConsumivelDeCombate,
}

export interface DistribuicaoDeAtributosController {
  rascunho: DistribuicaoDeAtributos
  pendentePontos: number
  faltamPontos: number
  ehSalvando: boolean
  erro: string | null
  atualEstatisticas: ReturnType<typeof derivarEstatisticasDeCombateDoJogador>
  previaEstatisticas: ReturnType<typeof derivarEstatisticasDeCombateDoJogador>
  alteracaoAtributo: (chave: ChaveDeAtributo, diferenca: number) => void
  limparRascunho: () => void
  confirmar: () => Promise<void>
}

/** Mantém o rascunho local dos pontos e calcula a prévia com as fórmulas do domínio. */
export function useDistribuicaoDeAtributos(
  partida: PartidaLocal,
  aoDistribuirAtributos: (distribuicao: DistribuicaoDeAtributos) => Promise<void>,
): DistribuicaoDeAtributosController {
  const [rascunho, definirRascunho] = useState<DistribuicaoDeAtributos>({})
  const { executar, pendente: ehSalvando, mensagem: erro } = useAcaoAssincrona()

  const pendentePontos = CHAVES_DOS_ATRIBUTOS.reduce(
    (total, chave) => total + (rascunho[chave] ?? 0),
    0,
  )
  const faltamPontos = Math.max(
    0,
    partida.personagem.pontosDeAtributoDisponiveis - pendentePontos,
  )

  const atualEstatisticas = useMemo(
    () => derivarEstatisticasDeCombateDoJogador(partida, catalogoDeCombate),
    [partida],
  )
  const previaEstatisticas = useMemo(() => {
    const atributos = { ...partida.personagem.atributos }
    for (const chave of CHAVES_DOS_ATRIBUTOS) {
      atributos[chave] += rascunho[chave] ?? 0
    }
    return derivarEstatisticasDeCombateDoJogador(
      { ...partida, personagem: { ...partida.personagem, atributos } },
      catalogoDeCombate,
    )
  }, [partida, rascunho])

  function alteracaoAtributo(chave: ChaveDeAtributo, diferenca: number): void {
    const atual = rascunho[chave] ?? 0
    if (diferenca > 0 && faltamPontos <= 0) return
    const proximo = Math.max(0, atual + diferenca)
    definirRascunho((atualRascunho) => ({ ...atualRascunho, [chave]: proximo }))
  }

  async function confirmar(): Promise<void> {
    if (pendentePontos <= 0 || ehSalvando) return
    const sucesso = await executar(() => aoDistribuirAtributos(rascunho))
    if (sucesso) definirRascunho({})
  }

  return {
    rascunho,
    pendentePontos,
    faltamPontos,
    ehSalvando,
    erro,
    atualEstatisticas,
    previaEstatisticas,
    alteracaoAtributo,
    limparRascunho: () => definirRascunho({}),
    confirmar,
  }
}
