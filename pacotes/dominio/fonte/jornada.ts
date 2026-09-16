import type { PartidaLocal } from './personagem'
import type { DefinicaoDeReceitaDeFabricacao } from './fabricacao'

export interface MetaDaJornada {
  idDaDefinicaoDaReceita: string
  selecionadoEm: string
  concluidoEm: string | null
}

export interface EstadoDaJornada {
  meta: MetaDaJornada | null
  idsDasReceitasFabricadas: string[]
}

export function criarJornadaInicial(): EstadoDaJornada {
  return { meta: null, idsDasReceitasFabricadas: [] }
}

/** A meta é um lembrete: escolhê-la não inicia nem interrompe o trabalho. */
export function escolherMetaDaJornada(
  partida: PartidaLocal,
  receita: DefinicaoDeReceitaDeFabricacao | null,
  agora: string,
): PartidaLocal {
  if (partida.masmorra.expedicaoAtiva) throw new Error('Escolha sua meta após retornar da expedição.')
  if (receita?.saida.tipo === "equipamento-reforco") {
    throw new Error('Escolha uma receita de fabricação para acompanhar.')
  }
  if (receita && partida.profissoes[receita.idDaProfissao].nivel < receita.nivelExigidoDaProfissao) {
    throw new Error('Essa receita ainda não está disponível para o personagem.')
  }
  if (receita && partida.jornada.meta?.idDaDefinicaoDaReceita === receita.id && !partida.jornada.meta.concluidoEm) return partida

  return {
    ...partida,
    atualizadoEm: agora,
    jornada: {
      ...partida.jornada,
      meta: receita ? { idDaDefinicaoDaReceita: receita.id, selecionadoEm: agora, concluidoEm: null } : null,
    },
  }
}

/** Chamado após fabricar com sucesso; possuir ou comprar um item não conta como fabricação. */
export function registrarFabricacaoDaJornada(jornada: EstadoDaJornada, idDaReceita: string, agora: string): EstadoDaJornada {
  const primeiroFabricar = !jornada.idsDasReceitasFabricadas.includes(idDaReceita)
  const concluidoMeta = jornada.meta?.idDaDefinicaoDaReceita === idDaReceita && !jornada.meta.concluidoEm
  if (!primeiroFabricar && !concluidoMeta) return jornada
  return {
    idsDasReceitasFabricadas: primeiroFabricar ? [...jornada.idsDasReceitasFabricadas, idDaReceita] : jornada.idsDasReceitasFabricadas,
    meta: concluidoMeta && jornada.meta ? { ...jornada.meta, concluidoEm: agora } : jornada.meta,
  }
}

/** As quantidades de ingredientes vêm do inventário, como no motor de fabricação. */
export function obterProgressoDaMetaDaJornada(partida: PartidaLocal, receita: DefinicaoDeReceitaDeFabricacao) {
  const ingredientes = receita.ingredientes.map((ingrediente) => {
    const possuido = partida.personagem.inventario.find((pilha) => pilha.idDaDefinicao === ingrediente.idDaDefinicao)?.quantidade ?? 0
    return { ...ingrediente, possuido, faltante: Math.max(0, ingrediente.quantidade - possuido) }
  })
  const concluido = partida.jornada.meta?.idDaDefinicaoDaReceita === receita.id && Boolean(partida.jornada.meta.concluidoEm)
  const pronto = ingredientes.every((ingrediente) => ingrediente.faltante === 0)
  const fabricacao = partida.fabricacao.receitaAtiva?.idDaDefinicaoDaReceita === receita.id
  const exigido = ingredientes.reduce((soma, ingrediente) => soma + ingrediente.quantidade, 0)
  const coletado = ingredientes.reduce((soma, ingrediente) => soma + Math.min(ingrediente.possuido, ingrediente.quantidade), 0)
  return { ingredientes, concluido, pronto, fabricacao, exigido, coletado }
}
