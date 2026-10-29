import { useMemo, useState } from 'react'
import {
  obterDefinicaoDeHabilidadeDeCombate,
  obterDefinicaoDeConsumivelDeCombate,
  obterDefinicaoDeInimigo,
  obterDefinicaoDeEquipamento,
} from '@greywake/conteudo'
import {
  CHAVES_DOS_ATRIBUTOS,
  derivarEstatisticasDeCombateDoJogador,
  type DistribuicaoDeAtributos,
  type ChaveDeAtributo,
  type PartidaLocal,
} from '@greywake/dominio'

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
  const [ehSalvando, definirEhSalvando] = useState(false)

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
    definirEhSalvando(true)
    try {
      await aoDistribuirAtributos(rascunho)
      definirRascunho({})
    } finally {
      definirEhSalvando(false)
    }
  }

  return {
    rascunho,
    pendentePontos,
    faltamPontos,
    ehSalvando,
    atualEstatisticas,
    previaEstatisticas,
    alteracaoAtributo,
    limparRascunho: () => definirRascunho({}),
    confirmar,
  }
}
